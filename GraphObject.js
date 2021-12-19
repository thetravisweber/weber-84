class GraphObject {
  _renderer;

  setRenderer(renderer) {
    this._renderer = renderer;
  }

  draw() {return false;}
}