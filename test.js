console.log('GameEngine: startGame');
    // Process game start logic...
    rows = 20;
    cols = 10;
    const board = Array.from({ length: rows }, () => Array(cols).fill(0));

    board[19][0] = Array(5).fill(4);
    console.log(board);