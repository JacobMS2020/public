const gameEngine = require('../game/gameEngine');
let gameSocket = null;  // Store the socket globally

module.exports = (socket) => {
    console.log('Game socket connected');

    gameSocket = socket;  // Save the socket instance
    // Event when the client starts the game
    socket.on('start-game', (data) => {
        console.log('Game started with data:', data);
        gameEngine.startGame(data);
    });

    // Event when a player makes a move in the game
    socket.on('move-player', (moveData) => {
        console.log('Player moved:', moveData);
        // Handle the player movement logic here
        gameEngine.movePlayer(moveData);
    });

    // Add more game-related events as needed
};

// Function to emit a board update back to the client
exports.boardUpdate = (data) => {
    if (gameSocket) {
        gameSocket.emit('board-update', data);  // Emit event to the client
        console.log('Sent board update to client');
    }
};

exports.gameOver = () => {
    if (gameSocket) {
        const data = 'Game Over';
        gameSocket.emit('game-over', data);  // Emit event to the client
        console.log('Sent "game-over" to client');
    }
}