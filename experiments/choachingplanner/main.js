function calculate() {

  var div = document.getElementById('outputTable');

  var input = document.getElementById('inputValue');

  var n2 = parseInt(inputValue.value);
  console.log(n2);

  if(n2 <= 2 || isNaN(n2)) {
    div.innerHTML = "Please enter a valid input";
    return;
  }

  if(n2 > 50) {
    div.innerHTML = "Inpute too large";
    return;
  }


  //var n2 = 6;
  var n = n2;
  var addExtra = false;
  if(n % 2 == 0) {
    n = n -1;
    addExtra = true;
  }

  console.log(n, addExtra);

  var numbers = [];
  for(var i = 0; i < n; i++) {
    numbers.push(i);
  }

  console.log(numbers);

  //stores a list of sessions
  //session stores a list of 2 numbers represeting a meeting
  var plan = [];


  for(var i = 0; i < n; i++) {

    var session = [];

    //make the groups
    for(var j = 0; j < n/2-1; j++) {
      session.push([numbers[j],numbers[n-j-1]]);
    }
    if(addExtra) {
      session.push([numbers[Math.floor(n/2)],n]);
    }

    plan.push(session);


    //rotate array
    var first = numbers[0];
    for(var j = 1; j < n; j++) {
      numbers[j-1] = numbers[j];
    }
    numbers[n-1] = first;

  }

  console.log(plan);

  str = "<table>";
  for(var i = 0; i < plan.length; i++) {
    str += "<tr>";
    for(var j = 0; j < plan[i].length; j++) {
      str += "<td>";

      str += (plan[i][j][0]+1) + " and " + (plan[i][j][1]+1);

      str += "</td>";
    }

    str += "</tr>";
  }

  str += "</table>"


  div.innerHTML = str;
};
