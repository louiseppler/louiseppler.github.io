var connections = null;

var globalColumnWith = 180; //for the column on the overviews
var globalOverviewWidth = 400; //for the selection screen

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
                time: startTime
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

async function createGraphic(ids) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("overview").style.display = "none";

    var responses = await loadSubConnections(ids);

    document.getElementById("loading").style.display = "none";
    document.getElementById("graphic").style.display = "block";

    console.log(responses);

    fillTable(responses);
    
}

function loadSample() {
    var responses = savedRepsonses;

    document.getElementById("loading").style.display = "none";
    document.getElementById("graphic").style.display = "block";

    fillTable(responses)
}

var y = null;
var x = "";

async function loadSubConnections(ids) {
    console.log("Loading connection for ids " + ids.join(","));
    
    var responses = [];

    for(var idPair of ids) {
        var link = `http://transport.opendata.ch/v1/connections?from=${idPair.fromStationId}}&to=${idPair.toStationId}&limit=10&date=${idPair.date}&time=${idPair.time}`

        console.log(link);
        

        console.log("Requesting data");
        var data = await fetchData(link);
        responses.push(data);
        console.log("done");
    }  
    
    return responses;
}

function fillTable(responses) {


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
        columnTitles.push(responses[i].from.name);
        columnTitles.push(responses[i].to.name);
    }

    processResponses(responses, columnTimes);

    console.log("Processed Response:");
    console.log(columnTimes);
    

    var pTagHeight = 24;
    var distFactor = 1 / 60 * 8; // Distance factor pixel per second
    
    computeHeights(columnTimes, pTagHeight, distFactor)

    setMarginsFromColumnHeights(columnTimes, pTagHeight);

    var lineData = computeLineData(responses, columnTimes);

    // POPULATE HTML

    populateHtmlTable(columnTimes, columnTitles);

    populateCanvavs(lineData, pTagHeight);
}

var mainCanvas;

function canvasDraw() {

}

function populateCanvavs(lineData, pTagHeight) {

    console.log(lineData);

    var width = globalColumnWith * lineData.length * 2;
    var height = lineData.map(x => {
        var lastElm = x.connections.at(-1);
        return Math.max(lastElm.from.tableHeight + lastElm.to.tableHeight);
    }).reduce((a, b) => Math.max(a, b), -Infinity);

    mainCanvas = new CanvasHelper("canvas", width, height, () => {}, () => {}, () => {canvasDraw();});
    mainCanvas.clearCanvasWhite()

    drawLines(mainCanvas, lineData, pTagHeight);
}


function computeHeights(columnTimes, pTagHeight, distanceFactor) {
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

 function processResponses(responses, columnTimes) {

    for(var i = 0; i < responses.length; i++) {
        var departures = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
            isDeparture: true,
            responseNr: i,
            connectionNr: key,
            timestamp: value.from.departureTimestamp,
            marginBottom: 0,
            marginTop: 0,
        }));

        columnTimes[i*2] = columnTimes[i*2].concat(departures);
        
        var arrivals = Array.from(responses[i].connections.entries()).map(([key, value]) => ({
            isDeparture: false,
            responseNr: i,
            connectionNr: key,
            timestamp: value.to.arrivalTimestamp,
            marginBottom: 0,
            marginTop: 0,
        }));
        columnTimes[i*2+1] = columnTimes[i*2+1].concat(arrivals);
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
                from: {},
                to: {},
                names: getLineNames(y)
            }
        })}
    })

    //Compute line coordinates

    for(var i = 0; i < columnTimes.length; i++) {
        //var height = 0;
        for(var j = 0; j < columnTimes[i].length; j++) {
            var elm = columnTimes[i][j]
            
            if(elm.isDeparture) {
                lineData[elm.responseNr].connections[elm.connectionNr].from.tableHeight = elm.height;
            }
            else {
                lineData[elm.responseNr].connections[elm.connectionNr].to.tableHeight = elm.height;
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
            var x1 = pTagTimeWidth + (i * 2) * tableWidth;
            var x2 = pTagTimeWidth2 + (i * 2 + 1) * tableWidth;
            var y1 = offsetY + connection.from.tableHeight + pTagHeight / 2;
            var y2 = offsetY + connection.to.tableHeight + pTagHeight / 2;


            canvas.drawLine(x1, y1, x2, y2);


            addLineLabels(canvas, connection.names, x1, y1, x2, y2)
        }
    }

    console.log("Adding lines");
    console.log(linesString);
    
    
    document.getElementById("graphic-lines").innerHTML = linesString;
}

function addLineLabels(canvas, names, x1, y1, x2, y2) {
    var n = names.length;
    
    var cx = (x1+x2)/2;
    var cy = (y1+y2)/2;

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

    for(var i = 0; i < n; i++) {

        var x_main = cx+dx*(i-(n-1)/2);
        var y_main = cy+dy*(i-(n-1)/2) + 3;

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

    document.getElementById("graphic-table").style.tableLayout = "fixed";

    document.getElementById("table-title").style.minWidth = globalColumnWith*columnTitles.length +"px"
    document.getElementById("table-title").innerHTML = titleString;



    var contentString = columnTimes.map(
        (x) => `<td style="width: ${globalColumnWith/2}px">${
            x.map((y) => {
                if(y.isDeparture) {
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