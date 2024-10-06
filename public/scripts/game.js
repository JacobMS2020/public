const socket = io();
var gameRunning = false;
// Game board size
var rows = 20;
var cols = 10;
var username = "Need to add this"

function newGame() {
    document.getElementById("btnReady").style.display = "none";
    // Emit an event when the game starts
    socket.emit('start-game', { playerId: username });

    // Generate the grid
    var board = document.getElementById("game-board2");
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = `square-${row}-${col}`; // Unique ID for each square
            board.appendChild(square);
        }
    }
    board = document.getElementById("game-board1");
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = `square-${row}-${col}`; // Unique ID for each square
            board.appendChild(square);
        }
    }
    gameRunning = true;
}

/* Example: listen for server events (e.g., player moved)
socket.on('player-moved', (data) => {
    console.log('Another player moved:', data);
    // Update the game UI accordingly
});
*/

socket.on('game-over', (data) => {
    gameRunning = false;
    alert("Game Over :(");
});

socket.on('board-update', (data) => {
    console.log(data);
    const board = data.board;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] == 1) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(154,163,255,1) 0%, rgba(0,0,255,1) 52%, rgba(154,163,255,1) 100%)," +
                    "linear-gradient(to bottom, rgba(154,163,255,1) 0%, rgba(0,0,255,1) 52%, rgba(154,163,255,1) 100%)"; // Blue
            } else if (board[row][col] == 2) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(255,163,163,1) 0%, rgba(255,0,0,1) 52%, rgba(255,163,163,1) 100%)," +
                    "linear-gradient(to bottom, rgba(255,163,163,1) 0%, rgba(255,0,0,1) 52%, rgba(255,163,163,1) 100%)"; // Red
            } else if (board[row][col] == 3) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(163,255,163,1) 0%, rgba(0,255,0,1) 52%, rgba(163,255,163,1) 100%)," +
                    "linear-gradient(to bottom, rgba(163,255,163,1) 0%, rgba(0,255,0,1) 52%, rgba(163,255,163,1) 100%)"; // Green
            } else if (board[row][col] == 4) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(255,214,163,1) 0%, rgba(255,165,0,1) 52%, rgba(255,214,163,1) 100%)," +
                    "linear-gradient(to bottom, rgba(255,214,163,1) 0%, rgba(255,165,0,1) 52%, rgba(255,214,163,1) 100%)"; // Orange
            } else if (board[row][col] == 5) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(255,163,228,1) 0%, rgba(212,4,156,1) 52%, rgba(255,163,228,1) 100%)," +
                    "linear-gradient(to bottom, rgba(255,163,228,1) 0%, rgba(212,4,156,1) 52%, rgba(255,163,228,1) 100%)"; // Dark Pink
            } else if (board[row][col] == 6) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(228,163,255,1) 0%, rgba(128,0,128,1) 52%, rgba(228,163,255,1) 100%)," +
                    "linear-gradient(to bottom, rgba(228,163,255,1) 0%, rgba(128,0,128,1) 52%, rgba(228,163,255,1) 100%)"; // Purple
            } else if (board[row][col] == 7) {
                document.getElementById(`square-${row}-${col}`).style.backgroundImage =
                    "linear-gradient(to right, rgba(255,232,163,1) 0%, rgba(255,221,0,1) 52%, rgba(255,232,163,1) 100%)," +
                    "linear-gradient(to bottom, rgba(255,232,163,1) 0%, rgba(255,221,0,1) 52%, rgba(255,232,163,1) 100%)"; // Yellow
            } else {            
                document.getElementById(`square-${row}-${col}`).style.backgroundImage = "none";
            }
        }
    }
});

// Example: move player
// Z = Rotate Left || C = R Right || arrow <,> || space
function movePlayer(direction) {
    console.log(`sending: ${direction}`);
    socket.emit('move-player', { playerId: username, direction: direction });
}

// Example of handling game-related DOM updates
document.addEventListener('keydown', (event) => {
    if (gameRunning) {
        //console.log(event.key);
        if (event.key === 'ArrowLeft') {
            movePlayer('left');
        } else if (event.key === 'ArrowRight') {
            movePlayer('right');
        } else if (event.key === 'z') {
            movePlayer('z');
        } else if (event.key === 'c') {
            movePlayer('c');
        } else if (event.key === ' ' || event.key === 'ArrowDown') {
            movePlayer('space');
        }
    }
});

function test() {
    const username = document.getElementById("username").value;
    // Emit an event when the game starts
    //socket.emit('start-game', { playerId: username });
    divLogin.style.display = "none";

    // Generate the grid
    var board = document.getElementById("game-board2");
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = `square-${row}-${col}`; // Unique ID for each square
            board.appendChild(square);
        }
    }
    board = document.getElementById("game-board1");
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = `square-${row}-${col}`; // Unique ID for each square
            board.appendChild(square);
        }
    }
    gameRunning = true;
}