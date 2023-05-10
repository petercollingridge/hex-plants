// Random integer from 0 - n
function randInt(n) {
  return Math.floor(Math.random() * n);
}

// Return a random item from an array
function randFromArray(arr) {
  return arr[randInt(arr.length)];
}
