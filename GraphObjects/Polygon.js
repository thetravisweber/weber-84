class Polygon extends GraphObject {
  constructor(points) {
    super();
    this.points = points;
  }

  draw() {
    this.points.forEach((point, index) => {
      let nextIndex = index+1;
      if (nextIndex == this.points.length) {
        nextIndex = 0;
      }
      let nextPoint = this.points[nextIndex];
      this._renderer.line(point.x, point.y, nextPoint.x, nextPoint.y);
    });
  }

  rotateAboutCenter() {

  }

  rotateAboutOrigin() {
    
  }
}