function setupSizes() {
    var width = window.screen.width;

    globalColumnWith = Math.min(width*0.8, 200);
    globalOverviewWidth = Math.min(width*0.9, 750); //for the selection screen

    console.log("Sizes of " + width + " -> " + globalColumnWith + " " + globalOverviewWidth); 
}

function setup() {
    stationSearchSetup();
    setupScrolling();
}


async function loadConnections() {   
    var stationFrom = document.getElementById("station-input-from").value
    var stationTo = document.getElementById("station-input-to").value
    var time = document.getElementById("input-time").value
    var date = document.getElementById("input-date").value

    if(stationFrom == "") stationFrom = "Winterthur"
    if(stationTo == "") stationTo = "Eth Honggerberg"

    console.log(stationFrom);
    console.log(stationTo);
    
    
    var link = `https://transport.opendata.ch/v1/connections?from=${stationFrom}&to=${stationTo}&limit=4&time=${time}&date=${date}`

    document.getElementById("loading").style.display = "block";

    var data = await fetchData(link);
    console.log(data);
    
    processStationOverviewResponse(data); 
}


function processStationOverviewResponse(data) {
    console.log("Processing Station Overview Response");
    
    
    y = data;

    var htmlString = ""

    var drawFunctions = [];

    connections = data.connections;
    for(var j = 0; j < data.connections.length; j++) {
        var connection = connections[j];
        console.log(connection);
        x = connection;

        var typesString = "";
        var viaString = "";
        for(var section of connection.sections) {
            if(section.journey == null) continue;
            if(typesString != "") typesString += ", "
            typesString += section.journey.category + section.journey.number;
        }

        var lineNames = getLineNames(connection);

        for(var i = 0; i < connection.sections.length-1; i++) {
            if(viaString != "") viaString += ", "
            viaString += connection.sections[i].arrival.location.name;
        }

        if(viaString != "") {
            viaString = "via " + viaString;
        }

        var drawFunction = (canvas) => {
            var x1 = 25;
            var x2 = globalOverviewWidth*0.9-25;
            var y1 = 25;
            var y2 = 25;

            var lineNamesLocal = getLineNames(connections[j]);
            
            canvas.ctx.strokeStyle = "blue";
            canvas.ctx.fillStyle = "blue";
            canvas.ctx.lineWidth = 3;

            canvas.drawDot(x1,y1, 5);
            canvas.drawDot(x2,y2, 5);
            canvas.drawLine(x1, y1, x2, y2);
            addLineLabels(canvas, lineNamesLocal, x1, y1, x2, y2)
        }

        drawFunctions.push(drawFunction);
        


        htmlString += `<a onclick="js:openConnection(${j})" href="#">
                <div class="card" style="width: ${globalOverviewWidth}px;">
                <div class="card-body">

                 <div class="d-flex d-flex justify-content-between align-items-center"> 
                    <h4 style="text-align: left;">${convertTimeStamp(connection.from.departureTimestamp)}</h4>
                    <h4 style="text-align: right;">${convertTimeStamp(connection.to.arrivalTimestamp)}</h4>
                </div>

                <canvas id="overview-${j}"> </canvas>
                <br>

                <div class="d-flex d-flex justify-content-end align-items-center" style="margin-top:30px"> 
                    <p class="card-subtitle mb-2 text-muted">${connection.duration.substring(4,11)}</h6>
                </div>

                  <p>${viaString}</p>
                </div>
                </a>
              </div><br><br>`
            
    }

    document.getElementById("overview").innerHTML = htmlString;
    document.getElementById("loading").style.display = "none";
    document.getElementById("overview").style.display = "block";


    for(var j = 0; j < data.connections.length; j++) {
        var canvas = new CanvasHelper(`overview-${j}`, globalOverviewWidth*0.9, 50, () => {}, () => {}, drawFunctions[j], true)
    }

    console.log("showing overview");
    
}

function loadSample2() {
    var responses = savedRepsonses2;

    processStationOverviewResponse(savedRepsonses2);
}