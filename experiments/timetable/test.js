function test1() {
    //Test basic

    var pTagHeight = 10;
    var distanceFactor = 4;
    columnTimes = [[{timestamp: 0},{timestamp: 10},{timestamp: 20},{timestamp: 30}]]
    expected = [[0, distanceFactor*10, distanceFactor*20, distanceFactor*30]]

    var result = computeHeights(columnTimes, pTagHeight, distanceFactor);

    compareResult(result, expected);
}

function test2() {
    //Test using pTagHeight

    var pTagHeight = 10;
    var distanceFactor = 1;
    columnTimes = [[{timestamp: 0},{timestamp: 5},{timestamp: 20},{timestamp: 25}]]
    expected = [[0, 10, 25, 35]]

    var result = computeHeights(columnTimes, pTagHeight, distanceFactor);

    compareResult(result, expected);
}

function test3() {
    //Test two columns

    var pTagHeight = 10;
    var distanceFactor = 1;
    columnTimes = [[{timestamp: 0},{timestamp: 5}], [{timestamp: 20},{timestamp: 30}]]
    expected = [[0,10],[25,35]]

    var result = computeHeights(columnTimes, pTagHeight, distanceFactor);

    compareResult(result, expected);
}

function test3() {
    //Test two columns (pTagHeight on only one side)

    var pTagHeight = 10;
    var distanceFactor = 1;
    columnTimes = [[{timestamp: 5}], [{timestamp: 7},{timestamp: 10}]]
    expected = [[5],[7,17]]

    var result = computeHeights(columnTimes, pTagHeight, distanceFactor);

    compareResult(result, expected);
}

function compareResult(result, expected) {
    for(var i = 0; i < result.length; i++) {
        for(var j = 0; j < result[i].length; j++) {
            console.assert(result[i][j].height == expected[i][j]);
            
        }
    }
    console.log("Compare done");
}

console.log("RUNNING TESTS");

// test1();
// test2();
// test3();
