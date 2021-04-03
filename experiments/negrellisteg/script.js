// http://transport.opendata.ch/v1/locations?query=Basel

class Train {
  constructor(train, string, time, platform) {
    this.train = train;
    this.string = string;
    this.time = time;
    this.platform = platform;
  }
}

var trains = [];
var gotArrivals = false;
var gotDepartures = false;


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};



getJSON('https://transport.opendata.ch/v1/stationboard?id=8503000&limit=20',
function(err, data) {
  if (err !== null) {
    //alert('Something went wrong: ' + err);
  } else {
    //alert('Your query count: ' + data.query);
    processData(data, false);
  }
});

getJSON('https://transport.opendata.ch/v1/stationboard?id=8503000&limit=20&type=arrival',
function(err, data) {
  if (err !== null) {
    //alert('Something went wrong: ' + err);
  } else {
    //alert('Your query count: ' + data.query);
    processData(data, true);
  }
});


function processData(data, arrival) {
  var strings = [];
  for(var i = 0; i < data.stationboard.length; i++ ) {
    var train = data.stationboard[i];
    /*var s = (arrival? "Arriving " : "" )+ train.category + " " + train.number + " to " + train.to + " | Platform " + train.stop.platform;
    if(arrival) {
      s = (arrival? "Arriving " : "" )+ train.category + " " + train.number + " from " + train.to + " | Platform " + train.stop.platform;
    }*/
    var s = "";
    var trainType = getTrainDescription(train);
    if(arrival) {
      s = trainType + " von " + train.to;
    }
    else {
      s = trainType +  " nach " + train.to;
    }


    console.log(s);
    console.log(train);

    trains.push(new Train(train, s, train.stop.departureTimestamp, train.stop.platform ?? getPlatform(trainType)));
  }

  if(arrival) {
    gotArrivals = true;
  }
  else {
    gotDepartures = true;
  }

  if(gotArrivals && gotDepartures) {
    readDataDone();
  }
}

function getPlatform(s) {
  var m = { "S2":30,"S8":30,"S14":30,"S19":30,
            "S24":3,
            "S11":40,"S12":40,"S23":40,"S3":40,"S6":40,"S7":40,"S9":40,"S15":40,"S16":40,"S7":40,"S21":40,"S5":40};

  return m[s];

}

function getTrainDescription(train) {
  if(train.category == "S") {
    return "S" + train.number;
  }
  if(train.number.length < 3) {
    return train.category + " " + train.number;
  }
  else {
    return train.category + "";
  }
}

function readDataDone() {
  trains.sort(function(a, b) {
    return a.time - b.time;
  });

  addItems(trains);
}

function addItems(data) {
  var div = document.getElementById('main');
  var str = "";

  str += "<table width=\"100%\"> <tr>";
  for(var i = 0; i < data.length; i++) {

    var index = getIndexOfPlatform(data[i]);

    str += "<tr>";
    for(var j = 1; j <= 16+7+2; j++) {
      if(j < index || j > index+7) {
        str += "<td></td>";
      }
      else if(j == index) {
        str += "<td colspan=\"7\">"
        + "<p>" + getTime(data[i].time) + " – Gl." + (data[i].train.stop.platform ?? "??") + "</p>"
        + "<p>" + data[i].string + "</p>"
        + "</td>";
      }
    }
    str += "</tr>"

  }
  str += "</table>"

  div.innerHTML += str;
}

function getTime(time) {
  var t = time / 60;
  var t1 = t % 60;
  var t2 = Math.floor(t / 60 ) % 24;

  if(t1 < 10) {
    return ""+t2 + ":0" + t1;
  }
  else {
    return ""+t2 + ":" + t1;
  }
}

function getIndexOfPlatform(train) {
  var m = { "41/42":1,"43/44":1,"41":1,"42":1,"43":1,"44":1,"40":1,
            "18":2,"17":3,"16":4,"15":5,"14":6,"13":7,"12":8,"11":9,
            "10":10,"9":11,"8":12,"7":13,"6":14,"5":15,"4":16,"3":17,
            "31":18,"32":18,"33":18,"34":18,"31/32":18,"33/34":18,"30":18};

  var r =   m[train.platform];

  if(r == null) {
    return 10;
  }
  else {
    return r;
  }
}
