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

var shapeData: ShapeData;

var polygonFeatures: Feature<Polygon>[] = []

var pointFeaturesLists: any[][] = [[]]
var selectedIndex = -1;
var n = 0;
var pointsToAdd = 0;

const debouncedGeometryUpdated = debounce(geometryUpdated, 250);
const debouncedHideSnackbar = debounce(() => {hideSnackbar()}, 1500);

const vectorSource = new VectorSource();

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ 
            source: vectorSource,
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

const modify = new Modify({
    source: vectorSource,
    filter: (feature) => {
        if(selectedIndex == -1) return false;

        // Get the polygon and points that SHOULD be editable
        const activePolygon = polygonFeatures[selectedIndex*2];
        const activePoints = pointFeaturesLists[selectedIndex*2];

        // Only allow modification if the feature is the active polygon 
        // OR one of the active points
        return feature === activePolygon || activePoints.includes(feature);
    }
});

map.addInteraction(modify);

const updatePolygon = () => {
    console.log(selectedIndex);

    if(selectedIndex == -1) return;
    var pointFeatures = pointFeaturesLists[selectedIndex*2];
    console.log("number of points in features " + pointFeatures.length);
    
    if (pointFeatures.length < 1) return;

    const firstCord = pointFeatures[0].getGeometry().getCoordinates();
    const secondCord = (pointFeatures.length >= 2)? pointFeatures[1].getGeometry().getCoordinates() : null;
    
    
    var points: number[][] = [];

    console.log("Rendering shape of type " + shapeData.shapeTypes[selectedIndex]);
    

    if(shapeData.shapeTypes[selectedIndex] == ShapeType.CustomPath) {
        const coords = pointFeatures.map(f => f.getGeometry().getCoordinates());
        points = [...coords, ...coords.reverse()];
    }
    if(shapeData.shapeTypes[selectedIndex] == ShapeType.Radar) {

        const distance = parseInt(shapeData.shapeFeatures[selectedIndex]);

        console.log(distance);
        if(shapeData.answers[selectedIndex]) {
            points = generateCirclePoints(firstCord, distance);
        }
        else {
            var pointsA = generateCirclePoints(firstCord, distance);
            var pointsB = generateCirclePoints(firstCord, 100*1000);
            points = [...pointsA, ...pointsB.reverse()];
        }    }
    else if(shapeData.shapeTypes[selectedIndex] == ShapeType.CustomRadar && pointFeatures.length >= 2) {
        const distance = computeDistance(firstCord, secondCord);

        if(shapeData.answers[selectedIndex]) {
            points = generateCirclePoints(firstCord, distance);
        }
        else {
            var pointsA = generateCirclePoints(firstCord, distance);
            var pointsB = generateCirclePoints(firstCord, 100*1000);
            points = [...pointsA, ...pointsB.reverse()];
        }

        showSnackbar(distanceToText(""+distance))
        debouncedHideSnackbar()
        shapeData.shapeFeatures[selectedIndex] = ""+distance
    }
    else if(shapeData.shapeTypes[selectedIndex] == ShapeType.Thermometer && pointFeatures.length >= 2) {
        const distance = computeDistance(firstCord, secondCord);

        if(shapeData.answers[selectedIndex]) { 
            points = generateThermometerPoints(firstCord, secondCord);

        }
        else {
            points = generateThermometerPoints(secondCord, firstCord);
        }

        showSnackbar(distanceToText(""+distance))
        debouncedHideSnackbar()
        shapeData.shapeFeatures[selectedIndex] = ""+distance
    }

    polygonFeatures[selectedIndex*2+1]
        .getGeometry()!
        .setCoordinates([points]);

    debouncedGeometryUpdated();
};

function updateFeatures() {
    vectorSource.clear();
    vectorSource.addFeatures(polygonFeatures)
    vectorSource.addFeatures(pointFeaturesLists[selectedIndex*2])
}

function addNewPoint(event: MapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) {
    const newPoint = new Feature({
            geometry: new Point(event.coordinate)
        });

        newPoint.getGeometry()!.on('change', () => {
            updatePolygon();
        });

        
        pointFeaturesLists[selectedIndex*2].push(newPoint);
        vectorSource.addFeature(newPoint);
        updatePolygon();
}

function updateSnackBar() {
        console.log("points to add " + pointsToAdd);

    console.log("Updating Snackbar");
    
    if(pointsToAdd == 0) {
        hideSnackbar();
    }
    else {
        var messages = getMessages(shapeData.shapeTypes[selectedIndex]);
        showSnackbar(messages[messages.length-pointsToAdd])
    }
}

export function setupMap(shapeDataLocal: ShapeData) {

    shapeData = shapeDataLocal;

    map.on("click", (event) => {

        if(pointsToAdd > 0) {
            pointsToAdd -= 1;
            addNewPoint(event);
        }

        updateSnackBar();
    });

    document.getElementById("prev-polygon")!.onclick = () => {
    console.log("prev");

    selectedIndex = Math.max(0, selectedIndex - 1);

    updateFeatures();
}
document.getElementById("next-polygon")!.onclick = () => {
    console.log("next");

    selectedIndex = Math.min(n-1, selectedIndex + 1);

    updateFeatures();
}
document.getElementById("new-polygon")!.onclick = () => {

   
}
}

export function editShape(index: number) {
    selectedIndex = index;
    updatePolygon();
    console.log("Setting selection index to " + index);
    updateFeatures();
}

export function addNewShapeToMap(type: ShapeType, feature: string) {
    selectedIndex = n/2;
    n += 2;

    shapeData.shapeTypes.push(type);
    shapeData.answers.push(true);
    shapeData.shapeFeatures.push(feature);

    console.log(`Adding New Shape of type ${type} ${feature}`);


    //one for the interaction, one for rendering
    const newPolygonFeature1 = new Feature({
        geometry: new Polygon([])
    });
    const newPolygonFeature2 = new Feature({
        geometry: new Polygon([])
    });
    pointFeaturesLists.push([])
    polygonFeatures.push(newPolygonFeature1);
    pointFeaturesLists.push([])
    polygonFeatures.push(newPolygonFeature2);

    console.log(shapeData.shapeTypes);
    
    pointsToAdd = getMessages(type).length;
    
    updateFeatures();
    updateSnackBar();
}

function geometryUpdated() {
    updateShapeUI();
}