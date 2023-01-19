var dots = []

var iterations = 0;

var originalDots = [
  {x: 200, y:100},
  {x: 500, y:200},
  {x: 300, y:400},
];

const val1 = 0.25;
const val2 = 0.75;

const s1 = ( sketch ) => {

  var value = 0.0;

  var drawingShape = true;


  sketch.setup = () => {
    sketch.createCanvas(700,500);

    document.getElementById("button1").onclick = reset;
    document.getElementById("button2").onclick = nextIteration;

    let button3 = document.getElementById("button3");

    button3.onclick = toggleDrawDots;

    toggleDrawDots();

    dots = originalDots.slice();

  };

  function toggleDrawDots() {
    if(drawingShape) {
      drawingShape = false;
      iterations = 0;
      button3.value = "draw shape";
    }
    else {
      drawingShape = true;
      originalDots = [];
      dots = [];
      button3.value = "end shape";
    }
  }

  sketch.mousePressed = () => {
    if(drawingShape == true && mouseInSketch(sketch)) {
      if(originalDots.length > 0 && getDistFromMouse(originalDots[0]) < 2000) {
        toggleDrawDots();
        return;
      }
      if(originalDots.length >= 10) {
        toggleDrawDots();
        return;
      }

      originalDots.push({x: sketch.mouseX, y:sketch.mouseY});
      dots = originalDots;
    }
  }

  sketch.draw = () => {
    sketch.background(240);


    if(dots.length != originalDots.length && !drawingShape) {
      sketch.fill(160);
      sketch.stroke(160);
      for(var i = 0; i < originalDots.length; i++) {
        sketch.ellipse(originalDots[i].x, originalDots[i].y, 5, 5);
      }
      for(var i = 0; i < originalDots.length-1; i++) {
        sketch.line(originalDots[i].x, originalDots[i].y, originalDots[i+1].x, originalDots[i+1].y);
      }
      sketch.line(originalDots[originalDots.length-1].x,
                  originalDots[originalDots.length-1].y,
                  originalDots[0].x, originalDots[0].y);
    }

    sketch.fill(0);
    sketch.stroke(0);
    for(var i = 0; i < dots.length; i++) {
      sketch.ellipse(dots[i].x, dots[i].y, 5, 5);
    }
    for(var i = 0; i < dots.length-1; i++) {
      sketch.line(dots[i].x, dots[i].y, dots[i+1].x, dots[i+1].y);
    }
    if(!drawingShape) {
      sketch.line(dots[dots.length-1].x, dots[dots.length-1].y, dots[0].x, dots[0].y);
    }



  };

  function reset() {
    console.log("resetting");
    iterations = 0;
    dots = originalDots.slice();
  }

  function nextIteration() {
    if(drawingShape) {return;}

    if(iterations > 7) {
      return;
    }

    iterations += 1;
    console.log("next iteration " + iterations);
    performIterations(iterations);
  }

  function performIterations(repeats) {
    dots = originalDots.slice();
    for(var j = 0; j < repeats; j++) {
      const n = dots.length;
      var newDots = [];
      for(var i = 0; i < n; i++) {
        newDots.push(linearInterpolation(dots[i], dots[(i+1)%n], val2));
        newDots.push(linearInterpolation(dots[i], dots[(i+1)%n], val1));
      }

      dots = newDots;
    }
  }

  function linearInterpolation(dot1, dot2, value) {
    return {
      x: dot1.x*value + dot2.x*(1-value),
      y: dot1.y*value + dot2.y*(1-value),
    }
  }


  function mouseInSketch(sketch) {
    return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
            0 < sketch.mouseY && sketch.mouseY < sketch.height);
  }

  function getDistFromMouse(dot) {
    return (dot.x-sketch.mouseX)*(dot.x-sketch.mouseX) + (dot.y-sketch.mouseY)*(dot.y-sketch.mouseY);
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');
