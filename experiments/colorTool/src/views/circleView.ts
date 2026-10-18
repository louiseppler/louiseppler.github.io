import { AppData } from "../appData";
import { CanvasHelper } from "../canvas-helper";
import { Color } from "../color";
import { Slider } from "../slider";
import { ColorView } from "./colorView";

export class CircleColorView implements ColorView {
    private sliders: Slider[] = [];
    private didSelectCircle = false;
    private didTriggerCircleUpdate = true;

    private cx: number;
    private cy: number;
    private r: number;

    canvas: CanvasHelper;
    appData: AppData;

    constructor(canvas: CanvasHelper, appData: AppData) {
        this.canvas = canvas;
        this.appData = appData;

        this.cx = this.canvas.width * 0.5;
        this.cy = this.canvas.height * 0.4;
        this.r = this.canvas.height * 0.2;

        this.sliders = [];
        this.sliders.push(new Slider(canvas, "saturation", canvas.width*0.2, canvas.height*0.75, canvas.width*0.6, 20, 0, 0, 100, () => {this.appData.saveColorState()}));
        this.sliders.push(new Slider(canvas, "value", canvas.width*0.2, canvas.height*0.85, canvas.width*0.6, 20, 0, 0, 100, () => {this.appData.saveColorState()}));


        this.colorsChanged();
    }

    mouseDown() {
        for (const slider of this.sliders) {
            slider.mouseDown();
        }
    }

    draw() {
        const selectedColor = this.appData.getSelectedColor();
        const hsv = selectedColor?.getHsv();
        if (!hsv) return;

        this.canvas.clearCanvasWhite();
        this.drawColorCircle(hsv);
        this.drawColorDots();

        for (const slider of this.sliders) {
            slider.draw();
        }

        const newColor = this.getNewColor(hsv);
        selectedColor?.setHsv(newColor.h, newColor.s, newColor.v);
    }

    mouseUp() {
        
    }

    private drawColorCircle(color_hsv: { h: number; s: number; v: number }) {
        const steps = 96;

        for (let i = 0; i < steps; i++) {
            const rgb = Color.hsv_to_rgb(360 / steps * i, color_hsv.s, color_hsv.v);
            this.canvas.ctx.fillStyle = Color.rgb_to_hex(rgb.r, rgb.g, rgb.b);

            this.canvas.drawRingArc(
                this.cx,
                this.cy,
                this.r * 1.15,
                this.r * 0.85,
                2 * Math.PI / steps * i - Math.PI * 0.5,
                2 * Math.PI / steps * (i + 1) - Math.PI * 0.5
            );
        }
    }

    private drawColorDots() {
        var selectedColor = this.appData.getSelectedColor();
        var selectedColor_hsv = selectedColor?.getHsv();
        for(var i = 0; i < this.appData.colors.length; i++) {
            var color_hsv = this.appData.colors[i]!.getHsv();
            this.canvas.ctx.fillStyle = selectedColor_hsv!.v < 50 ? "#FFF" : "#000";

            const angle = color_hsv.h / 360 * (Math.PI * 2) - Math.PI * 0.5;

            var radius = 3;

            const dx = this.canvas.mouseX - this.cx;
            const dy = this.canvas.mouseY - this.cy;

            if(i == this.appData.selectedColorIndex) {
                radius = 5;
                if(this.isWithinSelection(dx, dy, color_hsv.h)) {
                    radius = 7;
                }
            }

            this.canvas.drawDot(
                this.cx + Math.cos(angle) * this.r,
                this.cy + Math.sin(angle) * this.r,
                radius
            )
        }
       
    }

    private isWithinSelection(dx: number, dy: number, hue: number) {
        var angle = Math.atan2(dy, dx)/Math.PI*180 + 90;
        const mouse_r = dx * dx + dy * dy;

        if(mouse_r < (this.r * 1.15) * (this.r * 1.15)) {}
        else {
            return false;
        }

        angle = (angle + 360) % 360;
        
        if(angle*0.9 < hue && hue < angle*1.1) {
            return true;
            
        }
        else {
            return false;
        }
    }

    private getNewColor(color_hsv: { h: number; s: number; v: number }) {
        let hue = color_hsv.h;
        let sat = this.sliders[0]!.value;
        let val = this.sliders[1]!.value;

        const dx = this.canvas.mouseX - this.cx;
        const dy = this.canvas.mouseY - this.cy;

        if (this.canvas.mouseIsPressed) {
            if (!this.didSelectCircle) {
                if(this.isWithinSelection(dx, dy, hue)) {
                    this.didSelectCircle = true;
                    this.didTriggerCircleUpdate = false;
                }
            }
            if (this.didSelectCircle) {
                const angle = Math.atan2(dy, dx);
                let new_hue = angle / (Math.PI * 2) * 360 + 90 + 360;
                new_hue = new_hue % 360;
                hue = new_hue;
            }
        } else {
            //this.appData.saveColorState();
            this.didSelectCircle = false;
            if(!this.didTriggerCircleUpdate) {
                this.didTriggerCircleUpdate = true;
                this.appData.saveColorState();
            }
        }

        return { h: hue, s: sat, v: val };
    }

    colorsChanged() {
        const selectedColor = this.appData.getSelectedColor();
        const hsv = selectedColor?.getHsv();
        if (hsv) {
            this.sliders[0]!.value = hsv.s;
            this.sliders[1]!.value = hsv.v;
        }
    }
}