var dots = [];
var angles = [];


const s1 = ( sketch ) => {

  var dragging = false;

  sketch.setup = () => {

    sketch.createCanvas(700,500);

    dots = [
      {mx:100,my:200},
      {mx:400,my:200},
      {mx:0,my:0},
      {mx:0,my:0},
    ];

    angles = [-2.3,0.4];

    unpdateAngleMarkers();

    //btn1 = document.getElementById("button1");
    //btn1.onclick = drawRandomLine;
  };

  sketch.draw = () => {
    sketch.background(240)

    sketch.noStroke();
    sketch.fill(128,128,255);
    sketch.ellipse(dots[2].mx, dots[2].my, 10, 10);
    sketch.ellipse(dots[3].mx, dots[3].my, 10, 10);

    sketch.stroke(128,128,255);
    sketch.strokeWeight(3);
    drawTangent(sketch, dots[0],dots[2]);
    drawTangent(sketch, dots[1],dots[3]);

    sketch.noStroke();
    sketch.fill(0);
    sketch.ellipse(dots[0].mx, dots[0].my, 10, 10);
    sketch.ellipse(dots[1].mx, dots[1].my, 10, 10);


    drawFunction();

    if(!mouseInSketch(sketch)) {return;}



    //mx = sketch.mouseX;
    //my = sketch.mouseY;

    /*
    if(sketch.mouseIsPressed && dragging) {
      if(Math.abs(dots[dots.length-1].mx-sketch.mouseX)+Math.abs(dots[dots.length-1].my-sketch.mouseY) > 25) {
        dots.push({mx: sketch.mouseX, my:sketch.mouseY});
      }
    }
    else {
      dragging = false;
    }
    */

    if(sketch.mouseIsPressed) {
      const i = getDotIndex();

      if(i < 2) { //update the dots
        dots[i].mx = sketch.mouseX;
        dots[i].my = sketch.mouseY;
      }
      else {
        var j = i-2;

        angles[j] = Math.atan2(sketch.mouseX-dots[j].mx,sketch.mouseY- dots[j].my);
      }
      unpdateAngleMarkers();
    }
  };

  sketch.mousePressed = () => {

    if(mouseInSketch(sketch)) {
      sketch.fill(0);
      //sketch.ellipse(sketch.mouseX, sketch.mouseY, 10, 10);
      //dots.push({mx: sketch.mouseX, my:sketch.mouseY});
      dragging = true;
    }
  }

  function unpdateAngleMarkers() {
    for(var j = 0; j < 2; j++) {
      dots[j+2].mx = dots[j].mx+Math.sin(angles[j])*50;
      dots[j+2].my = dots[j].my+Math.cos(angles[j])*50;
    }
  }

  function drawFunction() {




    const x0 = dots[0].mx;
    const x0sq = x0*x0;
    const x0cb = x0sq*x0;
    const x1 = dots[1].mx;
    const x1sq = x1*x1;
    const x1cb = x1sq*x1;
    const y0 = dots[0].my;
    const y1 = dots[1].my;



    const matrix = [
      [x0cb,x0sq,x0,1],
      [x1cb,x1sq,x1,1],
      [3*x0sq,2*x0,1,0],
      [3*x1sq,2*x1,1,0],
    ]



    const b = [y0,y1,Math.tan(Math.PI*0.5-angles[0]),Math.tan(Math.PI*0.5-angles[1])];

    const sol = matrixSolve(matrix, b);



    sketch.stroke(0);

    const dx = 100/(x1-x0);
    var prevVal = 0;

    //if dots are almot over eachother, rounding mistakes makes sketch ugly
    if(Math.abs(x1-x0) < 20) {return;}


    if(dx > 0) {
      for(var i = x0; i < x1+dx; i += dx) {
        var isq = i*i;
        var icb = i*i*i;

        const val = icb*sol[0]+isq*sol[1]+i*sol[2]+sol[3];

        if(prevVal != 0) {
          sketch.line(i-dx, prevVal, i, val);
        }
        prevVal = val;

      }
    }
    else if(dx < 0) { //kinda ugly because duplicated code...
      for(var i = x0; i > x1+dx; i += dx) {
        var isq = i*i;
        var icb = i*i*i;

        const val = icb*sol[0]+isq*sol[1]+i*sol[2]+sol[3];

        if(prevVal != 0) {
          sketch.line(i-dx, prevVal, i, val);
        }
        prevVal = val;

      }
    }

  }

  function getDotIndex() {
    var smallestDist = 100000; // a big number
    var index = 0;
    for(var i = 0; i < dots.length; i++) {
      var dist = getDist(sketch.mouseX,sketch.mouseY, dots[i].mx, dots[i].my);
      if(dist < smallestDist) {
        index = i;
        smallestDist = dist;
      }
    }
    return index;
  }

  function getDist(x1, y1, x2, y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
  }



};

//tangent defined by a dot (where the tangent hits) and second dot: the angle
function drawTangent(sketch, dot1, dot2) {
  var diffX = dot1.mx-dot2.mx;
  var diffY = dot1.my-dot2.my;

  sketch.line(dot1.mx-diffX,dot1.my-diffY, dot1.mx+diffX, dot1.my+diffY);
}



//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');

function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}
