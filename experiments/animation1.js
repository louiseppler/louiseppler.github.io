// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let curX;
let curY;
let pressed = false;

document.onmousemove = function(e) {
  curX = (window.Event) ? e.pageX : e.clientX +
   (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  curY = (window.Event) ? e.pageY : e.clientY +
   (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

}

function getY() {
  return curY;
}

let last_known_scroll_position = 0;
let ticking = false;

function doSomething(scroll_pos) {
  // Do something with the scroll position
}

document.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});
// define loop that keeps drawing the scene constantly

//===========================================================================================

let scale = 100;

function scaleText(n) {
  if(n < 1000) {
    return Math.floor(n) + " m";
  }
  else {
    return Math.floor(n/1000) + " km"
  }
}

function updateScale() {
  const y = getY()/height;
  scale = 100*Math.pow(1.05, y*500);
}

function toPixels(meters) {
  return meters/scale*height;
}

function drawScale() {
  ctx.fillStyle = 'rgba(0,0,0,1)';;
  ctx.font = '48px Arial';
  ctx.textAlign = "left";
  ctx.fillText(' ' + scaleText(scale), 10, 60);
  ctx.fillRect(10, 10,1,height*0.1);



}

//===========================================================================================

function drawEarth() {
  if(scale < 200000) {
    ctx.strokeRect(0, height*0.75, width, 0);
    return;
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.strokeStyle = 'rgb(1, 1, 1)';
  ctx.beginPath();
  ctx.arc(width*0.5, height*0.75+toPixels(6371000), toPixels(6371000), 0, Math.PI*2, false);
  ctx.stroke();

  if(scale > 10000000000) {
    drawLineH("Earth","",0,0)
  }
}

function drawLine(name, name2, h) {
    drawLineH(name,name2,h,2)
}

function drawLineH(name, name2, h, hide) {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.strokeStyle = 'rgb(1, 1, 1)';

  const pixels = toPixels(h)
  if(pixels > hide || h == 0 || pixels < -hide) {
    ctx.fillRect(width*0.5-10, height*0.75-toPixels(h),20,1);

    textSize = 32;

    if(pixels < 32*4 && h != 0 && scale <= 200000000000) {
      textSize = Math.sqrt(pixels*4);
    }

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.textAlign = "left";
    ctx.font = textSize + 'px Arial';
    ctx.fillText(name, width*0.5+10, height*0.75-toPixels(h)+textSize*0.25);

    ctx.fillStyle = 'rgba(0,0,0,1)';;
    ctx.textAlign = "right";
    ctx.font = textSize + 'px Arial';
    ctx.fillText(name2, width*0.5-10, height*0.75-toPixels(h)+textSize*0.25);
  }
}

function drawInfo() {
  if(scale > 10000000000) {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.textAlign = "right";
    ctx.font = '16px Arial';
    ctx.fillText("*Smallest distance to earth in million km",width-30,height-30)
  }
}

function loop() {
  updateScale();

  //background
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect(0,0,width,height);

  //drawScale();
  drawEarth();

  drawLine("","100m",100);

  drawLine("Tallest Pyramide","146.5 m",146.5);
  drawLine("Eiffle Tower","324 m",324);
  drawLine("Burj Khalifa","830 m", 830);
  drawLine("Mont Blanc (Alps)","4'810 m",4810);
  drawLineH("Mount Everest","8849 m",8849,100);
  drawLine("Airplanes","10km",10000)
  drawLine("Starlink Satellites","55 km",55000);
  drawLine("ISS","408 km",408000);
  drawLine("GPS Satellites","~ 20 Mm",20200000);

  drawLine("Moon","384 Mm",384400000);

  drawLine("Venus","41 Gm",41000000000);
  drawLine("Mercury","92 Gm",92000000000);
  drawLine("Sun","149 Gm",149000000000);

  drawLine("Mars","79 Gm",  -79000000000)
  drawLine("Jupiter","631 Gm",  969000000000)

  //drawInfo();

  requestAnimationFrame(loop);
}

//Planets source
//https://www.nasa.gov/sites/default/files/files/YOSS_Act1.pdf

loop();
