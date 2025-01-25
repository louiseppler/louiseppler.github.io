var presetsBig = [25,50,75,100];
var presetSmall = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]

var currentBig = [];
var currentSmall = [];

var currentSelection = [];
var currentTarget = 0;

function reset() {
    console.log("Resetting");
    partialReset();
    target = 0;
    currentSelection = [];
    currentTarget = 0;
    currentBig = structuredClone(presetsBig);
    currentSmall = structuredClone(presetSmall);
    document.getElementById("numbers-display").innerHTML = "";
    document.getElementById("target-display").innerHTML = "";
    document.getElementById("generateTargetButtonDiv").hidden = true;
    document.getElementById("solutionButtonDiv").hidden = true;
    document.getElementById("showIfPossibleButtonDiv").hidden = true;
}

function partialReset() {
    document.getElementById("isPossible").innerHTML = "";
    document.getElementById("solutionDiv").innerHTML = "";
    if(currentTarget != 0) {
        document.getElementById("solutionButtonDiv").hidden = false;
        document.getElementById("showIfPossibleButtonDiv").hidden = false;
    }

    resetAlgorithm();
}

function addNumber(mode) {
    if(currentSelection.length >= 6) return;
    if(mode == 1) {
        var r = Math.floor(Math.random()*currentBig.length)
        currentSelection.push(currentBig[r]);
        currentBig.splice(r,1);
        if(currentBig.length == 0) {
            addNumber(3);
        }
    }
    if(mode == 2 || mode == 3) {
        var r = Math.floor(Math.random()*currentSmall.length)
        currentSelection.push(currentSmall[r]);
        currentSmall.splice(r,1);
    }
    if(mode == 3) {
        addNumber(3);
    }

    console.log(currentSelection);
    currentSelectionUpdated();
}

function currentSelectionUpdated() {
    partialReset();
    document.getElementById("numbers-display").innerHTML = currentSelection.reduce(
        (accumulator, currentValue) => accumulator + "&nbsp;&nbsp;" + currentValue,
        "",
    );

    if(currentSelection.length >= 6) {
        document.getElementById("generateTargetButtonDiv").hidden = false;
    }
}

function targetUpdated() {
    partialReset();
    document.getElementById("target-display").innerHTML = currentTarget;

    document.getElementById("solutionButtonDiv").hidden = false;
    document.getElementById("showIfPossibleButtonDiv").hidden = false;

    startComputation();
}

function generateTarget() {
    currentTarget = Math.floor(Math.random()*899)+101;
    targetUpdated();
}

function enterCustomNumbers() {
    var my_text = prompt('Enter Numbers separated by comma or space', '25 3 ...');
    arr = my_text.match(/\d+/g);
    for(var i = 0; i < arr.length; i++) {
        if(currentSelection.length >= 6) return;
        currentSelection.push(+arr[i]);
    }
    currentSelectionUpdated();    
}

function enterCustomTarget() {
    var my_text = prompt('Enter Target');
    arr = my_text.match(/\d+/g);
    currentTarget = +arr[0];
    targetUpdated();
}

function showIfPossible() {
    if(solutionComputed == false) {
        document.getElementById("isPossible").innerHTML = "Computing ...";
        if(startComputation() == -1) {
            document.getElementById("isPossible").innerHTML = "";
            return -1;
        }
    }

    if(minDist == 0) {
        document.getElementById("isPossible").innerHTML = "Solution is possible";
    }
    else {
        document.getElementById("isPossible").innerHTML = "Solution off by " + minDist;
    }

    document.getElementById("showIfPossibleButtonDiv").hidden = true;
}

function showSolution() {
    if( showIfPossible() == -1) return;
    var solText = path.split("\n").join("<br>")
    document.getElementById("solutionDiv").innerHTML = solText;

    document.getElementById("solutionButtonDiv").hidden = true;
}

function startComputation() {
    if(currentSelection.length < 2) {
        alert("Not enough input numbers");
        return -1;
    }
    if(currentTarget == 0) {
        alert("No Target Number");
        return -1;
    }
    numbers = ["", 0];
    for(var i = 0; i < currentSelection.length; i++) {
        numbers.push(currentSelection[i]);
    }
    target = currentTarget;
    computeSolution();
}