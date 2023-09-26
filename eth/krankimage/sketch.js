
var func;

//var foobar = [[0.5,1,0.5],[0.5,0.3,0.5],[0.2,1,0.5]]

const s1 = ( sketch ) => {
  let slider;

  var value = 0.0;

  var N;
  var M;
  var maxK = 0;
  var compressVal;

  var scalar = 4;

  var outputDiv;

  var t = 0;

  var useSlider = false;

  sketch.setup = () => {
    //sketch.frameRate(1);

    M = u.length;
    N = vh[0].length;
    maxK = u[0].length;


    console.log("M is " + M + " and N is " + N);
    console.log(u.length + " " + u[0].length);

    compressVal = 10;

    sketch.createCanvas(N*scalar,M*scalar);
  
    //button
    document.getElementById("button1").onclick = () => {
      compressVal -= 1;
      updateSliderValue();
    };
    document.getElementById("button2").onclick = () => {
      compressVal += 1;
      updateSliderValue();
    };

    func = () => {
      compressVal = 75;
      updateSliderValue();
    }


    outputDiv = document.getElementById("outText");

    //slider
    slider = document.getElementById("slider1");

    sliderChanged();
    updateImage();
  };

  function drawImage() {
    sketch.noStroke();

    for(var i = 0; i < M; i++) {
      for(var j = 0; j < N; j++) {
        var val = 0;
        for(var k = 0; k < compressVal; k++) {

          val += u[i][k]*vh[k][j];
        }
        //console.log(i + " " + j + " : "+ val);


        sketch.fill(val*255);
        sketch.rect(j*scalar,i*scalar,scalar,scalar);
      }
    }

    sketch.fill(0);
    sketch.text("k = " + compressVal,10,10);
  }

  sketch.draw = () => {
    sliderChanged();

    t++;
    updateImage();
  };

  function button1() {
    value = 128;
    valueUpdated();
  }

  function valueUpdated() {
    slider.value = value;
  }

  function updateSliderValue() {
    if(compressVal < 1) {compressVal = 1;}
    if(compressVal > maxK) {compressVal = maxK;}

    slider.value = 1000*Math.sqrt(compressVal/maxK);
    //update silder only for visual purposes
    //invers function is not precise enough
    useSlider = false;
  }

  function updateImage() {
    if(useSlider) {
      var x = value/1000;
      compressVal = Math.ceil(x*x*maxK);
    }

    outputDiv.innerHTML = "k = " + compressVal;


    if(t % 3 == 0) {
      drawImage();
    }
  }

  function sliderChanged() {
    var oldValue = value;
    sliderVal = +(slider.value)
    value = sliderVal;

    if(oldValue != value) {
      useSlider = true;
      valueUpdated();
    }
  }


  function mouseInSketch(sketch) {
    return (0 < sketch.mouseX && sketch.mouseX < sketch.width &&
            0 < sketch.mouseY && sketch.mouseY < sketch.height);
  }

};

//let p5_2 = new p5(s2, document.getElementById('p5sketch2'));
let p5_s1 = new p5(s1, 'p5sketch1');
