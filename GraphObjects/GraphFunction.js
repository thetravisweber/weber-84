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
    let rightSideTest = functionText.substring(functionText.indexOf('=') + 1);
    rightSideTest = rightSideTest.replaceAll(' ', '');
    return !!rightSideTest;
  }

  static getFunctionText(functionText) {
    functionText = functionText.substring(functionText.indexOf('=') + 1);
    return functionText;
  }

  static creatFunction(functionText) {
    let func = x => new Function(['x'],functionText);
    return func;
  }

}