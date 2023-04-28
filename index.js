const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const board = [];
const boardElement = document.getElementById("board");

let rows = 9;
let columns = 9;
let currentCandy;
let preventCandy;

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

function init() {
    createGameData();
    createGameElements();
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

function dragStart() {
    currentCandy = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    preventCandy = this;
}

function dragEnd() {
    let topCount = 0;
    let bottomCount = 0;
    let leftCount = 0;
    let rightCount = 0;

    let horizontalCandies = [];
    let verticalCandies = [];
    // if(horizontalCandies.length > 2) return ;
    // else if(verticalCandies.length > 2) return ;

    let currentCoords = currentCandy.dataset;
    let preventCoords = preventCandy.dataset;
    board[+currentCandy.dataset.column][+currentCandy.dataset.row].type = preventCoords.type;
    board[+preventCandy.dataset.column][+preventCandy.dataset.row].type = currentCoords.type;
    currentCandy.dataset.type = board[+currentCandy.dataset.column][+currentCandy.dataset.row].type;
    preventCandy.dataset.type = board[+preventCandy.dataset.column][+preventCandy.dataset.row].type;
    // top candies check
    let i1 = preventCoords.column;
    let j1 = preventCoords.row;
    while (j1 >= 0) {
        if (j1 > 0 && board[i1][j1 - 1].type === preventCoords.type) {
            topCount += 1;
            j1 -= 1;
        } else break;
    }


    // bottom candies check
    let i = +preventCoords.column;
    let j = +preventCoords.row;
    while (j < board[i].length) {
        if (
            j < board[i].length - 1 &&
            board[i][j + 1].type === preventCoords.type
        ) {
            bottomCount++;
            j++;
        } else break;
    }

    //right candies check
    let i2 = +preventCoords.column;
    let j2 = +preventCoords.row;
    while (i2 < board.length) {
        if (
            i2 < board.length - 1 &&
            board[i2 + 1][j2].type === preventCoords.type
        ) {
            rightCount++;
            i2++;
        } else {
            break;
        }
    }

    //left candies check
    let i3 = preventCoords.column;
    let j3 = preventCoords.row;
    while (i3 >= 0) {
        if (i3 > 0 && board[i3 - 1][j3].type === preventCoords.type) {
            console.log("left");
            leftCount++;
            i3--;
        } else {
            break;
        }
    }

    let j4 = preventCoords.row - topCount;
    let verticalCoord = +preventCoords.row + bottomCount;
    while (j4 <= verticalCoord) {
        verticalCandies.push(board[i][j4]);
        j4++;

    }

    let i4 = preventCoords.column - leftCount;
    let horizontalCoord = +preventCoords.column + rightCount;
    while(i4 <= horizontalCoord) {
        horizontalCandies.push(board[i4][j2])
        i4++
    }

    for (let i = +preventCoords.column - leftCount;i <= +preventCoords.column + rightCount;i++) {
        for (let j = +preventCoords.row - topCount;j <= +preventCoords.row + bottomCount;j++) {
            if (verticalCandies.length > 2 && i === +preventCoords.column && j === +preventCoords.row - topCount) {
                let x = board[i].splice(j, verticalCandies.length);
            }
            if(j === +preventCoords.row && horizontalCandies.length > 2) {
                console.log("kkkkkkk");
                board[i].splice(j,1)
            }
        }
        
    }

    newCandyGenerate()
}

function createGameElements() {
    boardElement.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
        let columnElement = document.createElement("div");
        columnElement.setAttribute("class", "columnElement");
        boardElement.append(columnElement);
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
    }
}

function newCandyGenerate() {
    for(let i = 0 ; i < columns ; i++){
        for(let j = 0 ; j < rows ; j++){
            let color_src = randomCandy();
            if(board[i].length < columns){
                board[i].unshift({type : color_src})
            }
        }
    }
    createGameElements();
}

init();