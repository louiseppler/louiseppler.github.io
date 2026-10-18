import { CanvasHelper } from "../canvas-helper";

export class UndoButtonView {
    buttonHeight = 30;
    buttonWidth = 40;
    yoffset = 50+2;

    canvas: CanvasHelper
    undoCallback: () => void
    redoCallback: () => void

    constructor(canvas: CanvasHelper, undoCallback: () => void, redoCallback: () => void) {
        this.canvas = canvas;
        this.undoCallback = undoCallback;
        this.redoCallback = redoCallback;
    }

    mouseClick() {
        if(this.yoffset+2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset+2+this.buttonHeight) {
            if(0 < this.canvas.mouseX && this.canvas.mouseX < this.buttonWidth) {
                console.log("Fooo 1");
                
                this.undoCallback();
            }
        }    

        if(this.yoffset+2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset+2+this.buttonHeight) {
            if(this.buttonWidth < this.canvas.mouseX && this.canvas.mouseX < 2*this.buttonWidth) {
                console.log("Fooo 2");
                
               this.redoCallback();
            }
        }
    }

    draw() {
        this.canvas.ctx.fillStyle = "#888";
        this.canvas.ctx.fillRect(0, this.yoffset+2, this.buttonWidth*2, this.buttonHeight);

        if(this.yoffset+2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset+2+this.buttonHeight) {
            if(0 < this.canvas.mouseX && this.canvas.mouseX < this.buttonWidth) {
                this.canvas.ctx.lineWidth = 3;
            }
        }    
        this.canvas.drawLeftArrow(0, this.yoffset+2, this.buttonWidth, this.buttonHeight);
        this.canvas.ctx.lineWidth = 1;


        if(this.yoffset+2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset+2+this.buttonHeight) {
            if(this.buttonWidth < this.canvas.mouseX && this.canvas.mouseX < 2*this.buttonWidth) {
                this.canvas.ctx.lineWidth = 3;
            }
        }
        this.canvas.drawRightArrow(this.buttonWidth, this.yoffset+2, this.buttonWidth, this.buttonHeight);
        this.canvas.ctx.lineWidth = 1;
    }
} 