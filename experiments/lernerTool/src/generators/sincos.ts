import { CardGenerator } from "../cardGenerator";
import { RandomHelper } from "../randomHelper";

export class SinCosGenerator implements CardGenerator {

    private j = 0;

    //<mo>-</mo><mfrac><mn>3<mi>π</mi></mn><mn>2</mn></mfrac>

    private anglesA = ["-90°","-60°","-45°","-30°","0°","30°","45°","60°","90°","120°","135°","150°","180°","210°","225°","240°","270°","300°","315°","330°","360°"]
    private anglesB = [
    "<mo>-</mo><mfrac><mi>π</mi><mn>2</mn></mfrac>",
    "<mo>-</mo><mfrac><mi>π</mi><mn>3</mn></mfrac>",
    "<mo>-</mo><mfrac><mi>π</mi><mn>4</mn></mfrac>",
    "<mo>-</mo><mfrac><mi>π</mi><mn>6</mn></mfrac>",
    "<mn>0</mn>",
    "<mfrac><mi>π</mi><mn>6</mn></mfrac>",
    "<mfrac><mi>π</mi><mn>4</mn></mfrac>",
    "<mfrac><mi>π</mi><mn>3</mn></mfrac>",
    "<mfrac><mi>π</mi><mn>2</mn></mfrac>",
    "<mfrac><mn>2<mi>π</mi></mn><mn>3</mn></mfrac>",
    "<mfrac><mn>3<mi>π</mi></mn><mn>4</mn></mfrac>",
    "<mfrac><mn>5<mi>π</mi></mn><mn>6</mn></mfrac>",
    "<mi>π</mi>",
    "<mfrac><mn>7<mi>π</mi></mn><mn>6</mn></mfrac>",
    "<mfrac><mn>5<mi>π</mi></mn><mn>4</mn></mfrac>",
    "<mfrac><mn>4<mi>π</mi></mn><mn>3</mn></mfrac>",
    "<mfrac><mn>3<mi>π</mi></mn><mn>2</mn></mfrac>",
    "<mfrac><mn>5<mi>π</mi></mn><mn>3</mn></mfrac>",
    "<mfrac><mn>7<mi>π</mi></mn><mn>4</mn></mfrac>",
    "<mfrac><mn>11<mi>π</mi></mn><mn>6</mn></mfrac>",
    "<mn>2</mn><mi>π</mi>"
    ];
    
    //private solutions = ["0","1/2","1/√2","√3/2","1"]
    private solutions = [
            "<mn>0</mn>",
            "<mfrac><mn>1</mn><mn>2</mn></mfrac>",
            "<mfrac><mn>1</mn><msqrt><mn>2</mn></msqrt></mfrac>",
            "<mfrac><msqrt><mn>3</mn></msqrt><mn>2</mn></mfrac>",
            "<mn>1</mn>"
    ]

    constructor() {}

    getFrontBack(): [string, string] {

        var front = "";
        var back = "";

        var i = 0;

        if(RandomHelper.randomBoolean()) {
            i = RandomHelper.randomInt(5)+4;
        }
        else {
            i = RandomHelper.randomInt(this.anglesA.length);
        }
                
        if(RandomHelper.randomBoolean()) {  //COSINUS
            if(RandomHelper.randomBoolean()) {
                front = `<math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>cos</mi><mo>(</mo><mn>${this.anglesA[i] ?? ""}</mn><mo>)</mo></math>`;
            }
            else {
                front = `<math xmlns="http://www.w3.org/1998/Math/MathML">
                    <mi>cos</mi><mo>(</mo>${this.anglesB[i] ?? ""}<mo>)</mo>
                    </math>`;
            }
    
            var sol_index = (i % 8);
            if(sol_index >= 5) sol_index = 8-sol_index;

            var is_negative = Math.floor(i/8) % 2 == 1
            if((i % 8) == 0) is_negative = false; //case -0
        }
        else { //SINUS
            if(RandomHelper.randomBoolean()) { 
                front = `<math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>sin</mi><mo>(</mo><mn>${this.anglesA[i] ?? ""}</mn><mo>)</mo></math>`;
            }
            else {
                front = `<math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>sin</mi><mo>(</mo>${this.anglesB[i] ?? ""}<mo>)</mo>
                </math>`;
            }
           
            var sol_index = ((i+12) % 8);
            if(sol_index >= 5) sol_index = 8-sol_index;

            var is_negative = Math.floor((i+12)/8) % 2 == 1
            if(((i+12) % 8) == 0) is_negative = false; //case -0

        }

        var sign = "";
        if(is_negative) sign = `<mo>-</mo>`
        back = `<math xmlns="http://www.w3.org/1998/Math/MathML">
            ${sign}${this.solutions[sol_index] ?? ""}
                </math>`;
    
        return ["<h3>" + front + " =</h3>", "<br><h2>" + back + "</h2>"];
    }

             
        //
}
