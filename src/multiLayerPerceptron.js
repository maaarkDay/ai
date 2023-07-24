'use strict'
const Math = require('./math/math.js');
const activationFunctions = require('./activationFunctions');

module.exports = function MultiLayerPerceptron(options) {
  /**
   * @param {number} options.inputs         Number of input nodes.
   * @param {number} options.hidden         Number of hidden nodes.
   * @param {number} options.outputs        Number of output nodes.
   * @param {string} options.activationFn   Name of activation function.
   * @param {number} [options.learningRate] Learning rate.   
   */
  this.inputs = options.inputs;
  this.hidden = options.hidden;
  this.outputs = options.outputs;
  this.activationFn = options.activationFn || activationFunctions.sigmoid
  this.learningRate = options.learningRate || .1;
  this.weights = new Map([
    [0, new Math.Matrix({
      rows: options.hidden,
      columns: options.inputs,
      fill: "random" 
    })],
    [1, new Math.Matrix({
      rows: options.outputs,
      columns: options.hidden,
      fill: "random"
    })],
  ]);
  this.biases = new Map([
    [0, new Math.Matrix({
      rows: options.hidden,
      columns: 1,
      fill: "random"
    })],
    [1, new Math.Matrix({
      rows: options.outputs,
      columns: 1,
      fill: "random"
    })]
  ])
  this.predict = predict;
  this.train = train;

  function predict(inputs = []) {
    /**
     * @param {number[]} inputs
     * @return {number[]}
     */
    // Convert input to matrix
    const inputMatrix = _arrToMatrix(inputs);
    // Calculate hidden layer outputs 
    const hiddenOutputs = this.weights.get(0)
      .product(inputMatrix)
      .add(this.biases.get(0))
      .map(this.activationFn);
    // Calculate output
    const outputs = this.weights.get(1)
      .product(hiddenOutputs)
      .add(this.biases.get(1))
      .map(this.activationFn);
    return outputs.data.flat();
  }

  function train(inputs = [], targets = []) {
    const inputMatrix = _arrToMatrix(inputs);
    const targetsMatrix = _arrToMatrix(targets);
    const hiddenOutputs = this.weights.get(0)
      .product(inputMatrix)
      .add(this.biases.get(0))
      .map(this.activationFn);
    const outputs = this.weights.get(1)
      .product(hiddenOutputs)
      .add(this.biases.get(1))
      .map(this.activationFn);
    
    // Output errors
    targetsMatrix.subtract(outputs);
    // Gradients
    const gradients = new Math.Matrix({
      fill: outputs.data
    }).map(y => y * (1 - y))
      .multiply(targetsMatrix)
      .multiply(this.learningRate);
    // Calculate deltas
    const transposedHiddenOutputs = hiddenOutputs.transpose();
    const layer2WeightsDeltas = gradients.product(transposedHiddenOutputs);
    // Update layer 2 weights and bias
    this.weights.get(1).add(layer2WeightsDeltas);
    this.biases.get(1).add(gradients);

    // Hidden errors
    const transposedL2Weights = this.weights.get(1).transpose();
    const hiddenErrors = transposedL2Weights.product(targetsMatrix);
    // Gradients
    const hiddenGradients = new Math.Matrix({
      fill: hiddenOutputs.data
    }).map(y => y * (1 - y))
      .multiply(hiddenErrors)
      .multiply(this.learningRate);
    // Calculate deltas
    const transposedInputs = inputMatrix.transpose();
    const layer1WeightsDeltas = hiddenGradients.product(transposedInputs);
    // Update layer 1 weights and bias
    this.weights.get(0).add(layer1WeightsDeltas);
    this.biases.get(0).add(hiddenGradients);
  } 

  function _arrToMatrix(arr) {
    const matrix = new Math.Matrix({
      rows: arr.length,
      columns: 1,
      fill: 0
    })
    for (let i = 0; i < arr.length; i++) {
      matrix.data[i][0] = arr[i];
    }
    return matrix;
  }

}

