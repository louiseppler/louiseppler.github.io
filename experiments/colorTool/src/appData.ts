import { Color } from "./color";
import { ColorHistory } from "./colorHistory";

export class AppData {
    private history = new ColorHistory();

    updateTextFieldCallback = () => {};

    colors: Color[] = [];
    selectedColorIndex = 0;

    constructor() {
        var color1 = new Color();
        var color2 = new Color();
        color1.setRandom();
        color2.setRandom();
        this.colors.push(color1, color2);
    }

    getSelectedColor() {
        return this.colors[this.selectedColorIndex];
    }

    undo() {
        var colorStrings = this.history.undo();
        if(colorStrings) this.setColorStrings(colorStrings);
        this.updateTextFieldCallback();

    }
    
    redo() {
        var colorStrings = this.history.redo();
        if(colorStrings) this.setColorStrings(colorStrings);
        this.updateTextFieldCallback();
    }

    private setColorStrings(colorStrings: string[]) {
        var newColors = colorStrings.map((c, i, _) => {
            var parsed_color = Color.parse_hex(c);
            var color = new Color();
            color.setRgb(parsed_color.r,parsed_color.g,parsed_color.b);
            return color;
        })
        this.colors = newColors;
    }

    saveColorState() {        
        var colorStrings = this.colors.map(c => c.getHex());
        this.history.addState(colorStrings);
        this.updateTextFieldCallback();
    }
}