const size = 4;
let board = [];
const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  addRandomTile();
  addRandomTile();
  statusEl.textContent = '';
  render();
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  grid.innerHTML = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      const value = board[r][c];
      cell.className = 'cell' + (value ? ' tile-' + value : '');
      cell.textContent = value === 0 ? '' : value;
      grid.appendChild(cell);
    }
  }
}

function slide(row) {
  row = row.filter(v => v !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  row = row.filter(v => v !== 0);
  while (row.length < size) row.push(0);
  return row;
}

function transpose(mat) {
  return mat[0].map((_, i) => mat.map(row => row[i]));
}

function boardsEqual(a, b) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function move(direction) {
  const old = board.map(row => row.slice());
  if (direction === 'left') {
    board = board.map(slide);
  } else if (direction === 'right') {
    board = board.map(row => slide(row.reverse()).reverse());
  } else if (direction === 'up') {
    board = transpose(board);
    board = board.map(slide);
    board = transpose(board);
  } else if (direction === 'down') {
    board = transpose(board);
    board = board.map(row => slide(row.reverse()).reverse());
    board = transpose(board);
  }
  if (!boardsEqual(old, board)) {
    addRandomTile();
    render();
    checkGame();
  }
}

function hasMoves() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true;
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function checkGame() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 2048) {
        statusEl.textContent = 'You win!';
        return;
      }
    }
  }
  if (!hasMoves()) {
    statusEl.textContent = 'Game over!';
  }
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft':
      move('left');
      break;
    case 'ArrowRight':
      move('right');
      break;
    case 'ArrowUp':
      move('up');
      break;
    case 'ArrowDown':
      move('down');
      break;
  }
});

document.getElementById('new-game').addEventListener('click', init);

init();
