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

  static isPoint(pointText) {
    pointText = pointText.replaceAll('(', '');
    pointText = pointText.replaceAll(')', '');
    let commaIndex = pointText.indexOf(',');
    if (commaIndex < 1) {
      return;
    }
    let x = pointText.substring(0, commaIndex);
    let y = pointText.substring(commaIndex + 1);    
    // right side contains number
    let test = /[\d]/.test(x) && /[\d]/.test(y);
    // right side does not contain any letters
    test = test && !/[A-Za-z]/.test(x) && !/[A-Za-z]/.test(y);
    return test;
  }

  static getPointVector(pointText) {
    pointText = pointText.replaceAll('(', '');
    pointText = pointText.replaceAll(')', '');
    let commaIndex = pointText.indexOf(',');
    let x = pointText.substring(0, commaIndex);
    x = Number.parseFloat(x);
    let y = pointText.substring(commaIndex + 1);
    y = Number.parseFloat(y);
    return createVector(x, y);
  }

  toString() {
    return `(${roundTwo(this.x)}, ${roundTwo(this.y)})`;
    function roundTwo(num) {
      return Math.round(num * 100) / 100;
    }
  }

}