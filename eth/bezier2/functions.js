function funkyTentBasis(N, t) {
  var sol = [];
  for(var i = 0; i < N; i++) {
    if(i-1 > t) {
      sol.push(0);
    }
    else if(i > t) {
      var tt = (t % 1.0);
      tt = tt*tt;
      sol.push( tt);
    }
    else if(i+1 > t) {
      var tt = (t % 1.0);
      tt = tt*tt;
      sol.push(1- tt);
    }
    else {
      sol.push(0);
    }
  }

  return sol;
}


/*
Tent Basis function for piece wise linear interpolation
*/
function tentBasis(N, t) {
  var sol = [];
  for(var i = 0; i < N; i++) {
    if(i-1 > t) {
      sol.push(0);
    }
    else if(i > t) {
      sol.push( (t % 1.0));
    }
    else if(i+1 > t) {
      sol.push(1- (t % 1.0));
    }
    else {
      sol.push(0);
    }
  }

  return sol;
}


/*
Bernstein Basis
NumCS script: 5.5.2.8, p423
Scrpt Fabian: 3.45, p112
https://en.wikipedia.org/wiki/Bernstein_polynomial
*/
function bernsteinBasis(N, tt) {
  const n = N-1;
  const t = tt/n; //this basis goes from 0 to 1 for some reason
  //const t = tt;

  var sol = [];
  for(var i = 0; i <= n; i++) {
    const val = choose(n, i)*Math.pow(t,i)*Math.pow(1-t,n-i);
    sol.push(val);
  }

  return sol;
}



function choose(n, k) {
    if (k == 0) { return 1;}
    return (n * choose(n - 1, k - 1)) / k;
}
