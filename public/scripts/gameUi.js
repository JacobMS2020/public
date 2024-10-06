// -------------------------------------- AI Text

const messages = [
    "WELCOME PLAYERS!",
    "I'm going to spit some yarns during the game."
];

let currentMessageIndex = 0;
const textElement = document.getElementById('aiText');

function cycleText() {
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    textElement.textContent = messages[currentMessageIndex];
}

// Change the text every 3 seconds
setInterval(cycleText, 2300);


// ----------------------------------  BUTTON READY:

const colors = ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"];
let currentColorIndex = 0;
const btnReady = document.getElementById('btnReady');

function cycleColors() {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    btnReady.style.backgroundColor = colors[currentColorIndex];
}

// Change the button color every 3 seconds
setInterval(cycleColors, 200);

