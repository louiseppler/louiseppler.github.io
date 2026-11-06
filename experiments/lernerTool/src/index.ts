import { BinaryGenerator } from "./generators/binary";
import { CapitalDistances } from "./generators/capitalDistances";
import { EquationsGenerator } from "./generators/equations";
import { SimpleMathGenerator } from "./generators/simpleMath";
import { SinCosGenerator } from "./generators/sincos";
import { VelocityGenerator } from "./generators/velocity";

var generators = [
    new SimpleMathGenerator(), 
    new BinaryGenerator(), 
    new VelocityGenerator(), 
    new EquationsGenerator(), 
    new CapitalDistances(), 
    new SinCosGenerator()];
//var generators = [new VelocityGenerator()];

var backSide = "";

var backVisible = true;

function setup() {
    var element = document.getElementById("main-button");

    if (element instanceof HTMLButtonElement) {
        element.onclick = mainButtonPressed;
    }
}

function generateNewProblems() {
    var i = Math.floor(Math.random()*generators.length);
    var generator = generators[i];

    var frontBack = generator?.getFrontBack();
    var front = frontBack![0];
    var back = frontBack![1];

    document.getElementById("front-card")!.innerHTML = front ?? "";
    document.getElementById("back-card")!.innerHTML = "";
    backSide = back ?? "";
    backVisible = false;
}

function mainButtonPressed() {
    console.log("Button Pressed");


    if(backVisible == false) {        
        backVisible = true;
        document.getElementById("back-card")!.innerHTML = backSide;
    }
    else {        
        generateNewProblems();
    }
}

setup();

console.log("hi?");
