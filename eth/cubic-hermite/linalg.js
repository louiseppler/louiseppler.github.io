//matrix format: first row, then column
//assuming square matrix
function matrixSolve(A, b) {

  n = A.length;

  // console.log(n);

  //forward propagation
  for(var i = 0; i < n; i++) {
    // console.log("---");
    // printSystem(A,b);
    for(var j = i+1; j < n; j++) {
      var fact = A[j][i]/A[i][i];

      b[j] = b[j]-b[i]*fact;
      for(var k = i; k < n; k++) {
        A[j][k] = A[j][k]-A[i][k]*fact;
      }
    }
  }

  //backwards propagation
  for(var i = n-1; i >= 0; i--) {
    // console.log("---");
    // printSystem(A,b);
    for(var k = i-1; k >= 0; k--) {
      var fact = A[k][i]/A[i][i];
      b[k] = b[k]-b[i]*fact;
      A[k][i] = 0;
    }
  }

  //normalise
  for(var i = 0; i < n; i++) {
    b[i] = b[i]/A[i][i];
    A[i][i] = 1;
  }

  // console.log("---")
  // printSystem(A,b);
  //
  // console.log("done");

  return b;
}

function printSystem(A,b) {

  n = A.length;

  for(var i = 0; i < n; i++) {
    str = "";
    for(var j = 0; j < n; j++) {
      str += Math.round(A[i][j]*10)/10 + " ";
    }
    str += " | " + b[i];
    console.log(str);
  }
}



//matrixSolve([[2,4],[2,3]],[5,2]);
//matrixSolve([[1,1,1],[0,2,5],[2,5,-1]],[6,-4,27]);
