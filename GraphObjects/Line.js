class Line extends GraphObject {
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = LINE;
  }

  draw(color=PRIMARY, weight=WEIGHT) {
    stroke(color);
    strokeWeight(weight);

    this._renderer.line(this.x1, this.y1, this.x2, this.y2);
  }

  angle() {
    return atan(this.slope());
  }

  slope() {
    return (this.y2 - this.y1) / (this.x2 - this.x1);
  }

  magnitude() {
    return sqrt( sq(this.x2 - this.x1) + sq(this.y2 - this.y1) );
  }

  yValue(xValue) {
    return this.slope() * xValue + this.yIntercept();
  }

  yIntercept() {
    return this.y1 - this.slope() * this.x1;
  }

  lesserX() {
    return min(this.x1, this.x2);
  }

  greaterX() {
    return max(this.x1, this.x2);
  }

  lesserY() {
    return min(this.y1, this.y2);
  }

  greaterY() {
    return max(this.y1, this.y2);
  }

}