var dots = [];
var mouseCoords = 0;
var mouseInSketch2 = false;
var mouseInSketch1 = false;

var angle2 = 0; //used for backwards preview
var h2 = 0;

function drawRandomLine() {
  s1.drawRandomLine();
}

const s1 = ( sketch ) => {

  var dragging = false;

  var cx;
  var cy;

  sketch.setup = () => {

    sketch.createCanvas(300,300);


    cx = sketch.width/2;
    cy = sketch.height/2;
  };

  sketch.draw = () => {
    sketch.background(224);

    sketch.stroke(0,0,0);
    sketch.strokeWeight(1);
    sketch.noStroke();
    sketch.ellipse(sketch.width/2,sketch.height/2,5,5);

    sketch.fill(0);
    for(var i = 0; i < dots.length; i++) {
      sketch.noStroke();
      sketch.ellipse((dots[i].mx+1)*sketch.width/2, (dots[i].my+1)*sketch.height/2, 10, 10);
    }

    if(mouseInSketch2) {
      var f = 225; //this number is determined by guessing, depends on s2 value
      sketch.stroke(0,128,128);
      sketch.strokeWeight(3);
      sketch.line(cx-300*Math.sin(angle2)-Math.cos(angle2)*h2*f,cy-300*Math.cos(angle2)+Math.sin(angle2)*h2*f,
                  cx+300*Math.sin(angle2)-Math.cos(angle2)*h2*f,cy+300*Math.cos(angle2)+Math.sin(angle2)*h2*f);
      sketch.stroke(0,0,0);
      sketch.strokeWeight(1);
    }

    mouseInSketch1 = mouseInSketch(sketch);
    if(!mouseInSketch1) {return;}


    mouseCoords = getCoords(sketch.mouseX, sketch.mouseY);

    if(sketch.mouseIsPressed && dragging) {
      if(Math.abs(dots[dots.length-1].mx-mouseCoords.mx)+Math.abs(dots[dots.length-1].my-mouseCoords.my) > 0.01) {
        dots.push(getCoords(sketch.mouseX,sketch.mouseY));
      }
    }
    else {
      dragging = false;
    }


  };

  function getCoords(x, y) {
    //convert dots to sacle [-1,1]
    return {mx: x/sketch.width*2-1, my: y/sketch.height*2-1};
  }

  sketch.mousePressed = () => {

    console.log("----");
    //console.log(dots);
    console.log(mouseCoords);

    if(mouseInSketch(sketch)) {
      sketch.fill(0);
      //sketch.ellipse(sketch.mouseX, sketch.mouseY, 10, 10);
      dots.push(getCoords(sketch.mouseX,sketch.mouseY));
      dragging = true;
    }


    //console.log(mx1 +" " + my1 + " <->" + mx2 + " " + my2);

  }

};

function getDist(x1, y1, x2, y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}



//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');

const s2 = ( sketch ) => {
  let slider;
  let input;

  var value = 0.0;

  var button;

  var showAxis = false;


  sketch.setup = () => {
    sketch.createCanvas(500,300);

    button = document.getElementById("button1");
    button.onclick = button1;

    document.getElementById("button2").onclick = button2;

    button1();

  };

  sketch.draw = () => {

    sketch.background(248*4);

    sketch.noFill();


    sketch.stroke(0,32);
    sketch.strokeWeight(3);
    sketch.ellipse(0,0,0,0);
    for(const dot of dots) {
      transfromDot(dot.mx, dot.my);
    }

    if(mouseInSketch1) {
      sketch.stroke(128,0,128);
      transfromDot(mouseCoords.mx, mouseCoords.my);
    }


    if(showAxis) {
      drawAxis();
      sketch.ellipse(0,0,0,0);
    }



    angle2 = sketch.mouseX/sketch.width*Math.PI*2;
    h2 = (sketch.mouseY/sketch.height*2)-1;

    mouseInSketch2 = mouseInSketch(sketch);

    // sketch.stroke(0);
    // sketch.strokeWeight(1);
    // sketch.line(0,sketch.height-10,sketch.width,sketch.height-10);

  }

  function button1() {
    showAxis = !showAxis;
    if(showAxis) {
      button.value = "hide axis";
    }
    else {
      button.value = "show axis";
    }
  }

  function button2() {
    dots = [];
  }

  function drawAxis() {
    var w = sketch.width;
    var h = sketch.height;

    sketch.fill(0);
    sketch.noStroke();
    sketch.text("displasement",3,12);
    sketch.text("angle",w-30,h-7);

    sketch.stroke(0);
    sketch.strokeWeight(1);

    sketch.line(10,17,10,h);
    sketch.line(7,22,10,17);
    sketch.line(13,22,10,17);

    sketch.line(0,h-10, w-35, h-10);
    sketch.line(w-40,h-13,w-35, h-10);
    sketch.line(w-40,h-7,w-35, h-10);
  }

  function transfromDot(x ,y) {
    //sketch.ellipse(100+x*100,100+y*100,10,10);

    var dist = getDist(0,0,x,y);
    var angle = Math.atan2(x,y);

    //sketch.ellipse(100+angle*50,50+dist*200,10,10);

    var s1 = sketch.width/(2*Math.PI);
    var s2 = 100;
    var shiftY = sketch.height/2;

    sketch.beginShape();


    for(var alpha = 0; alpha <= 2*Math.PI; alpha += 0.1) {
      // var a = dist/Math.cos(alpha-angle);
      // var x1 = x-a*Math.cos(alpha);
      // var y1 = y-a*Math.sin(alpha);

      var vecX = Math.sin(alpha);
      var vecY = Math.cos(alpha);

      var p = x*vecX+y*vecY;
      var x1 = x-p*vecX;
      var y1 = y-p*vecY

      var h = Math.sqrt(x1*x1+y1*y1);
      var foo = (angle-alpha);

      //since distance is in absolute value, correct that
      foo += 4*Math.PI;
      foo = foo%(2*Math.PI);
      if(foo < Math.PI) {h = -h;}

      sketch.vertex(alpha*s1, shiftY+h*s2);

      if(alpha != 0) {
        //sketch.line(prevAngle*s1, shiftY+prevH*s2, alpha*s1, shiftY+h*s2);
      }

    }

    sketch.endShape();
  }
};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}
