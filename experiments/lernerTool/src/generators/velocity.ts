import { CardGenerator } from "../cardGenerator";
import { RandomHelper } from "../randomHelper";

export class VelocityGenerator implements CardGenerator {
   
    constructor() {}

    getFrontBack(): [string, string] {
        
        var targetType = "bla";
        var str1 = ""
        var str2 = "";

        var v = (RandomHelper.randomInt(20)+1)*10;
        var d = 0;
        var distanceType = RandomHelper.randomInt(3);

        if(distanceType == 0) {
            d = (RandomHelper.randomInt(100)+1)*10; //km
        }
        if(distanceType == 1) {
            d = RandomHelper.randomInt(10)+1; //km
        }
        if(distanceType == 2) {
            d = v*RandomHelper.randomInt(12*10)/12;
            d = Math.floor(d*100)/100;
        }

        var t = d/v;

        return ["<h3>" + v + "&thinsp;km/h for " + d + "&thinsp;km </h3><p>how long?</p>", "<h3>" + this.convertTime(t) + "</h3>"];
    }

    convertTime(t: number) {
        if(t > 1/6) {
            var minutes = Math.round((t % 1)*60)
            var hour = Math.floor(t);

            return hour + "&thinsp;h " + minutes + "&thinsp;m";
        }
        else {
            var minutesTotal = t*60;
            var seconds = Math.round((minutesTotal % 1)*60)
            var minutes = Math.floor(minutesTotal);


            return minutes + "&thinsp;m " + seconds + "&thinsp;s";

        }
    }
}