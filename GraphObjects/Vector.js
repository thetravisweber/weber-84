class Vector extends Line {

  static HEAD_RATIO = 12;

  constructor(xMagnitude, yMagnitude, xOffset=0, yOffset=0) {
    super(xOffset, yOffset, xOffset+xMagnitude, yOffset+yMagnitude);
  }

  draw(color=PRIMARY, weight=WEIGHT) {
    super.draw(color, weight);

    fill(color);
    let forwardAngle = this.angle() + 19*PI/16;
    let backwardAngle = this.angle() - 19*PI/16;

    this._renderer.shape([
      this.head(),
      createVector(
        this.head().x + (cos(forwardAngle) * this.magnitude() / Vector.HEAD_RATIO),
        this.head().y + (sin(forwardAngle) * this.magnitude() / Vector.HEAD_RATIO)
      ),
      createVector(
        this.head().x + (cos(backwardAngle) * this.magnitude() / Vector.HEAD_RATIO),
        this.head().y + (sin(backwardAngle) * this.magnitude() / Vector.HEAD_RATIO)
      )
    ]);
  }

  head() {
    return createVector(this.x2, this.y2);
  }

  tail() {
    return createVector(this.x1, this.y1);
  }

  xMagnitude() {
    return this.x2 - this.x1;
  }

  yMagnitude() {
    return this.y2 - this.y1;
  }

  static isVector(vectorText) {
    const startMarker = '<';
    const endMarker = '>';
    if (!vectorText.includes(startMarker) || !vectorText.includes(endMarker)) {
      return;
    }
    let startIndex = vectorText.indexOf(startMarker) + startMarker.length;
    let endIndex = vectorText.indexOf(endMarker);
    let magnitudeText = vectorText.substring(startIndex, endIndex);
    if (!Point.isPoint(magnitudeText)) {
      return;
    }   
    
    let ptVec = Point.getPointVector(magnitudeText);
    // value for each coord
    let test = /[\d]/.test(ptVec.x) && /[\d]/.test(ptVec.y);

    const positionMarker = '+';
    if (!vectorText.includes(positionMarker)) {
      return test;
    }

    let positionStartIndex = vectorText.indexOf(positionMarker) + positionMarker.length;
    let positionText = vectorText.substring(positionStartIndex);
    if (!Point.isPoint(positionText)) {
      return;
    }
    let tailPtVec = Point.getPointVector(positionText);
    test = /[\d]/.test(tailPtVec.x) && /[\d]/.test(tailPtVec.y);
    
    return test;
  }

  static getVector(vectorText) {
    const startMarker = '<';
    const endMarker = '>';
    if (!vectorText.includes(startMarker) || !vectorText.includes(endMarker)) {
      return;
    }
    let startIndex = vectorText.indexOf(startMarker) + startMarker.length;
    let endIndex = vectorText.indexOf(endMarker);
    let magnitudeText = vectorText.substring(startIndex, endIndex);
    let ptVec = Point.getPointVector(magnitudeText);

    const positionMarker = '+';
    if (!vectorText.includes(positionMarker)) { 
      return new Vector(ptVec.x, ptVec.y);
    } 
    let positionStartIndex = vectorText.indexOf(positionMarker) + positionMarker.length;
    let positionText = vectorText.substring(positionStartIndex);
    let tailPtVec = Point.getPointVector(positionText);
    return new Vector(ptVec.x, ptVec.y, tailPtVec.x, tailPtVec.y);

  }

  isUnitVector() {
    let margin = 10**-14
    return abs(this.magnitude() - 1) < margin;
  }

  toString() {
    let str = `<${roundTwo(this.head().x)}, ${roundTwo(this.head().y)}>`;
    if (roundTwo(this.tail().x) && roundTwo(this.tail().y)) {
      str += ` + (${roundTwo(this.tail().x)}, ${roundTwo(this.tail().y)})`;
    }
    return str;
    
    function roundTwo(num) {
      return Math.round(num * 100) / 100;
    }
  }

  static multiplyScalar(vector, scalar) {
    vector.x2 = vector.x1 + vector.xMagnitude() * scalar;
    vector.y2 = vector.y1 + vector.yMagnitude() * scalar;
  }

  static dotProduct(vector1, vector2) {
    return vector1.xMagnitude()*vector2.xMagnitude() + vector1.yMagnitude()*vector2.yMagnitude();
  }

  static crossProduct(vector1, vector2) {
    return vector1.xMagnitude()*vector2.xMagnitude() + vector1.yMagnitude()*vector2.yMagnitude();
  }

}