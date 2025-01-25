var numbers = ["", 0,25,50,75,100, 3, 6];
var target = 0;
var minDist = 100000;
var minPoints = 1000000;
var path = "";

var queue = [];

var solutionComputed = false;

var temp = true;
var temp2 = true;

var temp3 = false;
var visited = new Set();

function resetAlgorithm() {
    path = ""
    minDist = 100000;
    minPoints = 1000000;
    target = 0;
    solutionComputed = false;
    temp = true;
    temp2 = true;
    temp3 = false;
}

var start;
var maxLenght = 0;

function computeSolution() {
    if(target == 0) return;
    queue = [];

    console.log("Computing with " + numbers + " to target " + target);
    
    queue.push(numbers);

    start = new Date();

    function doChunk() {
        console.log("computing one chunck");
        
        var cnt = 0;
        while(queue.length > 0 && cnt < 10000) {  
            if(queue.length > maxLenght) maxLenght = queue.length;

            // queue.sort(function(a,b){
            //     return a[1]-b[1];
            //   });

            cnt ++;

            var current;
            if(queue.length > 10000 || temp3) {
                var current = queue.shift();
                temp3 = true;
            }
            else {

                var minloc = 100000;
                var indexloc = 0;
                for(var i = 0; i <queue.length; i++) {
                    if(queue[i][1] < minloc) {
                        minloc = queue[i][1];
                        indexloc = i;
                    }
                }
                current = queue[0];
                queue.splice(0, 1);
            }

   


            //console.log(current);
            
            
            for(var i = 2; i < current.length; i++) {
                for(var j = i+1; j < current.length; j++) {            
                    var a = current[i];
                    var b = current[j];
    
                    var newNumbers = structuredClone(current)
                    newNumbers.splice(j, 1);
                    newNumbers.splice(i, 1);
    
                    var points = 0;
                    
                    if(a <= 10 || b <= 10) {
                        points = 1;
                    }
                    else {
                        points = 2
                    }
                    checkTarget(newNumbers, a+b, a + "+" + b + " = " + (a+b) + "\n", points);
    
                    if(a > b) {
                        checkTarget(newNumbers, a-b, a + "-" + b + " = " + (a-b) + "\n", points);
                    }
                    else {
                        checkTarget(newNumbers, b-a, b + "-" + a + " = " + (b-a) + "\n", points);
                    }

                    if(a != 1 && b != 1) {
                        if(a <= 10 && b <= 10) {
                            points = 1;
                        }
                        else if(a <= 10 || b <= 10) {
                            points = 2;
                        }
                        else if(a % 25 == 0 || b % 25 == 0) {
                            points = 3;
                        }
                        else {
                            points = 10;
                        }

                        checkTarget(newNumbers, a*b, a + "*" + b + " = " + (a*b) + "\n", points);
                    }

                    if(a <= 10 && b <= 10) {
                        points = 1;
                    }
                    else if(a > 100 || b > 100) {
                        points = 20;
                    }
                    else if(a <= 10 || b <= 10) {
                        points = 3;
                    }
                    else {
                        points = 20;
                    }
    
                    if(a > b && b != 1 && a/b%1 == 0) {
                        checkTarget(newNumbers, a/b, a + "/" + b + " = " + (a/b) + "\n", points)
                    }
                    else if(b > a && a != 1 && b/a%1 == 0) {
                        checkTarget(newNumbers, b/a, b + "/" + a + " = " + (b/a) + "\n", points);
                    }
                    
                }
            }
        }    
        if(queue.length > 0) {
            setTimeout(doChunk, 1);
        }
        else {
            var end = new Date();

            console.log("Total computation time: " + (end-start) + " milliseconds");
        
            console.log("target " + target);
        
            console.log("Done");
            console.log("With dist " + minDist);
            console.log("Solution: " + path);   
            console.log("Points: " + minPoints);
            console.log("max length: " + maxLenght);
            
            
            
            solutionComputed = true;
        }
    }    
    setTimeout(doChunk, 1);
}

function checkTarget(newNumbers, number, operation, points) {    
    var array = structuredClone(newNumbers);
    array[0] += operation;
    array[1] += points;

    var dist = Math.abs(number-target);

    if(dist < minDist) {
        minPoints = 1000000;
        path = array[0];
        minPoints = array[1];
        minDist = dist;
    }
    else if(dist == minDist && array[1] < minPoints) {
        console.log("------");
        console.log(path);
        
        console.log("------ Found nicer calculation - before: " + minPoints);
        
        path = array[0];
        minPoints = array[1];
        minDist = dist;
    }
    if(dist == 0) {
        if(temp2) {
            temp2 = false;
        
            var end = new Date();
            console.log("Would have been done with (first solution) " + (end-start) + " milliseconds");
            console.log("Solution: " + path);   
            console.log("Points: " + minPoints);
            
        }

        if(temp && minPoints < 7) {
            temp = false;
        
            var end = new Date();
            console.log("Would have been done with (less then 7 points) " + (end-start) + " milliseconds");
            console.log("Solution: " + path);   
            console.log("Points: " + minPoints);
            
        }
        
        //found target, does with searching
        queue = [];
    }


    array.push(number);
    
    if(minDist == 0 && array[1] >= minPoints) {}
    else {
        queue.push(array);
    }
    //queue.splice(0,0, array);

    // var array2 = structuredClone(newNumbers);
    // array2.slice(2);
    // if(visited.has) {
    //     visited.add(array2)
    //     queue.push(array);
    // }
}
