const Gameboard = (() => {
  let gameboard = Array(9).fill(' ');
  const getGameboard = () => gameboard;
  const updateGameboard = (index, playerMark) => {
    if (gameboard[index] === ' ') {
      gameboard[index] = playerMark;
      return true;
    }
    return false;
  };
  const resetGameboard = () => {
    gameboard = Array(9).fill(' ');
  };

  return { getGameboard, updateGameboard, resetGameboard};
})();

const Player = (name, mark) => {
  let wins = 0;

  const incrementWins = () => {
    wins++;
  };

  const getWins = () => {
    console.log(wins);
    return wins;
  }
  
  return {name, mark, incrementWins, getWins};
};

const Game = (() => {
  let currentPlayer;
  let gameActive = false;
  let round = 1;
  const players = [
    Player('', 'X'),
    Player('', '0')
  ];

  const togglePlayer = (currentPlayer) => {
    return currentPlayer === players[0] ? players[1] : players[0];
  };

  const winningCombinations = [
    [0 ,1 ,2], [3, 4, 5], [6, 7 ,8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkForWin = (mark) => {
    for (let combination of winningCombinations) {
      if (
        Gameboard.getGameboard()[combination[0]] === mark &&
        Gameboard.getGameboard()[combination[1]] === mark &&
        Gameboard.getGameboard()[combination[2]] === mark 
      ) {
        return true;
      }
    }
    return false;
    };

  const checkForTie = () => {
    return !Gameboard.getGameboard().includes(' ');
  };

  const playTurn = (index) => {
    if (Gameboard.updateGameboard (index, currentPlayer.mark) && gameActive)
      if (checkForWin(currentPlayer.mark)) {
        updateWinCounter(currentPlayer);
        endGame(`${currentPlayer.name} wins!`);
      } else if (checkForTie()) {
        endGame('Tie!')
      } else {
      Gameboard.updateGameboard (index, currentPlayer.mark);
      currentPlayer = togglePlayer(currentPlayer);
      highlightCurrentPlayer();
      setStatusDisplay();
    };
    renderGameboard();

  };

  const newGame = () => {
    currentPlayer = players[0];
    renderGameboard();
    highlightCurrentPlayer();
    gameActive = true;
    hideStartButton();
    counter();
  }

  const endGame = (message) => {
    statusDisplay.textContent = message;

    renderGameboard();
    gameActive = false;

  }

  const resetGame = () => {
    Gameboard.resetGameboard();
    newGame();
  }

  const gameBoardDiv = document.getElementById('gameboard');
  const statusDisplay = document.getElementById('status');
  const startButton = document.getElementById('start-btn');
  const player1Input = document.getElementById('player1-name');
  const player2Input = document.getElementById('player2-name');
  const score = document.getElementById('score');
  const player1Score = document.getElementById('player1-score');
  const player2Score = document.getElementById('player2-score');
  const player1board = document.getElementById('player1-board');
  const player2board = document.getElementById('player2-board');


  const handleStartClick = () => {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();


    if (player1Name !== '' && player2Name !== '') {
      players[0].name = player1Name;
      players[1].name = player2Name;
      currentPlayer = players[0];
      setStatusDisplay();
      newGame();
    } else {
      alert('Please enter name for both players')
    }
  };

  const counterCreator = () => {
    let count = 0;
    return () => {
      count++;
      score.textContent = `Round: ${count}`;
    };
  };

  const counter = counterCreator();

  const updateWinCounter = (player) => {
    player.incrementWins();
    if (player === players[0]) {
      player1Score.textContent = player.getWins();
    } else if (player === players[1]) {
      player2Score.textContent = player.getWins();
    }
  };

  startButton.addEventListener('click', handleStartClick);


  const setStatusDisplay = () => {
    statusDisplay.textContent = `Current player: ${currentPlayer.name}`;
  };

  const highlightCurrentPlayer = () => {
    if (currentPlayer === players[0]) {
      player1board.classList.add('current-player');
      player2board.classList.remove('current-player');
    } else if (currentPlayer === players[1]) {
      player1board.classList.remove('current-player');
      player2board.classList.add('current-player');
    }
  }


  hideStartButton = () => {
    startButton.style.display = 'none';
  }

  const renderGameboard = () => {
    gameBoardDiv.innerHTML = '';
    Gameboard.getGameboard().forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell;
      cellDiv.dataset.index = index;
      cellDiv.addEventListener('click', (e) => {
        if (gameActive)
        playTurn(e.target.dataset.index)
        else {
          resetGame();
        };
      })
      cellDiv.classList.add('cell');
      gameBoardDiv.appendChild(cellDiv);
    });
    const resetDiv = document.createElement('button');
    resetDiv.textContent = 'Clear board';
    resetDiv.setAttribute('id', 'restart-btn');
    resetDiv.addEventListener('click', () => {
      Gameboard.resetGameboard();
      renderGameboard();
    });
    gameBoardDiv.appendChild(resetDiv);
  }

  const botPlay = () => {
    if(currentPlayer === players[1] && gameActive) {
      setTimeout(()=> {
        const availableMoves = [];
        Gameboard.getGameboard().forEach((cell, index) => {
          if (cell === ' ') {
            availableMoves.push(index);
          }
        });
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedMove = availableMoves[randomIndex];
        playTurn(selectedMove);
      }, 500);
    }
  }







  return {newGame};

  })();
