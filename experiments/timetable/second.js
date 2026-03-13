var connections = null;

var globalColumnWith = 180; //for the column on the overviews
var globalOverviewWidth = 400; //for the selection screen
var xOffset = 20;
var pTagHeight = 24;

function openConnection(i) {
    console.log("Loading connection");
       
    var ids = [];
    var prevArrivalTime = "";
    for(var j = 0; j < connections[i].sections.length; j++) {
        var section = connections[i].sections[j];
        if(section.walk == null) {
            var startTime = 0; 
            if(prevArrivalTime == "") {
                startTime = section.departure.departure.substring(11,16);
            }
            else {
                startTime = decreaseTimeString(prevArrivalTime,5);
            }

            prevArrivalTime = section.arrival.arrival.substring(11,16);

            ids.push({
                fromStationId: section.departure.station.id,
                toStationId: section.arrival.station.id,
                date: section.departure.departure.substring(0,10),
                time: startTime,
            });
        }
    }
    console.log("Opening ids:");
    console.log(ids);
    createGraphic(ids);
}

function decreaseTimeString(time, delta) {
    var totalMins = parseInt(time.substring(0, 2)) * 60 + parseInt(time.substring(3, 5));

    totalMins -= delta;

    if (totalMins < 0) {
        return time;
    }

    var newHours = Math.floor(totalMins / 60).toString().padStart(2, '0');
    var newMinutes = (totalMins % 60).toString().padStart(2, '0');

    return `${newHours}:${newMinutes}`;
}

async function createGraphicAdvanced(stations, reverse, date, timeInput, searchType) {
    var responses;
    try {
        showLoading();

        responses = await loadSubConnectionsAdvanced(stations, reverse, date, timeInput, searchType);
    }
    catch(error) {
        showError("Requests Failed");
        return;
    }
   
    try {
        showGraphic();
        fillTable(responses, reverse);
    }
    catch(error) {
        showError("Failed Rendering Graphic");
        return; 
    }

}

async function createGraphic(ids) {
var responses;
    try {
        showLoading();

        responses = await loadSubConnections(ids);
    }
    catch(error) {
        showError("Requests Failed");
        return;
    }
   
    try {
        showGraphic();

        const reverse = new Array(responses.length).fill(false);
        fillTable(responses, reverse);   
    }
    catch(error) {
        showError("Failed Rendering Graphic");
        return; 
    }
}

function loadSample() {
    var responses = savedResponses;

    showGraphic();

    fillTable(responses, [false, false])
}


function loadSample3() {
    var responses = savedResponses3;

    showGraphic();

    fillTable(responses, [false, true])
}

var y = null;
var x = "";

async function loadSubConnectionsAdvanced(stations, reverse, date, timeInput, searchType) {
    //TODO: make logic more general
    var time = timeInput;

    var responses = [];

    if(searchType == 1) {
        time = decreaseTimeString(time, -10);
        for(var i = 0; i < stations.length-1; i++) {
            if(reverse[i]) {

                var link = `https://transport.opendata.ch/v1/connections?from=${encodeURIComponent(stations[i+1])}&to=${encodeURIComponent(stations[i])}&isArrivalTime=1&limit=10&date=${date}&time=${time}`
                console.log("fetching from: " + link);
            
                var data = await fetchData(link);
                console.log(data);

                responses.push(data);

                var departureTime = data.connections[0].from.departure.substring(11,16);
            }
            else {
                var link = `https://transport.opendata.ch/v1/connections?from=${encodeURIComponent(stations[i])}&to=${encodeURIComponent(stations[i+1])}&isArrivalTime=1&limit=10&date=${date}&time=${time}`
                console.log("fetching from: " + link);
            
                var data = await fetchData(link);

                console.log(data);

                responses.push(data);

                var arrivalTime = data.connections[0].to.arrival.substring(11,16);
            }
        }
    }
    else if(searchType == 3) {
        var time = timeInput;

        for(var i = 0; i < stations.length-1; i++) {  
            var link = `https://transport.opendata.ch/v1/connections?from=${encodeURIComponent(stations[i])}}&to=${encodeURIComponent(stations[i+1])}&limit=10&date=${date}&time=${time}`
            console.log("fetching from: " + link);
        
            var data = await fetchData(link);

            console.log(data);

            responses.push(data);

            var arrivalTime = data.connections[0].to.arrival.substring(11,16);

            time = decreaseTimeString(arrivalTime, 5);
        }
    }

    console.log(responses);

    return responses;
}

async function loadSubConnections(ids) {
    console.log("Loading connection for ids " + ids.join(","));
    
    var responses = [];

    for(var idPair of ids) {
        var link = `https://transport.opendata.ch/v1/connections?from=${idPair.fromStationId}}&to=${idPair.toStationId}&limit=10&date=${idPair.date}&time=${idPair.time}`

        console.log(link);

        
        

        console.log("Requesting data");
        var data = await fetchData(link);
        responses.push(data);
        console.log("done");
    }  
    
    return responses;
}

function fillTable(responses, reverse) {

    x = responses;    

    var columnTitles = [];
    var columnTimes = [];

    //PREPARE HTML

    for(var i = 0; i < responses.length*2; i++) {
        columnTimes.push([]);
        //columnTitles.push("");
    }

    // Generate Titles

    for(var i = 0; i < responses.length; i++) {
        if(reverse[i]) {
            columnTitles.push(responses[i].to.name);
            columnTitles.push(responses[i].from.name);
        }
        else {
            columnTitles.push(responses[i].from.name);
            columnTitles.push(responses[i].to.name);
        }
  
    }

    processResponses(responses, columnTimes, reverse);

    console.log("Processed Response:");
    console.log(columnTimes);
    
    var durations = responses.map((r) => parseDuration(r.connections[0].duration))
    computeHeights(columnTimes, pTagHeight ,durations);

    setMarginsFromColumnHeights(columnTimes, pTagHeight);

    var lineData = computeLineData(responses, columnTimes);

    // POPULATE HTML

    populateHtmlTable(columnTimes, columnTitles);

    populateCanvavs(lineData, pTagHeight);
}

function parseDuration(durationString) {
    return parseInt(durationString.substring(3,5)) * 60 + parseInt(durationString.substring(6,8));
}

var mainCanvas;
var currentScroll = 0;
var currentWidth = 0;

var lineData;


var animationCount = 100;

function canvasDraw() {
    var newScroll = window.scrollX / mainCanvas.dpi;
    var newWidth =  window.innerWidth / mainCanvas.dpi;

    if(newScroll != currentScroll || newWidth != currentWidth) {
        currentScroll = newScroll
        currentWidth = newWidth;
        animationCount = 100;
    }

    if(animationCount > 0) {
        animationCount --;
        mainCanvas.clearCanvasWhite();
        drawLines(mainCanvas, lineData, pTagHeight);
        updateAnimationFactors();
    }
}

var animationFactors = [];

function initAnimationFactors() {
    var n = lineData.length;

    for(var i = 0; i < n; i++) {
        animationFactors.push(0.5);
    }
    updateAnimationFactors(true);
}

function updateAnimationFactors(init = false) {
    var n = lineData.length;

    var str = 0;

    for(var i = 0; i < n; i++) {
        var x1 = globalColumnWith*i;
        var x2 = globalColumnWith*(i+1);

        str += " " + x1 + " " + x2;

        var f_target = 0;

        if(x1 < currentScroll) {
            f_target = 1;
        }
        else if(x2 > currentScroll+currentWidth) {
            f_target = 0;
        }
        else {
            f_target = 0.5;
        }

        if(init) {
            animationFactors[i] = f_target;
        }
        else {
            animationFactors[i] = Math.floor(100*(animationFactors[i] + f_target)/2)/100;
        }
    }
}

function populateCanvavs(lineData, pTagHeight) {

    console.log(lineData);

    var width = globalColumnWith * lineData.length * 2;
    var height = lineData.map(x => {
        var lastElm = x.connections.at(-1);
        return Math.max(lastElm.start.tableHeight + lastElm.end.tableHeight);
    }).reduce((a, b) => Math.max(a, b), -Infinity);

    mainCanvas = new CanvasHelper("canvas", width, height, () => {}, () => {}, () => {canvasDraw();});
    mainCanvas.clearCanvasWhite()
    currentScroll = window.scrollX / mainCanvas.dpi;
    currentWidth = window.innerWidth / mainCanvas.dpi;

    initAnimationFactors();
    lineData = lineData;
    drawLines(mainCanvas, lineData, pTagHeight);
}


function computeHeights(columnTimes, pTagHeight, durations) {

     // Distance factor pixel per second
    var distanceFactor = 1 / 60 * 8;

    if(durations.some((x) => x > 105)) {
        distanceFactor = 1 / 60 * 2;
    }
    else if(durations.some((x) => x > 45)) {
        distanceFactor = 1 / 60 * 4;
    }
    
    var N = columnTimes.length;
 
    for(var i = 0; i < N; i++) {
     columnTimes[i].push({timestamp: 1_000_000_000_000})
    }
 
    var indices = [];
    for(var i = 0; i < N; i++) {
     indices.push(0);
    }
 
    var go = true;
 
    var lastHeight = 0;
    var lastTimestamp = Math.min(...columnTimes.map(x => x[0].timestamp));
 
    while(go) {
        var minIndex;
        var minTimestamp = 1_000_000_000_000;

        for(var i = 0; i < N; i++) {
            var timestamp = columnTimes[i][indices[i]].timestamp;
            if(timestamp < minTimestamp) {
                minIndex = i;
                minTimestamp = timestamp;
            }
        }

        var minColumnTime = columnTimes[minIndex];

        console.assert(lastTimestamp <= minTimestamp);
        
        var heightDiff = (minTimestamp-lastTimestamp)*distanceFactor;
        var newHeight = lastHeight + heightDiff;

        if(indices[minIndex] > 0 && newHeight-minColumnTime[indices[minIndex]-1].height < pTagHeight) {
            heightDiff = pTagHeight;
            newHeight = lastHeight + heightDiff;
        }

        //update values
        minColumnTime[indices[minIndex]].height = newHeight;
        indices[minIndex] += 1;
        lastHeight = newHeight;
        lastTimestamp = minTimestamp;

        //check if at end
        go = false;
        for(var i = 0; i < N; i++) {
            if(indices[i] < columnTimes[i].length-1) {
                go = true;
            }
        }
 
    }
 
    columnTimes.forEach(inner => inner.pop());

    return columnTimes;
 }

 function setMarginsFromColumnHeights(columnTimes, pTagHeight) {
     //Set initial shift with margin top
    for(var i = 0; i < columnTimes.length; i++) {
        columnTimes[i][0].marginTop = columnTimes[i][0].height;
    }

    //Set correct height with margin bottom
    for(var i = 0; i < columnTimes.length; i++) {
        for(var j = 0; j < columnTimes[i].length; j++) {
            var mb = 0;
            if(j+1 < columnTimes[i].length) {
                mb = columnTimes[i][j+1].height - columnTimes[i][j].height
            }

            mb = mb-pTagHeight;

            columnTimes[i][j].marginBottom = mb;
        }
    }
 }

 function processResponses(responses, columnTimes, reverse) {

    for(var i = 0; i < responses.length; i++) {
        if(reverse[i]) {
            var departures = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
                isStart: false,
                responseNr: i,
                connectionNr: key,
                timestamp: value.from.departureTimestamp,
                marginBottom: 0,
                marginTop: 0,
            }));

            
            var arrivals = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
                isStart: true,
                responseNr: i,
                connectionNr: key,
                timestamp: value.to.arrivalTimestamp,
                marginBottom: 0,
                marginTop: 0,
            }));
            
            columnTimes[i*2] = columnTimes[i*2].concat(arrivals);
            columnTimes[i*2+1] = columnTimes[i*2+1].concat(departures);
        }
        else {
            var departures = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
                isStart: true,
                responseNr: i,
                connectionNr: key,
                timestamp: value.from.departureTimestamp,
                marginBottom: 0,
                marginTop: 0,
            }));

            columnTimes[i*2] = columnTimes[i*2].concat(departures);
            
            var arrivals = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
                isStart: false,
                responseNr: i,
                connectionNr: key,
                timestamp: value.to.arrivalTimestamp,
                marginBottom: 0,
                marginTop: 0,
            }));
            columnTimes[i*2+1] = columnTimes[i*2+1].concat(arrivals);
        }
    }

    for(var i = 0; i < columnTimes.length; i++) {
        columnTimes[i].sort((a, b) => a.timestamp - b.timestamp);
    }
    
 }

 function computeLineData(responses, columnTimes) {

    //Create empty object

    lineData = responses.map(x => {
         return {connections: x.connections.map(y => {
            return {
                start: {},
                end: {},
                names: getLineNames(y)
            }
        })}
    })

    //Compute line coordinates

    for(var i = 0; i < columnTimes.length; i++) {
        //var height = 0;
        for(var j = 0; j < columnTimes[i].length; j++) {
            var elm = columnTimes[i][j]
            
            if(elm.isStart) {
                lineData[elm.responseNr].connections[elm.connectionNr].start.tableHeight = elm.height;
            }
            else {
                lineData[elm.responseNr].connections[elm.connectionNr].end.tableHeight = elm.height;
            }
        }
    }
    
    return lineData;
}

function getLineNames(connection) {


    return connection.sections.map(section => {
        if(section.walk != null) return "walk"
        if("" + section.journey.number.length > 3) {
            //EC00018 -> EC
            return section.journey.category;
        }
        return section.journey.category + " " + section.journey.number;
    })
}

function drawLines(canvas, lineData, pTagHeight) {
    var lineStyle = "stroke:blue;stroke-width:3";

    console.log(globalColumnWith);
    
    var tableWidth = globalColumnWith;
    var pTagTimeWidth = 55;
    var pTagTimeWidth2 = tableWidth-50;
    var offsetY = 52;

    var linesString = "";

    canvas.ctx.strokeStyle = "blue";
    canvas.ctx.lineWidth = 3;

    for(var i = 0; i < lineData.length; i++) {
        for(var connection of lineData[i].connections) {
            var x1 = xOffset + pTagTimeWidth + (i * 2) * tableWidth;
            var x2 = xOffset + pTagTimeWidth2 + (i * 2 + 1) * tableWidth;
            var y1 = offsetY + connection.start.tableHeight + pTagHeight / 2;
            var y2 = offsetY + connection.end.tableHeight + pTagHeight / 2;


            canvas.drawLine(x1, y1, x2, y2);

            addLineLabels(canvas, connection.names, x1, y1, x2, y2, i)
        }
    }

    console.log("Adding lines");
    console.log(linesString);
    
    }

function addLineLabels(canvas, names, x1, y1, x2, y2, row) {
    var n = names.length;

    var w = 50;
    var h = 20;

    var dx = 0;
    var dy = 0;

    if(h/w > (y2-y1)/(x2-x1)) {
        dx = w+5;
        dy = (y2-y1)/(x2-x1)*dx;
    }
    else {
        dy = h+5;
        dx = (x2-x1)/(y2-y1)*dy;
    }

    var maxN = Math.floor((x2-x1)/dx-0.5);
    if(n > maxN) {
        n = maxN;

        if(n > 2) {
            names[n-2] = "...";
            names[n-1] = names[names.length-1];
        }
        else {
            names[n-1] = "...";
        }
    }

    var linesString = "";

    canvas.ctx.fillStyle = "#94D2FF"

    var cx = 0;
    var cy = 0;
    var indexOffset = 0;
    var f = animationFactors[row] ?? 0.5;
    var cx = x1*(1-f)+x2*f;
    var cy = y1*(1-f)+y2*f;
    var indexOffset = f*(n+0.5)-0.75;

    for(var i = 0; i < n; i++) {

        var x_main = cx+dx*(i-indexOffset);
        var y_main = cy+dy*(i-indexOffset) + 3;

        linesString += `<rect width="${w}" height="${h}" x="${x_main-w/2}" y="${y_main-h*0.77}" rx="4" ry="4" fill="#94D2FF" />`

        canvas.drawDot(cx,cy);

        canvas.ctx.fillStyle = "#94D2FF"

        canvas.ctx.beginPath();
        canvas.ctx.roundRect(x_main-w/2, y_main-h*0.77, w, h, 4);
        canvas.ctx.closePath();
        canvas.ctx.fill();


        if(names[i] == "walk") {
            drawWalkIcon(canvas, x_main, y_main)
        }
        else {
            canvas.ctx.fillStyle = "#000"; // text color
            canvas.ctx.textAlign = "center";
            canvas.ctx.font = "14px sans-serif";
            canvas.ctx.fillText(names[i], x_main, y_main);
        }
    }


    return linesString;
}

function populateHtmlTable(columnTimes, columnTitles) {
    

    var titleString = ""
    for(var i = 0; i < columnTitles.length; i += 2) {
        titleString += `<th colspan="2" style="width: ${globalColumnWith}px"> <p style="margin-bottom: 0">${columnTitles[i]} </p> <p style="text-align: right; margin-bottom: 0">${columnTitles[i+1]}</p> </th>`;

    }
    document.getElementById("graphic-table").style.minWidth = globalColumnWith*columnTitles.length +"px"
    document.getElementById("graphic-table").style.marginLeft = xOffset+"px";

    document.getElementById("graphic-table").style.tableLayout = "fixed";

    document.getElementById("table-title").style.minWidth = globalColumnWith*columnTitles.length +"px"
    document.getElementById("table-title").innerHTML = titleString;



    var contentString = columnTimes.map(
        (x) => `<td style="width: ${globalColumnWith/2}px">${
            x.map((y) => {
                if(y.isStart) {
                     return `<p class="time" style="ext-align: left; margin-left: 5px; margin-bottom: ${y.marginBottom}px; margin-top: ${y.marginTop}px">${convertTimeStamp(y.timestamp)}</p>`
                }
                else {
                    return `<p  class="time" style=\"text-align: right; margin-right: 5px; margin-bottom: ${y.marginBottom}px; margin-top: ${y.marginTop}px\">${convertTimeStamp(y.timestamp)}</p>` 
                }
            }).join("")
        }</td>`
    ).join("");

    document.getElementById("table-content").style.minWidth = globalColumnWith*columnTitles.length +"px"
    document.getElementById("table-content").innerHTML = contentString;
}

function getWalkIcon(x, y) {
    const scale = 15 / 860;
    return `<path transform="translate(${x}, ${y}) scale(${scale})"  d="m280-40 112-564-72 28v136h-80v-188l202-86q14-6 29.5-7t29.5 4q14 5 26.5 14t20.5 23l40 64q26 42 70.5 69T760-520v80q-70 0-125-29t-94-74l-25 123 84 80v300h-80v-260l-84-64-72 324h-84Zm260-700q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"/>`
}

function drawWalkIcon(canvas, x, y) {
    const scale = 15 / 860;


    canvas.ctx.save();
    canvas.ctx.translate(x-8, y+2.5);
    canvas.ctx.scale(scale, scale);

    const path = new Path2D("m280-40 112-564-72 28v136h-80v-188l202-86q14-6 29.5-7t29.5 4q14 5 26.5 14t20.5 23l40 64q26 42 70.5 69T760-520v80q-70 0-125-29t-94-74l-25 123 84 80v300h-80v-260l-84-64-72 324h-84Zm260-700q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z");
    canvas.ctx.fillStyle = "#000"; // icon color
    canvas.ctx.fill(path);

    canvas.ctx.restore();
}


var x = null;

function setupScrolling() {
    document.getElementById("graphic").addEventListener("scroll", (event) => {
        //document.getElementById("graphic").scrollTo(200,200);

    })

}