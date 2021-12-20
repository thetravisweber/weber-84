class Point extends GraphObject {
  constructor(x, y) {
    super()
    this.x = x;
    this.y = y;
    this.type = POINT;
  }

  draw(color=PRIMARY, weight=POINT_WEIGHT) {
    stroke(color);
    strokeWeight(weight);
    this._renderer.point(this.x, this.y);
  }
}