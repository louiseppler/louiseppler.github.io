import { AppData } from "../appData";
import { CanvasHelper } from "../canvas-helper";
import { Color } from "../color";
import { Slider } from "../slider";
import { ColorView } from "./colorView";

export class MonoColorView implements ColorView {
    private sliders: Slider[]
    private didSelectCircle = false;

    private size: number;
    private offset_y: number;
    private offset_x: number;

    canvas: CanvasHelper
    appData: AppData
    
    constructor(canvas: CanvasHelper, appData: AppData) {
        this.canvas = canvas;
        this.appData = appData;

        this.sliders = [];
        this.sliders.push(new Slider(canvas, "hue", canvas.width*0.2, canvas.height*0.9, canvas.width*0.6, 20, 0, 0, 360, () => {}))
    
        this.size = this.canvas.height*0.7;
        this.offset_y = this.canvas.height*0.15;
        this.offset_x = (this.canvas.width-this.size)/2;

        this.colorsChanged();
    }

    mouseDown() {
        for(var slider of this.sliders) {
            slider.mouseDown();
        }
    }

    draw() {
        var selectedColor = this.appData.getSelectedColor();
        var color_hsv = selectedColor?.getHsv();

        this.canvas.clearCanvasWhite();

        if(color_hsv == undefined) return;

        this.drawColorSquare(color_hsv);
        this.drawColorDots();

        for(var slider of this.sliders) {
            slider.draw();
        }

        var newColor = this.getNewColor(color_hsv);

        selectedColor?.setHsv(newColor.h, newColor.s, newColor.v);
    }

    private drawColorSquare(color_hsv: {h: number ,s: number, v:number}) {
        var steps = 64;
        var s = this.size/steps;

        for(var i = 0; i < steps; i++) {
            for(var j = 0; j < steps; j++) {
                var color_rgb = Color.hsv_to_rgb(color_hsv.h, i/steps*100, 100-j/steps*100);

                this.canvas.ctx.fillStyle = Color.rgb_to_hex(color_rgb.r, color_rgb.g, color_rgb.b);
                this.canvas.ctx.fillRect(this.offset_x+i*s,this.offset_y+j*s,s+1,s+1);
            }
        }
    }

    private drawColorDots() {
        for(var i = 0; i < this.appData.colors.length; i++) {
            var color_hsv = this.appData.colors[i]!.getHsv();
            
            if(color_hsv.v < 50) {
            this.canvas.ctx.fillStyle = "#FFF";
            } 
            else {
                this.canvas.ctx.fillStyle = "#000";
            }

            this.canvas.drawDot(
                this.offset_x + color_hsv.s/100*this.size,
                this.offset_y + (100-color_hsv.v)/100*this.size,
                (this.appData.selectedColorIndex == i)? 5 : 3);
        }
    }

    private getNewColor(color_hsv: {h: number ,s: number, v:number}) {
        var hue = color_hsv.h;
        var sat = color_hsv.s;
        var val = color_hsv.v;
        if(this.canvas.mouseIsPressed ) {
            if(this.offset_x <= this.canvas.mouseX && this.canvas.mouseX <= this.offset_x+this.size &&
                this.offset_y <= this.canvas.mouseY && this.canvas.mouseY <= this.offset_y+this.size
            ) {
                this.didSelectCircle = true;
            }
            if(this.didSelectCircle == true) {
                var new_sat = (this.canvas.mouseX-this.offset_x)/this.size*100;
                var new_val = (this.canvas.mouseY-this.offset_y)/this.size*100;

                new_sat = Math.min(Math.max(0, new_sat), 100);
                new_val = 100-Math.min(Math.max(0, new_val), 100);

                sat = new_sat;
                val = new_val;
            }
        }
        else {
            this.didSelectCircle = false;
        }

        hue = this.sliders[0]!.value;

        return {h: hue, s: sat, v: val};
    }

    colorsChanged() {
        var selectedColor = this.appData.getSelectedColor();

        var color = selectedColor?.getHsv();
        if(color) {
            this.sliders[0]!.value = color.h;
        }
    }
}