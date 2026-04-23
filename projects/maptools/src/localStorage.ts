import type { MapHelper } from "./map";
import type { ShapeData } from "./shapeData";

export function saveData(map: MapHelper) {
    console.log("Saving Data");
    
    var pointsData = map.getPointData();

    localStorage.setItem("points-data", JSON.stringify(pointsData));
    localStorage.setItem("shape-data", JSON.stringify(map.shapeData))
}

export function restoreData() {
    console.log("Restoring Data");
    
    const data1 = localStorage.getItem("points-data");
    const pointsData = data1 ? JSON.parse(data1) : null;

    const data2 = localStorage.getItem("shape-data");
    const shapeData = data2 ? JSON.parse(data2) as ShapeData : null;

    if(data1 == null || data1 == null) {
        console.log("No Data Found");
        return;
    }
    
    if(shapeData == null || pointsData == null) {
        console.log("Failed to parse data");
        return;
    };

    var n = pointsData.length;    
    if(shapeData.answers.length != n) return null;
    if(shapeData.shapeFeatures.length != n) return null;
    if(shapeData.shapeTypes.length != n) return null;

    console.log(shapeData);
    console.log(pointsData);

    return [shapeData, pointsData]
}
