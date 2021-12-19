class GraphFunction extends GraphObject {
  constructor (func) {
    super();
    this._func = func;
  }

  draw() {
    this._renderer.graph(this._func);
  }
}