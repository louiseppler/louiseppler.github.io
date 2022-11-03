
const s1 = ( sketch ) => {

  var cx = 250;
  var cy = 250;
  var dot1 = {x:20,y:20};
  var dot2 = {x:10,y:10};

  var selectedDot = 1;


  sketch.setup = () => {
    sketch.createCanvas(500,500);

    dot1.x = cx-50;
    dot1.y = cy-150;

    dot2.x = cx+150;
    dot2.y = cy-150;
  };

  sketch.draw = () => {


    sketch.background(224);
    sketch.fill(0)
    sketch.ellipse(cx,cy,10,10);
    sketch.stroke(0,128,0);
    sketch.fill(0,128,0);
    sketch.ellipse(dot1.x,dot1.y,5,5);
    sketch.ellipse(dot2.x,dot2.y,5,5);

    sketch.line(dot1.x,dot1.y, cx,cy);
    sketch.line(dot2.x,dot2.y, cx,cy);
    sketch.stroke(0);
    sketch.fill(0);

    drawEllipse();


    if(sketch.mouseIsPressed && mouseInSketch(sketch)) {
      if(selectedDot == 1) {
        dot1.x = sketch.mouseX;
        dot1.y = sketch.mouseY;
      }
      else {
        dot2.x = sketch.mouseX;
        dot2.y = sketch.mouseY;
      }
    }

  };

  function getDist(x1,y1, x2,y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
  }

  function drawEllipse() {
    var step = 0.01;
    var lastX = 0;
    var lastY = 0;
    for(var k = 0; k < 2*Math.PI+step; k+=step) {
      var x = Math.sin(k);
      var y = Math.cos(k); //get cords of the circle B(0,1)

      var dotX = (dot1.x-cx)*x+(dot2.x-cx)*y + cx;
      var dotY = (dot1.y-cy)*x+(dot2.y-cy)*y + cy;

      if(k != 0) {
        sketch.line(lastX,lastY,dotX,dotY);
      }
      lastX = dotX;
      lastY = dotY;

      //sketch.ellipse(dotX,dotY,2,2);


    }

  }

  sketch.mousePressed = () => {
    var dist1 = getDist(dot1.x, dot1.y, sketch.mouseX, sketch.mouseY);
    var dist2 = getDist(dot2.x, dot2.y, sketch.mouseX, sketch.mouseY);

    if(dist1 < dist2) {
      selectedDot = 1;
    }
    else {
      selectedDot = 2;
    }
  }

  function mouseInSketch(sketch) {
    return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
            0 < sketch.mouseY && sketch.mouseY < sketch.height);
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');
