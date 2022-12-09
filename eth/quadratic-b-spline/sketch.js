
dot0 = {x: 100, y:400}
dot1 = {x: 400, y:100}
dot2 = {x: 600, y:400}

dots = [dot0,dot1,dot2]

animate = true;

const s1 = ( sketch ) => {
  let slider;

  var value = 0.0;


  sketch.setup = () => {
    sketch.createCanvas(700,500);

    button1();

    //button
    let button = document.getElementById("button1");
    button.onclick = button1;

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
    sketch.line(dot0.x,dot0.y,dot1.x,dot1.y);
    sketch.line(dot1.x,dot1.y,dot2.x,dot2.y);
    sketch.stroke(0);

    sketch.fill(0);
    sketch.ellipse(dot0.x,dot0.y,10,10);
    sketch.ellipse(dot1.x,dot1.y,10,10);
    sketch.ellipse(dot2.x,dot2.y,10,10);

    sketch.strokeWeight(3);
    drawInterpolant();
    sketch.strokeWeight(1);
    drawInterpolantUI(value/100);


    if(mouseInSketch(sketch) && sketch.mouseIsPressed) {
      var minDotIndex = 0;
      var minDist = 1000*1000; //+infinty

      for(var i = 0; i < dots.length; i++) {
        const newDist = getDist(sketch.mouseX,sketch.mouseY,dots[i].x,dots[i].y);
        if(newDist < minDist) {
          minDist = newDist;
          minDotIndex = i;
        }
      }

      dots[minDotIndex].x = sketch.mouseX;
      dots[minDotIndex].y = sketch.mouseY;

    }


  };

  function drawInterpolant() {
    sketch.beginShape();
    sketch.noFill();

    const step = 20;
    for(var i = 0; i <= step; i++) {
      const t = i/step;
      const dot01 = linearInterpolant(dot0,dot1,t);
      const dot12 = linearInterpolant(dot1,dot2,t);
      const dotFinal = linearInterpolant(dot01,dot12,t);
      sketch.vertex(dotFinal.x, dotFinal.y);
    }

    sketch.endShape();

  }

  function drawInterpolantUI(t) {
    const dot01 = linearInterpolant(dot0,dot1,t);
    const dot12 = linearInterpolant(dot1,dot2,t);
    const dotFinal = linearInterpolant(dot01,dot12,t);

    if(true) { //shows ui
      sketch.fill(96);
      sketch.stroke(96);
      sketch.ellipse(dot01.x,dot01.y,5,5);
      sketch.ellipse(dot12.x,dot12.y,5,5);
      sketch.line(dot01.x,dot01.y,dot12.x,dot12.y);
      sketch.stroke(0);
    }
    sketch.fill(128,0,255);
    sketch.ellipse(dotFinal.x,dotFinal.y,7,7);

  }

  function linearInterpolant(dotA, dotB, t) {
    const newX = dotA.x*(1-t) + dotB.x*t;
    const newY = dotA.y*(1-t) + dotB.y*t;

    return {x:newX,y:newY};

  }

  function button1() {
    animate = !animate;

    if(animate) {
      document.getElementById("button1").value = "stop";
    }
    else {
      document.getElementById("button1").value = "start animation";

    }
  }

  function valueUpdated() {
    slider.value = value;
  }

  function sliderChanged() {
    var oldValue = value;
    sliderVal = +(slider.value)
    value = sliderVal;

    if(oldValue != value) {
      valueUpdated();
    }
  }

  function getDist(x1, y1, x2, y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
  }


  function mouseInSketch(sketch) {
    return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
            0 < sketch.mouseY && sketch.mouseY < sketch.height);
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');
