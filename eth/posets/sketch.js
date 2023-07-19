const backgroundColor = "#f0f0f0"
const funcColor = "#0fdd04"
const nodeColor = "#8e8e8e"
const fixColor = "#0b8e04"
const redColor = "#04508e" //not the color red, but color for Red(f)

var nodeCoords = []
var nodeFunc = [];
var edges = [];

var editMode = 2; //0 - move nodes, 1- delete nodes?, 2 - make connections/add nodses, 3 - set function
var moveingNode = false;
var moveingLine = false;
var moveingFunc = false;

var gridSize = 50;

var currLineEndIndex = -1; //where the edge is pointing towards
var currFuncEndIndex = -1;

var btn1;
var btn2;
var btn3;

var nodeDeleteIndex = -1;
var edgeDeleteIndex = -1;

function changeEditMode(mode) {
  editMode = mode;

  btn0.innerHTML = (mode == 0)? "**Move Nodes**" : "Move Nodes";
  btn1.innerHTML = (mode == 1)? "**Delete Edge**" : "Delete Edge";
  btn2.innerHTML = (mode == 2)? "**Add Edges/Nodes**" : "Add Edges/Nodes";
  btn3.innerHTML = (mode == 3)? "**Edit Function**" : "Edit Function";

}

const s1 = ( sketch ) => {

  function setupButtons() {
    btn0 = document.getElementById("button0");
    btn1 = document.getElementById("button1");
    btn2 = document.getElementById("button2");
    btn3 = document.getElementById("button3");

    btn0.onclick = () => {changeEditMode(0);};
    btn1.onclick = () => {changeEditMode(1);};
    btn2.onclick = () => {changeEditMode(2);};
    btn3.onclick = () => {changeEditMode(3);};

    changeEditMode(2);
  }

  sketch.setup = () => {
    sketch.createCanvas(700,500);

    setupButtons();
    prepareMaths();

  };

  sketch.draw = () => {
    sketch.background(backgroundColor);

    if(moveingNode && sketch.mouseIsPressed && mouseInSketch(sketch)) {
      if(selectedNode >= 0 && selectedNode < nodeCoords.length) {
        updateMovedNode();
      }
    }
    if(moveingLine) {
      updateLine();
    }
    if(moveingFunc) {
      updateFunc();
    }
    if(editMode == 1) {
      prepareDelete();
    }
    else {
      edgeDeleteIndex = -1;
      nodeDeleteIndex = -1;
    }

    //logLive(sketch, data.isMonotone? "Montone Function: yes" : "Montone Function: no")

    drawGrid();
    drawLines();
    drawNodes();
    drawInfo();
  };

  function prepareDelete() {
    var minDist = 1000*1000;
    var nodeIndex = -1;
    var edgeIndex = -1;

    for(var i = 0; i < edges.length; i++) {
      var tempX = (nodeCoords[edges[i].a].x + nodeCoords[edges[i].b].x)/2;
      var tempY = (nodeCoords[edges[i].a].y + nodeCoords[edges[i].b].y)/2;
      
      var dist = getDist(tempX, tempY, sketch.mouseX, sketch.mouseY);

      if(dist < minDist) {
        minDist = dist;
        nodeIndex = -1;
        edgeIndex = i;
      }
    }

    for(var i = 0; i < nodeCoords.length; i++) {
      var dist = getDist(nodeCoords[i].x, nodeCoords[i].y, sketch.mouseX, sketch.mouseY);

      if(dist < minDist) {
        minDist = dist;
        nodeIndex = i;
        edgeIndex = -1;
      }
    }

    if(minDist > gridSize*gridSize) {
      edgeDeleteIndex = -1;
      nodeDeleteIndex = -1;
    }
    else {
      edgeDeleteIndex = edgeIndex;
      nodeDeleteIndex = -1;
    }

  }

  function updateMovedNode() {
    var i = selectedNode;
    var s = gridSize;
    nodeCoords[i].x = Math.round(sketch.mouseX/s)*s;
    nodeCoords[i].y = Math.round(sketch.mouseY/s)*s;
  }

  function updateLine() {
    currLineEndIndex = getClosestNode();
  }

  function checkAddLine() {
    if(currLineEndIndex != -1) {
      edges.push({a: selectedNode, b:currLineEndIndex});
      currLineEndIndex = -1;
    }
  }

  function updateFunc() {
    currFuncEndIndex = getClosestNode();
  }

  function checkChangeFunc() {
    if(currFuncEndIndex != -1) {
      nodeFunc[selectedNode] = currFuncEndIndex;
      currFuncEndIndex = -1;
    }
  }

  sketch.mousePressed = () => {
    if(!mouseInSketch(sketch)) return;

    if(editMode == 1) {
      deleteStuff();
      return;
    }

    selectedNode = getClosestNode();
    console.log("selected node = " + selectedNode);

    if(editMode == 0) {
      moveingNode = true;
    }
    if(editMode == 2 && selectedNode != -1) {
      moveingLine = true;
    }
    if(editMode == 3 && selectedNode != -1) {
      moveingFunc = true;
    }

    if(selectedNode == -1 && (editMode == 0 || editMode == 2)) {
      selectedNode = nodeCoords.length;
      moveingNode = true;
      //addnewnode
      nodeCoords.push({x:0,y:0});
      nodeFunc.push(nodeFunc.length);
    }

  };

  sketch.mouseReleased = () => {
    moveingNode = false;
    if(moveingLine) {
      moveingLine = false;
      checkAddLine();
    }
    if(moveingFunc) {
      moveingFunc = false;
      checkChangeFunc();
    }
    selectedNode = -1;

    prepareMaths();
  }

  function clearSelection() {
    // moveingFunc = -1;
    // currFuncEndIndex = -1;
    // moveingLine = false;
    // currLineEndIndex = -1;
  }

  sketch.keyPressed = () => {

    if(moveingLine || moveingFunc) return;

    if(sketch.keyCode == sketch.SHIFT) {
      clearSelection();
      changeEditMode(3);
    }
    if(sketch.keyCode == "m") {
      clearSelection();
      changeEditMode(0);
    }
  }

  sketch.keyReleased = () => {
    if(moveingLine || moveingFunc) return;

    if(sketch.keyCode == sketch.SHIFT) {
      clearSelection();
      changeEditMode(2);
    }
  }

  function deleteStuff() {
    if(edgeDeleteIndex != -1) {
      edges.splice(edgeDeleteIndex, 1);
    }
  }

  function getClosestNode() {
    var minDist = 1000*1000;
    var nodeIndex = 0;

    for(var i = 0; i < nodeCoords.length; i++) {
      var dist = getDist(nodeCoords[i].x, nodeCoords[i].y, sketch.mouseX, sketch.mouseY);

      if(dist < minDist) {
        minDist = dist;
        nodeIndex = i;
      }
    }

    if(minDist < gridSize*gridSize/4) {
      return nodeIndex;
    }

    return -1; //new node?
  }

  // DRAWING ======================================================================================


  function drawGrid() {
    sketch.stroke(220);
    var s = gridSize;
    for(var i = 1; i < sketch.width/s; i++) {
      sketch.line(i*s,10,i*s,sketch.height-10);
    }
    for(var i = 1; i < sketch.height/s; i++) {
      sketch.line(10,i*s,sketch.width-10,i*s);
    }
  }

  function drawInfo() {
    const h = sketch.height;
    sketch.fill(backgroundColor)
    sketch.noStroke();
    sketch.rect(0,h-70, 130, 70);

    sketch.noFill();
    sketch.stroke(0);
    sketch.ellipse(15,h-35,12,12);

    sketch.noStroke();
    sketch.fill(fixColor);
    sketch.ellipse(15,h-15,12,12);
    sketch.ellipse(70,h-15,12,12);

    sketch.noStroke();
    sketch.fill(redColor);
    sketch.ellipse(65,h-15,12,12);

    

    sketch.textAlign(sketch.LEFT);
    sketch.textSize(12);
    sketch.noStroke();
    sketch.fill(0);
    sketch.text((data.isMonotone? "function is monotone" : "not monotone"), 10, h-55+4);
    sketch.text("Least / Greatest", 25, h-35+4)
    sketch.text("Fix(f)", 25, h-15+4)
    sketch.text("Red(f)", 80, h-15+4)

  }


  function drawNodes() {

    sketch.stroke(0);
    sketch.fill(0);
    sketch.textAlign(sketch.CENTER);
    for(var i = 0; i < nodeCoords.length; i++) {
      
      // sketch.fill(0);
      // sketch.noStroke();
      // sketch.text(i, nodeCoords[i].x, nodeCoords[i].y-10);

      sketch.noStroke();
      sketch.fill(nodeColor);
      
      if(data.least == i) {sketch.stroke(0); sketch.strokeWeight(1);}
      if(data.greatest == i) {sketch.stroke(0); sketch.strokeWeight(1);}

      if(data.postFixedPoints.includes(i)) sketch.fill(redColor);
      if(data.fixedPoints.includes(i)) sketch.fill(fixColor);

      if(nodeDeleteIndex == i) sketch.fill(200,0,0);

      sketch.ellipse(nodeCoords[i].x, nodeCoords[i].y, 12, 12);
    }

    sketch.strokeWeight(1);

    if(moveingFunc) {
      var i = selectedNode;
      drawFancyArrow(nodeCoords[i].x, nodeCoords[i].y, sketch.mouseX, sketch.mouseY);
    }

    for(var i = 0; i < nodeCoords.length; i++) {
      if(nodeFunc[i] != null) {
        if(!(editMode == 3 && selectedNode == i)) {
          if(nodeFunc[i] != i) {
            drawFancyArrow(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[nodeFunc[i]].x, nodeCoords[nodeFunc[i]].y);
          }
        }
      }
    }



  }


  function drawFancyArrow(x1, y1, x2, y2) {
    const a = Math.atan2(x1-x2, y2-y1)-0.2;
    const l = 50;
    sketch.stroke(0,200,0);
    sketch.noFill();
    sketch.rect(0,0,0,0);


    //sketch.ellipse(x2+Math.cos(a)*l, y2+Math.sin(a)*l, 10, 10); //debugg point
    
    drawBeizer(sketch, {x: x1, y: y1}, {x: x2+Math.cos(a)*l, y: y2+Math.sin(a)*l}, {x: x2, y: y2}, );
    sketch.fill(0,200,0);
    sketch.triangle(
      x2, y2, 
      x2+Math.cos(a-0.45)*10, y2+Math.sin(a-0.45)*10,
      x2+Math.cos(a+0.1)*10, y2+Math.sin(a+0.1)*10);

  }

  function drawLines() {
    
    for(var k = 0; k < edges.length; k++) {
      (edgeDeleteIndex == k)? sketch.stroke(200,0,0) : sketch.stroke(0);

      var i = edges[k].a;
      var j = edges[k].b;
      sketch.line(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[j].x, nodeCoords[j].y)
    }


    if(moveingLine) {
      sketch.stroke(0);
      var i = selectedNode;
      var j = currLineEndIndex;
      if(j == -1) {
        sketch.line(nodeCoords[i].x, nodeCoords[i].y, sketch.mouseX, sketch.mouseY);
      }
      else {
        sketch.line(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[j].x, nodeCoords[j].y)
      }
    }
  }
 
};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');


function mouseInSketch(sketch) {
  return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
          0 < sketch.mouseY && sketch.mouseY < sketch.height);
}

function getDist(x1, y1, x2, y2) {
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function getDist2(x1, y1, x2, y2) {
  return Math.abs(x1-x2)+Math.abs(y2-y1);
}



function logLive(sketch, text) {
  sketch.fill(255);
  sketch.noStroke(0);
  sketch.rect(0,0,250,25);
  sketch.fill(0);
  sketch.text(text, 10, 20);
}



//// draw Beizer (because p5js' is borken)

function drawBeizer(sketch, dot1 , dotM, dot2) {
  var prevDot = null;

  for(var i = 0; i <= 100; i++) {
    var t = i/100.0;
    var currDot = getBezierInterpolant(t, dot1, dotM, dot2);

    if(prevDot != null) {
      sketch.line(prevDot.x,prevDot.y, currDot.x, currDot.y);
    }

    prevDot = currDot;
  }

}

function getBezierInterpolant(t, dot0 , dot1, dot2) {
  const dot01 = linearInterpolant(dot0,dot1,t);
  const dot12 = linearInterpolant(dot1,dot2,t);
  const dotFinal = linearInterpolant(dot01,dot12,t);

  return dotFinal;
}

function linearInterpolant(dotA, dotB, t) {
  const newX = dotA.x*(1-t) + dotB.x*t;
  const newY = dotA.y*(1-t) + dotB.y*t;

  return {x:newX,y:newY};

}