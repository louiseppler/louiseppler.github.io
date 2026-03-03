// ============= UI parameters =============

var showCircles = false;
var showCenters = false;

// ============= Animations Parameters =============

//only used before calculation of triangles, use delaunay.points
var dots = []; 
var selectedIndex = 0;

var doPrint = false;

function mouseDown() {
    console.log("mouse down");
    console.log("mousIsPressed of: " + gameCanvas.mouseIsPressed);
    getClosestDot();
}

function mouseClick() {
    console.log("mouse cliked");
    console.log("mousIsPressed of: " + gameCanvas.mouseIsPressed);
}

function moveDots() {
    dots[selectedIndex].x = gameCanvas.mouseX;
    dots[selectedIndex].y = gameCanvas.mouseY;
}

/**
 * Gets the closest dot from the current mouse coordinates
 */
function getClosestDot() {
    var minIndex = 0;
    var minDist = 1_000_000_000;

    for(var i = 0; i < dots.length; i++) {
        const dist = getSquaredDist(gameCanvas.mouseX, gameCanvas.mouseY, dots[i].x, dots[i].y);
        console.log(dist);
        if(dist < minDist) {
            minDist = dist;
            minIndex = i;
        }
    }   

    console.log("minDist = ",minDist)

    if(minDist > 40*40) {
        console.log("adding new point")
        console.log("at:",gameCanvas.mouseX,gameCanvas.mouseY)

        dots.push({x: gameCanvas.mouseX, y: gameCanvas.mouseY});
        selectedIndex = dots.length-1;
    }
    else {
        selectedIndex = minIndex;
    }

}


function drawDotsSimple() {

    gameCanvas.ctx.fillStyle = "black"

    for(const dot of dots) {
        gameCanvas.drawDot(dot.x,dot.y,5)
    }
}


/**
 * This function computes the positions labels for the players
 * by computing a delaunay graph, then reduces it to a shape graph
 * to then determine the labels
 * @param {*} array the array of points [x1, y1, x2, y2, ...]
 * @param {*} isReversed pass true if team plays the other direction
 * @param {*} showDrawings pass true if elements should be drawn, default false
 * @returns 
 */
function shapeGraphMain(array, isReversed, showDrawings = true, playerIDs = null, team = 0) {

    const delaunay = new d3.Delaunay(array);

    const voronoi = delaunay.voronoi([0, 0, gameCanvas.width, gameCanvas.height]);

    var graph = computeBaseGraph(delaunay);

    gameCanvas.ctx.lineWidth = 3;
    gameCanvas.ctx.strokeStyle = "##000"
    drawGraph(delaunay.points, graph)
    gameCanvas.ctx.strokeStyle = "#000"
    gameCanvas.ctx.lineWidth = 1;


    if(showCircles || showCenters) {
        gameCanvas.ctx.strokeStyle = "#aaa"
        drawCenters(voronoi)
    }

    if(showCircles) {
        gameCanvas.ctx.strokeStyle = "#aaa"
        drawCircles(voronoi, delaunay.triangles)
    }

    gameCanvas.ctx.strokeStyle = "#000"

    return []
}

// ============= drawing functions  =============

function drawGraph(points, graph) {
    for(var i = 0; i < graph.length; i++) {
        for(var j = 0; j < graph[i].length; j++) {
            const k = graph[i][j];

            if(i < k) {
                gameCanvas.drawLine(points[i*2],points[i*2+1],points[k*2],points[k*2+1])
            }
        }
    }
}


function drawCenters(voronoi) {
     for(var i = 0; i < voronoi.circumcenters.length; i += 2) {
       gameCanvas.drawDot(voronoi.circumcenters[i],voronoi.circumcenters[i+1],2);
   }
}

function drawCircles(voronoi, triangles) {
   for(var i = 0; i < voronoi.circumcenters.length; i += 2) {

    const t0 = triangles[i];
    //const radius = getDist(voronoi.circumcenters[i],voronoi.circumcenters[i+1], points[t0*2], points[t0*2+1])
    const radius = getSmallestRadius(voronoi.circumcenters[i],voronoi.circumcenters[i+1]);
    gameCanvas.drawCircle(voronoi.circumcenters[i],voronoi.circumcenters[i+1], radius)
   }
}

// ============= Helper Functions =============


function getSmallestRadius(x1, y1) {
    var r = 1000000;
    for(const dot of dots) {
        var r_new = getDist(dot.x, dot.y, x1, y1);
        if(r_new < r) {
            r = r_new
        }
    }
    return r;
}

function getDist(x1, y1, x2, y2) {
    return Math.sqrt(getSquaredDist(x1, y1, x2, y2))
}

function getSquaredDist(x1, y1, x2, y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}


function computeBaseGraph(delaunay) {
    var graph = []

    for (var i = 0; i < delaunay.points.length/2; i++) {
        const neighbors = Array.from(delaunay.neighbors(i));
        graph.push(neighbors)
    }
    
    return graph
}
