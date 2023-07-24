const { xOr: trainingData } = require('./trainingData');

function xor(brain, epochs = 10000) {
  /**
   * @param {MultiLayerPerceptron} brain
   * @param {number} epochs
   */
  console.log("\nXOR");
  console.log(`training for ${epochs} iterations...`);
  for (let i = 0; i < epochs; i++) {
    const randomNum = Math.floor(Math.random() * 4);
    const { inputs, targets } = trainingData[randomNum];
    brain.train(inputs, targets);
  }
  console.log("running 4 tests...");
  for (data of trainingData) {
    console.log(
      brain.predict(data.inputs),
      `${data.targets[0] === Math.round(brain.predict(data.inputs))
        ? "✅"
        : "❌"}`
    );
  }
}

module.exports = {
  xor
}
