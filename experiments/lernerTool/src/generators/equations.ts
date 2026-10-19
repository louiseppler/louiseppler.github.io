import { CardGenerator } from "../cardGenerator";
import { RandomHelper } from "../randomHelper";

export class EquationsGenerator implements CardGenerator {
   
    constructor() {}

    getFrontBack(): [string, string] {

        var problem_size = 75;

        var x = 0;
        var x_solution = 0;
        var squaredCase = false;
        var r1 = RandomHelper.randomInt(6);
        if(r1 == 0) {
            x_solution = RandomHelper.randomInt(10)+1;
            x = x_solution*x_solution;
            squaredCase = true;
        }
        else {
            x_solution = (RandomHelper.randomInt(15)+1);
            var r11 = RandomHelper.randomInt(4);
            if(r11 == 0) x_solution = -(RandomHelper.randomInt(6)+1);
            x = x_solution;
        }

        var x_mulipier = (RandomHelper.randomInt(problem_size/x_solution)+1);

        //ax + b = cx + d
        var a : number = 0;
        var b : number = 0;
        var c : number = 0;
        var d : number = 0;

        // a = x_mulipier;

        // var split = this.splitIntoTwo(x_solution*x_mulipier);

        // d = split[0]!;
        // b = split[1]!;


        var r2 = RandomHelper.randomInt(2);
        var r3 = RandomHelper.randomInt(2);
        if(r2 == 0) {
            var split1 = this.splitIntoTwo(x_mulipier);
            a = split1[0]!
            c = split1[1]!
            
            if(r3 == 0 && !squaredCase) {
                var split2 = this.splitIntoTwo(x*x_mulipier);
                d = split2[0]!
                b = split2[1]!
            }
            else {
               d = x*x_mulipier;
            }
        }
        else {
            var split1 = this.splitIntoTwo(x*x_mulipier);
            d = split1[0]!
            b = split1[1]!
            
            if(r3 == 0 && !squaredCase) {
                var split2 = this.splitIntoTwo(x_mulipier);
                a = split2[0]!
                c = split2[1]!
            }
            else {
                a = x_mulipier;
            }
        }

        var x_string = "x"
        if(squaredCase) x_string = "x<sup>2</sup>"
        
        var strA = "";
        var strB = "";

        if(a == 0) {
            strA = ""+this.toStringNum(b);
        }
        else if(b == 0) {
            strA = ""+this.toStringX(a, x_string);
        }
        else if(a < 0 || (b >= 0 && RandomHelper.randomBoolean())) {
            if(a < 0) {
                strA = "" + this.toStringNum(b) + " - " + this.toStringX(a*-1, x_string);
            }
            else {
                strA = "" + this.toStringNum(b) + " + " + this.toStringX(a, x_string);
            }
        }
        else {
            if(b < 0) {
                strA = "" + this.toStringX(a, x_string) + " - " + this.toStringNum(b*-1);
            }
            else {
                strA = "" + this.toStringX(a, x_string) + " + " + this.toStringNum(b);
            }
        }

        if(c == 0) {
            strB = ""+this.toStringNum(d);
        }
        else if(d == 0) {
            strB = ""+this.toStringX(c, x_string);
        }
        else if(c < 0 || (d >= 0 && RandomHelper.randomBoolean())) {
            if(c < 0) {
                strB = "" + this.toStringNum(d) + " - " + this.toStringX(c*-1, x_string);
            }
            else {
                strB = "" + this.toStringNum(d) + " + " + this.toStringX(c, x_string);
            }
        }
        else {
            if(d < 0) {
                strB = "" + this.toStringX(c, x_string) + " - " + this.toStringNum(d*-1);
            }
            else {
                strB = "" + this.toStringX(c, x_string) + " + " + this.toStringNum(d);
            }
        }
        
        console.log("x_sol, x_mult" + x_solution + " " + x_mulipier);
        
        console.log("abcd:" + a + " " + b + " " + c + " " + d);
        

        var str1 = "";
        if(RandomHelper.randomBoolean()) {
            str1 = strA + " = " + strB;
        }
        else {
            str1 = strB + " = " + strA;
        }
        
        return ["<h3>" + str1 + "</h3><p>solve for x</p>", "<h3> x = " + x_solution +"</h3>"];
    }

    splitIntoTwo(n: number) : number[] {
        var sign = (n < 0)? -1 : 1;
        var r = RandomHelper.randomInt(n);
        var r2 = RandomHelper.randomInt(n+r);

        //console.log(r + " " + r2);
        
        console.log(n + " -> " + (n+r-r2) + " " + (r-r2));

        return [n+r*sign-r2, r*sign-r2];
    }

    toStringNum(n : number) : string {
        return "" + n
    }

    toStringX(n : number, xString: string) : string {
        if(n == 1) return xString;
        if(n == -1) return "-" + xString;
        return "" + n + xString;
    }
}