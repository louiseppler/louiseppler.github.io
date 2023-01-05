var dots = [];
var mx = 0;
var my = 0;
var scale = 0;

var mxB = 0;
var myB = 0;

var inSketchA = false;
var inSketchB = false;

function changeScale() {
 scale = 1-scale;
 if(scale == 0) {
   document.getElementById("link-button1").innerHTML = "right-hand-side [-1,1]"
 }
 else {
   document.getElementById("link-button1").innerHTML = "bigger scale"
 }
}

var drawRandomLineHelper;

function drawRandomLine() {
  s1.drawRandomLine();
}

const s1 = ( sketch ) => {

  var dragging = false;

  sketch.setup = () => {
    changeScale();

    sketch.createCanvas(500,500);

    btn1 = document.getElementById("button1");
    btn1.onclick = drawRandomLine;
    drawRandomLineHelper = drawRandomLine;

    document.getElementById("button2").onclick = resetDrawing;
  };

  sketch.draw = () => {
    sketch.background(224);

    sketch.fill(0);
    for(var i = 0; i < dots.length; i++) {
      sketch.ellipse(dots[i].mx, dots[i].my, 10, 10);
    }

    if(inSketchB) {
      var a = ((sketch.width-mxB)/sketch.width*2-1);
      var b = ((myB)/sketch.width*2-1);

      if(scale == 1) {
        a *= 4;
        //b = 4;
      }

      var y1 = (a*-1+b +1)*sketch.height/2;
      var y2 = (a*1+b +1)*sketch.height/2;

      sketch.stroke(0,128,128);
      sketch.strokeWeight(3);
      sketch.line(0,y1,sketch.width,y2);
      sketch.noStroke();
    }
    displayInfoLabel();


    inSketchA = false;
    if(!mouseInSketch(sketch)) {return;}
    inSketchA = true;

    mx = sketch.mouseX;
    my = sketch.mouseY;


    if(sketch.mouseIsPressed && dragging) {
      if(Math.abs(dots[dots.length-1].mx-sketch.mouseX)+Math.abs(dots[dots.length-1].my-sketch.mouseY) > 25) {
        dots.push({mx: sketch.mouseX, my:sketch.mouseY});
      }
    }
    else {
      dragging = false;
    }

  };

  sketch.mousePressed = () => {

    console.log("----");
    console.log(dots);


    if(mouseInSketch(sketch)) {
      sketch.fill(0);
      //sketch.ellipse(sketch.mouseX, sketch.mouseY, 10, 10);
      dots.push({mx: sketch.mouseX, my:sketch.mouseY});
      dragging = true;
    }
  }

  function displayInfoLabel() {
    var str = "-";
    if(inSketchA) {
      const a = 2*mx/sketch.width-1;
      const b = 2*my/sketch.height-1;
      var a2 = a;
      if(scale == 1) {a2 = a*4;}
      str = "&nbsp;&nbsp;("+ sketch.nf(a,1,2) +","+sketch.nf(b,1,2)+") &nbsp;&rarr; &nbsp;  f(x)=" + sketch.nf(-a2,1,2) + "x+"+sketch.nf(b,1,2);
    }
    if(inSketchB) {
      str = "B";

      //duplicate code
      var a = ((sketch.width-mxB)/sketch.width*2-1);
      var b = ((myB)/sketch.width*2-1);

      if(scale == 1) {
        a *= 4;
        //b = 4;
      }

      str = "f(x) = " + sketch.nf(-a,1,2)+"x+"+ sketch.nf(b,1,2) + " &nbsp;&larr; &nbsp;  ("+ sketch.nf(a,1,2) +","+sketch.nf(b,1,2)+")&nbsp;&nbsp;";
    }

    document.getElementById("infoLabel").innerHTML = str;
  }

  function resetDrawing() {
    dots = [];
  }

  function getDist(x1, y1, x2, y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
  }

  function drawRandomLine() {

    go = true;

    while(go) {
      const mx1 = Math.random()*sketch.width;
      const my1 = Math.random()*sketch.height;

      const mx2 = Math.random()*sketch.width;
      const my2 = Math.random()*sketch.height;

      var d = getDist(mx1,my1,mx2,my2); //distance
      var a = (my2-my1)/(mx2-mx1); //angle

      if(d > 200*200 && a < 2 && a > -2) { //if line doesn't match try again

        go = false;
        for(var i = 0; i < 10; i++) {
            var mx = mx1+(mx2-mx1)/10*i;
            var my = my1+(my2-my1)/10*i;

            dots.push({mx: mx, my: my});
        }
      }
    }



    //console.log(mx1 +" " + my1 + " <->" + mx2 + " " + my2);

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

    sketch.background(248*4);

    sketch.stroke(0,128);
    sketch.strokeWeight(3);
    sketch.ellipse(0,0,0,0);
    for(const dot of dots) {
      drawLine(2*dot.mx/sketch.width-1, 2*dot.my/sketch.height-1, mx, my);
    }

    if(inSketchA) {
      sketch.stroke(128,0,128);
      sketch.ellipse(0,0,0,0);
      drawLine(2*mx/sketch.width-1, 2*my/sketch.height-1, mx, my);
    }

    inSketchB = false;
    if(!mouseInSketch(sketch)) return;
    inSketchB = true;

    mxB = sketch.mouseX;
    myB = sketch.mouseY;
  }

  function drawLine(a ,b) {

    if(scale == 0) {
      var y1 = (a*-1+b +1)*sketch.height/2;
      var y2 = (a*1+b +1)*sketch.height/2;

      sketch.line(0,y1,sketch.width,y2);
    }
    else {
      var y1 = (a*-4+b +1)*sketch.height/2;
      var y2 = (a*4+b +1)*sketch.height/2;

      sketch.line(0,y1,sketch.width,y2);
    }
  }
};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}
