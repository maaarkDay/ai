'use strict'
const Math = require('./math/math.js');
const activationFunctions = require('./activationFunctions');

module.exports = function NueralNetwork(options) {
  /**
   * @param {number} options.inputs   Number of input nodes.
   * @param {number} options.hidden   Number of hidden nodes.
   * @param {number} options.outputs  Number of output nodes.
   * @param {string} options.activationFn  Name of activation function.
   */
  this.inputs = options.inputs;
  this.hidden = options.hidden;
  this.outputs = options.outputs;
  this.activationFn = options.activationFn || activationFunctions.sigmoid
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
  this.feedForward = feedForward;

  function feedForward(inputs = []) {
    /**
     * @param {number[]} inputs
     * @return {number[]}
     */
    // Convert input to matrix
    const inputMatrix = _arrToMatrix(inputs);
    // Calculate hidden layer outputs 
    const hiddenOutputs = this.weights.get(0).product(inputMatrix);
    hiddenOutputs.add(this.biases.get(0));
    hiddenOutputs.map(this.activationFn);
    // Calculate output
    const output = this.weights.get(1).product(hiddenOutputs);
    output.add(this.biases.get(1));
    output.map(this.activationFn);
    return output.data.flat();
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

