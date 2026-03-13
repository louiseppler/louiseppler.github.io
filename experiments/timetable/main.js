function setupSizes() {
    var width = window.innerWidth / mainCanvas.dpi;

    globalColumnWith = 180 + 0*Math.min(width*0.6, 180);
    globalOverviewWidth = Math.min(width*0.9, 750); //for the selection screen

    console.log("Sizes of " + width + " -> " + globalColumnWith + " " + globalOverviewWidth); 
}

function setup() {
    setupViews();
    setupSearch();
    stationSearchSetup();
    setupScrolling();
}

function getCurrentTime() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


async function loadConnections() {   
    if(searchType == 0) {

        var stationFrom = document.getElementById("station-input-from").value
        var stationTo = document.getElementById("station-input-to").value
        var time = document.getElementById("input-time").value
        var date = document.getElementById("input-date").value

        if(stationFrom == "") stationFrom = "Winterthur"
        if(stationTo == "") stationTo = "Eth Honggerberg"
        if(time == "") time = getCurrentTime();
        if(date == "") date = getCurrentDate();

        console.log(stationFrom);
        console.log(stationTo);
        
        
        
        loadOverviewConnections(stationFrom, stationTo, time, date);
    }
    else {
        console.log("Starting search");
        
        var stations = [];
        var reverse = [];
        var do_overview = false;

        var stationFrom = document.getElementById("station-input-from").value
        var stationTo = document.getElementById("station-input-to").value
        if(stationFrom == "") stationFrom = "Winterthur"
        if(stationTo == "") stationTo = "Eth Honggerberg"

        var time = document.getElementById("input-time").value
        var date = document.getElementById("input-date").value
        if(time == "" && searchType != 1) time = getCurrentTime();
        if(date == "") date = getCurrentDate();

        if(searchType == 1) {
            stations.push(stationFrom);
            var stationFrom2 = document.getElementById("station-input-from2").value;
            if(stationFrom2 == "") {
                alert("Please Enter a valid second departure station");
                return;
            }
            if(time == "") {
                alert("Please enter an arrival time")
                return;
            }
            
            stations.push(stationTo);
            stations.push(stationFrom2);
            reverse.push(false);
            reverse.push(true);
        }
        else if(searchType == 3) {
            stations.push(stationFrom);
            var stationVia1 = document.getElementById("station-input-via").value;
            if(stationVia1 == "") {
                alert("Please enter a valid via station");
                return; 
            }
            stations.push(stationVia1)
            stations.push(stationTo);
            reverse.push(false);
            reverse.push(false);
        }

        console.log(stations);
        
        createGraphicAdvanced(stations, reverse, date, time, searchType);
    }
}


async function loadOverviewConnections(stationFrom, stationTo, time, date) {

    var data = null;
    try {
        var link = `http://transport.opendata.ch/v1/connections?from=${encodeURIComponent(stationFrom)}}&to=${encodeURIComponent(stationTo)}&limit=4&time=${time}&date=${date}`

        showLoading();

        data = await fetchData(link);
        console.log(data);
    }
    catch(error) {
        console.log(error);
        
        showError("Request Failed");
        return;
    }


    try {
        processStationOverviewResponse(data); 
    }
    catch(error) {
        showError("Failed Rendering Data");
        return;
    }
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
    showOverview();

    for(var j = 0; j < data.connections.length; j++) {
        var canvas = new CanvasHelper(`overview-${j}`, globalOverviewWidth*0.9, 50, () => {}, () => {}, drawFunctions[j], true)
    }

    console.log("showing overview");
    
}

function loadSample2() {
    var responses = savedRepsonses4;

    processStationOverviewResponse(savedRepsonses2);
}