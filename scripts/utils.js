// Given a cell at x, y, return the hex grid coordinates
// when moving in a direction 0-5, which are the hex edges
// starting at the lower right and moving clockwise
const POSITIONS = [
  [[1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, 0]],
  [[1, 0], [0, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
];
function getPosition(x, y, dir) {
  const d = POSITIONS[Math.abs(x) % 2][dir];
  return [x + d[0], y + d[1]];
}

// Random integer from 0 - n
function randInt(n) {
  return Math.floor(Math.random() * n);
}

// Return a random item from an array
function randFromArray(arr) {
  return arr[randInt(arr.length)];
}
