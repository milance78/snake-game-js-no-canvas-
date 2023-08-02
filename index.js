const playgroundElement = document.querySelector('.playground');
const startResetButtonElement = document.querySelector('.start-button');
const pauseButtonElement = document.querySelector('.pause-button');
const containerElement = document.querySelector('.container');
const appleElement = document.querySelector('.fa-apple-whole');
const levelDisplayElement = document.querySelector('.level-display>span');

let fragment;
let numberOfFragments = 3;
const snakeHeadColor = 'goldenrod';
let playgroundWidth = 800;
let playgroundHeight = 500;
// for building initial snake
const initialHeadXCoordinate = 160;
let fragmentXCoordinate = initialHeadXCoordinate;
let fragmentYCoordinate = 60;
// for moving snake 
let headXCoordinate = 160;
let headYCoordinate = 60;
let towardsRight = false;
let towardsLeft = false;
let towardsUp = false;
let towardsDown = false;
let startPressed = false;
let pauseIsOn = false;
let movingLeft;
let movingRight;
let movingDown;
let movingUp;
let resetOptionOn = false;
let gameOver = false;
let snake = [];
let snakeSlowleness = 150;
// for eating apple
let snakeHeadCoordinates = {};
let appleCoordinates = {};
let eatenApples = 0;
const boundaryNumberOfApples = 10; 
const speedIncrease = 20;
let level = 1

playgroundElement.style.width = `${playgroundWidth}px`;
playgroundElement.style.height = `${playgroundHeight}px`;
containerElement.style.width = `${playgroundWidth - 14}px`;
containerElement.style.height = `${playgroundHeight - 14}px`;
levelDisplayElement.textContent = level;

const initialSnake = () => {
    snake = [];
    numberOfFragments = 3;
    for (let i = 0; i < numberOfFragments; i++) {
        const snakeFragment = document.createElement("div");
        snakeFragment.setAttribute('class', 'fragment');

        snakeFragment.style.top = '60px';
        if (i === 0) {
            snakeFragment.style.left = `${initialHeadXCoordinate}px`;
        } else {
            fragmentXCoordinate -= 20;
            snakeFragment.style.left = `${fragmentXCoordinate}px`;
        }
        if (i === 0) {
            snakeFragment.style.background = snakeHeadColor;
        }
        snake = [...snake, { x: fragmentXCoordinate, y: fragmentYCoordinate }];
        playgroundElement.appendChild(snakeFragment);
    }
    fragmentXCoordinate = initialHeadXCoordinate;
    headXCoordinate = 160;
    headYCoordinate = 60;
    level = 1;
    levelDisplayElement.textContent = level;
    snakeSlowleness = 150;
    eatenApples = 0;
    apple();
}

const goRight = () => {
    clearAllIntervals();
    movingRight = setInterval(() => {
        if (headXCoordinate > playgroundWidth - 50) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else { snakeMoving(20, 0) }
    }, snakeSlowleness);
    towardsRight = true;
    towardsLeft = false;
    towardsUp = false;
    towardsDown = false;
}
const goDown = () => {
    clearAllIntervals();
    movingDown = setInterval(() => {
        if (headYCoordinate > playgroundHeight - 50) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else { snakeMoving(0, 20) }
    }, snakeSlowleness);
    towardsDown = true;
    towardsRight = false;
    towardsLeft = false;
    towardsUp = false;
}
const goLeft = () => {
    clearAllIntervals();
    movingLeft = setInterval(() => {
        if (headXCoordinate < 10) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else { snakeMoving(-20, 0) }
    }, snakeSlowleness);
    towardsLeft = true;
    towardsDown = false;
    towardsRight = false;
    towardsUp = false;
}
const goUp = () => {
    clearAllIntervals();
    movingUp = setInterval(() => {
        if (headYCoordinate < 10) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else { snakeMoving(0, -20) }
    }, snakeSlowleness);
    towardsUp = true;
    towardsLeft = false;
    towardsDown = false;
    towardsRight = false;
}

const snakeMoving = (xMovement, yMovement) => {
    snakeHeadCoordinates = snake[0];
    playgroundElement.removeChild(playgroundElement.lastChild);
    snake.pop();
    const snakeFragment = document.createElement("div");
    playgroundElement.insertBefore(snakeFragment, playgroundElement.firstChild);

    snakeFragment.setAttribute('class', 'fragment');
    const firstFragment = document.querySelector('.fragment:first-child');
    const secondFragment = document.querySelector(`.fragment:nth-child(2)`);
    firstFragment.style.background = snakeHeadColor;
    secondFragment.style.background = "gold";

    headXCoordinate = headXCoordinate + xMovement;
    headYCoordinate = headYCoordinate + yMovement;
    snakeFragment.style.left = `${headXCoordinate}px`;
    snakeFragment.style.top = `${headYCoordinate}px`;
    snake = [{ x: headXCoordinate, y: headYCoordinate }, ...snake];
    appleEating();
    selfCollisionCheck();
}

const clearAllIntervals = () => {
    clearInterval(movingUp);
    clearInterval(movingDown);
    clearInterval(movingLeft);
    clearInterval(movingRight);
}

const displayGameOver = () => {
    const gameOverElement = document.createElement('h1');
    gameOverElement.setAttribute('class', 'game-over');
    gameOverElement.textContent = 'game over';
    playgroundElement.appendChild(gameOverElement);
}

const apple = () => {
    containerElement.lastChild.remove()
    const randomXRange = (playgroundWidth - 40) / 20
    const randomYRange = (playgroundHeight - 40) / 20
    const randomXNumber = Math.floor(Math.random() * randomXRange) + 1;
    const randomYNumber = Math.floor(Math.random() * randomYRange) + 1;

    const randomX = randomXNumber * 20
    const randomY = randomYNumber * 20
    appleCoordinates = { x: randomX, y: randomY }

    // snake.forEach((fragmentCoordinates) => {
    //     if (JSON.stringify(appleCoordinates) === JSON.stringify(fragmentCoordinates)) {
    //         apple();
    //     }
    // });
    const apple = document.createElement('i');
    apple.setAttribute('class', 'fa-solid fa-apple-whole');
    apple.style.left = `${randomX}px`;
    apple.style.top = `${randomY}px`;
    containerElement.appendChild(apple);
}

const appleEating = () => {
    snakeHeadCoordinates = snake[0];
    if (JSON.stringify(snakeHeadCoordinates) === JSON.stringify(appleCoordinates)) {
        eatenApples++;
        const addedSnakeFragment = document.createElement("div");
        addedSnakeFragment.setAttribute('class', `fragment`);
        addedSnakeFragment.style.left = `${snakeHeadCoordinates.x}px`;
        addedSnakeFragment.style.top = `${snakeHeadCoordinates.y}px`;
        playgroundElement.insertBefore(addedSnakeFragment, playgroundElement.children[playgroundElement[0]]);
        numberOfFragments += 1;
        snake.unshift(snakeHeadCoordinates);
        levelIncreaseCheck();
        apple();
    }
}
const selfCollisionCheck = () => {
    snake.forEach((fragmentCoordinates, i) => {
        if (i > 1) {
            if (JSON.stringify(snakeHeadCoordinates) === JSON.stringify(fragmentCoordinates)) {
                clearAllIntervals();
                gameOver = true;
                displayGameOver();
            }
        }
    });
}

const levelIncreaseCheck = () => {
    if (eatenApples%boundaryNumberOfApples === 0){
        snakeSlowleness -= speedIncrease;
        level++
        levelDisplayElement.textContent = level;
    }
}

initialSnake();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' &&
        towardsLeft === false &&
        towardsRight === false &&
        pauseIsOn === false &&
        startPressed === true &&
        gameOver === false
    ) {
        if (headXCoordinate > playgroundWidth - 50) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else {
            goRight();
        }
    } else if (event.key === 'ArrowDown' &&
        towardsUp === false &&
        towardsDown === false &&
        pauseIsOn === false &&
        startPressed === true &&
        gameOver === false
    ) {
        if (headYCoordinate > playgroundHeight - 50) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else {
            goDown();
        }

    } else if (event.key === 'ArrowLeft' &&
        towardsLeft === false &&
        towardsRight === false &&
        pauseIsOn === false &&
        startPressed === true &&
        gameOver === false
    ) {
        if (headXCoordinate < 10) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else {
            goLeft();
        }
    } else if (event.key === 'ArrowUp' &&
        towardsUp === false &&
        towardsDown === false &&
        pauseIsOn === false &&
        startPressed === true &&
        gameOver === false
    ) {
        if (headYCoordinate < 10) {
            clearAllIntervals();
            gameOver = true;
            displayGameOver();
        } else {
            goUp();
        }
    }
});

startResetButtonElement.addEventListener('click', () => {
    if (resetOptionOn === false) {
        goRight();
        startResetButtonElement.textContent = "reset";
        resetOptionOn = true;
        startPressed = true;
        gameOver = false;
    } else {
        startResetButtonElement.textContent = "start";
        clearAllIntervals();
        playgroundElement.replaceChildren();
        initialSnake();
        resetOptionOn = false;
        startPressed = false;
        pauseIsOn = false;
        pauseButtonElement.style.background = "inherit"
    }
});

pauseButtonElement.addEventListener('click', () => {
    if (pauseIsOn === false && startPressed === true) {
        clearAllIntervals();
        pauseIsOn = true;
        pauseButtonElement.style.background = "gold";
    } else if (pauseIsOn === true) {
        if (towardsRight === true) {
            goRight();
        } else if (towardsDown === true) {
            goDown();
        } else if (towardsLeft === true) {
            goLeft();
        } else if (towardsUp === true) {
            goUp();
        }
        pauseIsOn = false;
        pauseButtonElement.style.background = "inherit";
    }
});