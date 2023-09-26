var color1 = '#A06AB4';
var color2 = '#D773A2';
var color3 = '#07BB9C';
var color4 = '#FFD743';
var colorR = '#EB3D3D';


dots = [
  // {x: 100, y:400},
  // {x: 200, y:100},
  // {x: 400, y:80},
]

var mx;
var my;

//matrix values
var a;
var b;
var c;
var d;

vec1 = {x: 10, y:0};
vec2 = {x: 0, y:10};
elCenter = {x: 0, y:0}; //ellipse center

var selectedDot = -1;

var value = 0.0;

let slider;

animate = true;


const s1 = ( sketch ) => {



  sketch.setup = () => {
    sketch.createCanvas(700,500);

  };

  sketch.draw = () => {
    //sketch.background(value)
    sketch.background(240);


    document.getElementById("buttonR").onclick = () => {
      dots = [];
    }

    sketch.fill(0,128);
    sketch.stroke(96);
    for(var i = 0; i < dots.length; i++) {
      sketch.ellipse(dots[i].x,dots[i].y,10,10);
    }

    sketch.fill(0,0,255);
    sketch.ellipse(sketch.mouseX,sketch.mouseY,10,10);

    if(mouseInSketch(sketch) && sketch.mouseIsPressed) {
      if(selectedDot >= 0) {
        dots[selectedDot].x = sketch.mouseX;
        dots[selectedDot].y = sketch.mouseY;
      }
      else if(selectedDot == -2) {
        const i = dots.length-1;
        if(getDist(sketch.mouseX,sketch.mouseY,dots[i].x,dots[i].y) > 20*20) {
          dots.push({x: sketch.mouseX, y: sketch.mouseY});
        }
      }
    }

    mx = sketch.mouseX;
    my = sketch.mouseY;


    //drawUnitSquare();

    calculateEllipse();
    drawEllipse();

  };


  sketch.mouseReleased = () => {
    selectedDot = -1;
  }


  sketch.mousePressed = () => {
    if(!mouseInSketch(sketch)) return;

    var minDotIndex = 0;
    var minDist = 1000*1000; //+infinty

    // for(var i = 0; i < dots.length; i++) {
    //   const newDist = getDist(sketch.mouseX,sketch.mouseY,dots[i].x,dots[i].y);
    //   if(newDist < minDist) {
    //     minDist = newDist;
    //     minDotIndex = i;
    //   }
    // }

    // if(minDist < 50*50) {
    //   selectedDot = minDotIndex;
    // }
    if(false){}
    else {
      dots.push({x: sketch.mouseX, y: sketch.mouseY});
      selectedDot = -2;
      //selectedDot = dots.length-1;
    }

  };

  function calculateEllipse() {
    var avg1 = 0;
    var avg2 = 0;

    for(var dot of dots) {
      avg1 += dot.x;
      avg2 += dot.y;
    }


    avg1 = avg1/dots.length;
    avg2 = avg2/dots.length;

    elCenter.x = avg1;
    elCenter.y = avg2;


    a = covariance(dots.map(d => d.x), avg1, dots.map(d => d.x), avg1 );
    b = covariance(dots.map(d => d.x), avg1, dots.map(d => d.y), avg2 );
    c = covariance(dots.map(d => d.y), avg2, dots.map(d => d.x), avg1 );
    d = covariance(dots.map(d => d.y), avg2, dots.map(d => d.y), avg2 );

    eigenvals = getEigenValues();

    vec1 = calculateNormalizedEigenvector(eigenvals.l1);
    vec2 = calculateNormalizedEigenvector(eigenvals.l2);
  }

  function drawEllipse() {
    var step = 0.01;
    var lastX = 0;
    var lastY = 0;
    sketch.stroke(128);

    sketch.ellipse(elCenter.x,elCenter.y, 3,3);

    for(var k = 0; k < 2*Math.PI+step; k+=step) {
      var x = Math.sin(k);
      var y = Math.cos(k); //get cords of the circle B(0,1)

      var dotX = (vec1.x)*x*vec1.val + (vec2.x)*y*vec2.val + elCenter.x;
      var dotY = (vec1.y)*x*vec1.val + (vec2.y)*y*vec2.val + elCenter.y;

      if(k != 0) {
        sketch.line(lastX,lastY,dotX,dotY);
      }
      lastX = dotX;
      lastY = dotY;

      //sketch.ellipse(dotX,dotY,2,2);
    }

    sketch.stroke(255,0,0);
    sketch.strokeWeight(2);
    drawArrow(elCenter.x, elCenter.y, vec1.x*vec1.val + elCenter.x, vec1.y*vec1.val + elCenter.y);
    drawArrow(elCenter.x, elCenter.y, vec2.x*vec2.val + elCenter.x, vec2.y*vec2.val + elCenter.y);
    sketch.strokeWeight(1);

    sketch.stroke(255,0,0,64)
    drawLongLine(elCenter.x, elCenter.y, vec1.x*vec1.val + elCenter.x, vec1.y*vec1.val + elCenter.y);

    sketch.stroke(0);

  }

  function drawArrow(x1, y1, x2, y2) {
    var angle = Math.atan2((x1-x2),(y1-y2));

    if(Math.abs(x1-x2) < 1 || Math.abs(y1-y2) < 1) { return }

    sketch.line(x1,y1,x2,y2);
    sketch.line(x2,y2,x2+Math.sin(angle+0.5)*10,y2+Math.cos(angle+0.5)*10)
    sketch.line(x2,y2,x2+Math.sin(angle-0.5)*10,y2+Math.cos(angle-0.5)*10)
  }

  function drawLongLine(x1, y1, x2, y2) {
    var angle = Math.atan2((x1-x2),(y1-y2));

    sketch.line(x2+Math.sin(angle)*-700,y2+Math.cos(angle)*-700,x2+Math.sin(angle)*700,y2+Math.cos(angle)*700)

  }

  function drawUnitSquare() {

    if(true) {
    
      sketch.rect(sx(0),sy(0),sx(1)-sx(0),sy(1)-sy(0));


      sketch.quad( sx(0), sy(0),
                  sx(a), sy(c),
                  sx(a+b), sy(c+d),
                  sx(b), sy(d));
      }
    }
    

  // Maths ====================================================================================================================

  function covariance(arr1, avg1, arr2, avg2) {
    var sum = 0;
    for(var i = 0; i < arr1.length; i++) {
      sum += (arr1[i]-avg1)*(arr2[i]-avg2);
    }

    return 1/(arr1.length-1)*sum;
  }

  function calculateNormalizedEigenvector(lambda) {
    var x = a-lambda;
    var y = -b;

    var angle = Math.atan2(x,y);


    return {x: Math.cos(angle), y: Math.sin(angle), val: Math.sqrt(lambda)};
    return {x: x/(x+y), y: y/(x+y), val: Math.sqrt(lambda)};

  }

  function calculateEigenvector(lambda) {
    return {x: a-lambda, y:-b, val:lambda};
  }

  function getEigenValues() {
    const sol = solveQuadratic(1, (-a-d), a*d-c*b);
    return {l1: sol.x1, l2: sol.x2};
  }

  function solveQuadratic(a, b, c) {
    return {x1: (-b+Math.sqrt(b*b-4*a*c))/(2*a),
            x2: (-b-Math.sqrt(b*b-4*a*c))/(2*a)};
  }

    //Coordiante Translatsions ==================================================================================================

    const TF = 100.0; //Translation factor

    function sx(x) {
      return x*TF+sketch.width/2;
    }
  
    function sy(y) {
      return -y*TF+sketch.height/2;
    }
  
    function tx(x) { //inverse of sx
      return (x-sketch.width/2)/TF;
    }
  
    function ty(y) { //inverse of sy
      return -(y-sketch.height/2)/TF;
  
    }
  

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');

const s2 = ( sketch ) => {
  sketch.setup = () => {
    sketch.createCanvas(700,100);
  }

  sketch.draw = () => {
    sketch.background(240);

    sketch.stroke(0);
    sketch.rect(0,0,0,0);
    sketch.line(0,sketch.height/2, sketch.width, sketch.height/2);
    sketch.line(sketch.width/2,sketch.height/2-15,sketch.width/2,sketch.height/2+15);

    if(isNaN(vec1.val)) {return;}



    sketch.noStroke();
    sketch.rect(0,0,0,0);
    sketch.fill(0,128);

    for(var dot of dots) {
      var angle = Math.atan2(vec1.x, vec1.y) + Math.atan2(elCenter.x-dot.x, dot.y-elCenter.y);
      var dist = Math.cos(angle)*Math.sqrt(getDist(dot.x, dot.y, elCenter.x, elCenter.y))*0.5;


      sketch.ellipse(dist+sketch.width/2,sketch.height/2,10,10);

    }

    {
      sketch.fill(0,0,255);
      var angle = Math.atan2(vec1.x, vec1.y) + Math.atan2(elCenter.x-mx, my-elCenter.y);
      var dist = Math.cos(angle)*Math.sqrt(getDist(mx, my, elCenter.x, elCenter.y))*0.5;

      sketch.ellipse(dist+sketch.width/2,sketch.height/2,10,10);
    }

  }
}

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
