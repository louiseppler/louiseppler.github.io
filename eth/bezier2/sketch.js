var color1 = '#A06AB4';
var color2 = '#D773A2';
var color3 = '#07BB9C';
var color4 = '#FFD743';
var colorR = '#EB3D3D';


dots = [
  {x: 100, y:400},
  {x: 200, y:100},
  {x: 400, y:80},
  {x: 550, y:300},
  {x: 590, y:250},
  {x: 610, y:180},
  {x: 660, y:310},
  {x: 630, y:360},
  {x: 540, y:410},
]
var deg = 2;

var selectedDot = -1;

var basisFunction = bernsteinBasis;

var value = 0.0;

let slider;

animate = true;


const s1 = ( sketch ) => {



  sketch.setup = () => {

    sketch.createCanvas(700,500);

    sketch.textAlign(sketch.CENTER);

    button1();

    //button
    let button = document.getElementById("button1");
    button.onclick = button1;

    document.getElementById("button2").onclick = button2;
    document.getElementById("button3").onclick = button3;

    //slider
    slider = document.getElementById("slider1");

  };

  sketch.draw = () => {
    //sketch.background(value)
    sliderChanged();
    sketch.background(240);
    //
    if(animate) {
      value += 0.5;
      value = value % 100;
    }
    valueUpdated();





    sketch.fill(96);
    sketch.stroke(96);
    for(var i = 0; i < deg; i++) {
      sketch.line(dots[i].x,dots[i].y,dots[i+1].x,dots[i+1].y);
    }

    sketch.strokeWeight(3);
    //drawInterpolant();
    drawInterpolantWithBasis(basisFunction);
    sketch.ellipse(0,0,0,0);
    sketch.strokeWeight(1);
    drawInterpolantUI(value/100);
    drawShowValue(basisFunction, value/100);


    sketch.noStroke();
    sketch.fill(0);
    for(var i = 0; i < deg+1; i++) {
      if(i == selectedDot) {
        sketch.fill(color4);
      }
      else {
        sketch.fill(0);
      }
      sketch.ellipse(dots[i].x,dots[i].y,10,10);
    }

    drawAxis();


    if(mouseInSketch(sketch) && sketch.mouseIsPressed) {
      var minDotIndex = 0;
      var minDist = 1000*1000; //+infinty

      for(var i = 0; i < deg+1; i++) {
        const newDist = getDist(sketch.mouseX,sketch.mouseY,dots[i].x,dots[i].y);
        if(newDist < minDist) {
          minDist = newDist;
          minDotIndex = i;
        }
      }

      selectedDot = minDotIndex;

      dots[minDotIndex].x = sketch.mouseX;
      dots[minDotIndex].y = sketch.mouseY;

    }


  };

  function drawAxis() {
    var w = sketch.width;
    var h = sketch.height;

    sketch.fill(96);
    sketch.noStroke();
    sketch.text("y",10,12);
    sketch.text("x",w-10,h-7);

    sketch.stroke(96);
    sketch.strokeWeight(1);

    //axis + arrow
    sketch.line(10,17,10,h);
    sketch.line(7,22,10,17);
    sketch.line(13,22,10,17);

    //axis + arrow
    sketch.line(0,h-10, w-15, h-10);
    sketch.line(w-20,h-13,w-15, h-10);
    sketch.line(w-20,h-7,w-15, h-10);

  }

  function drawInterpolant() {
    sketch.beginShape();
    sketch.noFill();

    const step = 20;
    for(var i = 0; i <= step; i++) {
      const t = i/step;
      const dot01 = linearInterpolant(dots[0],dots[1],t);
      const dot12 = linearInterpolant(dots[1],dots[2],t);
      const dot23 = linearInterpolant(dots[2],dots[3],t);
      const dotA = linearInterpolant(dot01,dot12,t);
      const dotB = linearInterpolant(dot12,dot23,t);

      const dotFinal = linearInterpolant(dotA,dotB,t);

      //console.log(dotA);

      sketch.vertex(dotFinal.x, dotFinal.y);
    }

    sketch.endShape();

  }

  function drawInterpolantUI(t) {
    const dot01 = linearInterpolant(dots[0],dots[1],t);
    if(deg == 1) {
      sketch.fill(colorR);
      sketch.noStroke();
      sketch.ellipse(dot01.x,dot01.y,7,7);

    }
    if(deg < 2 || deg > 3) return;

    const dot12 = linearInterpolant(dots[1],dots[2],t);
    const dot23 = linearInterpolant(dots[2],dots[3],t);
    const dotA = linearInterpolant(dot01,dot12,t);
    const dotB = linearInterpolant(dot12,dot23,t);

    const dotFinal = linearInterpolant(dotA,dotB,t);


    if(true) { //shows ui
      sketch.fill(color1);
      sketch.stroke(color1);
      sketch.ellipse(dot01.x,dot01.y,5,5);
      sketch.ellipse(dot12.x,dot12.y,5,5);
      sketch.line(dot01.x,dot01.y,dot12.x,dot12.y);


      if(deg == 3) {
        sketch.ellipse(dot23.x,dot23.y,5,5);
        sketch.line(dot12.x,dot12.y,dot23.x,dot23.y);

        sketch.fill(color2);
        sketch.stroke(color2);
        sketch.ellipse(dotA.x,dotA.y,7,7);
        sketch.ellipse(dotB.x,dotB.y,7,7);

        sketch.line(dotA.x,dotA.y,dotB.x,dotB.y);
      }


    }

    sketch.fill(colorR);
    sketch.noStroke();
    if(deg == 3) {
      sketch.ellipse(dotFinal.x,dotFinal.y,11,11);
    }
    else {
      sketch.ellipse(dotA.x,dotA.y,9,9);
    }

  }

  function linearInterpolant(dotA, dotB, t) {
    const newX = dotA.x*(1-t) + dotB.x*t;
    const newY = dotA.y*(1-t) + dotB.y*t;

    return {x:newX,y:newY};

  }

  function drawShowValue(basisFunc, i) {
    N = deg+1;
    //if degree is <= 3 it is done in showUi
    if(deg > 3) {
      const nextSol = basisFunc(N, i*(N-1));

      var x = 0;
      var y = 0;
      for(var j = 0; j < N; j++) {
        x += dots[j].x*nextSol[j];
        y += dots[j].y*nextSol[j];
      }

      if(i != 0) {
        sketch.fill(colorR);
        sketch.noStroke();
        sketch.ellipse(x,y,9,9);
      }
    }
  }

  function drawInterpolantWithBasis(basisFunc) {
    var N = deg+1;
    var res = 100;
    var step = (N-1)/res;

    var prevX;
    var prevY;

    sketch.stroke(0);

    for(var i = 0; i < N-1+step*0.1; i += step) {

      const nextSol = basisFunc(N, i);
      //console.log(nextSol);

      //logLive(sketch, nextSol[N-2]);

      var x = 0;
      var y = 0;
      for(var j = 0; j < N; j++) {
        x += dots[j].x*nextSol[j];
        y += dots[j].y*nextSol[j];
      }

      if(i != 0) {
        sketch.line(prevX,prevY,x,y);
      }

      prevX = x;
      prevY = y;
    }

  };

  function button1() {
    animate = !animate;

    if(animate) {
      document.getElementById("button1").value = "stop";
    }
    else {
      document.getElementById("button1").value = "start animation";

    }
  }

  function button2() {
    deg = deg-1;
    if(deg < 1) {deg = 1;}
  }

  function button3() {
    deg = deg+1;
    if(deg > 8) {deg = 8;}
  }

  function sliderChanged() {
    var oldValue = value;
    sliderVal = +(slider.value)
    value = sliderVal;

    if(oldValue != value) {
      valueUpdated();
    }
  }

};

function valueUpdated() {
  slider.value = value;
}


//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');



const s2 = ( sketch ) => {


  sketch.setup = () => {

    sketch.createCanvas(700,300);

    sketch.textAlign(sketch.CENTER);


    sketch.background(250);

  };

  sketch.draw = () => {
    sketch.background(200);
    drawBasis();


    if(mouseInSketch(sketch) && sketch.mouseIsPressed) {
      value = sketch.mouseX/sketch.width*100;
      valueUpdated();
    }


    sketch.stroke(colorR);
    sketch.ellipse(0,0,0,0);
    sketch.line(value/100*sketch.width,0,value/100*sketch.width,sketch.height);

    drawAxis();

  }


    function drawAxis() {
      var w = sketch.width;
      var h = sketch.height;

      sketch.fill(96);
      sketch.noStroke();
      sketch.text("1",6,22);
      sketch.text("1",w-20,h-5);

      sketch.stroke(96);
      sketch.strokeWeight(1);




      sketch.line(20,0,20,h);
     sketch.line(16,20,24,20);
    // sketch.line(13,22,10,17);

      sketch.line(0, h-20, w, h-20);
      sketch.line(w-20,h-16,w-20,h-24);
      // sketch.line(w-20,h0-3,w-15, h0);
      // sketch.line(w-20,h0+3,w-15, h0);

    }


  function drawBasis() {
    var N = deg+1;
    var res = 100;
    var step = (N-1)/res;

    var prevSol;

    sketch.stroke(0);

    for(var i = 0; i < N-1+step*0.1; i += step) {

      const nextSol = basisFunction(N, i);
      //console.log(nextSol);


      if(i != 0) {
        for(var j = 0; j < N; j++) {
          if(j == selectedDot) {
            sketch.fill(0,0,0);
            //sketch.ellipse(i*sketch.width/N,      (1-nextSol[j])*sketch.height,4,4)
            sketch.stroke(color4);

          }
          else {
            sketch.fill(0,0,0);
            sketch.ellipse(0,0,0,0); //fixes some kind of rendering bug...
            sketch.stroke('#000000');

          }
          sketch.line(20+(i-step)*(sketch.width-40)/(N-1), 20+(1-prevSol[j])*(sketch.height-40),
                      20+i*(sketch.width-40)/(N-1),      20+(1-nextSol[j])*(sketch.height-40));


        }
      }

      prevSol = nextSol;
    }
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

function getDist(x1, y1, x2, y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}



function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}
