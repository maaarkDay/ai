
module.exports = function Matrix(options) {
  this.data = _init(options);
  this.add = add;
  this.subtract = subtract;
  this.multiply = multiply;
  this.product = product;
  this.transpose = transpose;
  this.map = map;

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
    return this;
  }

  function subtract(n) {
    /**
     * @param {(Matrix|Number)} n
     * @return {this}
     */
    // Scalar
    if (typeof n === "number") {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] -= n;
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
          this.data[i][j] -= data[i][j];
        }
      }
    }
    return this;
  }

  function multiply(n) {
    /**
     * @param {(Matrix|Number)} n
     * @return {this} 
     */
    if (!n) throw new Error("Missing param: argument.");
    // Scalar
    if (typeof n === "number") {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] = this.data[i][j] * n;
        }
      } 
    }
    // Element-wise
    else {
      if (this.data.length !== n.data.length) throw new Error("Matrix rows must match.");
      if (this.data[0].length !== n.data[0].length) throw new Error("Matrix columns must match.");
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].length; j++) {
          this.data[i][j] = this.data[i][j] * n.data[i][j];
        }
      }
    }
    return this;
  }

  function product(n) {
    /**
    * @param {Matrix} n
    * @return {Matrix}  // New Matrix.
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
    /**g
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

  function map(fn) {
    /**
     * Runs a function on every element in matrix.
     *
     * @param {function} fn
     * @return {this}
     */
    if (typeof fn !== "function") 
        throw new Error("Invalid param: Must be a function.");
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] = fn(this.data[i][j]);
      }
    }
    return this;
  }

  function _init(options) {
    const { rows, columns, fill } = options;
    let result = new Array(rows || 0);
    if (rows && columns) {
      for (let i = 0; i < rows; i++) {
        if (fill !== undefined && typeof fill === "number") result[i] = new Array(columns).fill(fill || 0);
        if (fill && fill === "random") {
          const column = new Array(columns);
          for (let idx = 0; idx < columns; idx++) {
            const randomNumber = Math.random()*2-1;
            column[idx] = randomNumber;
            result[i] = column;
          }
        }
      } 
    }
    else if (fill && Array.isArray(fill)) {
      // Deep copy for array of arrays
      result = JSON.parse(JSON.stringify(fill));
    }
    return result;
  }

}
