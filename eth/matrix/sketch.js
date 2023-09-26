imageArray = null;
colorsArray = null; //the acutal colors

const colors = {
  a1: "#1a9e06", 
  a2: "#729e6b",
  b1: "#06939e",
  b2: "#6b9a9e",
  red: "#f95c74",
  black: '#000000',
  gray: '#808080',
  lightgray: '#c0c0c0',
};

points = [];

//button vals get flipped one at the start
var showEigen = !false;
var showArea = !true;
var showPreview = !true;

const s1 = ( sketch ) => {

  var a,b,c,d; //matrix values

  var selectedPoint = -1; //-1 if no point is slected

  sketch.setup = () => {
    sketch.createCanvas(500, 500);
    sketch.background(240);

    clearPoints();
    button1();
    button2();
    button3();

    sketch.fill(0);

    setupButtons();
  };

  function button1() {
    showEigen = !showEigen;
    if(showEigen) {
      document.getElementById("button1").innerHTML = "Hide Eigenvecotrs";
    }
    else {
      document.getElementById("button1").innerHTML = "Show Eigenvecotrs";
    }
  }

  function button2() {
    showArea = !showArea;
    if(showArea) {
      document.getElementById("button2").innerHTML = "Hide Unit-Square";
    }
    else {
      document.getElementById("button2").innerHTML = "Show Unit-Square";
    }
  }

  function button3() {
    showPreview = !showPreview;
    if(showPreview) {
      document.getElementById("button3").innerHTML = "Hide Preview";
    }
    else {
      document.getElementById("button3").innerHTML = "Show Preview";
    }
  }

  function clearPoints() {
    points = [{x:sx(0), y:sy(0)}];
  }



  function setupButtons() {
    document.getElementById("button1").onclick = button1;
    document.getElementById("button2").onclick = button2;
    document.getElementById("button3").onclick = button3;
    document.getElementById("button4").onclick = clearPoints;


  }

  sketch.draw = () => {
    if(selectedPoint == -1) {
      getMatrix();
      if(sketch.mouseIsPressed && mouseInSketch(sketch)) {
        getMousePoints();
      }
    }
    else {
      updateMatrix();
    }

    sketch.background(240);
    drawAxis();
    sketch.noFill();
    drawUnitSquare();

    if(showEigen) {
      displayEigenvalues();
    }

    drawPoints();
    drawTranslatedPoints();
    
    if(showPreview && sketch.mouseIsPressed == false && mouseInSketch(sketch)) {
      drawPrewview();
    }

  };

  sketch.mousePressed = () => {
    x1 = sx(a);
    y1 = sy(c);
    x2 = sx(b);
    y2 = sy(d);

    if(dist(sketch.mouseX,sketch.mouseY, x1, y1) < 200) {
      selectedPoint = 1;
    }
    else if(dist(sketch.mouseX,sketch.mouseY, x2, y2) < 200) {
      selectedPoint = 2;
    }
  }

  sketch.mouseReleased = () => {
    selectedPoint = -1;
  }

  function getMousePoints() {
    lastPoint = points[points.length-1];
    if(dist(sketch.mouseX, sketch.mouseY, lastPoint.x, lastPoint.y) > 25) {
      points.push({x:sketch.mouseX, y:sketch.mouseY});
    }
  }

  function drawPoints() {
    sketch.fill(colors.lightgray);
    sketch.noStroke();
    for(point of points) {
      sketch.ellipse(point.x, point.y, 5,5);
    }
  }

  function drawTranslatedPoints() {
    sketch.fill(colors.gray);
    sketch.noStroke();
    for(point of points) {
      var tempX = tx(point.x);
      var tempY = ty(point.y);

      var newX = a*tempX+b*tempY;
      var newY = c*tempX+d*tempY;
      sketch.ellipse(sx(newX), sy(newY), 5,5);
    }
  }

  function updateMatrix() {
    if(selectedPoint == 1) {
      a = tx(sketch.mouseX);
      c = ty(sketch.mouseY);
    }
    if(selectedPoint == 2) {
      b = tx(sketch.mouseX);
      d = ty(sketch.mouseY);
    }

    setMatrix();
  }

  function setMatrix() {
    document.getElementById("mat00").value = sketch.nf(a,1,2);
    document.getElementById("mat01").value = sketch.nf(b,1,2);;
    document.getElementById("mat10").value = sketch.nf(c,1,2);;
    document.getElementById("mat11").value = sketch.nf(d,1,2);;
  }

  function getMatrix() {
    a = +document.getElementById("mat00").value;
    b = +document.getElementById("mat01").value;
    c = +document.getElementById("mat10").value;
    d = +document.getElementById("mat11").value;
  }

  // Drawing ==================================================================================================================


  function drawAxis() {
    sketch.stroke(colors.gray);
    sketch.line(sketch.width/2, 0, sketch.width/2, sketch.height);
    sketch.line(0, sketch.height/2, sketch.width, sketch.height/2);
  }

  function drawUnitSquare() {

    if(showArea) {
      sketch.stroke(colors.gray);
      sketch.fill(colors.lightgray)

      sketch.rect(sx(0),sy(0),sx(1)-sx(0),sy(1)-sy(0));


      sketch.quad( sx(0), sy(0),
                  sx(a), sy(c),
                  sx(a+b), sy(c+d),
                  sx(b), sy(d));
    }
    

    sketch.strokeWeight(3);
    sketch.stroke(colors.a1); 
    sketch.rect(0,0,0,0);
    drawArrow(sx(0), sy(0), sx(a), sy(c));
    sketch.stroke(colors.b1);
    sketch.rect(0,0,0,0);
    drawArrow(sx(0), sy(0), sx(b), sy(d));
    sketch.strokeWeight(1);

    if(showArea) {
      sketch.strokeWeight(3);
      sketch.stroke(colors.a2);
      sketch.rect(0,0,0,0);
      drawArrow(sx(0),sy(0),sx(1),sy(0));
      sketch.stroke(colors.b2);
      sketch.rect(0,0,0,0);
      drawArrow(sx(0),sy(0),sx(0),sy(1));
      sketch.strokeWeight(1);
    }

  }


  function drawPrewview() {
    const x = tx(sketch.mouseX);
    const y = ty(sketch.mouseY);
    const newX = a*x+b*y;
    const newY = c*x+d*y;
    sketch.stroke(colors.gray);
    sketch.rect(0,0,0,0);
    drawArrow(sx(0),sy(0), sketch.mouseX, sketch.mouseY);
    sketch.stroke(colors.black);
    sketch.rect(0,0,0,0);
    drawArrow(sx(0),sy(0), sx(newX), sy(newY));
  }

  function drawArrow(x1, y1, x2, y2) {
    var angle = Math.atan2((x1-x2),(y1-y2));

    sketch.line(x1,y1,x2,y2);
    sketch.line(x2,y2,x2+Math.sin(angle+0.5)*10,y2+Math.cos(angle+0.5)*10)
    sketch.line(x2,y2,x2+Math.sin(angle-0.5)*10,y2+Math.cos(angle-0.5)*10)
  }

  // Eigenvetor Stuff =========================================================================================================


  function displayEigenvalues() {
    eigenvals = getEigenValues();

    if(!isNaN(eigenvals.l1)) {

      document.getElementById("eigenvalues").innerHTML = "Eigenvalues: " + sketch.nf(eigenvals.l1,1,2) + "&nbsp;&nbsp;&nbsp;" + sketch.nf(eigenvals.l2,1,2);

      vec1 = calculateEigenvecotor(eigenvals.l1);
      vec2 = calculateEigenvecotor(eigenvals.l2);

      drawEigenvector(vec1);
      drawEigenvector(vec2);

      document.getElementById("vectors").innerHTML = "Eigenvecors: (" + sketch.nf(vec1.x,1,2) + "," + sketch.nf(vec1.y,1,2)+ ") and (" + + sketch.nf(vec2.x,1,2) + "," + sketch.nf(vec2.y,1,2) +")";
    }
    else {
      document.getElementById("eigenvalues").innerHTML = "Eigenvalues are not in R."
      document.getElementById("vectors").innerHTML = ""
    }
  }

  function drawEigenvector(vec) {
    sketch.stroke(colors.red);
    sketch.rect(0,0,0,0);
    var angle = Math.atan2(vec.x, vec.y) + Math.PI;
    //angle = angle % Math.PI + Math.PI;

    drawArrow(sx(0),sy(0),sx(Math.cos(angle)*vec.val),sy(Math.sin(angle)*vec.val));
    //sketch.line();
    sketch.stroke(0);
    sketch.rect(0,0,0,0);
  }


  // Maths ====================================================================================================================

  function calculateEigenvecotor(lambda) {
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

  function dist(x1,y1,x2,y2) {
    return (x1-x2)*(x1-x2) + (y2-y1)*(y2-y1);
  }


};

function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

let p5_1 = new p5(s1, 'p5sketch1');
