 function drawLoc() {
                
    if(gameCanvas.mouseIsPressed) {
        moveDots();
    }

    gameCanvas.clearCanvasWhite();
    gameCanvas.ctx.strokeStyle = "#000"
    gameCanvas.ctx.strokeRect(0,0,gameCanvas.width, gameCanvas.height);
    drawDotsSimple();

    var points = [];
    for(dot of dots) {
        points.push(dot.x, dot.y);
    }
    shapeGraphMain(points, false, true, null, 1);
    doPrint = false;
}

function mouseClickLoc() {
    doPrint = true;
}

function mouseDownLoc() {
    getClosestDot();
}

gameCanvas = new CanvasHelper("canvas", 750, 500, () => {mouseClickLoc();}, () => {mouseDownLoc();}, () => {drawLoc();});

showGraphForTeam = 1;

gameData = {};
gameData.awayTeam = {}
gameData.homeTeam = {}
gameData.homeTeam.color = "#3395AB";
gameData.awayTeam.color = "#B73B92";

// =============== Setup Buttons ===============


$("#showCircles").click(function() {
    showCircles = !showCircles;

    if(showCircles) $("#showCircles").html("Hide Circles")
    else    $("#showCircles").html("Show Circles")
});

$("#showCenters").click(function() {
    showCenters = !showCenters;

    if(showCenters) $("#showCenters").html("Hide Centers")
    else    $("#showCenters").html("Show Centers")
});

showCenters = false;
$("#showCenters").click();
showCircles = false;
$("#showCircles").click();
