const Game = (()=> {
    let gameboard = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    let gameActive = false;
    let currentPlayer = null;
    let roundCounter = 1;
    let playerXScore = 0;
    let playerOScore = 0;
    const playerX = 'X';
    const playerO = 'O';
    const gameContainer = document.getElementById('game');
    const playerXDisplay = document.getElementById('player-x-display');
    const playerODisplay = document.getElementById('player-o-display');
    const roundDisplay = document.getElementById('round-display');
    const newGameBtn = document.getElementById('new-game-btn');
    const clearBtn = document.getElementById('clear-board-btn');


    const getGameboard = () => gameboard;

    const startGame = () => {
        gameActive = true;
        currentPlayer = playerX;
        playerXScore = 0;
        playerOScore = 0;
        roundCounter = 1;
        gameboard = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
        renderGame();
    }

    const newRound = () => {
        gameboard = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
        renderGame();
        gameActive = true;
        currentPlayer = playerX;
    }

    const updateGameboard = (index, currentPlayer) => {
        if (gameboard[index] === ' ') {
            gameboard[index] = currentPlayer;
            return true;
        }
    };
    const togglePlayer = (currentPlayer) => {
        return currentPlayer === playerX ? playerO : playerX;
      };

    const playRound = (index) => {
        if (gameActive === true && updateGameboard(index, currentPlayer)) {
            if (checkWinCondition(currentPlayer) === true) {
                updateScore();
                endRound();
                showPopup(`${currentPlayer} WON`)
            } else if (checkForTie()) {
                endRound();
                showPopup('TIE')
            }
            else {
                updateGameboard(index, currentPlayer);
                currentPlayer = togglePlayer(currentPlayer);
                console.log(gameboard, currentPlayer);
            }
        }
    }


    const winCombinations = [
        [0 ,1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWinCondition = (currentPlayer) => {
        for (let combination of winCombinations) {
            if (
                Game.getGameboard()[combination[0]] === currentPlayer &&
                Game.getGameboard()[combination[1]] === currentPlayer &&
                Game.getGameboard()[combination[2]] === currentPlayer
            ) {
                return true;
            }
        } 
        return false;
    };

    const endRound = () => {
        roundCounter++;
        playerODisplay.textContent = playerOScore;
        playerXDisplay.textContent = playerXScore;
        roundDisplay.textContent = roundCounter;
        gameActive = false;
    }

    const checkForTie = () => {
        return !getGameboard().includes(' ');
    }

    const updateScore = () => {
        if (currentPlayer === playerX) playerXScore++
        else if (currentPlayer === playerO) playerOScore++
    }

    const renderGame = () => {
        gameContainer.innerHTML = '';
        getGameboard().forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell;
            cellDiv.dataset.index = index;
            cellDiv.classList.add('cell-div');
            cellDiv.addEventListener('click', handleClick)
            gameContainer.appendChild(cellDiv);
        });
    };

    const handleClick = (event) => {
        if (gameActive === true && gameboard[event.target.dataset.index] === ' ') {
            event.target.textContent = currentPlayer;
            playRound(event.target.dataset.index);
            if (gameActive === true) {
                let botChoice = getRandomIndex();
                const cellDiv = document.querySelector(`[data-index="${botChoice}"]`);
                cellDiv.textContent = currentPlayer;
                playRound(botChoice);
            }
            
        } else if (gameActive === false) {
            newRound();
        }
    }



    const getRandomIndex = () => {
        let availableCells = [];
        getGameboard().forEach((cell, index) => {
            if (cell === ' ') { 
                availableCells.push(index)
            }
        });
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const selectedMove = availableCells[randomIndex]
        return selectedMove
    }

    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");

    // Function to show the pop-up with a specific message
    const showPopup = (message) => {
    popupMessage.textContent = message;
    popup.style.display = "block";
    }

    // Function to hide the pop-up
    const hidePopup = () => {
    popup.style.display = "none";
    }

    // Example usage after determining game result (win or tie)
    // Replace "playerName" and "win/tie" with appropriate values

    popup.addEventListener("click", hidePopup);

    newGameBtn.addEventListener('click', startGame)
    clearBtn.addEventListener('click', newRound)

    





    return { getGameboard, updateGameboard, playRound, startGame, renderGame, getRandomIndex};
})();

Game.startGame();