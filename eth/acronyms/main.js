list = ["Random","Words","Foo","Bar","Hello","World","Something"];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function textInputUpdate() {
    await sleep(100); //add delay, so textfields update smoothly, then data comes
    main();
}

function getFilters() {
    cats = [];
    if(document.getElementById("checkbox-ca").checked) {
        cats.push("spca");
        cats.push("ddca");
        cats.push("compsys");
    }
    if(document.getElementById("checkbox-cn").checked) {
        cats.push("cn");
    }
    if(document.getElementById("checkbox-infsek").checked) {
        cats.push("infsek");
    }
    if(document.getElementById("checkbox-ml").checked) {
        cats.push("iml");
    }

    return cats;
}

function clearFilters() {
    document.getElementById("checkbox-ca").checked = false;   
    document.getElementById("checkbox-cn").checked = false;   
    document.getElementById("checkbox-infsek").checked = false;   
    document.getElementById("checkbox-ml").checked = false;   

    main();
}


function checkCats(catsA, catsB) {
    for(elm of catsA) {
        if(catsB.includes(elm)) {
            return true;
        }
    }
    return false;
}

function main() {
    var input = document.getElementById("main-input").value;

    var cats = getFilters();

    console.log(cats);

    //filter the list    
    currList = [];
    secondList = [];
    for(word of data) {

        if(word.acronymFiltered.includes(input.toUpperCase().replace(/[^0-9a-z]/gi, ''))) {
            if(cats.length == 0|| checkCats(word.cats, cats)) {
                currList.push(word);
            }
            else {
                secondList.push(word);
            }
        }

    }

    document.getElementById("output-div").innerHTML = "";

    outputStr = "";

    for(word of currList) {
        temp = "";
        temp += "<div>";
        temp += "<p><span class=\"ac\">" + word.acronym + "</span> " + word.name +"</p>";
        temp += "<p class=\"cats\">" + word.cats + "</p>";
        temp += "<p class=\"des\">" + word.description + "</p>";
        temp += "<hr>";
        temp += "</div>";
        
        outputStr += temp;
    }

    outputStr += "";

    if(secondList.length == 1) {
        outputStr += "<p class=\"des\"> " + secondList.length + " more entry found. <a href=\"javascript:clearFilters()\"> clear filters?</a></des> ";
    }
    if(secondList.length > 1) {
        outputStr += "<p class=\"des\"> " + secondList.length + " more entries found. <a href=\"javascript:clearFilters()\"> clear filters?</a></des> ";
    }

    console.log(currList);
    console.log(outputStr);
    
    document.getElementById("output-div").innerHTML = outputStr;
} 

function setText(str) {
    document.getElementById("main-input").value = str;
    textInputUpdate()
}

let params = new URLSearchParams(location.search);

if(params.get('search') != null) {
    document.getElementById("main-input").value = params.get('search');
}

textInputUpdate()

//do uppercasing at beginning for slightly better performance
for(word of data) {
    word.acronymFiltered = word.acronym.toUpperCase().replace(/[^0-9a-z]/gi, '')
}