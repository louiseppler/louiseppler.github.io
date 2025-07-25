var mainCanvas;

/**
 * A class with extra functions to draw shapes + handles user input
 */
class CanvasHelper {
    constructor(id, width, height, mouseClick, mouseDown, draw, limitedRefresh = false) {
        this.limitedRefresh = limitedRefresh;
        this.count = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseIsPressed = false;

        this.width = width;
        this.height = height; 

        console.log("setting up");

        this.draw = draw

        var scaleFactor = 2; //change dpi

        var canvas = document.getElementById(id);

        const element = document.getElementById(id);
        element.style.width = width + "px";
        element.style.height = height + "px";

        this.ctx = canvas.getContext("2d");

        canvas.width = Math.ceil(width * scaleFactor);
        canvas.height = Math.ceil(height * scaleFactor);

        this.ctx.scale(scaleFactor, scaleFactor);
        
        window.requestAnimationFrame(() => {this.drawHandler()});

        var helper = this
        
        canvas.addEventListener("mousemove", function(event) {
            helper.mouseX = event.offsetX;
            helper.mouseY = event.offsetY;
        });
        
        canvas.addEventListener("mouseup", function(event) {
            mouseClick();
            helper.mouseIsPressed = false;
        });
        
        canvas.addEventListener("mousedown", function(event) {
            helper.mouseIsPressed = true;
            mouseDown();
        })
    
        this.clearCanvas()
    }

    drawHandler() { 
        if(!this.limitedRefresh) {   
            this.draw();
        }
        else {
            this.count += 1;
            if(this.mouseIsPressed || this.count % 20 == 0) {
                this.draw();
            }
        }

        window.requestAnimationFrame(() => {this.drawHandler()});
    }

    drawDot(x, y, r, start = 0, end = 2 * Math.PI) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, start, end);
        this.ctx.fill();
    }

    drawCircle(x, y, r, start = 0, end = 2 * Math.PI) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, start, end);
        this.ctx.stroke();
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawTriangle(x1, y1, x2, y2, x3, y3) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.fill();
    }

    fillTextLeft(str, x, y) {
        this.ctx.fillText("" + str, x, y); 
    }
    fillTextCenter(str, x, y) {
        var textWidth = this.ctx.measureText(str).width;
        this.ctx.fillText("" + str, x-textWidth/2, y); 
    }

    fillTextRight(str, x, y) {
        var textWidth = this.ctx.measureText(str).width;
        this.ctx.fillText("" + str, x-textWidth, y); 
    }

    clearCanvas() {
        this.ctx.fillStyle = "lightgray"
        this.ctx.fillRect(0,0,this.width,this.height);
    }

    clearCanvasWhite() {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0,0,this.width,this.height);
    }

    logLive(text) {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0,0,200,20);
        this.ctx.fillStyle = "#000"
        this.ctx.fillText(text, 15, 15);
    }
}

function setupCanvases() {

    mainCanvas = new CanvasHelper("canvas", 1000, 200, () => {mouseClick();}, () => {mouseDown();}, () => {draw();});
    mainCanvas.clearCanvas()

}

// Extra Helper Functions

function boolArrayToString(arr) {
    var s = ""
    for(var i = 0; i < arr.length; i++) {
        if(arr[i]) {
            s += "" + i + ",";
        }
    }
    return s
}   


function getDist(x1, y1, x2, y2) {
    return Math.sqrt(getSquaredDist(x1, y1, x2, y2))
}

function getSquaredDist(x1, y1, x2, y2) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}