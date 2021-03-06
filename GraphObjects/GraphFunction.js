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
    // well tested, this is the most accurate value for dx we'll get
    let dx = 2**-24;
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
    let leftSide = functionText.substring(0, functionText.indexOf('='));
    if (!this.isValidFunctionName(leftSide)) {
      return;
    }
    // if line 
    if (functionText.includes('=>')) {
      return;
    }
    
    functionText = functionText.substring(functionText.indexOf('=') + 1);
    functionText = functionText.trim();
    if (!functionText) {
      return;
    }

    // if doesn't contain any digits or variables
    if (!/[\dA-Za-z()]/.test(functionText)) {
      return;
    }

    // if the first or last character is an operator
    if (!/[\dA-Za-z(]/.test(functionText[0]) || !/[\dA-Za-z)]/.test(functionText[functionText.length - 1])) {
      return;
    }

    for (let i = 0; i < functionText.length; i++) {
      // two adjacent operators(unless they're both parentheses or **)
      if (charExists(-1)
        && (/[*+-/()^]/.test(char()) && /[*+-/()^]/.test(char(-1)))
        && (char() !== '*' || char(-1) !== '*')
        && !(char(-1) === ')' && /[*+-/^()]/.test(char())
          || char() === '(' && /[*+-/^()]/.test(char(-1)))) {
          return;
      }
      function char(indexOffset=0) {
        if (i + indexOffset !== constrain(i + indexOffset, 0, functionText.length - 1)) {
          return false;
        }
        return functionText[i + indexOffset];
      }
      function charExists(indexOffset) {
        return i + indexOffset === constrain(i + indexOffset, 0, functionText.length - 1);
      }
    }
    return true;
  }

  static getFunctionText(functionText) {
    functionText = functionText.substring(functionText.indexOf('=') + 1);
    functionText = functionText.trim();
    functionText = functionText.replaceAll('^', '**');
    let variables = [];
    for (let i = 0; i < functionText.length; i++) {

      // (...)(...) -> (...)*(...)
      if (charExists(-1) && ( char() == '(' && char(-1) == ')' )) {
        injectString('*');
      }
      
      // ab -> a*b, 3a -> 3*a
      // if char OR last char are not digits
      if ( charExists(-1) && ( !/[\d]/.test(char(-1)) || !/[\d]/.test(char()) ) ) {
        // if char AND last char are not operators
        if (charExists(-1) && !/[*+-/()]/.test(char()) && !/[*+-/()]/.test(char(-1)) ) {
          injectString('*');
        }
      }

      // if non-x character
      if (/[A-Za-wy-z]/.test(char())) {
        // if reserved word, handle word & skip
        if (!handleReservedString()) {
          // if not reserved word, create variable for character
          addVariable();
        }
      }

      function injectString(substr) {
        functionText = functionText.substring(0, i) + substr + functionText.substring(i + substr.length - 1);
        i += substr.length;
      }

      function replaceString(count, newString) {
        functionText = functionText.substring(0, i) + newString + functionText.substring(i + count);
        i += newString.length - count;
      }
      function addVariable() {
        for (let j = 0; j < variables.length; j++) {
          if (variables[j] == char()) {
            return;
          }
        }
        variables.push(char());
      }

      function handleReservedString() {
        let reservedStrings = [
          'sin(',
          'cos(',
          'tan(',
          'acos(',
          'asin(',
          'atan(',
          'abs(',
        ];
        let replacerStrings = [
          {
            original:'pi',
            new:'PI'
          },
          {
            original:'e',
            new:'Math.E'
          },
          {
            original:'log(',
            new:'1/log(10)*log('
          },
          {
            original:'ln(',
            new:'log('
          }
        ]
        for (let j = 0; j < reservedStrings.length; j++) {
          if (functionText.substring(i, i+reservedStrings[j].length) == reservedStrings[j]) {
            i += reservedStrings[j].length - 1;
            return true;
          }
        }
        for (let j = 0; j < replacerStrings.length; j++) {
          if (functionText.substring(i, i+replacerStrings[j].original.length) == replacerStrings[j].original) {
            replaceString(replacerStrings[j].original.length, replacerStrings[j].new);
            i += replacerStrings[j].new.length - 1;
            return true;
          }
        }
      }
      function char(indexOffset=0) {
        if (!charExists(indexOffset)) {
          return false;
        }
        return functionText[i + indexOffset];
      }
      function charExists(indexOffset) {
        return i + indexOffset === constrain(i + indexOffset, 0, functionText.length - 1);
      }
    }

    // uneven parenthesis
    while (functionText.includes(')') && (functionText.indexOf(')') < functionText.indexOf('(') || !functionText.includes('(') || functionText.split(')').length > functionText.split('(').length)) {
        functionText = '(' + functionText;
    }
    while (functionText.includes('(') && (functionText.lastIndexOf('(') > functionText.lastIndexOf(')') || !functionText.includes(')') || functionText.split('(').length > functionText.split(')').length)) {
        functionText = functionText + ')';
    }

    functionText = `return ${functionText};`;

    variables.forEach(variable => {
      functionText = `let ${variable} = ${getVariable(variable)};
      ${functionText}`;
    });
    return functionText;
  }

  static createFunction(functionText) {
    let func = new Function('x', functionText);
    return func;
  }

  toString() {
    if (this.inputElement()) {
      return this.inputElement().value;
    }
    let str = this._func.toString();
    str = str.substring(str.indexOf('=>') + 2);
    str = str.replaceAll('**', '^');
    str = str.replaceAll('return', '');
    str = str.replaceAll(';', '');
    str = str.replaceAll('{', '');
    str = str.replaceAll('}', '');
    str = str.trim();
    str = 'f(x) =' + str;
    return str;
  }

  static isValidFunctionName(functionName) {
    functionName = functionName.trim();
    if (functionName == 'y') {
      return true;
    }
    if (!functionName.includes('(x)')) {
      return false;
    }
    functionName = functionName.substring(0, functionName.indexOf('(x)'));
    return !!functionName.trim();
  }

  // get functions name
  // not to be confused with read name, which statically reads name from text parameter
  getName() {
    return GraphFunction.readName(this.toString());
  }

  nameMatches(name) {
    return this.getName() === name;
  }

  static readName(functionText) {
        // "f(x) ", "y ""
        if (functionText.includes('=')) {
          functionText = functionText.substring(0, functionText.indexOf('='));
        }
        // remove white space
        functionText = functionText.trim();
        return functionText;
  }

  static getMatchingFunction(functionText) {
    let functionName = this.readName(functionText);
    if (!functionName) {
      return;
    }
    let graphFunctions = this.getGraphFunctions();
    for (let i = 0; i < graphFunctions.length; i++) {
      if (graphFunctions[i].nameMatches(functionName)) {
        return graphFunctions[i];
      }
    }
  }

  // function with name functionName exists
  static matchingFunctionExists(functionName) {
    let graphFunctions = this.getGraphFunctions();
    for (let i = 0; i < graphFunctions.length; i++) {
      if (graphFunctions[i].nameMatches(functionName)) {
        return true;
      }
    }
  }

  static getGraphFunctions() {
    let graphObjects = mainField.getChildren();
    let functions = [];
    for (let i = 0; i < graphObjects.length; i++) {
      if (graphObjects[i].type === FUNCTION) {
        functions.push(graphObjects[i]);
      }
    }
    return functions;
  }

}