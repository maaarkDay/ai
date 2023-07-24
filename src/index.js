const readline = require('readline');
const Perceptron = require('./perceptron.js');
const { dataSet_2_100, xOr } = require('./trainingData.js');
const ML_Math = require('./math/math.js')
const MultiLayerPerceptron = require('./multiLayerPerceptron.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const x = input.split(" ");
  const [ command, ...args ] = x;

  switch(command) {
    case 'exit': 
      process.exit();
      break;
    case 'create-p':
      createPerceptron(args);
      break;
    case 'train-p':
      trainPerceptron(args);
      break;
    case 'predict':
      predict(args);
      break;
    case 'create-matrix':
      createMatrix(args);
      break;
    case 'add-matrix':
      add(args);
      break;
    case 'subtract-matrix':
      subtract(args);
      break;
    case 'multiply-matrix':
      multiply(args);
      break;
    case 'product-matrix':
      product(args);
      break;
    case 'transpose-matrix':
      transpose(args);
      break;
    case 'map-matrix':
      map(args);
      break;
    case 'get-matrix':
      get(args);
      break;
    default:
      console.log('Unknown command!');
      break;
  }
});

// Perceptron
let perceptron;
function createPerceptron(data = []) {
  const inputCount = Number(data[0]); 
  const p = new Perceptron(inputCount);
  perceptron = p;
  console.log(perceptron);
}

function trainPerceptron(data = []) {
  dataSet_2_100.forEach((dataSet, i) => {
    const inputs = dataSet.splice(0,3);
    const [ target ] = dataSet;
    perceptron.train(inputs, target);
    console.log(perceptron);
  })
}

function predict(data = []) {
  data.forEach((item, i) => {
    data[i] = Number(item); 
  })
  const prediction = perceptron.predict(data);
  console.log(prediction);
}

// Matrix
let matrices = new Map();
function createMatrix(data = []) {
  const [ id, rowCount, colCount, fill ] = data;
  const options = {};
  if (rowCount) options.rows = Number(rowCount);
  if (colCount) options.columns = Number(colCount);
  if (fill) {
    fill === "random"
      ? options.fill = fill
      : options.fill = Number(fill);
  }
  matrix = new ML_Math.Matrix(options);
  matrices.set(id, matrix);
  console.table(matrix.data);
}

function get(data = []) {
  return console.table(matrices.get(data[0])?.data || "none");
}

function add(data=[]) {
  const [ id, ...args ] = data;
  const matrix = matrices.get(id);
  // Scalar
  // Example command: add-matrix 1 2 
  // 1 is the id of the matrix
  // 2 is the number to add to all elements in matrix
  if (args.length === 1) {
    const scalar = Number(args[0]);
    const updatedMatrix = matrix.add(scalar);
    return console.table(updatedMatrix.data);
  } 
  // Matrix 
  // Example command: add-matrix 1 2 x
  // 1 is the id of the matrix
  // 2 is the id of the second matrix
  // x can me anything, its just a flag to let this function know
  // that this is matrix addition instead of scalar addition.
  else {
    const [ id2, flag ] = args;
    const matrix_2 = matrices.get(id2);
    if (!matrix_2) console.log(`Missing param: matrix with id ${id2}.`);
    matrix.add(matrix_2);
    return console.table(matrices.get(id).data);
  }
}

function subtract(data=[]) {
  const [ id, ...args ] = data;
  const matrix = matrices.get(id);
  // Scalar
  // Example command: subtract-matrix 1 2 
  // 1 is the id of the matrix
  // 2 is the number to subtract from  all elements in matrix
  if (args.length === 1) {
    const scalar = Number(args[0]);
    const updatedMatrix = matrix.subtract(scalar);
    return console.table(updatedMatrix.data);
  } 
  // Matrix 
  // Example command: subtract-matrix 1 2 x
  // 1 is the id of the matrix
  // 2 is the id of the second matrix
  // x can me anything, its just a flag to let this function know
  // that this is matrix addition instead of scalar addition.
  else {
    const [ id2, flag ] = args;
    const matrix_2 = matrices.get(id2);
    if (!matrix_2) console.log(`Missing param: matrix with id ${id2}.`);
    matrix.subtract(matrix_2);
    return console.table(matrices.get(id).data);
  }
}

function multiply(data=[]) {
  // Matrix 
  // Example command: multiply-matrix 1 2
  // 1 is the id of the matrix
  // 2 is the id of the second matrix
  // Example command: multiply-matrix 1 2 scalar
  // 1 is the id of the matrix
  // 2 is the scalar
  // scalar is the flag
  if (data.length === 2) {
    const [ id, id2 ] = data;
    const matrix = matrices.get(id);
    const matrix_2 = matrices.get(id2);
    if (!matrix) console.log(`Missing param: matrix with id ${id}.`);
    if (!matrix_2) console.log(`Missing param: matrix with id ${id2}.`);
    const updatedMatrix = matrix.multiply(matrix_2);
    return console.table(updatedMatrix.data);
  } 
  if (data.length === 3) {
    const [ id, scalar, flag ] = data;
    if (flag === "scalar") {
      const matrix = matrices.get(id);
      const updatedMatrix = matrix.multiply(Number(scalar));
      return console.table(updatedMatrix.data);
    }
  }
}

function product (data = []) {
  // Matrix
  // Example command: product-matrix 1 2
  // 1 is the id of the matrix
  // 2 is the id of the second matrix
  // Returns a NEW matrix
  const matrix_1 = matrices.get(data[0]);
  const matrix_2 = matrices.get(data[1]);
  const result = matrix_1.product(matrix_2);
  return console.table(result.data); 
}

function transpose(data = []) {
  // Matrix
  // Example command: transpose-matrix 1
  // 1 is the id of the matrix
  // Returns a NEW matrix
  const matrix = matrices.get(data[0]);
  const result = matrix.transpose();
  return console.table(result.data);
}

function map(data = []) {
  // Matrix
  // Example command: map-matrix 1
  // 1 is the id of the matrix
  const matrix = matrices.get(data[0]);
  const testFn = (number) => {
    return number * 2; 
  }
  const updatedMatrix = matrix.map(testFn);
  return console.table(updatedMatrix.data);
}

// Neural Network
const brain = new MultiLayerPerceptron({
  inputs: 2,
  hidden: 2,
  outputs: 1
})

console.log("\nXOR training test...");
for (let i = 0; i < 50000; i++) {
  const randomNum = Math.floor(Math.random() * 4);
  const { inputs, targets } = xOr[randomNum];
  brain.train(inputs, targets);
}

for (data of xOr) {
  console.log(
    brain.predict(data.inputs),
    `${data.targets[0] === Math.round(brain.predict(data.inputs))
      ? "✅"
      : "❌"}`
  );
}


//let prediction = brain.predict([0,0]);
//console.log("prediction:", prediction);
//prediction = brain.predict([0,1]);
//console.log("prediction:", prediction);
//prediction = brain.predict([1,1]);
//console.log("prediction:", prediction);
//prediction = brain.predict([1,1]);
//console.log("prediction:", prediction);





