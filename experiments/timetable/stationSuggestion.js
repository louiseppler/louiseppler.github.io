var filteredStations = {};

var textFieldId = ""

function textFieldOnChange(id) {

    textFieldId = id;    

    var input = document.getElementById(`station-input-${textFieldId}`).value;

    if(input == "" || input == null) {
        document.getElementById(`station-suggestions-${textFieldId}`).innerHTML = "<div></div>";
        return;
    }

    input = input.toLowerCase();
    //TODO: remove spaces, commas, etc
    //TODO: do this once at start (or even in the data directly)
    stations.forEach(station => {
        station.stop_name_lower = station.stop_name.toLowerCase();
    });


    stations.forEach(station => station.priority = prioritiseStation(input, station.stop_name_lower));

    stations = stations.sort((a,b) => a.stop_name.length-b.stop_name.length)
    stations = stations.sort((a,b) => b.priority - a.priority);

    console.log("Input changed: " + input);
    

    var htmlString = `
    <ul class="list-group">`

    var possibleStations = stations.filter(x => x.stop_name_lower.includes(input));

    console.log(possibleStations);
    

    for(var i = 0; i < possibleStations.length && i < 200; i++) {
        var stationName = possibleStations[i].display_name ?? possibleStations[i].stop_name;
        htmlString += `<a href="javascript:stationSelected('${stationName}')"><li class="list-group-item">${stationName}</li></a>`
    }
    
    htmlString += `</ul>`;

    
    document.getElementById(`station-suggestions-${textFieldId}`).innerHTML = htmlString;
}

function prioritiseStation(input, stationName) {
    var parts = stationName.split(", ")

    if(stationName.includes("hbf")) {
        //International Stations (e.g. "Berlin Hbf")
        if(stationName.startsWith(input)) return 3.5;
        return 0;
    }

    if(parts.length == 1) {
        //Train station (no area given e.g. "Bern Wankdorf")

        if(stationName.startsWith(input)) return 3.5;
        if(stationName.includes(input)) return 2.5;

    }
    if(parts.length == 2) {
        //Bus/Tram Stop ("area, name", e.g. "Zürich, Central")
        if(parts[1].startsWith(input)) return 3;
        if(parts[1].includes(input)) return 2;
        if(stationName.startsWith(input)) return 1.5;
        if(parts[0].includes(input)) return 1;
    }

    return 0;
}

function stationSelected(value) {
    document.getElementById(`station-input-${textFieldId}`).value = value;
        document.getElementById(`station-suggestions-${textFieldId}`).innerHTML = "<div></div>";

}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

function stationSearchSetup() {
    //stations.push({"stop_id":8503000, stop_name:"HB", display_name:"Zürich HB"})
}