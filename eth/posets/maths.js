var isLowerMat; //ture,false or null

var data = {}

function prepareMaths() {
    console.log("Computing Maths Part");

    console.log("node function");
    console.log(nodeFunc);

    
    cleanEdges();
    computeIsLower();
    computeLeast();
    checkMonotonicity();
    computeFixedPoints();



    console.log("computed data:")
    console.log(data)
}

function checkMonotonicity() {
    const N = nodeCoords.length;

    data.isMonotone = true;

    for(var i = 0; i < N; i++) {
        for(var j = 0; j < N; j++) {
            if(isLowerMat[i][j]) {
                if(isLowerMat[nodeFunc[i]][nodeFunc[j]] != true) {
                    console.log("this edge fails monotonicity from node " + i + " to node " + j);
                    data.isMonotone = false;
                }
            }
        }
    }
}

function compteLFP() {
    for(node of data.fixedPoints) {

    }
}

function isLeastLFP(node1) {
    for(node2 of data.fixedPoints) {
        if(isLowerMat[node1][node2]) {}
    }
}

function computeFixedPoints() {
    const N = nodeCoords.length;

    console.log(nodeFunc);

    arr1 = []
    arr2 = []
    for(var i = 0; i < N; i++) {
        if(nodeFunc[i] == i) {
            arr1.push(i);
        }
        if(isLowerMat[nodeFunc[i]][i]) {
            arr2.push(i);
        }
    }

    data.fixedPoints = arr1;
    data.postFixedPoints = arr2;
}

function computeLeast() {
    const N = nodeCoords.length;

    data.least = null;
    data.greatest = null;

    for(var i = 0; i < N; i++) {
        if(isLeast(i)) {
            data.least = i;
        }
        if(isGreatest(i)) {
            data.greatest = i;
        }
    }
}

function isLeast(node) {
    for(var j = 0; j < nodeCoords.length; j++) {
        if(isLowerMat[node][j] != true) {
            return false;
        }
    }
    return true;
}

function isGreatest(node) {
    for(var j = 0; j < nodeCoords.length; j++) {
        if(isLowerMat[node][j] != false && node != j) {
            return false;
        }
    }
    return true;
}

function cleanEdges() {
    var removedEdge = false;

    //ensures edge.a is always lower than edge.b
    for(var i = 0; i < edges.length; i++) {
        if(nodeCoords[edges[i].a].y > 1+nodeCoords[edges[i].b].y) {}
        else if(nodeCoords[edges[i].a].y+1 < nodeCoords[edges[i].b].y) {
            var temp = edges[i].a;
            edges[i].a = edges[i].b;
            edges[i].b = temp;
        }
        else {
            removedEdge = true;
            edges.splice(i,1);
            i = i-1;
        }
    }
    console.log(edges);

    if(removedEdge) {
        showRemovedEdgeWarning = 500;
    }
}

function computeIsLower() {
    const N = nodeCoords.length;

    //setup matrix
    isLowerMat = [];

    for(var i = 0; i < N; i++) {
        isLowerMat.push([]);
        for(var j = 0; j < N; j++) {
            isLowerMat[i].push(null);
        }
    }

    //assure symmetric
    for(var i = 0; i < N; i++) {
        isLowerMat[i][i] = true;
    }

    //do a dfs for every node
    for(var k = 0; k < N; k++) {
        var visited = [];
        for(var i = 0; i < N; i++) {
            visited.push(false);
        }

        var queue = [k];
        while(queue.length != 0) {
            var node = queue.pop();

            if(visited[node] == true) {
                continue;
            }
            isLowerMat[k][node] = true;

            visited[node] = true;

            for(var edge of edges) {
                if(edge.a == node) {
                    queue.push(edge.b);
                }
            }
        }
    }

    for(var i = 0; i < N; i++) {
        for(var j = 0; j < N; j++) {
            if(isLowerMat[i][j] == true && i != j) {
                isLowerMat[j][i] = false;
            }
        }
    }

    console.log(isLowerMat);
}