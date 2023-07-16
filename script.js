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
  return {name, mark};
};

const Game = (() => {
  let gameActive = true;
  const players = [
    Player('Player1', 'X'),
    Player('Player2', '0')
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
    if (Gameboard.updateGameboard (index, currentPlayer.mark))
      if (checkForWin(currentPlayer.mark)) {
        endGame(currentPlayer.name + 'wins!');
      } else if (checkForTie()) {
        endGame('Tie!')
      }
      else {
      Gameboard.updateGameboard (index, currentPlayer.mark);
      currentPlayer = togglePlayer(currentPlayer);
      console.log(currentPlayer, Gameboard.getGameboard())
      };
      renderGameboard();
  };

  const newGame = () => {
    currentPlayer = players[0];
    renderGameboard();
  }

  const endGame = (message) => {
    alert(message);
  }

  const resetGame = () => {
    Gameboard.resetGameboard();
    newGame();
  }

  const gameBoardDiv = document.getElementById('gameboard');
  const cells = document.querySelectorAll('.cell');

  const renderGameboard = () => {
    gameBoardDiv.innerHTML = '';
    Gameboard.getGameboard().forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell;
      cellDiv.dataset.index = index;
      cellDiv.addEventListener('click', (e) => {
        playTurn(e.target.dataset.index);
      })
      cellDiv.classList.add('cell');

      gameBoardDiv.appendChild(cellDiv);
    });
  }

  return { playTurn, newGame, resetGame };

  })();



Game.newGame();