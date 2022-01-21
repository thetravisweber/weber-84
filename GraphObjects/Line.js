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

  static isLine(lineText) {
    const centerMarker = '=>';
    if (!lineText.includes(centerMarker)) {
      return;
    }
    let centerIndex = lineText.indexOf(centerMarker);

    let p1Text = lineText.substring(0, centerIndex);
    let p2Text = lineText.substring(centerIndex + centerMarker.length);
    if (!Point.isPoint(p1Text) || !Point.isPoint(p2Text)) {
      return;
    }
    let p1 = Point.getPointVector(p1Text);
    let p2 = Point.getPointVector(p2Text);
    // value for each coord
    let test = /[\d]/.test(p1.x) && /[\d]/.test(p1.y);
    test = test && /[\d]/.test(p2.x) && /[\d]/.test(p2.y);
    return test;
  }

  static getLine(lineText) {
    const centerMarker = '=>';
    let centerIndex = lineText.indexOf(centerMarker);
    let p1 = Point.getPointVector(lineText.substring(0, centerIndex));
    let p2 = Point.getPointVector(lineText.substring(centerIndex + centerMarker.length));
    return new Line(p1.x, p1.y, p2.x, p2.y);
  }

  toString() {
    return `(${roundTwo(this.x1)}, ${roundTwo(this.y1)}) => (${roundTwo(this.x2)}, ${roundTwo(this.y2)})`;
    function roundTwo(num) {
      return Math.round(num * 100) / 100;
    }
  }

  toSlopeInterceptString() {
    return `y = ${roundTwo(this.slope())}x + ${roundTwo(this.yIntercept())}`;
    function roundTwo(num) {
      return Math.round(num * 100) / 100;
    }
  }

}