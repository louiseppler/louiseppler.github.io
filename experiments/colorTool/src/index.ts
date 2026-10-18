import { AppData } from "./appData";
import { CanvasHelper } from "./canvas-helper";
import { Color } from "./color";
import { TextFieldInputHelper } from "./textFieldInputHelper";
import { loadUiElements } from "./ui-elements";
import { CircleColorView } from "./views/circleView";
import { ColorView } from "./views/colorView";
import { HSVView } from "./views/hsvView";
import { MonoColorView } from "./views/monoView";
import { RGBView } from "./views/rgbView";
import { UndoButtonView } from "./views/undoButtonsView";

console.log("Hello World");


var mainCanvas: CanvasHelper

var colorView: ColorView
var undoButtonsView: UndoButtonView

var appData = new AppData()

var textfieldInputHelper: TextFieldInputHelper;

function setup() {
    setupCanvases();

    textfieldInputHelper = new TextFieldInputHelper(appData, colorView);
    appData.updateTextFieldCallback = () => {textfieldInputHelper.setString();} //this feels ugly

    loadUiElements(
        colorModeChanged,
        () => {appData.undo(); colorView.colorsChanged();},
        () => {appData.redo(); colorView.colorsChanged();}
    );

    document.getElementById("add-color-btn")!.onclick = addColor;
    var button = document.getElementById("update-color-textinput")!;
    button.onclick = () => textfieldInputHelper.readStringInput();
    appData.saveColorState();
}
setup();

function setupCanvases() {
    mainCanvas = new CanvasHelper("canvas", 700, 500, () => {mouseClick();}, () => {mouseDown();}, () => {draw();});
    mainCanvas.clearCanvas()

    colorView = new CircleColorView(mainCanvas, appData);

    undoButtonsView = new UndoButtonView(mainCanvas, () => {appData.undo(); colorView.colorsChanged();}, () => {appData.redo(); colorView.colorsChanged();});

    console.log("Setting up Canvas");
    
    console.log(appData.colors);   
}

function colorModeChanged(value: string) {
    console.log("Changing color mode to " + value);
    
    switch(value) {
        case "rgb":
            colorView = new RGBView(mainCanvas, appData);
            break;
        case "hsv":
            colorView = new HSVView(mainCanvas, appData);
            break;
        case "mono":
            colorView = new MonoColorView(mainCanvas, appData);
            break;
        case "circle":
            colorView = new CircleColorView(mainCanvas, appData);
            break;
    }
}

function addColor() {
    var c = new Color();
    c.setRandom();
    appData.colors.push(c);
    colorView.colorsChanged();
}

function mouseClick() {
    undoButtonsView.mouseClick();

}

function mouseDown() {
    colorView.mouseDown();
}

var savedColorHeight = 50;

function draw() {
    colorView.draw();
    drawSavedColors();
    //undoButtonsView.draw();
}

function drawSavedColors() {
    var n = appData.colors.length;
    var s = mainCanvas.width/n;

    for(var i = 0; i < n; i++) {
        mainCanvas.ctx.fillStyle = appData.colors[i]?.getHex() ?? "#000";
        if(i == appData.selectedColorIndex) {
            mainCanvas.ctx.fillRect(i*s,0,s,savedColorHeight);
        }
        else {
            mainCanvas.ctx.fillRect(i*s,savedColorHeight*0.125,s,savedColorHeight*0.75);
        }
    }

    mainCanvas.ctx.lineWidth = 3;
    //mainCanvas.drawLine(0, savedColorHeight, mainCanvas.width, savedColorHeight);
    mainCanvas.ctx.lineWidth = 1;

    if(mainCanvas.mouseIsPressed && mainCanvas.mouseY < savedColorHeight) {
        var prevIndex = appData.selectedColorIndex;
        appData.selectedColorIndex = Math.floor(mainCanvas.mouseX/s);

        if(appData.selectedColorIndex != prevIndex) {
            colorView.colorsChanged();
        }

    }
}