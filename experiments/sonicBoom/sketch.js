let input1, input2;

function setup() {


  createCanvas(windowWidth,windowHeight*0.7);

  input1 = document.getElementById("htmlText1")
  input2 = document.getElementById("htmlText2")

  button = document.getElementById("restartAnimation");
  btn1 = document.getElementById("btn1");
  btn2 = document.getElementById("btn2");
  btn3 = document.getElementById("btn3");
  btn4 = document.getElementById("btn4");
  button.onclick = restart;
  btn1.onclick = button1;
  btn2.onclick = button2;
  btn3.onclick = button3;
  btn4.onclick = button4;

  y = height/2;
  x = 50;
  restart();
}


var x = 0;
var y = 0;
var dx = 1.0;
var ddx = 0.0;

let speedOfSound = 1
let interval = 20;

var t = 0

var circles = [];

var cnt = 0;

var infoText = "";


function draw() {
 x += dx;
 dx += ddx;

 background(255);
 t++;


 fill(0);
 stroke(0);
 ellipse(x, y, 5, 5);

 if (t % interval == 0) {
   console.log(dx + " " + ddx);
   circles.push( new Circle(x,y,t) );
   cnt ++;
 }

 for (var i = 0; i < circles.length; i++) {
  circles[i].draw();
 }



 
 if(infoText != "") {
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(0);
  noStroke(0);
  text(infoText, width/2,height*0.1);
  }

 if(cnt > 120) {
   restart();
 }


}

function restart() {
  readText();
  t = 0;
  cnt = 0;
  circles = [];
  x = 50;
}

function button1() {setSpeed(0.5,0);}
function button2() {setSpeed(1,0);}
function button3() {setSpeed(1.5,0);}
function button4() {setSpeed(2,-0.002);}

function setSpeed(speed, acceleleration) {
  restart();
  dx = speed;
  ddx = acceleleration;
  input1.value = speed;
  input2.value = acceleleration;
  infoText = ""
}

function sliderChanged() {
  var oldValue = value;
  sliderVal = +(slider.value)
  value = sliderVal/100000;

  if(oldValue != value) {
    valueUpdated();
  }
}

function readText() {
  console.log("Text Entered");
  const text1 = +(input1.value);
  const text2 = +(input2.value);

  dx = text1;
  ddx = text2;

  infoText = "";

  if(dx >= 10) {
    infoText = "**Speed should be smaller than 5**";
  }
  if(dx <= -10) {
    infoText = "**Speed should be bigger than -5**";
  }
  if(ddx >= 0.1) {
   infoText = "**Acceleration should be smallther than 0.005**";
  }
  if(ddx <= -0.1) {
   infoText = "**Acceleration should be bigger than -0.005**";
  }

  console.log("entered values " + text2);
}

class Circle {
  constructor(x,y,start) {
    this.x = x;
    this.y = y;
    this.start = start;
  };

  draw() {
    noFill();
    stroke(0, (1000-(t-this.start))/1000.0*128);
    strokeWeight(3);

    var r = (t-this.start)*speedOfSound*2;
    ellipse(this.x,this.y, r,r);
  }
}
