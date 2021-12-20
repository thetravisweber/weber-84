class RotationMatrix extends Matrix {
  applyTo(positionVector) {
    let topRow = this.m[0];
    let bottomRow = this.m[1];
    let x = topRow[0]*positionVector.x + topRow[1]*positionVector.y;
    let y = bottomRow[0]*positionVector.x + bottomRow[1]*positionVector.y;
    return createVector(x, y);
  }

  static from(theta) {
    return new RotationMatrix([
      [cos(theta), sin(theta)],
      [-sin(theta), cos(theta) ]
    ]);
  }
}