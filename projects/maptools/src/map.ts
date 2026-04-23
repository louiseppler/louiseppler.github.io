import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Modify from "ol/interaction/Modify";
import Style from "ol/style/Style";
import { Circle, Polygon } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke"
import CircleStyle from 'ol/style/Circle';
import { computeDistance, generateCirclePoints, generateThermometerPoints } from "./coordinateMath";
import { getDistance } from "ol/sphere";
import { getMessages, ShapeType } from "./shapeTypes";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import { hideSnackbar, showSnackbar } from "./alert";
import type { ShapeData } from "./shapeData";
import { debounce, distanceToText } from "./helpers";
import { updateShapeUI } from ".";

export class MapHelper {


    shapeData: ShapeData;

    polygonFeatures: Feature<Polygon>[] = []

    pointFeaturesLists: any[][] = [[]]
    selectedIndex = -1;
    n = 0;
    pointsToAdd = 0;

    readonly vectorSource = new VectorSource();
    readonly map: Map;
    readonly modify: Modify


    readonly debouncedGeometryUpdated = debounce(this.geometryUpdated, 250);
    readonly debouncedHideSnackbar = debounce(() => {hideSnackbar()}, 1500);


    constructor(shapeData: ShapeData) {
        this.shapeData = shapeData;

        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({ source: new OSM() }),
                new VectorLayer({ 
                    source: this.vectorSource,
                    style: new Style({
                        fill: new Fill({ color: 'rgba(51, 153, 204, 0.2)' }),
                        stroke: new Stroke({ color: '#3399CC', width: 2 }),
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({ color: '#3399CC' })
                        })
                    })
                })
            ],
            view: new View({
                center: fromLonLat([8.5383, 47.3784]),
                zoom: 13,
            }),
        });

        this.modify = new Modify({
            source: this.vectorSource,
            filter: (feature) => {
                if(this.selectedIndex == -1) return false;

                // Get the polygon and points that SHOULD be editable
                const activePolygon = this.polygonFeatures[this.selectedIndex*2];
                const activePoints = this.pointFeaturesLists[this.selectedIndex*2];

                // Only allow modification if the feature is the active polygon 
                // OR one of the active points
                return feature === activePolygon || activePoints.includes(feature);
            }
        });

        this.map.addInteraction(this.modify);

        this.map.on("click", (event) => {

            console.log("Resistered a click");
            
            if(this.pointsToAdd > 0) {
                this.pointsToAdd -= 1;
                this.updateSnackBar();
                this.addNewPoint(event);
            }

        });

    }

    updatePolygon = () => {
        console.log("Updating Polygon");
        
        console.log(this.selectedIndex);

        if(this.selectedIndex == -1) return;
        var pointFeatures = this.pointFeaturesLists[this.selectedIndex*2];
        console.log("number of points in features " + pointFeatures.length);
        
        if (pointFeatures.length < 1) return;

        const firstCord = pointFeatures[0].getGeometry().getCoordinates();
        const secondCord = (pointFeatures.length >= 2)? pointFeatures[1].getGeometry().getCoordinates() : null;
        
        
        var points: number[][] = [];

        console.log("Rendering shape of type " + this.shapeData.shapeTypes[this.selectedIndex]);
        

        if(this.shapeData.shapeTypes[this.selectedIndex] == ShapeType.CustomPath) {
            const coords = pointFeatures.map(f => f.getGeometry().getCoordinates());
            points = [...coords, ...coords.reverse()];
        }
        if(this.shapeData.shapeTypes[this.selectedIndex] == ShapeType.Radar) {

            const distance = parseInt(this.shapeData.shapeFeatures[this.selectedIndex]);

            console.log(distance);
            if(this.shapeData.answers[this.selectedIndex]) {
                points = generateCirclePoints(firstCord, distance);
            }
            else {
                var pointsA = generateCirclePoints(firstCord, distance);
                var pointsB = generateCirclePoints(firstCord, 100*1000);
                points = [...pointsA, ...pointsB.reverse()];
            }    }
        else if(this.shapeData.shapeTypes[this.selectedIndex] == ShapeType.CustomRadar && pointFeatures.length >= 2) {
            const distance = computeDistance(firstCord, secondCord);

            if(this.shapeData.answers[this.selectedIndex]) {
                points = generateCirclePoints(firstCord, distance);
            }
            else {
                var pointsA = generateCirclePoints(firstCord, distance);
                var pointsB = generateCirclePoints(firstCord, 100*1000);
                points = [...pointsA, ...pointsB.reverse()];
            }

            showSnackbar(distanceToText(""+distance))
            this.debouncedHideSnackbar()
            this.shapeData.shapeFeatures[this.selectedIndex] = ""+distance
        }
        else if(this.shapeData.shapeTypes[this.selectedIndex] == ShapeType.Thermometer && pointFeatures.length >= 2) {
            const distance = computeDistance(firstCord, secondCord);

            if(this.shapeData.answers[this.selectedIndex]) { 
                points = generateThermometerPoints(firstCord, secondCord);

            }
            else {
                points = generateThermometerPoints(secondCord, firstCord);
            }

            showSnackbar(distanceToText(""+distance))
            this.debouncedHideSnackbar()
            this.shapeData.shapeFeatures[this.selectedIndex] = ""+distance
        }

        this.polygonFeatures[this.selectedIndex*2+1]
            .getGeometry()!
            .setCoordinates([points]);

        this.debouncedGeometryUpdated();
    };

    private updateFeatures() {
        console.log("updating features");
        
        this.vectorSource.clear();
        this.vectorSource.addFeatures(this.polygonFeatures)
        if(this.selectedIndex != -1) {
            this.vectorSource.addFeatures(this.pointFeaturesLists[this.selectedIndex*2])
        }
    }

    private addNewPoint(event: MapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) {
        const newPoint = new Feature({
            geometry: new Point(event.coordinate)
        });

        newPoint.getGeometry()!.on('change', () => {
            this.updatePolygon();
        });

        console.log(newPoint);
        
        this.pointFeaturesLists[this.selectedIndex*2].push(newPoint);
        this.vectorSource.addFeature(newPoint);
        this.updatePolygon();
    }

    private updateSnackBar() {
        console.log("Updating Snackbar");
        
        if(this.pointsToAdd == 0) {
            hideSnackbar();
        }
        else {
            var messages = getMessages(this.shapeData.shapeTypes[this.selectedIndex]);
            showSnackbar(messages[messages.length-this.pointsToAdd])
        }
    }

    public editShape(index: number) {
        this.selectedIndex = index;
        this.updatePolygon();
        console.log("Setting selection index to " + index);
        this.updateFeatures();
    }

    public addShapesToMap(points: any[][]) {
        console.log("Adding Shapes to Map");
        
        for(var i = 0; i < points.length; i++) {
            this.selectedIndex = i;
            this.n += 2;
            this.addEmptyFeatures();
            for(const point of points[i]) {
                const newPoint = new Feature({
                    geometry: new Point(point)
                });
                this.pointFeaturesLists[this.selectedIndex*2].push(newPoint);
                newPoint.getGeometry()!.on('change', () => {
                    this.updatePolygon();
                });
                this.vectorSource.addFeature(newPoint);

            }
            this.updatePolygon();
        }
        this.updateFeatures();
    }

    private addEmptyFeatures() {
        //one for the interaction, one for rendering
        const newPolygonFeature1 = new Feature({
            geometry: new Polygon([])
        });
        const newPolygonFeature2 = new Feature({
            geometry: new Polygon([])
        });
        this.pointFeaturesLists.push([])
        this.polygonFeatures.push(newPolygonFeature1);
        this.pointFeaturesLists.push([])
        this.polygonFeatures.push(newPolygonFeature2);
    }

    public addNewShapeToMap(type: ShapeType, feature: string) {
        console.log(`Adding New Shape of type ${type} ${feature}`);

        this.selectedIndex = this.n/2;
        this.n += 2;

        this.shapeData.shapeTypes.push(type);
        this.shapeData.answers.push(true);
        this.shapeData.shapeFeatures.push(feature);

        this.addEmptyFeatures();

        console.log(this.shapeData.shapeTypes);
        
        this.pointsToAdd = getMessages(type).length;
        
        this.updateFeatures();
        this.updateSnackBar();

        console.log("point to add: " + this.pointsToAdd);
        
    }


    public deleteShape(index: number) {
        console.log("Removing Shape");

        this.selectedIndex = -1;
        this.n -= 2;
        this.vectorSource.clear();
        
        this.pointFeaturesLists.splice(index*2, 2);
        this.polygonFeatures.splice(index*2, 2);
        this.shapeData.answers.splice(index, 1);
        this.shapeData.shapeFeatures.splice(index, 1);
        this.shapeData.shapeTypes.splice(index, 1);
       
        this.updateFeatures();
        updateShapeUI();
    }

    private geometryUpdated() {
        updateShapeUI();
    }

    public getPointData() : any[][] {
        var pointList = [];
        for(var i = 0; i < this.n; i += 2) {
            var points = this.pointFeaturesLists[i].map((x) => x.getGeometry().getCoordinates());
            pointList.push(points);
        }
        return pointList;
    }

}