import { AppData } from "../appData";
import { CanvasHelper } from "../canvas-helper";
import { Slider } from "../slider";
import { ColorView } from "./colorView";

export class RGBView implements ColorView {
    private sliders: Slider[]

    canvas: CanvasHelper
    appData: AppData

    
    constructor(canvas: CanvasHelper, appData: AppData) {
        this.canvas = canvas;
        this.appData = appData;

        this.sliders = [];
        this.sliders.push(new Slider(canvas, "red", canvas.width*0.2, canvas.height*0.4, canvas.width*0.6, 20, 0, 0, 255, () => {this.appData.saveColorState()}))
        this.sliders.push(new Slider(canvas, "green", canvas.width*0.2, canvas.height*0.5, canvas.width*0.6, 20, 0, 0, 255, () => {this.appData.saveColorState()}))
        this.sliders.push(new Slider(canvas, "blue", canvas.width*0.2, canvas.height*0.6, canvas.width*0.6, 20, 0, 0, 255, () => {this.appData.saveColorState()}))
    
        this.colorsChanged();
    }

    mouseDown() {
        for(var slider of this.sliders) {
            slider.mouseDown();
        }
    }

    draw() {
        var selectedColor = this.appData.getSelectedColor();

               this.canvas.clearCanvasWhite();
        this.canvas.ctx.fillStyle = selectedColor?.getHex() ?? "#888";
        const factor = 0.15
        this.canvas.ctx.fillRect(this.canvas.width*factor/2, this.canvas.height*factor/2, this.canvas.width*(1-factor), this.canvas.height*(1-factor));

        for(var slider of this.sliders) {
            slider.draw();
        }


        selectedColor?.setRgb(
            this.sliders[0]!.value,
            this.sliders[1]!.value,
            this.sliders[2]!.value,
        );
    }

    colorsChanged() {
        var selectedColor = this.appData.getSelectedColor();

        var color = selectedColor?.getRgb();
        if(color) {
            this.sliders[0]!.value = color.r;
            this.sliders[1]!.value = color.g;
            this.sliders[2]!.value = color.b;
        }
    }
}