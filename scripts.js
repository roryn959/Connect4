//Initialise board. 0 -> Empty, 1 -> Red, 2 -> Yellow
const board = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0]

//DOM Refs
const frame = document.querySelectorAll("td");
const circles = document.querySelectorAll("p");
const winnerHeader = document.getElementById("winner-header");
const yellowTurnButton = document.getElementById("yellow-turn-button");
const thinkingText = document.getElementById("thinking");


//Properties
let turn = true; //true -> red turn, false -> black turn
let winningLines = [ 
    [0, 1, 2, 3], [41, 40, 39, 38],[7, 8, 9, 10], 
    [34, 33, 32, 31], [14, 15, 16, 17], [27, 26, 25, 24], 
    [21, 22, 23, 24], [20, 19, 18, 17], [28, 29, 30, 31], 
    [13, 12, 11, 10], [35, 36, 37, 38], [6, 5, 4, 3], 
    [0, 7, 14, 21], [41, 34, 27, 20], [1, 8, 15, 22], 
    [40, 33, 26, 19], [2, 9, 16, 23], [39, 32, 25, 18], 
    [3, 10, 17, 24], [38, 31, 24, 17], [4, 11, 18, 25], 
    [37, 30, 23, 16], [5, 12, 19, 26], [36, 29, 22, 15], 
    [6, 13, 20, 27], [35, 28, 21, 14], [0, 8, 16, 24], 
    [41, 33, 25, 17], [7, 15, 23, 31], [34, 26, 18, 10], 
    [14, 22, 30, 38], [27, 19, 11, 3], [35, 29, 23, 17], 
    [6, 12, 18, 24], [28, 22, 16, 10], [13, 19, 25, 31], 
    [21, 15, 9, 3], [20, 26, 32, 38], [36, 30, 24, 18], 
    [5, 11, 17, 23], [37, 31, 25, 19], [4, 10, 16, 22], 
    [2, 10, 18, 26], [39, 31, 23, 15], [1, 9, 17, 25], 
    [40, 32, 24, 16], [9, 7, 25, 33], [8, 16, 24, 32], 
    [11, 7, 23, 29], [12, 18, 24, 30], [1, 2, 3, 4], 
    [5, 4, 3, 2], [8, 9, 10, 11], [12, 11, 10, 9],
    [15, 16, 17, 18], [19, 18, 17, 16], [22, 23, 24, 25], 
    [26, 25, 24, 23], [29, 30, 31, 32], [33, 32, 31, 30], 
    [36, 37, 38, 39], [40, 39, 38, 37], [7, 14, 21, 28], 
    [8, 15, 22, 29], [9, 16, 23, 30], [10, 17, 24, 31], 
    [11, 18, 25, 32], [12, 19, 26, 33], [13, 20, 27, 34] 
    ]; 

let moveList = []; //Stack to keep track of moves, to allow for undoing moves
let CPUColour = false; //false -> yellow, true -> red

function createListeners(){
    for (let i=0; i < circles.length; i++){
        circles[i].addEventListener("click", attemptMove);
    }
    yellowTurnButton.addEventListener("click", makePlayerYellow);
}

function makePlayerYellow(){
    CPUMove();
    yellowTurnButton.remove();
    CPUColour = !CPUColour;
}

function findLastEmpty(column){
    let lastEmpty;
    for (let i = column; i<42; i = i+7){
        if (board[i] == 0){
            lastEmpty = i;
        } else {
            break;
        }
    }
    return lastEmpty;
}

function attemptMove(){
    yellowTurnButton.remove();
    let lastEmpty = findLastEmpty(parseInt(event.target.id));

    if (lastEmpty == undefined){
        alert('There is no space in that column!');
    } else {
        executeMove(lastEmpty);
        reactToGameState();
    }
    CPUMove();
    reactToGameState();
}

function reactToGameState(){
    let gameState = checkGameState();
    if (gameState != 0){
        if (gameState == null){
            winnerHeader.innerText = 'Draw!';
        } else if (gameState == 1){
            winnerHeader.innerText = 'Red wins!';
        } else if (gameState == -1){
            winnerHeader.innerText = 'Yellow wins!';
        }
        stopGame();
    }
}

function stopGame(){
    for (let i=0; i<42; i++){
        circles[i].removeEventListener('click', attemptMove);
    }
}

function executeMove(cell){
    if (turn){
        board[cell] = 1;
        circles[cell].setAttribute("class", "red-square");
    } else {
        board[cell] = 2;
        circles[cell].setAttribute("class", "yellow-square");
    }
    turn = !turn;
    moveList.push(cell);
}

function undoMove(){
    if (moveList.length == 0){
        alert('Error - movelist empty');
    } else {
        let lastCounter = moveList.pop();
        board[lastCounter] = 0;
        circles[lastCounter].setAttribute('class', 'empty-square');
        turn = !turn;
    }
}

function checkGameState(){
    if (checkWin('red-square')){
        return 1;
    } else if (checkWin('yellow-square')){
        return -1;
    } else if (checkDraw()){
        return null;
    } else {
        return 0;
    }
}

function checkDraw(){
    for (let i=0; i<42; i++){
        if (board[i] == 0){
            return false;
        }
    }
    return true;
}

function checkWin(colour){
    //For each winning line
    for (let i=0; i<winningLines.length; i++){
        let validLine = true;
        //For each cell in the line
        for (let j=0; j<4; j++){
            let currentIndex = winningLines[i][j];
            let currentCircle = circles[currentIndex];

            if (currentCircle.getAttribute('class') != colour){
                validLine = false;
                break;
            }
        }
        if (validLine){
            return true;
        }
    }
    return false;
}

function activateThinking(){
    thinkingText.style.color = "black";
}

function deactivateThinking(){
    thinkingText.style.color = "white";
}

function CPUMove(){
    activateThinking();
    //RandomCPUMove();
    //MinimaxCPUMove(6);
    AlphabetaCPUMove(9);
    deactivateThinking();
}

function RandomCPUMove(){
    while (true){
        let chosenColumn = Math.floor(Math.random() * 7);
        let lastEmpty = findLastEmpty(chosenColumn);
        
        if (lastEmpty == undefined){
            continue;
        }

        executeMove(lastEmpty);
        break;
    }
}

function findMoves(){
    let moves = [];
    for (let i=0; i<7; i++){
        let lastEmpty = findLastEmpty(i);
        if (lastEmpty != undefined){
            moves.push(lastEmpty);
        }
    }
    return moves;
}

function MinimaxCPUMove(depth){
    let evaluation = Minimax(depth, CPUColour);
    executeMove(evaluation[1]);
}

function AlphabetaCPUMove(depth){
    let evaluation = Alphabeta(depth, CPUColour, -100, 100);
    executeMove(evaluation[1]);
}

function Minimax(depth, colour){ //Gives [evaluationScore, bestMove]
    let gameState = checkGameState();
    if (gameState != 0 || depth == 0){
        return [gameState, null];
    }

    let bestMove, bestScore, comparison;

    //Positive score = good for red
    if (colour){
        bestScore = -100;
    } else {
        bestScore = 100;
    }

    let possibleMoves = findMoves();
    for (let i=0; i<possibleMoves.length; i++){
        let newMove = possibleMoves[i];

        executeMove(newMove);

        let newScore = Minimax(depth-1, !colour)[0];

        if (colour){
            comparison = (newScore > bestScore);
        } else {
            comparison = (newScore < bestScore);
        }

        if (comparison){
            bestScore = newScore;
            bestMove = newMove;
        }

        undoMove();
    }

    return [bestScore, bestMove];
}

function Alphabeta(depth, colour, alpha, beta){
    let gameState = checkGameState();
    if (gameState != 0 || depth == 0){
        return [gameState, null];
    }

    let bestMove, bestScore, newMove, newScore;

    if (colour){
        bestScore = -100;
        let possibleMoves = findMoves();
        for (let i=0; i<possibleMoves.length; i++){
            newMove = possibleMoves[i];
            executeMove(newMove);
            newScore = Alphabeta(depth-1, !colour, alpha, beta)[0];
            if (newScore > bestScore){
                bestScore = newScore;
                bestMove = newMove;
            }
            if (bestScore >= beta){
                undoMove();
                break;
            }
            alpha = Math.max(alpha, bestScore);
            undoMove();
        }
    } else {
        bestScore = 100;
        let possibleMoves = findMoves();
        for (let i=0; i<possibleMoves.length; i++){
            newMove = possibleMoves[i];
            executeMove(newMove);
            newScore = Alphabeta(depth-1, !colour, alpha, beta)[0];
            if (newScore < bestScore){
                bestScore = newScore;
                bestMove = newMove;
            }
            if (bestScore <= alpha){
                undoMove();
                break;
            }
            beta = Math.min(beta, bestScore);
            undoMove()
        }
    }
    return [bestScore, bestMove];
}

createListeners();