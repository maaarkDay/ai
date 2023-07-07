const Perceptron = require('./perceptron.js');
const { dataSet_2_100 } = require('./trainingData.js');

const p = new Perceptron(3);
console.log("Initialized perceptron.\n", p);
console.log("Training...");
dataSet_2_100.forEach((dataSet, i) => {
  const inputs = dataSet.splice(0,3);
  const [ target ] = dataSet;
  p.train(inputs, target);
})
console.log("Trained perceptron.\n", p);

console.log("prediction:", p.predict([45, 200,1]));
