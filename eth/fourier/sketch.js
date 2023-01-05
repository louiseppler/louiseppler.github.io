var heights = [];
var shifts = [];
var s = 10; //rectangle size
var smallS = 10;
var f = 5;
var sx = 0;
var my = 0;

var btn1;
var smallResolution = false;
var btn2;

var displayMode = 0;


function changeResolution() {
  console.log("button 1 pressed");
  smallResolution = !smallResolution;
  if(smallResolution) {
    s = smallS;
  }
  else {
    s = smallS*f;
  }
}

function changeDisplayMode() {
  displayMode = (displayMode+1)%5;
  if(displayMode == 1) displayMode++; //removed mode 1 (too lazy to rename everything in code)

}

function resetValues() {
  heights = [];
  shifts = [];
  for(var i = 0; i < 500/smallS+1; i++) {
    heights.push(0);
    shifts.push(0);
  }
}

const s1 = ( sketch ) => {

  var dragging = false;

  sketch.setup = () => {
    sketch.createCanvas(500,500);

    btn1 = document.getElementById("btn1");
    btn1.onclick = changeResolution;
    btn2 = document.getElementById("btn2");
    btn2.onclick = changeDisplayMode;
    btn3 = document.getElementById("btn3");
    btn3.onclick = resetValues;

    resetValues();

    changeResolution();
    changeResolution();

    //btn1 = document.getElementById("button1");
    //btn1.onclick = drawRandomLine;
  };

  sketch.draw = () => {

    sketch.background(224);

    sketch.line(sketch.width/2,0,sketch.width/2,sketch.height);
    sketch.text("x=0",sketch.width/2,10)

    //draw input
    sketch.fill(64);
    if(displayMode == 4) {sketch.colorMode(sketch.HSB, 1, 1, 1)}
    for(var i = 0; i < heights.length; i++) {
      if(!smallResolution && i % f != 0) continue;
      if(displayMode == 4) {sketch.fill((i/heights.length*4)%1, 0.5, 0.5);}
      sketch.rect(i*smallS-s/2,sketch.height-heights[i],s,heights[i]);
    }
    if(displayMode == 4) {sketch.colorMode(sketch.RGB)}


    sketch.fill(128);
    for(var i = 0; i < shifts.length; i++) {
      if(!smallResolution && i % f != 0) continue;
      sketch.ellipse((i)*smallS,(shifts[i])*sketch.height, 5,5);
    }

    if(!mouseInSketch(sketch)) {return;}


    //update variables for other sketch
    my = sketch.mouseY;

    sx = Math.floor((sketch.mouseX+s/2)/smallS);
    if(!smallResolution) {
      sx = Math.floor((sx*1.0)/f)*f;
    }



    //update input if mouse is pressed
    if(sketch.mouseIsPressed) {
      if(sketch.key == "Shift" && sketch.keyIsPressed) {
        shifts[sx] = sketch.mouseY/sketch.height;
      }
      else { //edit frequency
        //var sx = Math.floor(sketch.mouseX/s);
        heights[sx] = sketch.height-sketch.mouseY;
      }
    }

  };

  sketch.mousePressed = () => {
    }

};



//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');

const s2 = ( sketch ) => {
  let slider;
  let input;

  var value = 0.0;


  sketch.setup = () => {
    sketch.createCanvas(500,500);

  };

  sketch.draw = () => {
    sketch.background(248);

    var values = [];
    var s2 = 3;

    var N = heights.length;

    //draw main function
    for(var i = 0; i < sketch.height/s2; i++){
      var val = 0;
      for(var j = 0; j < heights.length; j++) {
        if(!smallResolution && j % f != 0) continue;
        var x = i-sketch.width/s2/2;
        var f2 = 200/s; //+ shifts[i]*2*Math.PI
        val -= Math.cos((j-(N-1)/2)/25*x + shifts[j]*2*Math.PI)*heights[j]/f2;
      }
      values.push(val+sketch.height/2);
    }

    sketch.stroke(0);
    sketch.strokeWeight(3);
    sketch.ellipse(0,0,0,0);
    for(var i = 1; i < sketch.height/s2; i++) {
      sketch.line((i-1)*s2, values[i-1], i*s2, values[i]);
    }

    sketch.strokeWeight(1);
    sketch.line(0,sketch.height*0.5,sketch.width,sketch.height*0.5);


    if(displayMode == 4) {
      s2 = 2
      //draw all lines individually
      sketch.colorMode(sketch.HSB, 1, 1, 1);
      for(var j = 0; j < heights.length; j++) {
        var oldVal = 0;
        for(var i = 0; i < sketch.height/s2; i++){

          if(!smallResolution && j % f != 0) continue;
          sketch.stroke((j*4/heights.length)%1,1,1);
          sketch.ellipse(0,0,0,0);

          var x = i-sketch.width/s2/2;
          var f2 = 200/s; //+ shifts[i]*2*Math.PI
          //I have no idea why a 1/1.5 here is needed
          val = sketch.height/2 - Math.cos(1/1.5*(j-(N-1)/2)/25*x + shifts[j]*2*Math.PI)*heights[j]/f2;

          sketch.line((i-1)*s2,oldVal,i*s2,val);

          oldVal = val;
        }
      }
      sketch.colorMode(sketch.RGB);


    }
    else {
      //compute helper functions
      var sampleValues1 = [];
      var sampleValues2 = [];

      for(var i = 0; i < sketch.height/s2; i++){
        var val1 = 0;
        var val2 = 0;
        for(var j = 0; j < heights.length; j++) {
          //if(!smallResolution && j % f != 0) continue;
          var x = i-sketch.width/s2/2;
          var f2 = 200/s; //+ shifts[i]*2*Math.PI

          var j2 = sx;
          if(j == j2) {
            val1 -= Math.cos((j-(N-1)/2)/25*x + shifts[j]*2*Math.PI)*heights[j]/f2;
          }
          else {
            val2 -=  Math.cos((j-(N-1)/2)/25*x + shifts[j]*2*Math.PI)*heights[j]/f2;
          }
        }

        sampleValues1.push(val1+sketch.height/2);
        sampleValues2.push(val2+sketch.height/2);
      }

      //draw helper functions
      sketch.stroke(255,0,128);
      sketch.ellipse(0,0,0,0);
      if(displayMode == 2 || displayMode == 3) {
        for(var i = 1; i < sketch.height/s2; i++) {
          sketch.line((i-1)*s2, sampleValues1[i-1], i*s2, sampleValues1[i]);
        }
      }
      sketch.stroke(255,128,0);
      sketch.ellipse(0,0,0,0);
      if(displayMode == 3) {

        for(var i = 1; i < sketch.height/s2; i++) {
          sketch.line((i-1)*s2, sampleValues2[i-1], i*s2, sampleValues2[i]);
        }
      }
    }

    //draw info labels
    if(displayMode == 2 || displayMode == 3) {
      sketch.fill(255,0,128);
      sketch.noStroke();
      sketch.text("---- preview function", 10, 15);
    }
    if(displayMode == 3) {
      sketch.fill(255,128,0);
      sketch.noStroke();
      sketch.text("---- function without preview function", 120, 15);
    }
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}
