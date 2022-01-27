class Polygon extends GraphObject {
  constructor(points) {
    super();
    this.points = points;
  }

  draw() {
    this._renderer.shape(this.points);
  }

  rotateAboutCenter() {

  }

  rotateAboutOrigin() {
    
  }
}