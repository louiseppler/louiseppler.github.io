export class RandomHelper {
    static random() {
        return Math.random()
    }

    static randomInt(max: number) : number {
        return Math.floor(Math.random()*max);
    }
    
    static randomBoolean(p = 0.5) : boolean {
        return (Math.random() < p)
    }

    static randomIntRange(min: number, max: number) : number {
        return Math.floor(Math.random()*(max-min))+min;
    }

    static randomDistribution(distribution: number[]) : number {
        const sum = distribution.reduce((acc, num) => acc + num, 0)

        var r = Math.random();
        var acc = 0;
        for(var i = 0; i < distribution.length; i++) {
            acc += distribution[i]!;
            
            if(r < acc/sum) {
                return i;
            }
        }
        return distribution.length-1;
    }  
    
    static randomFrom<T>(array: T[]) : T {
        var r = this.randomInt(array.length);
        return array[r]!;
    }
     
}