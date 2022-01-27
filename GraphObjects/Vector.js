class Vector extends Line {

  headRatio = 12;

  constructor(xMagnitude, yMagnitude, xOffset=0, yOffset=0) {
    super(xOffset, yOffset, xMagnitude, yMagnitude);
  }

  draw(color=PRIMARY, weight=WEIGHT) {
    super.draw(color, weight);

    fill(color);
    let forwardAngle = this.angle() + 19*PI/16;
    let backwardAngle = this.angle() - 19*PI/16;

    this._renderer.shape([
      this.head(),
      createVector(
        this.head().x + (cos(forwardAngle) * this.magnitude() / this.headRatio),
        this.head().y + (sin(forwardAngle) * this.magnitude() / this.headRatio)
      ),
      createVector(
        this.head().x + (cos(backwardAngle) * this.magnitude() / this.headRatio),
        this.head().y + (sin(backwardAngle) * this.magnitude() / this.headRatio)
      )
    ]);
  }

  head() {
    return createVector(this.x2, this.y2);
  }
}