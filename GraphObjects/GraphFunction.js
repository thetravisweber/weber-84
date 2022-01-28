class GraphFunction extends GraphObject {
  constructor (func) {
    super();
    this._func = func;
    this.type = FUNCTION;
  }

  draw(color=PRIMARY, weight=WEIGHT) {
    stroke(color);
    strokeWeight(weight);
    this._renderer.graph(this._func);
  }

  derivative(x) {
    // unsure of dx
    // too small causes errors, too big causes inaccuracies,
    // maybe make dx dynamic based on factors like the size of x and f(x)
    let dx = 10**-12;
    dx = 32 / Number.MAX_SAFE_INTEGER;
    let x2 = x + dx;

    let y = this._func(x);
    let y2 = this._func(x2);

    let dy = y2 - y;
    return dy / dx;
  }

  tangent(x) {
    let m = this.derivative(x);
    let y = this._func(x);
    return new Vector(1, m, x, y);
  }

  unitTangent(x, scalar=2.5) {
    let m = this.derivative(x);
    let y = this._func(x);
    let vec = new UnitVector(1, m, x, y);
    Vector.multiplyScalar(vec, scalar);
    return vec;
  }

  highlightTangent(x) {
    let vec = this.unitTangent(x);
    let pt = new Point(vec.tail().x, vec.tail().y);
    mainField.addChild(vec);
    mainField.addChild(pt);
    vec.highlight();
    pt.highlight();
    mainField.removeLastChild();
    mainField.removeLastChild();
  }

  translate(deltaX, deltaY) {
    this.translateX(deltaX);
    this.translateY(deltaY);
  }

  translateX(deltaX) {
    let initialFunc = this._func;
    this._func = x => initialFunc(x-deltaX);
  }

  translateY(deltaY) {
    let initialFunc = this._func;
    this._func = x => initialFunc(x) + deltaY;
  }

  static isGraphFunction(functionText) {
    if (!functionText.includes('=')) {
      return;
    }
    // if line 
    if (functionText.includes('=>')) {
      return;
    }
    
    let rightSide = functionText.substring(functionText.indexOf('=') + 1);
    let rightSideTest = isValidString(rightSide);
    rightSideTest = rightSideTest && isValidString(rightSide.charAt(rightSide.length - 1));

    return rightSideTest;

    function isValidString(txt) {
      // txt contains x or number
      let test = /[x\d]/.test(txt);
      // txt does not contain any other letters
      test = test && !/[A-Za-wy-z]/.test(txt);
      return test;
    }
  }

  static getFunctionText(functionText) {
    functionText = functionText.substring(functionText.indexOf('=') + 1);
    functionText = functionText.trim();
    
    // n = constant
    for (let i = 1; i < functionText.length; i++) {
      let char = functionText[i];
      let lastChar = functionText[i-1];
      // nx => n*x
      if (/[\d]/.test(lastChar) !== /[\d]/.test(char)) {
        if (!/[*+-/]/.test(lastChar) && !/[*+-/]/.test(char)) {
          injectString('*');
        }
      }
      // x^n => x**n
      if (char == '^') {
        injectString('**');
      }

      function injectString(substr) {
        functionText = functionText.substring(0, i) + substr + functionText.substring(i + substr.length - 1);
        i += substr.length;
      }
    }
    return functionText;
  }

  static createFunction(functionText) {
    let func = new Function('x', `return ${functionText};`);
    return func;
  }

  toString() {
    let str = this._func.toString();
    str = str.substring(str.indexOf('=>') + 2);
    str = 'f(x) =' + str;
    str = str.replaceAll('**', '^');
    return str;
  }

}