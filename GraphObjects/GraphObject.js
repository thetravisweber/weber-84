class GraphObject {
  _renderer;

  setRenderer(renderer) {
    this._renderer = renderer;
  }

  draw() {return false;}

  highlight() {
    this.draw(color(80,80,255), 8);
    this.draw();
  }
}