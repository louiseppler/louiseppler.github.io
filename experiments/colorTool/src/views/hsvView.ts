import { AppData } from "../appData";
import { CanvasHelper } from "../canvas-helper";
import { Slider } from "../slider";
import { ColorView } from "./colorView";

export class HSVView implements ColorView {
    private sliders: Slider[]

    canvas: CanvasHelper
    appData: AppData
    
    constructor(canvas: CanvasHelper, appData: AppData) {
        this.canvas = canvas;
        this.appData = appData;

        this.sliders = [];
        this.sliders.push(new Slider(canvas, "hue", canvas.width*0.2, canvas.height*0.4, canvas.width*0.6, 20, 0, 0, 360, () => {this.appData.saveColorState()}))
        this.sliders.push(new Slider(canvas, "saturation", canvas.width*0.2, canvas.height*0.5, canvas.width*0.6, 20, 0, 0, 100, () => {this.appData.saveColorState()}))
        this.sliders.push(new Slider(canvas, "lightness", canvas.width*0.2, canvas.height*0.6, canvas.width*0.6, 20, 0, 0, 100, () => {this.appData.saveColorState()}))
    
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
        //this.canvas.ctx.fillRect(0, 25, this.canvas.width, this.canvas.height);


        for(var slider of this.sliders) {
            slider.draw();
        }

        selectedColor?.setHsv(
            this.sliders[0]!.value,
            this.sliders[1]!.value,
            this.sliders[2]!.value,
        );
    }

    colorsChanged() {
        var selectedColor = this.appData.getSelectedColor();

        var color = selectedColor?.getHsv();
        if(color) {
            this.sliders[0]!.value = color.h;
            this.sliders[1]!.value = color.s;
            this.sliders[2]!.value = color.v;
        }
    }
}