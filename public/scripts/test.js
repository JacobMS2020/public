const divLogin = document.getElementById("divLogin");
const socket = io();
var gameRunning = false;
// Game board size
var rows = 20;
var cols = 10;

// ------------------------- SKIP buttons -------------------------
newGame();
// ---------------------------------------------------------------

function newGame() {
    const username = document.getElementById("username").value;
    // Emit an event when the game starts
    //socket.emit('start-game', { playerId: username });
    divLogin.style.display = "none";

    // Generate the grid
    const board = document.getElementById("game-board");
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

socket.on('board-update', (data) => {
    console.log(data);
    const board = data.board;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] == 1) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "blue";
            } else if (board[row][col] == 2) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "red";
            } else if (board[row][col] == 3) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "green";
            } else if (board[row][col] == 4) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "orange";
            } else if (board[row][col] == 5) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "#d4049c"; // Dark Pink
            } else if (board[row][col] == 6) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "purple";
            } else if (board[row][col] == 7) {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "#ffdd00"; // Yellow
            } else {
                document.getElementById(`square-${row}-${col}`).style.backgroundColor = "white";
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