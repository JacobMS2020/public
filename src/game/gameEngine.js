const { random } = require("colors");
const socketController = require("../controllers/socketController");
let gameInterval;
var gameOver = false;
const TICK_RATE = 1000; // 60 FPS
const rows = 20;
const cols = 10;
var fixedBoard;
var shapeBoard;
var gameBoard;
var activePiece;

class Shape {
    constructor(shapeNumber) {
        this.shape = this.createShapeFromNumber(shapeNumber);
        this.position = { x: 4, y: 0 };
        this.color = shapeNumber;

    }
    createShapeFromNumber(number) {
        const shapes = {
            1: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
            2: [[0, 2, 2], [2, 2, 0]],
            3: [[3, 3, 0], [0, 3, 3]],
            4: [[0, 4, 0], [0, 4, 0], [0, 4, 4]],
            5: [[0, 5, 0], [0, 5, 0], [5, 5, 0]],
            6: [[6, 6, 6], [0, 6, 0]],
            7: [[0, 7, 7], [0, 7, 7]]
        }
        return shapes[number];
    }

    rotateClockwise() {
        this.shape = this.shape[0].map((_, index) => 
            this.shape.map(row => row[index]).reverse()
        );
    }

    rotateAnticlockwise() {
        this.shape = this.shape[0].map((_, index) => 
            this.shape.map(row => row[index])).reverse();
    }
}
class Board {
    constructor(rows, cols) {
        this.rows = rows; // Use 'this' to refer to the instance
        this.cols = cols;
        this.newBoard(); // Store the created board as a property
    }
    newBoard() {
        // Create a 2D array filled with zeros
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }
}

function startGame(data) {
    console.log('GameEngine: startGame');
    // Process game start logic...

    fixedBoard = new Board(rows, cols);
    shapeBoard = new Board(rows, cols);
    gameBoard = new Board(rows, cols);

    // Send the game board back to the client via socket
    const gameBoardData = {
        message: "Game has started!",
        board: gameBoard.board
    };

    // Emit the board data to the client using socketController
    socketController.boardUpdate(gameBoardData);

    activePiece = spawnPiece(); // Function to spawn a new Tetris piece
    gameOver = false;

    // Start the game loop
    gameInterval = setInterval(() => {
        if (!gameOver) {
            onTick();
            updateClient();
        }
    }, TICK_RATE);
};

function onTick() {
    if (activePiece) {
        if (move('down')) {
            console.log("Moved");
        } else {
            lockPiece(activePiece)
        }
    } else {
        spawnPiece();
    }
}

function movePlayer(moveData) {
    move(moveData.direction)
}

function move(direction) {
    if (direction == 'down') {
        offsetRow = 1;
        offsetCol = 0;
    } else if (direction == 'left') {
        offsetRow = 0;
        offsetCol = -1;
    } else if (direction == 'right') {
        offsetRow = 0;
        offsetCol = 1;
    } else if (direction == 'space') {
        offsetRow = 1;
        offsetCol = 0;
    } else if (direction == 'z') {
        // Rotate Shape counter clockwise
        if (activePiece) {
            rotateShape(true)
            return true;
        }
        return false;
    } else if (direction == 'c') {
        // Rotate Shape clockwise
        if (activePiece) {
            rotateShape(false)
            return true;
        }
        return false;
    } else {
        return false;
    }
    var tempBoard = new Board(rows, cols);
    var minRow = Infinity, minCol = Infinity;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (shapeBoard.board[row][col]) {
                
                try {
                    if (fixedBoard.board[row + offsetRow][col + offsetCol]) {
                        return false;
                    } else if (row + offsetRow < 0 || col + offsetCol < 0 || row + offsetRow > rows - 1 || col + offsetCol > cols - 1) {
                        return false;
                    } else {
                        // Update the minimum row and column
                        if (row < minRow) {minRow = row};
                        if (col < minCol) {minCol = col};
                        tempBoard.board[row + offsetRow][col + offsetCol] = shapeBoard.board[row][col]
                    }
                } catch (e) {
                    return false;
                }
            }
        }
    }


    // Set the position to the top-left corner based on minRow and minCol
    activePiece.position = { 
        x: minCol + offsetCol, 
        y: minRow + offsetRow 
    };
    console.log(activePiece.position);
    shapeBoard.board = tempBoard.board;

    updateClient();
    return true;
}


function updateClient() {
    updateGameBoard();
    socketController.boardUpdate(gameBoard);
}

function rotateShape(antiClockwise) {
    console.log("Before Rotation:", activePiece);
    // Don't rotate the square.
    if (activePiece.color == 7) {
        return false;
    }
    
    // Rotate the shape clockwise or counterclockwise
    if (antiClockwise) {
        activePiece.rotateAnticlockwise();
    } else {
        activePiece.rotateClockwise();
    }
    
    console.log("After Rotation:", activePiece);

    // Check if the new position is valid
    if (!isValidPosition(activePiece.shape, activePiece.position)) {
        // If invalid, revert the rotation
        if (antiClockwise) {
            activePiece.rotateClockwise(); // Revert
        } else {
            activePiece.rotateAnticlockwise(); // Revert
        }
        return false; // Rotation failed due to invalid position
    }

    // Update shapeBoard with new rotation
    loadShapeIntoBoard();
    updateClient(); // Update the display
    return true; // Successful rotation
}


function loadShapeIntoBoard() {
    // Clear the current shape on the board first (if necessary)
    shapeBoard.newBoard();

    // Load the new rotated shape into the board
    const { x, y } = activePiece.position;
    for (let row = 0; row < activePiece.shape.length; row++) {
        for (let col = 0; col < activePiece.shape[row].length; col++) {
            if (activePiece.shape[row][col] !== 0) { // Non-empty cell
                shapeBoard.board[y + row][x + col] = activePiece.shape[row][col]; // Add shape to board
            }
        }
    }
}

function isValidPosition(shape, position) {
    const { x, y } = position;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] !== 0) { // Non-empty cell
                const newRow = y + row;
                const newCol = x + col;
                // Check if the new position is out of bounds or colliding
                if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || fixedBoard.board[newRow][newCol]) {
                    return false;
                }
            }
        }
    }
    return true; // Valid position
}


function updateGameBoard() {
    gameBoard = new Board(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Merge values from shapeBoard to fixedBoard if greater than 0
            if (shapeBoard.board[row][col] > 0) {
                gameBoard.board[row][col] = shapeBoard.board[row][col]; // You can set it to 1 or any other value as needed
            } else if (fixedBoard.board[row][col] > 0) {
                gameBoard.board[row][col] = fixedBoard.board[row][col];
            }
        }
    }
}


// Function to spawn a new piece (example)
function spawnPiece() {
    // Generate a new piece with its shape and initial position
    // shape properties    

    const piece = new Shape(getRandomInt(1, 7));
    console.log(piece);

    shapeBoard.newBoard();

    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                shapeBoard.board[piece.position.y + row][piece.position.x + col] = piece.color; // Lock piece into board
            }
        }
    }
    activePiece = piece;
    updateClient();
    
    if (!move('down')) {
        console.log("GE: Game Over");
        gameOver = true;
        sendGameOver();
    }

    return
}

// Function to lock a piece into the board
function lockPiece(board, piece) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Merge values from shapeBoard to fixedBoard if greater than 0
            if (shapeBoard.board[row][col] > 0) {
                fixedBoard.board[row][col] = shapeBoard.board[row][col]; // You can set it to 1 or any other value as needed
            }
        }
    }
    for (let row = 0; row < rows; row++) {
        var fullLine = true;
        for (let col = 0; col < cols; col++) {
            if (fixedBoard.board[row][col] == 0) {
                fullLine = false;
                break
            }
        }
        if (fullLine) {
            fixedBoard.board.splice(row, 1);
            fixedBoard.board.unshift(new Array(cols).fill(0));
        }
    }
    // Clear shapeBoard after merging
    shapeBoard.newBoard(); // Reset shapeBoard to be empty
    activePiece = false;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendGameOver() {
    socketController.gameOver();
}

module.exports = { movePlayer, startGame };
