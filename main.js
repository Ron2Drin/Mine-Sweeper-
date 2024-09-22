'use strict'

const TIMER_INTERVAL = 31
const INITIAL_TIMER_TEXT = '00:00'
const BOMB = '💣'



var gBoard = []

var gGame = {
    isOn: false,
    showCount: 0,
    markCount: 0,
    secsPassed: 0,
    livesCount: 0,
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBombsCount
var gTimerInterval
var gStartTime


function onInit() {
    clearInterval(gTimerInterval)
    gStartTime = null
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT
    gGame.isOn = true
    gGame.showCount = 0
    gGame.markCount = 0
    document.querySelector('.restart').classList.add('hidden')
    buildBoard()
    updateMineCounter()
    addLives()
}

function buildBoard() {
    gBoard = []
    var boardSize = gLevel.SIZE
    for (var i = 0; i < boardSize; i++) {
        gBoard[i] = []
        for (var j = 0; j < boardSize; j++) {
            var currCell = {
                minesAroundCount: 0,
                isShown: false, // האם התא לחוץ או לא?
                isMine: false, // האם יש שם פצצה?
                isMarked: false // האם יש שם דגל?
            }
            gBoard[i][j] = currCell
        }

    }
    renderBoard()
}


function renderBoard() {
    var strHTML = '<table>'
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {
            var cellClass = ''
            if (gBoard[i][j].isShown) {
                cellClass = 'shown'
            }
            strHTML += `<td 

                class="cell-${i}-${j} ${cellClass}" 
                onclick="onCellClicked(this, ${i}, ${j})"
                oncontextmenu="onCellMarked(event, this, ${i}, ${j})">
                </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>'
    document.querySelector('.card-game').innerHTML = strHTML // לשנות תשם של הקלאס
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return; // אם המשחק לא פעיל, לא עושים כלום

    var currCell = gBoard[i][j];
    if (currCell.isShown || currCell.isMarked) return; // אם התא נחשף או מסומן, לא עושים כלום

    if (!gStartTime) { // אם זו הלחיצה הראשונה
        gStartTime = Date.now(); // מתחילים את הטיימר
        startTimer();
        addBombs(i, j); // מניחים את הפצצות אחרי הלחיצה הראשונה
    }

    if (currCell.isMine) { // אם השחקן לחץ על מוקש אחרי הנחת הפצצות
        showBomobs(); // מציג את כל המוקשים
        return;
    }

    if(currCell.isMine){
        gGame.lives--
        addLives()

        if(gGame.lives === 0){
            showBomobs()
            return
        }else{
            alert(`You fell on a bomb, you have${gGame.lives} another life`)
        }
    }

    currCell.isShown = true;
    gGame.showCount++;
    elCell.classList.add('shown');

    if (currCell.minesAroundCount > 0) {
        elCell.innerText = currCell.minesAroundCount;
    } else {
        elCell.innerText = '';
        expandShow(i, j); // פותח תאים סמוכים אם אין מוקשים מסביב
    }

    checkGameOver(); // בדיקה אם המשחק נגמר
}

function expandShow(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i == cellI && j == cellJ) continue
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[i].length) continue

            var currCell = gBoard[i][j]
            const elCell = document.querySelector(`.cell-${i}-${j}`)

            if (!currCell.isMarked && !currCell.isMine && !currCell.isShown) {
                currCell.isShown = true
                gGame.showCount++
                elCell.classList.add('shown')

                if (currCell.minesAroundCount > 0) {
                    elCell.innerText = minesAroundCount
                } else {
                    elCell.innerText = ''
                }

                if (currCell.minesAroundCount === 0) {
                    expandShow(i, j)
                }
            }

        }

    }

}

function checkGameOver() {
    var totalCells = gBoard.length * gBoard[0].length
    var noMinesCell = totalCells - gLevel.MINES
3
    if (gGame.showCount === noMinesCell) {

        showAllCells() 

        setTimeout(() => {
            alert('You won!😎')
            clearInterval(gTimerInterval)
            gGame.isOn = false
            document.querySelector('.restart').classList.remove('hidden')
        }, 100)
    }
}

function showAllCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                currCell.isShown = true
                elCell.classList.add('shown')
                elCell.innerText = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''
            }
        }
    }
}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()

    if (!gGame.isOn) return


    var currCell = gBoard[i][j]
    if (currCell.isShown) return

    currCell.isMarked = !currCell.isMarked
    if (currCell.isMarked) {
        elCell.innerText = '⛳'
        gGame.markCount++
    } else {
        elCell.innerText = ''
        gGame.markCount--
    }
    updateMineCounter()
    checkGameOver()
}

function updateMineCounter() {
    const elBombsCount = document.querySelector('.bombsCount')
    elBombsCount.innerText = gLevel.MINES - gGame.markCount
}

function startTimer() 
{
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        const delta = Date.now() - gStartTime 
        const formattedTime = formatTime(delta)
        
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = formattedTime
        
    }, TIMER_INTERVAL)
}

function formatTime(ms) 
{
    var minutes = Math.floor(ms / 60000)
    var seconds = Math.floor((ms % 60000) / 1000)
    // var milliseconds = ms % 1000
    return `${
        padTime(minutes)}
        :${padTime(seconds)}`
        // .${padMiliseconds(milliseconds)}
}

function padTime(val) 
{
    return String(val).padStart(2, '0')
}

function resetGame() 
{
        clearInterval(gTimerInterval); // איפוס הטיימר
        gStartTime = null; // איפוס זמן התחלה
        gGame = {
            isOn: true,
            showCount: 0,
            markCount: 0,
            secsPassed: 0
        };
        buildBoard(); // בונה מחדש את הלוח עם רמת הקושי החדשה
        document.querySelector('.restart').classList.add('hidden'); 
}

function onChangeDifficulty(elBtn) 
{
    var elTxt = elBtn.innerText
    if (elTxt === 'Easy') 
    {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } 
    else if (elTxt === 'Medium') 
    {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } 
    else 
    {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    onInit()
}

function startTimer() {
    gStartTime = Date.now()

    gTimerInterval = setInterval(() => {
        const delta = Date.now() - gStartTime 
        const formattedTime = formatTime(delta)
        
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = formattedTime
        
    }, TIMER_INTERVAL)
}

function addLives() {   
    const elLives = document.querySelector('.lives')
    var strHTML = ''

    for (var i = 0; i < gGame.lives; i++) {
        strHTML+= '😄'
    }
  
    elLives.innerHTML = strHTML
}

