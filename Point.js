class Point extends GraphObject {
  constructor(x, y) {
    super()
    this.x = x;
    this.y = y;
  }

  draw() {
    this._renderer.point(this.x, this.y);
  }
}