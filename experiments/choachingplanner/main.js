var tableStr = "No computed Table";
var excelStr = "No computed Table";

function calculate() {

  //This code could/sould be refactored into functions and more

  var div = document.getElementById('outputTable');
  var input = document.getElementById('inputValue');


  var limitValue = document.getElementById('limitValue');
  var spredValue = document.getElementById('spredValue');
  var breakValue = document.getElementById('breakValue');
  var splitCellValue = document.getElementById('splitCells');

  var showInNewTab = false;

  var n2 = parseInt(inputValue.value);
  console.log(n2);

  var limitNr = parseInt(limitValue.value);
  console.log(limitNr);

  if(n2 <= 2 || isNaN(n2)) {
    div.innerHTML = "Please enter a valid input";
    return;
  }

  if(n2 > 500) {
    div.innerHTML = "Input too large";
    return;
  }
  else if(n2 > 25){
    showInNewTab = true;
    div.innerHTML = "Table opend in new tab."
  }

  if(limitValue.value != "") {
    if(isNaN(limitNr)) {
      div.innerHTML = "Please enter a number in 'Number of mettings in parallel'"
      return;
    }
    if(limitNr < 1) {
      div.innerHTML = "Please enter a number bigger than 0 in 'Number of mettings in parallel'"
    }
  }
  if(isNaN(limitNr)) {
    limitNr = n2;
  }

  uncopy();

  //var n2 = 6;
  var n = n2;
  var addExtra = false;
  if(n % 2 == 0) {
    n = n -1;
    addExtra = true;
  }

  console.log(n, addExtra);

  var numbers = [];
  for(var i = 0; i < n; i++) {
    numbers.push(i);
  }

  console.log(numbers);

  //stores a list of sessions
  //session stores a list of 2 numbers represeting a meeting
  var plan = [];
  var listOfSessions = [];


  for(var i = 0; i < n; i++) {

    var session = [];

    //make the groups
    for(var j = 0; j < n/2-1; j++) {
      session.push([numbers[j],numbers[n-j-1]]);
    }
    if(addExtra) {
      session.push([numbers[Math.floor(n/2)],n]);
    }

    listOfSessions = listOfSessions.concat(session);


    //rotate array
    var first = numbers[0];
    for(var j = 1; j < n; j++) {
      numbers[j-1] = numbers[j];
    }
    numbers[n-1] = first;

  }

  console.log(listOfSessions)


  if(limitNr > (n-1)/2) {
    limitNr = Math.floor(n2/2);
  }

  console.log("n " + n);

  //adds empty values of listOfSessions to spread them out
  var toAdd = Math.ceil(listOfSessions.length/limitNr)*limitNr-listOfSessions.length;
  console.log("toAdd " + toAdd);

  if(spredValue.checked) {
    //add the empty slots in the middle
    //numberOfSessions/2 -> the middle, -toAdd/2, spread them around the middle
    var addShift = Math.ceil(listOfSessions.length/limitNr/2)-Math.floor(toAdd/2);

    for(var i = 1; i <= toAdd; i++) {
      listOfSessions.splice((i+addShift)*limitNr-1, 0, [-1,-1]); //insert at index
    }
  }
  else {
    for(var i = 0; i < toAdd; i++) {
      listOfSessions.push([-1,-1]);
    }
  }




  //takes listOfSessions and makes a plan out of it
  var temp = [];
  for(var i = 0; i < listOfSessions.length; i++) {
    if(i % limitNr == 0 && i != 0) {
      plan.push(temp);
      temp = [];
    }
    temp.push(listOfSessions[i]);
  }
  plan.push(temp);

  console.log(plan);

  //computing the breaks
  var onBreak = [];
  var haveBreaks = false;

  for(var i = 0; i < plan.length; i++) {
    onBreak.push([]);
    var haveMeeting = [];
    for(var j = 0; j < n2; j++) {
      haveMeeting.push(false);
    }

    for(var j = 0; j < plan[i].length; j++) {
      if(plan[i][j][0] != -1) {
        haveMeeting[plan[i][j][0]] = true;
        haveMeeting[plan[i][j][1]] = true;
      }
    }

    for(var j = 0; j < n2; j++) {
      if(haveMeeting[j] == false) {
        haveBreaks = true;
        onBreak[i].push(j);
      }
    }
  }

  console.log(onBreak);


  //FORMATTING STUFF =========================================================
  var namesText = document.getElementById('Names').value;
  var timesText = document.getElementById('Times').value;
  var roomsText = document.getElementById('Rooms').value;
  var breakText = document.getElementById('BreakTxt').value;
  var separatorText = document.getElementById('SeparatorTxt').value;

  //setting default formatting -- names
  var names = [];
  if(namesText == "") {
    for(var i = 0; i < n2; i++) {
      names.push(""+(i+1));
    }
  }
  else {
    names = namesText.split("\n");
    for(var i = names.length; i < n2; i++) {
      names.push("Person " + (i+1));
    }
  }

  //setting default formatting -- rooms
  var rooms = [];
  if(roomsText == "") {
    for(var i = 0; i < n; i++) {
      rooms.push("Group " + (i+1));
    }
  }
  else {
    rooms = roomsText.split("\n");
    for(var i = rooms.length; i < n; i++) {
      rooms.push("Group " + (i+1));
    }
  }

  if(breakText == "") {
    breakText = "Break";
  }
  if(separatorText == "") {
    separatorText = "and";
  }

  //setting defautl frommating -- times
  var haveTimes = false;
  var times = [];
  if(timesText != "") {
    haveTimes = true;
    times = timesText.split("\n");
    for(var i = times.length; i < plan.length; i++) {
      times.push("--");
    }
  }

  var splitCells = splitCellValue.checked;

 //WRITING HTML ============================================================
  str = "<table class=\"maintable\">";
  estr = "";

  //adding table header with rooms
  str += "<tr>"
  if(haveTimes) {
    str += "<td></td>";
    estr += "\t";
  }

  for(var j = 0; j < plan[0].length; j++) {
    if(splitCells) {
      str += "<td colspan=\"2\"><strong>";
    }
    else {
      str += "<td><strong>";
    }
    str += rooms[j];
    estr += rooms[j] + "\t";
    if(splitCells) {
      estr += "\t";
    }
    str += "</strong></td>";
  }

  if(haveBreaks && breakValue.checked == true) {
    str += "<td><strong>";
    str += breakText;
    estr += breakText;
    str += "</strong></td> </tr>"
  }

  //main content of table
  for(var i = 0; i < plan.length; i++) {
    str += "<tr>";
    estr += "\n";
    if(haveTimes) {
      str += "<td>"+ times[i] +"</td>";
      estr += times[i] + "\t";
    }

    for(var j = 0; j < plan[i].length; j++) {
      str += "<td>";

      //console.log(plan[i][j]);
      if(plan[i][j][0] != -1) {
        if(splitCells) {
          str += names[plan[i][j][0]] + " " + "</td><td>" + " " + names[plan[i][j][1]];
          estr += names[plan[i][j][0]] + " " + "\t" + " " + names[plan[i][j][1]];
        }
        else {
          str += names[plan[i][j][0]] + " " + separatorText + " " + names[plan[i][j][1]];
          estr += names[plan[i][j][0]] + " " + separatorText + " " + names[plan[i][j][1]];
        }
      }
      else {
        if(splitCells) {
          str += "</td><td>";
          estr += "\t";
        }
      }

      str += "</td>";
      estr += "\t";
    }

    //str += "<td></td>";
    if(haveBreaks && breakValue.checked == true) {
      str += "<td>";
      for(var j = 0; j < onBreak[i].length; j++) {
        str += names[onBreak[i][j]];
        estr += names[onBreak[i][j]];
        if(j != onBreak[i].length-1) {
          str += ", ";
          estr += ", ";
        }
      }
    }
    //str += (onBreak[i][onBreak[i].length-1]+1) + "</td>";


    str += "</tr>";
  }

  str += "</table>"

  tableStr = str;
  excelStr = estr;

  if(showInNewTab) { //for big examples
    newTab();
    return;
  }
  div.innerHTML = str;

};

function showExamples() {
  if(
    document.getElementById('Names').value != "" ||
    document.getElementById('Times').value != "" ||
    document.getElementById('Rooms').value != ""
  ) {
    alert("To avoid overwriting data, please delete the text to view the example");
    return;
  }

  document.getElementById('Names').value =
  "Alice\nBob\nCharlie\nDave\nEve\nFelix\nGian\nHilbert\nIda\nJan";
  document.getElementById('Times').value =
  "14:00-14:15\n14:15-14:30\n14:30-14:45\n14:45-15:00";
  document.getElementById('Rooms').value =
  "Room 42\nRoom 43\nRoom44\nRoom45";

  document.getElementById('inputValue').value = 10;
  document.getElementById('limitValue').value = 4;
}

function newTab() {
  var str = "<!DOCTYPE html>";
  str += "<head> <link rel=\"stylesheet\" href=\"style.css\"> </head>"
  str += "<body><center><p><br></p>";
  str += tableStr;
  str += "</center></str>";

  console.log(tableStr);
  console.log(str);

  var tab = window.open('about:blank', '_blank');
  tab.document.write(str); // where 'html' is a variable containing your HTML
  tab.document.close();
}

function copyData() {
  navigator.clipboard.writeText(excelStr);
  var div = document.getElementById('copiedDiv');
  div.innerHTML = "Copied!";
}

function uncopy() {
  //removes copied label
  var div = document.getElementById('copiedDiv');
  div.innerHTML = "";
}
