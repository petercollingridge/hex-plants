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

// Return an array of n random numbers between -1 and 1
function randArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.random() * 2 - 1);
  }
  return arr;
}

// Return a random integer from 0 - n
function randInt(n) {
  return Math.floor(Math.random() * n);
}

// Return a random item from an array
function randFromArray(arr) {
  return arr[randInt(arr.length)];
}

function sigmoid(n) {
  return 1 / (1 + Math.exp(-n));
};

// Propagate singles from one layer to the next in the neural net
// Given an arrray of inputs, an array of outputs and an array of weights,
// which should have a length equal to the product of the input and bias lengths
function nextLayer(inputs, biases, weights) {
  const inputSize = inputs.length;
  const outputSize = biases.length;
  const output = [];

  // Loop through output nodes
  for (let i = 0; i < outputSize; i++) {
    let value = biases[i];

    // Loop through input nodes
    for (let j = 0; j < inputSize; j++) {
      value += inputs[j] * weights[i * 4 + j];
    }

    output.push(sigmoid(value));
  }

  return output;
}

const EPSILON = 1e-6;
