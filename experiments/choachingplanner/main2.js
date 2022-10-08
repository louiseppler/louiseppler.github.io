var outputText = "";
var copyText = "";

var startTime = 0;
var duration;
var breakT;
var longBreak; //stores duration time
var longBreak2; //stores frequencies
var longBreak3; //counts down to next long break

var formatType;

var count = 0;

function calculate() {
  console.log("computing");

  var out = document.getElementById('outputDiv');

  var startTime = document.getElementById('startTime');
  var durationTime = document.getElementById('durationTime');
  var breakTime = document.getElementById('breakTime');
  var longBreakTime = document.getElementById('longBreak');
  var longBreak2Time = document.getElementById('longBreak2');

  formatType = document.getElementById('format-select').value;


  //parsing starttime
  var t1 = parseInt(startTime.value.substring(0,2));
  var t2 = parseInt(startTime.value.substring(3,5));

  console.log(t1);

  if(isNaN(t1) || isNaN(t2)) {
    out.innerHTML = "Could not read start time";
    return;
  }

  startTime = t1*60+t2;
  outputText = ""; //reset output text
  longBreak3 = 0;


  duration = parseInt(durationTime.value)

  if(isNaN(duration)) {
    out.innerHTML = "Could not read duration time";
    return;
  }


  breakT = parseInt(breakTime.value);
  if(isNaN(breakT)) {breakT = 0;}

  longBreak = parseInt(longBreakTime.value);
  if(isNaN(longBreak)) {longBreak = 0;}
  longBreak2 = parseInt(longBreak2Time.value);
  if(isNaN(longBreak2)) {longBreak2 = 0;}
  longBreak3 = longBreak2;


  console.log("duration " + duration);
  console.log("breakT " + breakT);


  currentTime = startTime;

  computeEntries();

}

function computeEntries() {
  var out = document.getElementById('outputDiv');

  var N = count*0.5;
  if(N < 10) {N = 20;}


  for(var i = 0; i < N; i++) {
    count += 1;

    outputText += format(currentTime, currentTime+duration, formatType) + "<br>";
    copyText += format(currentTime, currentTime+duration, formatType) + "\n"; //maybe a smarter way to do this

    currentTime += duration+breakT;
    if(longBreak3 == 1) {
      currentTime += longBreak - breakT;
      longBreak3 = longBreak2;
    }
    else {
      longBreak3 -= 1;
    }
    console.log(currentTime);
  }

  out.innerHTML = "</p> " + (outputText) + "</p>";
}


function format(start, end, type) {
  if(type.substring(1,2) == "2") {
    return formatTime(start, type.substring(0,1)) + " - " + formatTime(end, type.substring(0,1));
  }
  else {
    return formatTime(start, type.substring(0,1));
  }

  return start + " - " + end;



}

function formatTime(time, type) {
  time = time%(24*60);

  if(type == "a") {
    return numToStr(time/60) + ":" + numToStr(time%60);
  }
  else if(type == "b") {
    return numToStr(time/60) + "." + numToStr(time%60) + "h";
  }
  else if(type == "c") {
    var h = Math.floor(time/60);
    if(h < 12) return numToStr(time/60) + ":" + numToStr(time%60) + " AM";
    if(h == 12) return numToStr(time/60) + ":" + numToStr(time%60) + " PM";
    if(h < 24) return numToStr(time/60-12) + ":" + numToStr(time%60) + " PM";
    else return numToStr(time/60-12) + ":" + numToStr(time%60) + " AM";
  }
}

function numToStr(num) {
  num = Math.floor(num);
  if(num < 10) {
    return "0"+num;
  }
  else {
    return num;
  }
}

function copyResult() {
  navigator.clipboard.writeText(copyText);
  var div = document.getElementById('copiedDiv');
  div.innerHTML = "Copied!";
}
