dotsA = [
  {x:360,y:62},
  {x:350,y:80},
  {x:449,y:143},
  {x:460,y:62},
  {x:259,y:149},
  {x:166,y:328},
  {x:108,y:136},
  {x:282,y:149},
];

dotsB = [
  {x:239,y:494},
  {x:80,y:321},
  {x:325,y:108},
  {x:454,y:286},
  {x:458,y:317},
  {x:139,y:244},
  {x:360,y:233},
  {x:229,y:309},
  {x:301,y:447},
]

//needed for adding new points
lastPointX = 0;
lastPointY = 0;


var editMode = 0;
//0: change slider
//1: add postives
//2: add negatives

function changeEditMode(mode) {
  editMode = mode;

  document.getElementById("button0").innerHTML = (mode == 0)? "**Change Threshold**" : "Change Threshold";
  document.getElementById("button1").innerHTML = (mode == 1)? "**Add Positives**" : "Add Positives";
  document.getElementById("button2").innerHTML = (mode == 2)? "**Add Negatives**" : "Add Negatives";

}

var lineHeight = 200;

const s1 = ( sketch ) => {

  var dragging = false;

  sketch.setup = () => {
    sketch.createCanvas(500,500);

    changeEditMode(0);

    document.getElementById("button0").onclick = () => {changeEditMode(0);};
    document.getElementById("button1").onclick = () => {changeEditMode(1);};
    document.getElementById("button2").onclick = () => {changeEditMode(2);};
    document.getElementById("button3").onclick = () => {clearPoints();};

  };

  sketch.draw = () => {
    sketch.background(224);

    sketch.noStroke();
    sketch.fill(255,204,204);
    sketch.rect(0,0,sketch.width,lineHeight);
    sketch.fill(204,204,255);
    sketch.rect(0,lineHeight,sketch.width,sketch.height-lineHeight);


    sketch.fill(255,0,0);
    for(var i = 0; i < dotsA.length; i++) {
      sketch.ellipse(dotsA[i].x, dotsA[i].y, 10, 10);
    }

    sketch.fill(0,0,255);
    for(var i = 0; i < dotsB.length; i++) {
      sketch.ellipse(dotsB[i].x, dotsB[i].y, 10, 10);
    }

    sketch.strokeWeight(3);
    sketch.stroke(0);
    sketch.line(0,lineHeight,sketch.width,lineHeight);


    if(editMode == 0 && sketch.mouseIsPressed && mouseInSketch(sketch)) {
      lineHeight = sketch.mouseY;
    }
    if((editMode == 1 || editMode == 2 ) & sketch.mouseIsPressed  && mouseInSketch(sketch)) {
      addPoints();
    }

    displayOutputValues();

    // const vals = getValues(lineHeight);
    // const out = "TP: " + vals.TP + " FP: " + vals.FP + "  |  TN: " + vals.TN + " FN: " + vals.FN

    // document.getElementById("outputText").innerHTML = out;

  };

  function clearPoints() {
    dotsA = [];
    dotsB = [];
  }

  function displayOutputValues() {
    const vals = getValues(lineHeight);

    var out = ""
    out += "<table class=\"info\"><tr>"
      out += "<td></td>"
      out += "<td>predict P</td>"
      out += "<td>predict N</td>"
    out += "</tr><tr>"
      out += "<td>is P</td>"
      out += "<td>TP: " + vals.TP + "</strong></td>";
      out += "<td>FN: " + vals.FN + "</td>";
    out += "</tr><tr>"
      out += "<td>is N</td>"
      out += "<td>FP: " + vals.FP + "</td>";
      out += "<td>TN: " + vals.TN + "</td>";
    out += "</tr></table>"

    out += "<br>"

    out += "<table class=\"info\"><tr>"
      out += "<td> FPR: </td><td> <strong>" + fn(vals.FP/vals.N) + "</strong></td> <td>= FP/N</td> <td></td>"
      out += "<td> TNR: </td><td> <strong>" + fn(vals.TN/vals.N) + "</strong></td> <td>= TN/N </td>"
    out += "</tr><tr>"
      out += "<td> FNR: </td><td> <strong>" + fn(vals.FN/vals.P) + "</strong></td> <td>= FN/P</td> <td></td>"
      out += "<td> TPR (Recall): </td><td> <strong>" + fn(vals.TP/vals.P) + "</strong></td><td>= TP/P </td>"
    out += "</tr><tr>"
      out += "<td> FDR: </td><td> <strong>" + fn(vals.FP/(vals.FP+vals.TP)) + "</strong></td> <td>= FP/(TP+FP)</td> <td></td>" 
      out += "<td> PPV (Precision): </td><td> <strong>" + fn(vals.TP/(vals.TP+vals.FP)) + "</strong></td> <td>= TP/(TP+FP)</td>"
    out += "</tr><tr>"
      out += "<td> NPV: </td><td> <strong>" + fn(vals.TN/(vals.TN+vals.FN)) + "</strong></td> <td>= TN/(TN+FN)</td> <td></td>"
      out += "<td> FOR: </td><td> <strong>" + fn(vals.FN/(vals.TN+vals.FN)) + "</strong></td> <td>= FN/(TN+FN)</td>"
    out += "</tr></table>"


    /*
    FPR - TNR
    FNR - TPR (Recall, Sensitivity)
    FDR - PPV (precision)
    NPV - FOR
    */


    document.getElementById("outputVals").innerHTML = out;
  }

  //format number
  function fn(x) {
    if(isNaN(x)) {
      return "-"
    }
    return Math.round(x*100)/100
  }

  function addPoints() {
    if(getDist(sketch.mouseX, sketch.mouseY, lastPointX, lastPointY) > 100) {
      if(editMode == 1) {
        dotsA.push({x: sketch.mouseX, y: sketch.mouseY});
      }
      else {
        dotsB.push({x: sketch.mouseX, y: sketch.mouseY});
      }
      lastPointX = sketch.mouseX;
      lastPointY = sketch.mouseY;
    }
  }

  sketch.mousePressed = () => {


    if(mouseInSketch(sketch)) {
      sketch.fill(0);
    }
  }
}

function getValues(h) {
  var P = 0;
  var N = 0;
  var FN = 0;
  var FP = 0;
  var TP = 0;
  var TN = 0;

  for(var i = 0; i < dotsA.length; i++) {
    P++;
    if(dotsA[i].y < h) {
      TP ++;
    }
    else {
      FN ++;
    }
  }

  for(var i = 0; i < dotsB.length; i++) {
    N++;
    if(dotsB[i].y > h) {
      TN ++;
    }
    else {
      FP ++;
    }
  }

  return {P:P, N:N, FN:FN, FP:FP, TP:TP, TN:TN, TP:TP};
}



//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');


const s2 = ( sketch ) => {


  sketch.setup = () => {
    sketch.createCanvas(500,500);

  };

  sketch.draw = () => {
    sketch.background(224)
    
    var mode = document.getElementById("display-mode").value;

    //rocMode();

    if(mode == "modeROC") {
      rocMode();
    }
    else if(mode == "mode01") {
      drawLoss(get01Loss);
    }
    else {
      drawLoss(getLogLoss);
    }
   
  }

  function drawLoss(lossFunction) {

    var prevX = -1;
    var prevY = -1;

    K = 1000.0;
    sketch.fill(0);
    sketch.stroke(0);
    sketch.strokeWeight(3);
    for(var i = 0; i <= K; i ++) {
   
      const dispX = (1-i/K)*sketch.width;
      const dispY = sketch.height-(lossFunction(i/K*sketch.height));


      // logLive(sketch, dispY)

      if(dispY < sketch.height*10) {

        if(prevX != -1) {
          sketch.line(prevX, prevY, dispX, dispY);
        }

        
        sketch.ellipse(dispX, dispY, 1,1);
      }

      prevX = dispX;
      prevY = dispY;
    }


    { //draws preview dot (where threshold currently is)
      sketch.fill(0,200,0);
      sketch.noStroke();

      const dispX = sketch.width-lineHeight;
      const dispY = sketch.height-(lossFunction(lineHeight));

      //logLive(sketch, lineHeight + " :: "+ dispX + " " + dispY);

      sketch.ellipse(dispX, dispY, 9,9);
    }


  }


  function get01Loss(lineHeight) {
    const vals = getValues(lineHeight);

    return (vals.FN + vals.FP)/(vals.N+vals.P)*sketch.height;
  }

  //f^ is just a linear function

  function getLinearLoss(lineHeight) {
    var sum = 0;
    var cnt = 0;
    for(var i = 0; i < dotsA.length; i++) {
      sum += lineHeight-dotsA[i].y;
      cnt += 1;
    }
  
    for(var j = 0; j < dotsB.length; j++) {
      sum += -(lineHeight-dotsB[j].y);
      cnt += 1;
    }

    //return lineHeight

    return sum/cnt;
  }

  function getLogLoss(lineHeight) {
    var sum = 0;
    var cnt = 0;
    for(var i = 0; i < dotsA.length; i++) {
      sum += Math.log(1+ Math.exp(lineHeight-dotsA[i].y));
      cnt += 1;
    }
  
    for(var i = 0; i < dotsB.length; i++) {
      sum += Math.log(1+ Math.exp(-lineHeight+dotsB[i].y));
      cnt += 1;
    }

    return sum/cnt;
  }

  function getExpLoss(lineHeight) {
    var sum = 0;
    var cnt = 0;
    for(var i = 0; i < dotsA.length; i++) {
      sum += Math.exp(lineHeight-dotsA[i].y);
      cnt += 1;
    }
  
    for(var i = 0; i < dotsB.length; i++) {
      sum += Math.exp(-lineHeight+dotsB[i].y);
      cnt += 1;
    }

    return sum/cnt/Math.exp(sketch.height/2);
  }

  function rocMode() {
    sketch.ellipse()
    const vals = getValues(lineHeight);

    const valX = vals.FP/vals.N;
    const valY = vals.TP/vals.P;

    const dispX = valX*sketch.width;
    const dispY = (1-valY)*sketch.height;


    sketch.textAlign(sketch.CENTER);
    sketch.noFill();
    sketch.fill(0);
    sketch.text("FPR",dispX/2,dispY-2);
    sketch.text("TNR",dispX+(sketch.width-dispX)/2, dispY-2);
    sketch.textAlign(sketch.LEFT);
    sketch.text("Miss Rate - FNR",dispX+4,dispY/2);
    sketch.text("Sensitivity - TPR",dispX+4,dispY+(sketch.height-dispY)/2);


    sketch.stroke(0,0,0);
    sketch.strokeWeight(1);
    sketch.rect(0,0,0,0);

    sketch.line(0,dispY,dispX,dispY);
    sketch.line(dispX,dispY,sketch.width,dispY);
    sketch.line(dispX,0,dispX,dispY);
    sketch.line(dispX,dispY,dispX,sketch.height);


    drawROC();

    sketch.fill(0,200,0);
    sketch.noStroke();
    sketch.ellipse(dispX, dispY, 9,9);

  }

  function drawROC() {
    var prevX = -1;
    var prevY = -1;

    K = 100.0;
    sketch.fill(0);
    sketch.stroke(0);
    sketch.strokeWeight(3);
    for(var i = 0; i <= K; i ++) {
      const vals = getValues(i/K*sketch.height);

      //values from 0-1
      const valX = vals.FP/vals.N;
      const valY = vals.TP/vals.P;

      const dispX = valX*sketch.width;
      const dispY = (1-valY)*sketch.height;

      if(prevX != -1) {
        sketch.line(prevX, prevY, dispX, dispY);
      }

      sketch.ellipse(dispX, dispY, 5,5);

      prevX = dispX;
      prevY = dispY;
    }

  }

};


//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s2 = new p5(s2, 'p5sketch2');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

function getDist(x1,y1,x2,y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}