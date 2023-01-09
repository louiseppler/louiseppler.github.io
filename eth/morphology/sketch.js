var N = 30;//size of image
var M = 5; //size of structuring element

var inputImage = [];
var displayedImage = null;
var structImage = [];
var canDraw = true;

/*
Image data: 0,1 no pixel, 2,3 has pixel
(1: pixel that was removed)
(2: pixeld that was newly added)
*/

var colors = [
  "#ffffff",
  "#dddddd",
  "#444444",
  "#000000",
]

const s1 = ( sketch ) => {

  var color = 0;

  sketch.setup = () => {
    sketch.createCanvas(496,496);

    setUpButtons();

    inputImage = emptySquareArray(N);
  };

  function getRotateAll() {
    return document.getElementById("rotateAll").checked;
  }

  function setUpButtons() {
    document.getElementById("button1").onclick = () => {
      console.log("button 1 pressed");
      displayedImage = dilation(inputImage, structImage);
      canDraw = false;
    };

    document.getElementById("button2").onclick = () => {
      console.log("button 2 pressed");
      displayedImage = erosion(inputImage, structImage);
      canDraw = false;
    };

    document.getElementById("button3").onclick = () => {
      console.log("button 3 pressed");

      displayedImage = dilation(erosion(inputImage, structImage) ,structImage);
      setImagePreview();
      canDraw = false;
    };

    document.getElementById("button4").onclick = () => {
      console.log("button 4 pressed");

      displayedImage = erosion(dilation(inputImage, structImage) ,structImage);
      setImagePreview();
      canDraw = false;
    };

    document.getElementById("button5").onclick = () => {
      console.log("button 5 pressed");

      displayedImage = hitAndMiss(inputImage, structImage, getRotateAll());
      setImagePreview();
      canDraw = false;
    };

    document.getElementById("button6").onclick = () => {
      console.log("button 6 pressed");

      displayedImage = thinning(inputImage, structImage, getRotateAll());
      setImagePreview();
      canDraw = false;
    };

    document.getElementById("button7").onclick = () => {
      console.log("button 7 pressed");

      displayedImage = thickening(inputImage, structImage, getRotateAll());
      setImagePreview();
      canDraw = false;
    };

    document.getElementById("buttonA").onclick = () => {
      console.log("button A pressed");

      updateImage();
      displayedImage = null;
      canDraw = true;
    };

    document.getElementById("buttonB").onclick = () => {
      console.log("button B pressed");

      displayedImage = null;
      canDraw = true;
    };

    document.getElementById("buttonC").onclick = () => {
      console.log("button C pressed");

      displayedImage = null;
      inputImage = emptySquareArray(N);
      canDraw = true;
    };
  }

  sketch.draw = () => {
    sketch.background(128);

    if(sketch.mouseIsPressed && mouseInSketch(sketch) && canDraw) {
      updatePixels();
    }

    if(displayedImage == null) {
      drawImage(inputImage);
    }
    else {
      drawImage(displayedImage);
    }

    // if(displayedImage == null) {
    //   logLive(sketch, "null");
    // }
    // else {
    //   logLive(sketch, "not null")
    // }

  }

  function drawImage(img) {
    const s = sketch.height/N;

    sketch.stroke(128);

    for(var i = 0; i < N; i++) {
      for(var j = 0; j < N; j++) {
        sketch.fill(colors[img[i][j]]);
        sketch.rect(i*s,j*s,s,s);
      }
    }
  }

  function updatePixels() {
    var i = Math.floor(sketch.mouseX/sketch.width*N);
    var j = Math.floor(sketch.mouseY/sketch.height*N);

    inputImage[i][j] = color;
  }

  sketch.mouseReleased = () => {
    canDraw = true;
  }

  sketch.mousePressed = () => {
    if(mouseInSketch(sketch)) {
      if(displayedImage != null) {
        displayedImage = null;
      }

      var i = Math.floor(sketch.mouseX/sketch.width*N);
      var j = Math.floor(sketch.mouseY/sketch.height*N);

      if(inputImage[i][j] == 0) {
        color = 3;
      }
      else {
        color = 0;
      }
    }
  }

  function updateImage() {
    if(displayedImage == null) {
      return;
    }

    for(var i = 0; i < N; i++) {
      for(var j = 0; j < N; j++) {
        if(displayedImage[i][j] >= 2) {
          inputImage[i][j] = 3;
        }
        else {
          inputImage[i][j] = 0;
        }
      }
    }
  }

  function setImagePreview() {
    for(var i = 0; i < N; i++) {
      for(var j = 0; j < N; j++) {
        if(displayedImage[i][j] < 2) {
          if(inputImage[i][j] == 0) {
            displayedImage[i][j] = 0;
          }
          else {
            displayedImage[i][j] = 1;
          }
        }
        else {
          if(inputImage[i][j] == 0) {
            displayedImage[i][j] = 2;
          }
          else {
            displayedImage[i][j] = 3;
          }
        }
        // if(inputImage[i][j] == 0 && displayedImage[i][j] < 2) {
        //   displayedImage[i][j] = 0;
        // }
        // if(inputImage[i][j] == 0 && displayedImage[i][j] >= 2) {
        //   displayedImage[i][j] = 1;
        //
        // }
        // if(inputImage[i][j] == 3 && displayedImage[i][j] < 2) {
        //   displayedImage[i][j] = 2;
        //
        // }
        // if(inputImage[i][j] == 3 && displayedImage[i][j] >= 2) {
        //   displayedImage[i][j] = 3;
        // }
      }
    }
  }

  //Image processing part =========================



};

function getDist(x1, y1, x2, y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}



//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');

const s2 = ( sketch ) => {

  var color = 0;

  sketch.setup = () => {
    sketch.createCanvas(100,100);

    structImage = emptySquareArray(M);

    setPreset0();

  };

  sketch.draw = () => {
    sketch.background(128);

    const s = sketch.height/M;

    if(sketch.mouseIsPressed && mouseInSketch(sketch)) {
      updatePixels();
    }

    sketch.stroke(128);
    for(var i = 0; i < M; i++) {
      for(var j = 0; j < M; j++) {

        if(structImage[i][j] == -1) {
          sketch.fill(255);
          sketch.rect(i*s,j*s,s,s);
          sketch.line(i*s,(j+1)*s,(i+1)*s,j*s);
          sketch.line(i*s,j*s,(i+1)*s,(j+1)*s);
        }
        else {
          if(structImage[i][j] == 1) {
            sketch.fill(0);
          }
          else {
            sketch.fill(255);
          }
          sketch.rect(i*s,j*s,s,s);
        }
      }
    }
  }

  function updatePixels() {
    var i = Math.floor(sketch.mouseX/sketch.width*M);
    var j = Math.floor(sketch.mouseY/sketch.height*M);

    structImage[i][j] = color;
  }

  sketch.mousePressed = () => {
    if(mouseInSketch(sketch)) {
      var i = Math.floor(sketch.mouseX/sketch.width*M);
      var j = Math.floor(sketch.mouseY/sketch.height*M);

      if(structImage[i][j] == -1) {
        color = 0;
      }
      else {
        color = 1-structImage[i][j];
      }

      if(sketch.keyIsPressed && sketch.keyCode == sketch.SHIFT) {
        color = -1;
      }
    }

  }


};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function setPreset0() {
  structre = emptySquareArray(M);
  structImage[1][2] = 1;
  structImage[2][2] = 1;
  structImage[3][2] = 1;
  structImage[2][1] = 1;
  structImage[2][3] = 1;
}

function setPreset1() {
  structImage = [
    [-1,-1,-1,-1,-1],
    [-1,-1, 1,-1,-1],
    [-1, 0, 1, 1,-1],
    [-1, 0, 0,-1,-1],
    [-1,-1,-1,-1,-1]
  ];
}


function setPreset2() {
  structImage = [
    [-1,-1,-1, 1,-1],
    [-1,-1, 0, 1, 1],
    [-1,-1, 0, 0,-1],
    [-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1]
  ];
}

function emptySquareArray(n) {
  var array = [];
  for(var i = 0; i < n; i++) {
    array.push([]);
    for(var j = 0; j < n; j++) {
      array[i].push(0);
    }
  }

  return array;
}

function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}
