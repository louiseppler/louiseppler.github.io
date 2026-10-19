import { CardGenerator } from "../cardGenerator";
import { RandomHelper } from "../randomHelper";

export class CapitalDistances implements CardGenerator {
   
    constructor() {}

    capitals = [
        ["Vienna", 48.2082, 16.3738],
        ["Brussels", 50.8503, 4.3517],
        ["Sofia", 42.6977, 23.3219],
        ["Zagreb", 45.8150, 15.9819],
        ["Nicosia", 35.1856, 33.3823],
        ["Prague", 50.0755, 14.4378],
        ["Copenhagen", 55.6761, 12.5683],
        ["Tallinn", 59.4370, 24.7536],
        ["Helsinki", 60.1699, 24.9384],
        ["Paris", 48.8566, 2.3522],
        ["Berlin", 52.5200, 13.4050],
        ["Athens", 37.9838, 23.7275],
        ["Budapest", 47.4979, 19.0402],
        ["Reykjavik", 64.1466, -21.9426],
        ["Dublin", 53.3498, -6.2603],
        ["Rome", 41.9028, 12.4964],
        ["Riga", 56.9496, 24.1052],
        ["Vilnius", 54.6872, 25.2797],
        ["Luxembourg", 49.6116, 6.1319],
        ["Valletta", 35.8989, 14.5146],
        ["Chisinau", 47.0105, 28.8638],
        ["Monaco", 43.7384, 7.4246],
        ["Podgorica", 42.4304, 19.2594],
        ["Amsterdam", 52.3676, 4.9041],
        ["Skopje", 41.9973, 21.4280],
        ["Oslo", 59.9139, 10.7522],
        ["Warsaw", 52.2297, 21.0122],
        ["Lisbon", 38.7223, -9.1393],
        ["Bucharest", 44.4268, 26.1025],
        ["San Marino", 43.9424, 12.4578],
        ["Belgrade", 44.7866, 20.4489],
        ["Bratislava", 48.1486, 17.1077],
        ["Ljubljana", 46.0569, 14.5058],
        ["Madrid", 40.4168, -3.7038],
        ["Stockholm", 59.3293, 18.0686],
        ["Bern", 46.9480, 7.4474],
        ["Ankara", 39.9334, 32.8597],
        ["Kyiv", 50.4501, 30.5234],
        ["London", 51.5074, -0.1278],
        ["Vatican City", 41.9029, 12.4534]
    ];

    getFrontBack(): [string, string] {
        var i = RandomHelper.randomInt(this.capitals.length);
        var j = RandomHelper.randomInt(this.capitals.length-1);
        if(j >= i) j += 1;

        var distance = this.distanceKm(
            (this.capitals[i]![1] as number),
            (this.capitals[i]![2] as number),
            (this.capitals[j]![1] as number),
            (this.capitals[j]![2] as number))

       distance = Math.round(distance/10)*10;
     
        return ["<h3>" + this.capitals[i]![0] + " <span style=\"font-size: medium;  font-weight: normal;\">to</span> " + this.capitals[j]![0] + "</h3><p>How many kilometers?", "<h3>" + distance + "&thinsp;km</h3>"];
    }

    distanceKm(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
        ): number {
        const R = 6371; // Earth radius in km

        const toRadians = (degrees: number) => degrees * Math.PI / 180;

        lat1 = toRadians(lat1);
        lon1 = toRadians(lon1);
        lat2 = toRadians(lat2);
        lon2 = toRadians(lon2);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
        }

}