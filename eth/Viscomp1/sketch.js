
const s1 = ( sketch ) => {
  let slider;
  let input;

  var u = 2;
  var v = 1;


  sketch.setup = () => {
    sketch.createCanvas(500,500);
    sketch.noStroke();

  };

  sketch.draw = () => {
    //if(!mouseInSketch(sketch)) return;
    if(mouseInSketch(sketch)) {

      u = sketch.mouseX/(sketch.width +0.0)*10-5;
       v = sketch.mouseY/(sketch.height +0.0)*10-5;
    }

     var s = 5; //drawing size
     for(var x = 0; x < sketch.width; x += s) {
       for(var y = 0; y < sketch.height; y += s) {
         var val = Math.cos(2*Math.PI* (u*x/sketch.width + v*y/sketch.height)) - Math.sin(2*Math.PI* (u*x/sketch.width + v*y/sketch.height));



         sketch.fill(val*128.0+128);
         //fill((x+0.0)/height*255,(y+0.0)/width*255,0);
         sketch.rect(x,y,s,s);
       }
     }

     document.getElementById("outText").innerHTML = "<p style=\"font-size: 20px;\"> u = " + u.toFixed(2) + " v = " + v.toFixed(2) + "</p>";
  };

  function mouseInSketch(sketch) {
    return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
            0 < sketch.mouseY && sketch.mouseY < sketch.height);
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');
