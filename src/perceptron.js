'use strict'

module.exports = function Perceptron(size = 3, options = {}) {
  /**
   * @param {number} size 
   * @param {number[]} [options.initialWeights]
   * @param {number} [options.learningRate]
   */   
  this.size = size;
  this.learningRate = _initLearningRate(options.learningRate);
  this.weights = _initWeights(size, options.initialWeights);
  this.predict = predict;
  this.train = train;
  
  function predict(inputs) {
    /**
     * @param {number[]} inputs
     * @return {number} 1 or -1.
     */
    if (!Array.isArray(inputs)) throw new Error("Invalid param: type must be array.")
    if (inputs.length !== this.size) throw new Error(`Invalid param: array must contain ${this.size} inputs.`)
    let sum = 0;
    for ( let i = 0; i < inputs.length; i++ ) {
      sum+= inputs[i] * this.weights[i];
    }
    return _activation(sum);
  }

  function train(inputs, target) {
    /**
     * @param {number[]} inputs
     * @param {number} target     1 or -1.
     */
    const prediction = this.predict(inputs);
    const error = target - prediction;
    this.weights.forEach((w, i) => {
      this.weights[i] = w + inputs[i] * error * this.learningRate; 
    }) 
  }

  function _initWeights(size, initialWeights) {
    /**
     * @param {number} size
     * @param {number[]} [initialWeights]
     */
    if (initialWeights && !Array.isArray(initialWeights)) 
      throw new Error("Invalid param: initialWeights - must be an array.");
    if (initialWeights && initialWeights.length !== size)
      throw new Error("Invalid param: initialWeights length must be equal to size.")
    return Array.from({
      length: size
    }, () => Math.random()*2-1);
  }

  function _initLearningRate(rate) {
    /**
     * @param {number} [rate]
     */
    const DEFAULT_RATE = .1;
    if (rate) {
      if (rate < 0 || rate > 1)
        throw new Error("Invalid param: learningRate must be between 0 and 1.")
    }
    return rate || DEFAULT_RATE;
  }

  function _activation(input) {
    /**
     * @param {number} input
     */
    return input > 0? 1 : -1;
  }

}
