import { CanvasHelper } from "./canvas-helper";

export class Slider {

    private isSelected = false;
    private triggeredUpdate = true;

    constructor(
        public canvas: CanvasHelper,
        public name: string,
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public value: number,
        public min: number,
        public max: number,
        public sliderUpdated: () => void //called once at the end
    ) {
        console.assert(max >= min);
    }

    draw() {
        this.canvas.ctx.font = `${Math.round(this.h) * 0.8}px Arial`;

        this.canvas.ctx.fillStyle = "#cac9c9"
        this.canvas.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.canvas.ctx.fillStyle = "#000"
        var t = (this.value-this.min)/(this.max-this.min) * this.w;
        this.canvas.ctx.fillRect(this.x + t -2, this.y, 4, this.h);

        this.canvas.ctx.textAlign = "left";
        this.canvas.ctx.fillText(this.name, this.x+5, this.y+this.h*0.8);
        
        this.canvas.ctx.textAlign = "right";
        this.canvas.ctx.fillText(""+Math.round(this.value), this.x+this.w-5, this.y+this.h*0.8);

        if(this.canvas.mouseIsPressed) {
            if(this.isSelected) {
                this.triggeredUpdate = false;
                //Update value
                var t = (this.canvas.mouseX-this.x)/(this.w) * (this.max-this.min);
                t = Math.min(this.max, t);
                t = Math.max(this.min, t);
                this.value = t;
            }
        }
        else {
            this.isSelected = false;
            if(!this.triggeredUpdate) {                
                this.triggeredUpdate = true;
                this.sliderUpdated();
            }
        }
    }

    mouseDown() {
        if(this.x < this.canvas.mouseX && this.canvas.mouseX < this.x+this.w && 
            this.y < this.canvas.mouseY && this.canvas.mouseY < this.y+this.h) {
                this.isSelected = true;
        }
    }
}