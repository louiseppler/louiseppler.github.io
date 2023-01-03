// var color1 = '#E55B13';
// var color2 = '#F6A21E';
// var color3 = '#104210';
// var color4 = '#7A871E';

var color1 = '#A06AB4';
var color2 = '#D773A2';
var color3 = '#07BB9C';
var color4 = '#FFD743';
var colorR = '#EB3D3D';



var dots = [];
var angles = [];

var showValue = 0.5;
var mouseInSketchB = false;

const s1 = ( sketch ) => {

  var dragging = false;

  sketch.setup = () => {

    sketch.createCanvas(700,500);

    dots = [
      {mx:100,my:200},
      {mx:550,my:300},
      {mx:0,my:0},
      {mx:0,my:0},
    ];

    angles = [-2.3,0.4];

    unpdateAngleMarkers();

    drawFunction2();

    //btn1 = document.getElementById("button1");
    //btn1.onclick = drawRandomLine;
  };

  sketch.draw = () => {

    // sketch.noStroke();
    //
    // sketch.fill(color1);
    // sketch.rect(175*0,0,175,500);
    // sketch.fill(color2);
    // sketch.rect(175*1,0,175,500);
    // sketch.fill(color3);
    // sketch.rect(175*2,0,175,500);
    // sketch.fill(color4);
    // sketch.rect(175*3,0,175,500);
    // sketch.fill(colorR)
    // sketch.rect(0,400,700,100);
    //
    // return;

    sketch.background(240)

    sketch.noStroke();
    sketch.fill(color3);
    sketch.ellipse(dots[2].mx, dots[2].my, 10, 10);
    sketch.fill(color4);
    sketch.ellipse(dots[3].mx, dots[3].my, 10, 10);

    sketch.stroke(color3);
    sketch.strokeWeight(3);
    drawTangent(sketch, dots[0],dots[2]);
    sketch.stroke(color4);
    drawTangent(sketch, dots[1],dots[3]);

    sketch.stroke(0);
    drawFunction2();
    sketch.stroke(204);

    if(mouseInSketchB) {
      drawShowValue(showValue);
    }


    sketch.noStroke();
    sketch.fill(color1);
    sketch.ellipse(dots[0].mx, dots[0].my, 10, 10);
    sketch.fill(color2);
    sketch.ellipse(dots[1].mx, dots[1].my, 10, 10);



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

  function drawShowValue(i) {
    var m0 = Math.tan(Math.PI*0.5-angles[0]);
    var m1 = Math.tan(Math.PI*0.5-angles[1]);

    const y0 = dots[0].my;
    const y1 = dots[1].my;
    const x0 = dots[0].mx;
    const x1 = dots[1].mx;

    const xdiff = (x1-x0);

    const val = directFunction(y0,y1,m0*xdiff,m1*xdiff,i);
    sketch.fill(colorR);
    sketch.noStroke();
    sketch.ellipse(x0+i*xdiff, val,11,11);

  }

  function drawFunction2() {
    var m0 = Math.tan(Math.PI*0.5-angles[0]);
    var m1 = Math.tan(Math.PI*0.5-angles[1]);

    const y0 = dots[0].my;
    const y1 = dots[1].my;
    const x0 = dots[0].mx;
    const x1 = dots[1].mx;

    const xdiff = (x1-x0);
    const dx = 100/(x1-x0);
    var prevVal = 0;

    for(var i = x0; i < x1+dx; i += dx) {
      var isq = i*i;
      var icb = i*i*i;


      const val = directFunction(y0,y1,m0*xdiff,m1*xdiff,(i-x0)/xdiff);

      //console.log(val);

      if(prevVal != 0) {
        sketch.line(i-dx, prevVal, i, val);
      }
      prevVal = val;

    }
  }

  function directFunction(p0, p1, m0, m1, t) {
    const tsq = t*t;
    const tcb = tsq*t;

    return (2*tcb-3*tsq+1)*p0 +
           (tcb-2*tsq+t)  *m0 +
           (-2*tcb+3*tsq) *p1 +
           (tcb-tsq)      *m1;

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


const s2 = ( sketch ) => {


  sketch.setup = () => {
    sketch.createCanvas(700,300);

    sketch.background(250);

  };

  sketch.draw = () => {
    mouseInSketchB = mouseInSketch(sketch);
    sketch.background(200);
    sketch.ellipse(0,0,0,0);
    drawBasis();
    if(!mouseInSketchB) return;



    showValue = sketch.mouseX/sketch.width;
    sketch.stroke(255,0,0);
    sketch.line(sketch.mouseX,0,sketch.mouseX,sketch.height);




  }

  function drawBasis() {
    // return (2*tcb-3*tsq+1)*p0 +
    //        (tcb-2*tsq+t)  *m0 +
    //        (-2*tcb+3*tsq) *p1 +
    //        (tcb-tsq)      *m1;
    //


    sketch.strokeWeight(2);
    sketch.stroke(color1);
    sketch.ellipse(0,0,0,0);
    drawFunction(x => (2*x*x*x-3*x*x+1) );
    sketch.stroke(color2);
    sketch.ellipse(0,0,0,0);
    drawFunction(x => (-2*x*x*x+3*x*x) );
    sketch.stroke(color3);
    sketch.ellipse(0,0,0,0);
    drawFunction(x => (x*x*x-2*x*x+x) );
    sketch.stroke(color4);
    sketch.ellipse(0,0,0,0);
    drawFunction(x => (x*x*x-x*x));
    sketch.stroke(0);
    sketch.ellipse(0,0,0,0);
    drawFunction(x => 0);

  }

  function drawFunction(func) {
    var res = 100;
    var step = (1)/res;

    var prevSol = 0;


    for(var i = 0; i < 1; i += step) {

      //const nextSol = basisFunction(N, i);

      const nextSol = func(i);
      //console.log(nextSol);


      if(i != 0) {
        sketch.line((i-step)*sketch.width, (1-prevSol)*sketch.height*0.8,
                    i*sketch.width,      (1-nextSol)*sketch.height*0.8);
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

function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}
