import { CardGenerator } from "../cardGenerator";

export class SimpleMathGenerator implements CardGenerator {

    private result: number = 0;
    private string: string = "";

    constructor() {}

    getFrontBack(): [string, string] {

        var difficulty = 3;
        var spred = 3;

        const r = Math.random();

        const percentages: number[][] = [
            [],
            [0.6, 0.0, 0.0, 0.0],
            [0.7, 0.2, 0.1, 0.05],
            [0.65, 0.3, 0.175, 0.05],
            [0.75, 0.5, 0.25, 0.075],
            [0.85, 0.7, 0.4, 0.05],
            [0.9, 0.8, 0.45, 0.1],
            [1, 1, 0.5, 0.15]
        ];

        const p = percentages[spred];
        const diff = difficulty - 1;

        if (r > p![0]!) {
            this.nextAddition(diff);
        } else if (r > p![1]!) {
            this.nextSubtraction(diff);
        } else if (r > p![2]!) {
            this.nextMultiplication(diff);
        } else if (r > p![3]!) {
            this.nextDivision(diff);
        } else {
            this.nextPercentage(diff);
        }

        return ["<h3>" + this.string + " =</h3>", "<h3>" + String(this.result) + "</h3>"];
    }

    private nextAddition(diff: number): void {
        const maxs1 = [10, 100, 100, 1000, 1000];
        const maxs2 = [10, 10, 100, 100, 1000];

        const a = Math.floor(Math.random() * maxs1[diff]!) + 1;
        const b = Math.floor(Math.random() * maxs2[diff]!) + 1;

        this.result = a + b;
        this.string = `${a} + ${b}`;
    }

    private nextSubtraction(diff: number): void {
        const maxs1 = [10, 100, 100, 1000, 1000];
        const fac = [2, 8, 4, 8, 4];

        const a = Math.floor(Math.random() * maxs1[diff]!) + 1;
        const b = Math.floor(
            Math.random() * Math.floor(maxs1[diff]! / fac[diff]!)
        ) + 1;

        this.result = a - b;
        this.string = `${a} - ${b}`;
    }

    private nextMultiplication(diff: number): void {
        const maxs1 = [8, 13, 16, 30, 40];
        const maxs2 = [8, 9, 11, 12, 40];

        const a = Math.floor(Math.random() * maxs1[diff]!) + 2;
        const b = Math.floor(Math.random() * maxs2[diff]!) + 2;

        this.result = a * b;
        this.string = `${a} * ${b}`;
    }

    private nextDivision(diff: number): void {
        const maxs1 = [10, 15, 60, 100, 100];
        const maxs2 = [5, 8, 10, 30, 40];

        const a = Math.floor(Math.random() * maxs1[diff]!);
        const b = Math.floor(Math.random() * maxs2[diff]!) + 2;

        this.result = a;
        this.string = `${a * b} / ${b}`;
    }

    private nextPercentage(diff: number): void {
        const maxs1 = [5, 10, 50, 100, 100];

        const a = (Math.floor(Math.random() * maxs1[diff]!) + 2) * 10;
        const b = Math.floor(Math.random() * 14) + 2;

        this.result = Math.floor((a * b) / 10);
        this.string = `${b * 10}% of ${a}`;
    }
}