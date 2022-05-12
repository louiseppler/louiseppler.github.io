/*
function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}
*/
/*
Inspired by this video (https://youtu.be/sj8Sg8qnjOg)
Right half to increase, Left to decrease ; Top slow, Bottom fast ; Center to set value to 0.61803
Golden Ratio=1.61803 ; 1/Golden Ratio=0.61
*/

let slider;
let input;
let button;

let link1;
let link2;

function min(a, b) {
  if(a < b) return a;
  else return b;
}

function setup() {

  if(false) {
    var temp = min(windowHeight,windowWidth)*0.8;
    createCanvas(temp,temp);
  }
  else {
    createCanvas(windowWidth*0.9,windowHeight*0.7);
  }
  slider = document.getElementById("htmlSlider");

  input = document.getElementById("htmlText")

  input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      enteredText();
    }
  });

  button = document.getElementById("setGolden");
  button.onclick = setGoldenFkt;

  value = 0.11;
  valueUpdated();


  //link1 = document.getElementById("link1");
  //link1.onclick = setToDemo;
  //link1 = document.getElementById("link2");
  //link2.onclick = setGoldenFkt;
  //setGoldenFktSketch = setGoldenFkt;

}


var value = 0.0;

function setGoldenFkt() {
  value = 0.618033988;
  valueUpdated();
}

function setToDemo() {
  value = 0.33;
  valueUpdated();
}

function valueUpdated() {
  slider.value = value*100000;
  input.value = "" + value;
}

function draw() {
   points();

  // text(nf(value,1,5),width/2,50);

/*
   if(mousePressed) {
     var v = float(mouseY)/height*0.0005;
       if(mouseX < width/2) {
           value -= v;
       }
       else if(mouseX > width/2) {
           value += v;
       }
   }
   */
}

function sliderChanged() {
  var oldValue = value;
  sliderVal = +(slider.value)
  value = sliderVal/100000;

  if(oldValue != value) {
    valueUpdated();
  }
}

function enteredText() {
  console.log("Text Entered");
  const text = input.value;

  value = +(text);

  valueUpdated();
}

function points() {

   if(slider === null) {} else {
     sliderChanged();
  }

   background(255);
   //noStroke();
   fill(0);
   var cx = width/2;  var cy = height/2; //center x, y

   //value = slider.value()/1000;

   var s = 1; var step = PI*value*2;


  //var prevX = cx+0.0;
  //var prevY = cy+0.0;
   for(var i = 0; i < 500; i++) {
       var y = sin(step*i);
       var x = cos(step*i);

       //line(prevX,prevY, cx+i*s*x,cy+i*s*y);
       //prevX = cx+i*s*x;
       //prevY = cy+i*s*y;

       ellipse(cx+i*s*x,cy+i*s*y,s*4,s*4);

   }
}

var number = 0;
var decimal = 0;
