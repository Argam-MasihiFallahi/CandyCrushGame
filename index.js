let rows = 9;
let columns = 9;

let currCandy;
let prevCandy;

let currCoords;
let prevCoords;

let topCount = 0;
let bottomCount = 0;
let leftCount = 0;
let rightCount = 0;

let horizontalCandies = [];
let verticalCandies = [];

const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"]; //data item types selected from this array
const board = []; //data array
const boardElement = document.getElementById("board");

const images = {
    Blue: "./images/Blue.png",
    Orange: "./images/Orange.png",
    Green: "./images/Green.png",
    Yellow: "./images/Yellow.png",
    Red: "./images/Red.png",
    Purple: "./images/Purple.png",
};

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function createGameData() {
    for (let c = 0; c < columns; c++) {
        let columnArray = [];
        for (let r = 0; r < rows; r++) {
            let color_src = randomCandy();
            columnArray.push({ type: color_src });
        }
        board.push(columnArray);
    }
}

function createGameElements() {
    boardElement.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
        let columnElement = document.createElement("div");
        columnElement.setAttribute("class", "columnElement");

        for (let j = 0; j < board[i].length; j++) {
            let columnImgContainer = document.createElement("div");
            columnImgContainer.dataset.column = i;
            columnImgContainer.dataset.row = j;
            columnImgContainer.dataset.type = board[i][j].type;
            //=======================================================
            let columnImg = document.createElement("img");
            columnImg.setAttribute("class", "columnImg");
            columnImg.src = images[board[i][j].type];
            //=======================================================
            columnElement.append(columnImgContainer);
            columnImgContainer.appendChild(columnImg);
            //=======================================================
            //click on a candy, initialize drag process
            columnImgContainer.addEventListener("dragstart", dragStart);
            //clicking on candy, moving mouse to drag the candy
            columnImgContainer.addEventListener("dragover", dragOver);
            //dragging candy onto another candy
            columnImgContainer.addEventListener("dragenter", dragEnter);
            //leave candy over another candy
            columnImgContainer.addEventListener("dragleave", dragLeave);
            //dropping a candy over another candy
            columnImgContainer.addEventListener("drop", dragDrop);
            //after drag process completed, we swap candies
            columnImgContainer.addEventListener("dragend", dragEnd);
        }
        boardElement.append(columnElement);
    }
}

function calculateSameCandies(prevCoords) {
    topCount = 0;
    bottomCount = 0;
    leftCount = 0;
    rightCount = 0;

    verticalCandies = [];
    horizontalCandies = [];

    horizontalCandies.push({
        column: +prevCoords.column,
        row: +prevCoords.row,
        ...board[prevCoords.column][prevCoords.row],
    });

    verticalCandies.push({
        column: +prevCoords.column,
        row: +prevCoords.row,
        ...board[prevCoords.column][prevCoords.row],
    });

    // top candies check
    let i1 = +prevCoords.column;
    let j1 = +prevCoords.row - 1;
    while (j1 >= 0) {
        if (board[i1][j1].type === prevCoords.type) {
            verticalCandies.unshift({ column: i1, row: j1, ...board[i1][j1] });
            topCount++;
            j1--;
        } else break;
    }

    // bottom candies check
    let i = +prevCoords.column;
    let j = +prevCoords.row + 1;
    while (j < board[i].length) {
        if (board[i][j].type === prevCoords.type) {
            verticalCandies.push({ column: i, row: j, ...board[i][j] });
            bottomCount++;
            j++;
        } else break;
    }

    //left candies check
    let i3 = +prevCoords.column - 1;
    let j3 = +prevCoords.row;
    while (i3 >= 0) {
        if (board[i3][j3].type === prevCoords.type) {
            horizontalCandies.unshift({
                column: i3,
                row: j3,
                ...board[i3][j3],
            });
            leftCount++;
            i3--;
        } else {
            break;
        }
    }
    //right candies check
    let i2 = +prevCoords.column + 1;
    let j2 = +prevCoords.row;
    while (i2 < board.length) {
        if (board[i2][j2].type === prevCoords.type) {
            horizontalCandies.push({ column: i2, row: j2, ...board[i2][j2] });
            rightCount++;
            i2++;
        } else {
            break;
        }
    }

    candyCrush();
}

function candyCrush() {
    for (
        let i = horizontalCandies[0].column;
        i <= horizontalCandies[horizontalCandies.length - 1].column;
        i++
    ) {
        for (
            let j = verticalCandies[0].row;
            j <= verticalCandies[verticalCandies.length - 1].row;
            j++
        ) {
            if (
                verticalCandies.length > 2 &&
                i === verticalCandies[0].column &&
                j === verticalCandies[0].row
            ) {
                board[i].splice(j, verticalCandies.length);
            }
            if (
                j === horizontalCandies[0].row &&
                horizontalCandies.length > 2
            ) {
                board[i].splice(j, 1);
            }
        }
    }
    newCandyGenerate();
}
function newCandyGenerate() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let color_src = randomCandy();
            if (board[i].length < columns) {
                board[i].unshift({ type: color_src });
            }
        }
    }
    createGameElements();
}

function init() {
    createGameData();
    createGameElements();
}

function dragStart() {
    currCandy = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    prevCandy = this;
}

function dragEnd() {
    currCoords = currCandy.dataset;
    prevCoords = prevCandy.dataset;
    board[+currCandy.dataset.column][+currCandy.dataset.row].type =
        prevCoords.type;
    board[+prevCandy.dataset.column][+prevCandy.dataset.row].type =
        currCoords.type;
    currCandy.dataset.type =
        board[+currCandy.dataset.column][+currCandy.dataset.row].type;
    prevCandy.dataset.type =
        board[+prevCandy.dataset.column][+prevCandy.dataset.row].type;

    let row = +currCandy.dataset.row;
    let column = +currCandy.dataset.column;
    let row2 = +prevCandy.dataset.row;
    let column2 = +prevCandy.dataset.column;

    let left = column2 == column - 1 && row == row2;
    let right = column2 == column + 1 && row == row2;
    let up = row2 == row - 1 && column2 == column;
    let down = row2 == row + 1 && column2 == column;

    let isMovement = left || right || up || down;
    // console.log(isMovement);

    if (isMovement) {
        calculateSameCandies(prevCandy.dataset);
        calculateSameCandies(currCandy.dataset);
    } else {
        // board[+prevCandy.dataset.column][+prevCandy.dataset.row].type = prevCoords.type;
        // board[+currCandy.dataset.column][+currCandy.dataset.row].type = currCoords.type;
        // prevCandy.dataset.type = board[+currCandy.dataset.column][+currCandy.dataset.row].type;
        // currCandy.dataset.type = board[+prevCandy.dataset.column][+prevCandy.dataset.row].type;
    }

    console.log(board);
}

init();
