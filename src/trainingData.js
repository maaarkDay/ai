module.exports = {
  dataSet_2_100: function() {
    const data = [];
    for (let i = 1; i < 100; i++) {
      const bias = 1;
      const x = Math.random();
      const y = Math.random();
      const tag = x > y? 1 : -1;
      data.push([
        x,
        y,
        bias,
        tag
      ]);
    }
    return data;
  }()
}
