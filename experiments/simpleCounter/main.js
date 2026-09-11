var count = 0;
var customButtons = [5,10,20]

function updateCounter(delta) {    
    count += delta;
    console.log("Updating Counter to " + count);

    updateUI();
    saveCounter();
}

function updateButtonsUI() {
    const container = document.getElementById("custom-buttons");
    container.innerHTML = "";

    customButtons.forEach((value, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "btn btn-secondary small-button m-1";
        button.id = `btn-${index + 1}`;
        button.textContent = value;
        button.onclick = () => {updateCounter(value);};

        container.appendChild(button);
    });
}

function updateUI() {
    document.getElementById("counter-display").innerHTML = "" + count;

}

function saveCounter() {
    localStorage.setItem("count", count);
}

function loadCounter() {
    count = Number(localStorage.getItem("count")) || 0;
}

function saveCustomButtons() {
    localStorage.setItem("customButtons", JSON.stringify(customButtons));
}

function loadCustomButtons() {
    const saved = localStorage.getItem("customButtons");

    if (saved) {
        customButtons = JSON.parse(saved);
    }
}

function setup() {
    loadCounter();
    loadCustomButtons();
    updateButtonsUI();
    updateUI();

    console.log("Setup");
    
    document.getElementById("btn-1").onclick = () => {updateCounter(1);};
    document.getElementById("btn-2").onclick = () => {updateCounter(-1);};
}

setup();

// ==================

function adjustButtons() {
    customButtons = []

    var my_text = prompt('Enter Numbers separated by comma or space', '5 10 20');
    
    if (my_text === null) {
        return; 
    }

    arr = my_text.match(/\d+/g);
    for(var i = 0; i < arr.length; i++) {
       console.log("" + arr[i])
       customButtons.push(Number(arr[i]));
    }

    console.log("new custom buttons");
    console.log(customButtons);
    

    saveCustomButtons();
    updateButtonsUI();
    
}

function setNumber() {
    var my_text = prompt('Enter a number', '0');

    if (my_text === null) {
        return; 
    }

    var number = Number(my_text);

    if (confirm(`Set counter to ${number}?`)) {
        count = number;
        updateUI();
        saveCounter();
    }
}