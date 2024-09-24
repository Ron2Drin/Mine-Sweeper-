'use strict'

function addBombs(firstClickI, firstClickJ) {
    var minesCount = gLevel.MINES;
    while (minesCount > 0) {
        var i = getRandomInt(0, gLevel.SIZE);
        var j = getRandomInt(0, gLevel.SIZE);

        // ודא שהמוקשים לא מונחים בתא הראשון או בתאים הסובבים אותו
        if (Math.abs(i - firstClickI) <= 1 && Math.abs(j - firstClickJ) <= 1) continue;

        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true;
            minesCount--;
        }
    }
    setMinesAroundCount(); // מחשב כמה מוקשים יש מסביב לכל תא
}


function setMinesAroundCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];
            currCell.minesAroundCount = countMinesAroundCell(i, j); // חישוב מספר המוקשים סביב התא
        }
    }
}

function countMinesAroundCell(cellI, cellJ) {
    var bombsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) {
                bombsCount++;
            }
        }
    }
    return bombsCount; // מחזיר את מספר המוקשים מסביב לתא
}

function showBomobs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            var currCell = gBoard[i][j]

            if (currCell.isMine) {

                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')
                elCell.innerText = BOMB

            }
        }
        
    }
    setTimeout(() => {
        gGame.isOn = false
        alert('Game over!')
        clearInterval(gTimerInterval)
        document.querySelector('.restart').classList.remove('hidden');
        document.querySelector('.emoji').innerText = '😢';  
    }, 100)
}

