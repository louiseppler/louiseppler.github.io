var color1 = '#A06AB4';
var color2 = '#D773A2';
var color3 = '#07BB9C';
var color4 = '#FFD743';
var colorR = '#EB3D3D';



dots = [
  {x: 100, y:400},
  {x: 200, y:100},
  {x: 400, y:80},
  {x: 500, y:380},
  {x: 340, y:240},

]

vec1 = {x: 10, y:0};
vec2 = {x: 0, y:10};
elCenter = {x: 0, y:0}; //ellipse center

var selectedDot = -1;

var useManhattanDist = false;

var value = 0.0;

let slider;

var animationRadius = 0;

const s1 = ( sketch ) => {

  var colorBackgorund = sketch.color(255);
  var colors = [
    sketch.color('#A06AB4'),
    sketch.color('#D773A2'),
    sketch.color('#07BB9C'),
    sketch.color('#FFD743'),  
    sketch.color('#EB3D3D'),
  ];
  
  

  function setColors() {
    var f = 38;

    sketch.colorMode(sketch.HSB);
    for(var k = colors.length; k < dots.length; k++) {
      colors.push(sketch.color((k*f)%360,64,90))
    }
  }


  sketch.setup = () => {
    sketch.createCanvas(700,500);

    animationRadius = sketch.height + sketch.width;
    document.getElementById("button1").onclick = () => {
      animationRadius = 0;
    }

    setColors();
  };

  sketch.draw = () => {
    //sketch.background(value)
    sketch.background(240);

    drawDiagram();


    sketch.fill(0);
    sketch.stroke(0);
    for(var i = 0; i < dots.length; i++) {
      sketch.ellipse(dots[i].x,dots[i].y,5,5);
    }

    if(mouseInSketch(sketch) && sketch.mouseIsPressed && selectedDot != -1) {
      dots[selectedDot].x = sketch.mouseX;
      dots[selectedDot].y = sketch.mouseY;
    }

    if(animationRadius <  sketch.width+sketch.height) {
      animationRadius += 2;
    }

  };


  sketch.mousePressed = () => {
    if(!mouseInSketch(sketch)) return;

    var minDotIndex = 0;
    var minDist = 1000*1000; //+infinty

    for(var i = 0; i < dots.length; i++) {
      const newDist = getDist(sketch.mouseX,sketch.mouseY,dots[i].x,dots[i].y);
      if(newDist < minDist) {
        minDist = newDist;
        minDotIndex = i;
      }
    }

    if(minDist < 50*50) {
      selectedDot = minDotIndex;
    }
    else {
      if(dots.length > 20) return; //limit maximum number of dots

      dots.push({x: sketch.mouseX, y: sketch.mouseY});
      selectedDot = dots.length-1;
      setColors();
    }
  };

 
  function drawDiagram() {

    var animationRadiusSquared = animationRadius*animationRadius;
    if(useManhattanDist) {
      animationRadiusSquared = animationRadius;
    }

  

    for (let i = 0; i < sketch.width; i++) {
      for (let j = 0; j < sketch.height ; j++) {
        var minDot = 0;
        var minDist = sketch.width*sketch.height*100; //a big number
        for(var k = 0; k < dots.length; k++) {
          if(useManhattanDist) {
            dist = getDist2(i,j,dots[k].x,dots[k].y);

          }
          else {
            dist = getDist(i,j,dots[k].x,dots[k].y);
          }
          if(dist < minDist) {
            minDist = dist;
            minDot = k;
          }
        }
         
        if(minDist < animationRadiusSquared) {
          sketch.set(i, j, colors[minDot]);
        }
        else {
          sketch.set(i,j, colorBackgorund);
        }
      }
    }
    sketch.updatePixels();
  }


};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

function getDist(x1, y1, x2, y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function getDist2(x1, y1, x2, y2) {
  return Math.abs(x1-x2)+Math.abs(y2-y1);
}



function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}
