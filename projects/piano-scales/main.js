var dots = [];
var selectedDotIndex = 0;

var keyWidth = 50;
var keySmallWidth = 25;
var keyHeight = 200;
var keySmallHeight = 140;
var xOffset = 2;

var pianoKeyStart = 48; // C

var keyStart = 48+12; //C

var selectedId = "";

var blackKeyFollows = [true, false, true, false, false, true, false, true, false, true, false, false];

var keyNames = ["C", "C<sup>&#35;</sup>", "D", "D<sup>&#35;</sup>", "E", "F", "F<sup>&#35;</sup>", "G", "G<sup>&#35;</sup>", "A", "A<sup>&#35;</sup>", "B"]

var keyNamesSharp = ["C", "C<sup>&#35;</sup>", "D", "D<sup>&#35;</sup>", "E", "F", "F<sup>&#35;</sup>", "G", "G<sup>&#35;</sup>", "A", "A<sup>&#35;</sup>", "B"];

var keyNamesFlat = ["C", "D<sup>&#9837;</sup>", "D", "E<sup>&#9837;</sup>", "E", "F", "G<sup>&#9837;</sup>", "G", "A<sup>&#9837;</sup>", "A", "B<sup>&#9837;</sup>", "B"];

var useFlat = false;

var globalShift = 0;

function mouseClick() {
   
}

function checkMouseInput() {
    var prevKeyStart = keyStart;

     selectedIndex = Math.floor((mainCanvas.mouseX - xOffset) / keyWidth);
    var mightBeBlack = false;

    var xDelta = (mainCanvas.mouseX-xOffset) % keyWidth;

    if(mainCanvas.mouseY < keySmallHeight) {
        if(xDelta < keySmallWidth/2 || xDelta > keyWidth-keySmallWidth/2) {
            mightBeBlack = true;
        }
    }

    var index = 0;
    var keyIndex = pianoKeyStart;

    while(index < selectedIndex) {
        index += 1;
        if(blackKeyFollows[keyIndex % 12]) {
            keyIndex += 2;
        }
        else {
            keyIndex += 1;
        }
    }

    keyStart = keyIndex;

    if(mightBeBlack) {
        if(xDelta < keySmallWidth/2) {
            if(blackKeyFollows[(keyIndex-2 + 12) % 12]) {
                keyStart = keyIndex - 1;
            }
        }
        else {
            if(blackKeyFollows[keyIndex % 12]) {
                keyStart = keyIndex + 1;
            }
        }
    }

    if(prevKeyStart != keyStart) {
        updateUI();
    }
}

function mouseDown() {
}

function updateUI() {
    addButtons();
    
    if(options[selectedId] != null) {
        document.getElementById("title").innerHTML = options[selectedId].name.replaceAll("#", getKeyStartName(false))
    }

}

function setup() {
    updateUI();
}

function changeScale(newId) {
    offsets = options[newId].offsets;
    selectedId = newId;
    updateUI();
}

function addButtons() {
    addTableRows("table-chords", [["Caug","","Caug7"],["C","C6","C7","Cmaj7","","C9","C11","C13"],["Cm","Cm6","Cm7","CmM7"],["Cdim","","Cdim7","Chalfdim7","","","Csus2","Csus4"]]);
    addTableRows("table-chords-2", [[]]);

    addTableRows("table-scales", [["s-min-nat","s-min-harm","s-min-mel","s-maj"]]);
    addTableRows("table-scales-2", [["s-maj-pent","s-min-pent","s-blues"]]);

    addTableRows("table-scales-3", [["s-diminished","s-dom-dim","s-whole","s-chrom"]]);



    addTableRows("table-scales-4", [[    "s-ionian","s-dorian","s-phrygian","s-lydian","s-mixolydian","s-aeolian","s-locrian"]]);

    //Adjust flat/sharp button
    if(blackKeyFollows[(keyStart-1+12) % 12]) {
        document.getElementById("sharp-flat-div").style.display = "visible";

        document.getElementById("sharp-flat-button").innerHTML = "display as " + getKeyStartName(true);
    }   
    else {
        document.getElementById("sharp-flat-button").innerHTML = "";

        document.getElementById("sharp-flat-div").style.display = "hidden";
    }

}

function getKeyStartName(inverse = false) {
    if((!inverse && useFlat) || (inverse && !useFlat)) {
        return keyNamesFlat[(keyStart) % 12];
    }
    return keyNamesSharp[(keyStart) % 12];
}

function toggleSharpFlat() {
    useFlat = !useFlat;

    updateUI();
}

function addTableRows(elementId, scaleIds) {
    var htmlString = ""
    for(var row of scaleIds) {
    htmlString += `<tr>`
        for(var id of row) {
            if(id == 0) {
                htmlString += `<td></td>`
                continue;
            }
            var name = "";
            if(options[id].short != null) {
                name = options[id].short.replaceAll("#", getKeyStartName(false))
            }
            else {
                name = options[id].name.replaceAll("#", getKeyStartName(false))
            }

            htmlString += `<td><a class="button" href="javascript:changeScale('${id}')"><div class="button">${name}</div></a></td>`
        }
    htmlString += `</tr>`
    }

    document.getElementById(elementId).innerHTML = htmlString;
}

var offsets = [0];


function draw() {
    if(mainCanvas.mouseIsPressed) {
        checkMouseInput();
    }
    
    mainCanvas.clearCanvas();

   // mainCanvas.ctx.fillRect(0,0,50,200);

    mainCanvas.ctx.fillStyle = "white"
    mainCanvas.ctx.strokeStyle = "black"
    mainCanvas.ctx.lineWidth = 3;

    //var offsets = [0,2,4,5,7,9,11,12]

    var highlightedKeys = offsets.map(x => keyStart + x);

    drawKeyBoard(pianoKeyStart, highlightedKeys);
}

function changeKeyStart(delta, center = false) {
    keyStart += delta;
    if(center) {
        keyStart = (keyStart+8) % 12 + pianoKeyStart+4;
    }

    updateUI();
}

function drawKeyBoard(keyStart, highlightedKeys) {

    var n = 20;

    var keyIndex = keyStart;

    for(var i = 0; i < n; i++) {
        mainCanvas.ctx.fillStyle = "white"

        if(highlightedKeys.includes(keyIndex)) {
            mainCanvas.ctx.fillStyle = "red"
        }

        mainCanvas.ctx.fillRect(xOffset+keyWidth*i,0, keyWidth,keyHeight);

        if(blackKeyFollows[keyIndex % 12]) {
            keyIndex += 2;
        }
        else {
            keyIndex += 1;
        }
    }

    for(var i = 0; i < n+1; i++) {
        mainCanvas.drawLine(xOffset + i*keyWidth, 0, xOffset + i*keyWidth,keyHeight);
    }

    keyIndex = keyStart;

    for(var i = 0; i < n; i++) {
        if(blackKeyFollows[keyIndex % 12]) {
            keyIndex += 1;
        
            mainCanvas.ctx.fillStyle = "black"
            
            if(highlightedKeys.includes(keyIndex)) {
                mainCanvas.ctx.fillStyle = "#880000"
            }

            mainCanvas.ctx.fillRect(xOffset+keyWidth*(i+1) -keySmallWidth/2,0, keySmallWidth,keySmallHeight);
        }

        keyIndex += 1;
    }
}


var options = {

    "C" : {short: "#", name: "# Major", offsets: [0, 4, 7]},
    "Cm" : {short: "#m", name: "# Minor", offsets: [0, 3, 7]},
    "Cdim" : {short: "#dim", name: "# Diminished", offsets: [0, 3, 6]},
    "Caug" : {short: "#aug", name: "# Augmented", offsets: [0, 4, 8]},


    "Csus2" : {short: "#Sus2", name: "# Suspended 2", offsets: [0, 2, 7]},
    "Csus4" : {short: "#Sus4", name: "# Suspended 4", offsets: [0, 5, 7]},

    "C6" : {short: "#6", name: "# Major 6", offsets: [0, 4, 7, 9]},
    "Cm6" : {short: "#m6", name: "# Minor 6", offsets: [0, 3, 7, 9]},

    "Cmaj7" : {short: "#maj7", name: "# Major 7", offsets: [0, 4, 7, 11]},
    "C7" : {short: "#7", name: "# 7", offsets: [0, 4, 7, 10]},
    "Cm7" : {short: "#m7", name: "# Minor 7", offsets: [0, 3, 7, 10]},
    "Cdim7" : {short: "#dim7", name: "# Diminished 7", offsets: [0, 3, 6, 9]},
    "Chalfdim7" : {short: "#ø7", name: "# Half-Diminished 7", offsets: [0, 3, 6, 10]},
    "CmM7" : {short: "#mM7", name: "# Minor Major 7", offsets: [0, 3, 7, 11]},
    "Caug7" : {short: "#aug7", name: "# Augmented 7", offsets: [0, 4, 8, 10]},


    "C9"  : {id: "9", name: "#9", offsets: [0, 4, 7, 10, 14]},
    "C11" : {id: "11", name: "#11", offsets: [0, 4, 7, 10, 14, 17]}, 
    "C13" : {id: "13", name: "#13", offsets: [0, 4, 7, 10, 14, 17, 21]},

    "s-maj" : {name: "# Major", offsets: [0, 2, 4, 5, 7, 9, 11, 12]},
    "s-min-nat" : {name: "# Natural Minor", offsets: [0, 2, 3, 5, 7, 8, 10, 12]},
    "s-min-harm" : {name: "# Harmonic Minor", offsets: [0, 2, 3, 5, 7, 8, 11, 12]},
    "s-min-mel" : {name: "# Melodic Minor ", offsets: [0, 2, 3, 5, 7, 9, 11, 12]},

    "s-maj-pent" : {name: "# Major Pentatonic Scale", offsets: [0, 2, 4, 7, 9, 12]},
    "s-min-pent" : {name: "# Minor Pentatonic Scale", offsets: [0, 3, 5, 7, 10, 12]},
    "s-blues" : {name: "# Blues Scale", offsets: [0, 3, 5, 6, 7, 10, 12]},

    "s-diminished" : {name: "# Diminished", offsets: [0, 2, 3, 5, 6, 8, 9, 11, 12]},
    "s-dom-dim" : {name: "# Dominant Diminished", offsets: [0, 1, 3, 4, 6, 7, 9, 10, 12]},
    "s-whole" : {name: "# Whole Tone Scale", offsets: [0, 2, 4, 6, 8, 10, 12]},
    "s-chrom" : {name: "# #hromatic Scale", offsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},

    "s-ionian" : {name: "# Ionian", offsets: [0, 2, 4, 5, 7, 9, 11, 12]},
    "s-dorian" : {name: "# Dorian", offsets: [0, 2, 3, 5, 7, 9, 10, 12]},
    "s-phrygian" : {name: "# Phrygian", offsets: [0, 1, 3, 5, 7, 8, 10, 12]},
    "s-lydian" : {name: "# Lydian", offsets: [0, 2, 4, 6, 7, 9, 11, 12]},
    "s-mixolydian" : {name: "# Mixolydian", offsets: [0, 2, 4, 5, 7, 9, 10, 12]},
    "s-aeolian" : {name: "# Aeolian", offsets: [0, 2, 3, 5, 7, 8, 10, 12]},
    "s-locrian" : {name: "# Locrian", offsets: [0, 1, 3, 5, 6, 8, 10, 12]},
};
