import { hideSnackbar, showAlert, showSnackbar } from "./alert";
import { distanceToText } from "./helpers";
import { restoreData, saveData } from "./localStorage";
import { MapHelper } from "./map";
import { ShapeData } from "./shapeData";
import { ShapeType } from "./shapeTypes";

var shapeData = new ShapeData();
var map: MapHelper 
var button = document.getElementById("add-question") as HTMLButtonElement

function setup() {
    var data = restoreData();
    //data = null;

    if(data != null) {
        shapeData = data[0];
        map = new MapHelper(shapeData)
        map.addShapesToMap(data[1]);
    }
    else {
        map = new MapHelper(shapeData);
    }
}

setup();

button.onclick = async () => {
    console.log("Button Pressed");

    addNewShape(); 
}

async function addNewShape()  {
    showSnackbar("adding new shape")

    const choice = await showAlert('Choose Type', ['Radar', 'Thermometer', 'Custom Path']);

    if(choice == 'Radar') {
        addNewRadar();
    }
    else if(choice == 'Custom Path') {
        map.addNewShapeToMap(ShapeType.CustomPath, "");
    }
    else if(choice == 'Thermometer') {
        map.addNewShapeToMap(ShapeType.Thermometer, "");
        updateShapeUI();
    }
}

const radarTypes: Record<string, string> = {
    "Custom": "Custom",
    "500m": "500",
    "1km": "1000",
    "2km" : "2000",
    "5km" : "5000",
    "10km": "10000",
    "15km" : "15000"
};

async function addNewRadar() {
    // Define the dictionary


    const choice = await showAlert('Choose Type', Object.keys(radarTypes));

    if(choice == "Custom") {
        map.addNewShapeToMap(ShapeType.CustomRadar, "");
    }
    else if (choice && radarTypes[choice]) {
        map.addNewShapeToMap(ShapeType.Radar, radarTypes[choice]);
    }

    updateShapeUI();
}


export function updateShapeUI() {
    const container = document.getElementById("shapeList");
    if (!container) return;

    container.innerHTML = "";

    shapeData.shapeTypes.forEach((type, index) => {
        const feature = shapeData.shapeFeatures[index];

        const div = document.createElement("div");
        div.className = "shape";

        const title = document.createElement("h4");
        title.textContent = getLabel(type, feature);

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-outline-primary m-1";
        editBtn.textContent = "Edit Shape";
        editBtn.onclick = () => editShapePressed(index);

        const invertBtn = document.createElement("button");
        invertBtn.type = "button";
        invertBtn.className = "btn btn-outline-primary m-1";
        invertBtn.textContent = "Invert";
        invertBtn.onclick = () => invertShape(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-outline-danger m-1";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteShape(index)

        div.appendChild(title);
        div.appendChild(editBtn);
        div.appendChild(invertBtn);
        div.appendChild(deleteBtn);

        container.appendChild(div);
    });

    saveData(map);
}

function getLabel(type: ShapeType, feature: string) : string {
    if(type == ShapeType.CustomRadar) {
         return "Custom Radar of " + distanceToText(feature);
    }
    if(type == ShapeType.Radar) {
        return "Radar of " + distanceToText(feature);
    }
    if(type == ShapeType.Thermometer) {
        return "Thermometer of " + distanceToText(feature);
    }
    if(type == ShapeType.CustomPath) {
        return "Custom Path"
    }

    return "no data";
}

function editShapePressed(index: number) {
    map.editShape(index);
    window.scrollTo(0,0);
}

function invertShape(index: number) {
    console.log("inverting shape");
    
    shapeData.answers[index] = !shapeData.answers[index];
    map.editShape(index);
    window.scrollTo(0,0);
}

async function deleteShape(index: number) {
    window.scrollTo(0,0);
    var title = "Delete " + getLabel(shapeData.shapeTypes[index], shapeData.shapeFeatures[index]) + " ?";
    const choice = await showAlert(title, ['Yes', 'No']);

    if(choice == "Yes") {
        map.deleteShape(index);
    }
}

document.getElementById("debug-button1")!.onclick = () => {

}

document.getElementById("debug-button2")!.onclick = () => {
    restoreData();
}
