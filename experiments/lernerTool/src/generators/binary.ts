import { CardGenerator } from "../cardGenerator";
import { RandomHelper } from "../randomHelper";

export class BinaryGenerator implements CardGenerator {
    private str1: string = "";
    private str2: string = "";

    //0: binary, 1: decimal, 2: hex
    private type1: number = 0;
    private type2: number = 1;
    private difficulty: number = 3;

    constructor() {}

    getFrontBack(): [string, string] {
        const options = [
            [0,1,[0,1,2,3,2,1,0,0]],
            [0,2,[0,0,0,0,0,0,0,1]],
            [1,0,[0,0,1,2,3,4,3,1]],
            [2,0,[0,0,0,0,0,0,0,1]],
            [2,1,[1,2,3,2,1,0,0,0]],
            [1,2,[1,2,3,2,1,0,0,0]],
        ]

        var option = RandomHelper.randomFrom(options);

        this.type1 = (option[0] as number)!
        this.type2 = (option[1] as number)!
        this.difficulty = RandomHelper.randomDistribution((option[2] as number[])!);
        
        const bits: boolean[] = [
            false, false, false, false,
            false, false, false, false
        ];

        if (this.difficulty === 0) {
            for (let i = 0; i < 8; i++) {
                if (Math.random() < 0.5) {
                    bits[i] = !bits[i];
                }
            }
        } else {
            for (let i = 0; i < this.difficulty; i++) {
                const index = Math.floor(Math.random() * 8);
                bits[index] = true;
            }
        }

        if (this.type1 === 0) {
            this.str1 = this.toBinary(bits);
        } else if (this.type1 === 1) {
            this.str1 = this.toDecimal(bits);
        } else if (this.type1 === 2) {
            this.str1 = this.toHex(bits);
        }

        var targetType = "";

        if (this.type2 === 0) {
            this.str2 = this.toBinary(bits);
            targetType = "binary"
        } else if (this.type2 === 1) {
            this.str2 = this.toDecimal(bits);
            targetType = "decimal"
        } else if (this.type2 === 2) {
            this.str2 = this.toHex(bits);
            targetType = "hex";
        }

        

        return ["<h3>" + this.str1 + "</h3><p>in "+targetType+"</p>", "<h3>" + this.str2 + "</h3>"];
    }

    private toBinary(bits: boolean[]): string {
        let result = "";

        for (let i = 0; i < 4; i++) {
            result += bits[i] ? "1" : "0";
        }

        result += " ";

        for (let i = 4; i < 8; i++) {
            result += bits[i] ? "1" : "0";
        }

        return result;
    }

    private toDecimal(bits: boolean[]): string {
        let num = 0;

        for (let i = 0; i < 8; i++) {
            if (bits[7 - i]) {
                num += 1 << i;
            }
        }

        return num.toString();
    }

    private toHex(bits: boolean[]): string {
        const chars = [
            "0", "1", "2", "3",
            "4", "5", "6", "7",
            "8", "9", "a", "b",
            "c", "d", "e", "f"
        ];

        let num1 = 0;

        for (let i = 0; i < 4; i++) {
            if (bits[7 - i]) {
                num1 += 1 << i;
            }
        }

        let num2 = 0;

        for (let i = 4; i < 8; i++) {
            if (bits[7 - i]) {
                num2 += 1 << (i - 4);
            }
        }

        return "0x" + chars[num2]! + chars[num1]!;
    }
}