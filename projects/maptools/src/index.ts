import { hideSnackbar, showAlert, showSnackbar } from "./alert";
import { distanceToText } from "./helpers";
import { addNewShapeToMap, editShape, setupMap } from "./map";
import { ShapeData } from "./shapeData";
import { ShapeType } from "./shapeTypes";

var shapeData = new ShapeData();

setupMap(shapeData);

var button = document.getElementById("add-question") as HTMLButtonElement

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
        addNewShapeToMap(ShapeType.CustomPath, "");
    }
    else if(choice == 'Thermometer') {
        addNewShapeToMap(ShapeType.Thermometer, "");
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
        addNewShapeToMap(ShapeType.CustomRadar, "");
    }
    else if (choice && radarTypes[choice]) {
        addNewShapeToMap(ShapeType.Radar, radarTypes[choice]);
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
}

function getLabel(type: ShapeType, feature: string) : string {
    if(type == ShapeType.CustomRadar) {
         return "Custom Radar of " + distanceToText(feature);
    }
    if(type == ShapeType.Radar) {
        return "Radar of" + distanceToText(feature);
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
    editShape(index);
    window.scrollTo(0,0);
}

function invertShape(index: number) {
    console.log("inverting shape");
    
    shapeData.answers[index] = !shapeData.answers[index];
    editShape(index);
    window.scrollTo(0,0);
}

function deleteShape(index: number) {

}
