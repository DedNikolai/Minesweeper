const number = 15;
const bomsCout = 30;
const bombs = [];
const cells = [];
let checked = [];

class Cell {
    constructor(id, neibors) {
        this.isBomb = false;
        this.isOpen = false;
        this.id = id;
        this.bombsAround = 0;
        this.neibors = neibors;
        this.value = 0;
        this.isChecked = false;
    }
};

init(number);
randomizeBombs(number);
setValue();

function randomizeBombs(number) {
    while(bombs.length < bomsCout) {
        let temp = Math.floor(Math.random() * (number*number))
        if (!bombs.includes(temp)) {
            cells[temp].isBomb = true;
            bombs.push(temp);
            
        }
    }
    bombs.sort((a, b) => a-b);
};

function init(number) {
    for (let i = 0; i < number; i++) {
        const table = document.querySelector('.table');
        const row = document.createElement('div');
        row.className = 'row';
        table.append(row)
        for (let j = 0; j < number; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            let id = i*number + j;
            cell.id = id;
            let neibors = setNeibors(i, j, number)
            cells.push(new Cell(id, neibors));
            row.append(cell)
        }
    }
};

function setNeibors(i, j, number) {
    let left = j != 0 ? i*number + j - 1 : null;
    let topLeft = i != 0 && j != 0 ? (i-1)*number + j - 1 : null;
    let bottomLeft = i != number - 1 && j != 0 ? (i+1)*number + j - 1 : null;
    let top = i != 0 ? (i-1)*number + j : null;
    let bottom = i != number - 1 ? (i+1)*number + j : null;
    let rigth = j != number - 1 ? i*number + j + 1 : null;
    let topRight = j != number - 1 && i > 0 ? (i-1)*number + j + 1 : null;
    let bottomRight = j != number - 1 && i != number - 1 ? (i+1)*number + j + 1 : null;
    let neibors = [left, topLeft, bottomLeft, top, bottom, rigth, topRight, bottomRight];

    return neibors.filter(item => item == 0 || item)
};

function setValue() {
    for (let cell of cells) {
        let counter = 0;
        if (!cell.isBomb) {
            cell.neibors.forEach(id => {
                if (cells[id].isBomb) counter++;
            });
        }
    
        cell.value = counter;
    }
};

document.body.querySelector('.table').addEventListener('click', function open(event) {
    let cell = event.target;
    let cellObject = cells[cell.id];
    if (cellObject.isChecked || cellObject.isOpen) return
    cellObject.isOpen = true;
    if (cellObject.isBomb) {
        let status = document.body.querySelector('.status');
        status.classList.add('status-looser');
        cell.classList.add('cell--bomb');
        document.body.querySelector('.table').removeEventListener('click', open)
        openAllBombs(false)
        return
    }

    cell.classList.add('cell--open');
    if (cellObject.value) {
        cell.innerHTML = cellObject.value
    } else (
        openNeibors(cellObject)
    )
      
});

document.body.querySelector('.status').addEventListener('click', () => {
    location.reload()
})

document.body.querySelector('.table').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    let cell = e.target;
    let cellObject = cells[cell.id];
    if (cellObject.isOpen) return

    if (cellObject.isChecked) {
        checked = checked.filter(item => item !== cellObject.id)
    } else {
        checked.push(cellObject.id);
        checked.sort((a, b) => a - b);
    }

    cellObject.isChecked = !cellObject.isChecked;
    cell.classList.toggle('cell--checked');
    
    
    if (isWon()) {
        let status = document.body.querySelector('.status');
        status.classList.add('status-won');
        document.body.querySelector('.table').removeEventListener('click', open);
        openAllBombs(true);
    }
})

function openNeibors(cellObject) {
    let neibors = cellObject.neibors;
    for (let i = 0 ; i < neibors.length; i ++) {
        let neiborId = neibors[i];
        let neibor = cells[neiborId];
        if (!neibor.isBomb && !neibor.isOpen && !neibor.isChecked) {
            let cell = document.getElementById(`${neiborId}`)
            cell.classList.add('cell--open');
            neibor.isOpen = true;
            if (neibor.value) {
                cell.innerHTML = neibor.value;
            } else {
                openNeibors(neibor)
            }
        }

    }
};

function openAllBombs(isWon) {
    bombs.forEach((id) => {
        let cell = document.getElementById(id);
        // cell.innerHTML = '*';
        if (!isWon) {
            if (!cells[id].isOpen) {
                cell.classList.add('cell--bomb');
            }
        } else {
            cell.classList.add('cell--success')
        }

    })
};

function isWon() {
    if (bombs.length === checked.length) {
        for (let i = 0; i < bombs.length; i++) {
            if (bombs[i] !== checked[i]) return false
        }

        return true;
    }
}



