/**
 * A class with extra functions to draw shapes + handles user input
 */
export class CanvasHelper {
    private count: number

    limitedRefresh: boolean
    width: number
    height: number
    mouseX: number
    mouseY: number
    mouseIsPressed: boolean
    ctx: CanvasRenderingContext2D
    draw: () => void

    constructor(id: string, width: number, height: number, mouseUp: () => void, mouseDown: () => void, draw: () => void, limitedRefresh = false) {
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

        var canvas = (document.getElementById(id) as HTMLCanvasElement);

        const element = document.getElementById(id)!;
        element.style.width = width + "px";
        element.style.height = height + "px";

        this.ctx = (canvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;

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
            helper.mouseIsPressed = false;
            mouseUp();
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

    drawDot(x: number, y: number, r: number, start = 0, end = 2 * Math.PI) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, start, end);
        this.ctx.fill();
    }

    drawCircle(x: number, y: number, r: number, start = 0, end = 2 * Math.PI) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, start, end);
        this.ctx.stroke();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.fill();
    }

    drawRingArc(cx: number, cy: number, innerR: number, outerR: number, start: number, end: number) {
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, outerR, start, end, false);
        this.ctx.arc(cx, cy, innerR, end, start, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLeftArrow(x: number, y: number, width: number, height: number) {
        const padding = height * 0.3;
        const midY = y + height / 2;
        const headSize = height * 0.2;

        this.ctx.beginPath();

        // Line
        this.ctx.moveTo(x+padding, midY);
        this.ctx.lineTo(x + width - padding, midY);

        // Arrow head
        this.ctx.moveTo(x + padding + headSize, midY - headSize);
        this.ctx.lineTo(x + padding, midY);
        this.ctx.lineTo(x + padding + headSize, midY + headSize);

        this.ctx.stroke();
    }

    drawRightArrow(x: number, y: number, width: number, height: number) {
        const padding = height * 0.3;
        const midY = y + height / 2;
        const headSize = height * 0.2;

        this.ctx.beginPath();

        // Line
        this.ctx.moveTo(x+padding, midY);
        this.ctx.lineTo(x + width - padding, midY);

        // Arrow head
        this.ctx.moveTo(x + width - padding - headSize, midY - headSize);
        this.ctx.lineTo(x + width - padding, midY);
        this.ctx.lineTo(x + width - padding - headSize, midY + headSize);

        this.ctx.stroke();
    }

    fillTextLeft(str: string, x: number, y: number) {
        this.ctx.fillText("" + str, x, y); 
    }
    fillTextCenter(str: string, x: number, y: number) {
        var textWidth = this.ctx.measureText(str).width;
        this.ctx.fillText("" + str, x-textWidth/2, y); 
    }

    fillTextRight(str: string, x: number, y: number) {
        var textWidth = this.ctx.measureText(str).width;
        this.ctx.fillText("" + str, x-textWidth, y); 
    }

    clearCanvas() {
        this.ctx.fillStyle = "lightgray"
        this.ctx.fillRect(0,0,this.width,this.height);
    }

    clearCanvasWhite() {
        this.ctx.fillStyle = "#eee" //custom overwrite for this webpage
        this.ctx.fillRect(0,0,this.width,this.height);
    }

    logLive(text: string) {
        this.ctx.fillStyle = "#fff"
        this.ctx.textAlign = "left"
        this.ctx.fillRect(0,0,200,20);
        this.ctx.fillStyle = "#000"
        this.ctx.fillText(text, 15, 15);
    }

    static getDist(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(getSquaredDist(x1, y1, x2, y2))
    }

    static getSquaredDist(x1: number, y1: number, x2: number, y2: number) {
        return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
    }

}

// Extra Helper Functions 

function getDist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(getSquaredDist(x1, y1, x2, y2))
}

function getSquaredDist(x1: number, y1: number, x2: number, y2: number) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}