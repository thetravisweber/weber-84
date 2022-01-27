class Vector extends Line {
  constructor(xMagnitude, yMagnitude, xOffset=0, yOffset=0) {
    super(xOffset, yOffset, xMagnitude, yMagnitude);
  }

  draw(color=PRIMARY, weight=WEIGHT) {
    stroke(color);
    strokeWeight(weight);

    this._renderer.line(this.x1, this.y1, this.x2, this.y2);
  }
}