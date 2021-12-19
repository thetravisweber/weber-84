class Line extends GraphObject {
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw() {
    this._renderer.line(this.x1, this.y1, this.x2, this.y2);
  }
}