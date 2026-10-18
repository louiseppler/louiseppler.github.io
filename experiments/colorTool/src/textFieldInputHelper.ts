import { AppData } from "./appData";
import { Color } from "./color";
import { ColorView } from "./views/colorView";

export class TextFieldInputHelper {

    appData: AppData;
    colorView: ColorView;

    constructor(appData: AppData, colorView: ColorView) {
        this.appData = appData;
        this.colorView = colorView;

    }

    setString() {
        console.log("setting string");
        
        var string = "";
        for(const color of this.appData.colors) {
            string += color.getHex() + "\n";
        }

        var textField = (document.getElementById("text-color-input") as HTMLInputElement)
        textField.value = string;
    }
    
    readStringInput() {
        var textField = (document.getElementById("text-color-input") as HTMLInputElement)

        var hexStrings = this.findHexColors(textField.value);

        
        console.log("reading text input");
        
        console.log(hexStrings);
        

        this.appData.colors = [];
        for(const text of hexStrings) {
            var rgb = Color.parse_hex(text);
            var color = new Color();
            color.setRgb(rgb.r, rgb.g, rgb.b);
            console.log("Adding color ");
            console.log(rgb);
            
            
            this.appData.colors.push(color);
        }
        this.colorView.colorsChanged();
    }

    private findHexColors(text: string): string[] {
        const regex = /#[0-9abcdefABCDEF]{6}/g;
        const matches = text.match(regex);
        return matches || [];
    }

}