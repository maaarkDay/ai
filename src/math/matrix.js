
module.exports = function Matrix(options) {
  this.data = _init(options);
  this.add = add;
  this.multiply = multiply;
  this.product = product;
  this.transpose = transpose;

  function add(n) {
    /**
     * @param {(Matrix|Number)} n
     * @return {this}
     */
    // Scalar
    if (typeof n === "number") {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] += n;
        }
      }
    } 
    // Element-wise
    if (n instanceof Matrix) {
      const { data } = n;
      if (data.length !== this.data.length) throw new Error("Matrix rows must match.");
      data.forEach((row, i) => {
        if (row.length !== this.data[i].length)  
          throw new Error("Matrix columns must match.");
      })
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] += data[i][j];
        }
      }
    }
  }

  function multiply(n) {
    /**
     * @param {(Matrix|Number)} n
     * @return {this} 
     */
    if (n) throw new Error("Missing param: argument.");
    // Scalar
    if (typeof n === "number") {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] += n.data[i][j];
        }
      } 
    }
    // Element-wise
    else {
      if (this.data.length !== n.data.length) throw new Error("Matrix rows must match.");
      for (let i = 0; i < this.data.length; i++) {
        if (n.data.length !== this.data[i].length) throw new Error("Matrix columns must match.");
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] = this.data[i][j] * n.data[i][j];
        }
      }
    }
 }

  function product(n) {
    /**
    * @param {Matrix} n
    * @return {Matrix}
    */
    if (!n instanceof Matrix) throw new Error("Invalid param: arg must be a Matrix.");
    if (this.data[0].length !== n.data.length) throw new Error("Invalid param: Matrix cols must match arg Matrix rows.");
    const result = new Matrix({
      rows: this.data.length,
      columns: n.data[0].length,
      fill: 0
    });
    for (let i = 0; i < result.data.length; i++) {        // result rows
      for (let j = 0; j < result.data[0].length; j++) {   // result cols
        let sum = 0;
        for (let k = 0; k < this.data[0].length; k++) {   // this.data cols
          sum = sum + this.data[i][k] * n.data[k][j]
        }
        result.data[i][j] = sum;
      }        
    }
    return result;
  }

  function transpose() {
    /** 
     * @return {Matrix} New Matrix.
     */
    const result = new Matrix ({
      rows: this.data[0].length,
      columns: this.data.length,
      fill: 0
    });
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[0].length; j++) {
         result.data[j][i] = this.data[i][j];
      }
    }
    return result;
  }

  function _init(options) {
    const { rows, columns, fill } = options;
    const result = new Array(rows || 0);
    if (rows && columns) {
      for (let i = 0; i < rows; i++) {
        if (fill !== undefined && typeof fill === "number") result[i] = new Array(columns).fill(fill || 0);
        if (fill && fill === "random") {
          const column = new Array(columns);
          for (let idx = 0; idx < columns; idx++) {
            const randomNumber = Math.floor(Math.random() * 10);
            column[idx] = randomNumber;
            result[i] = column;
          }
        }
      } 
    }
    return result;
  }

}
