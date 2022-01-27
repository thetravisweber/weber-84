class TwoSpaceRenderEngine {

  constructor(field) {
    this.field = field;
  }

  line(x1, y1, x2, y2) {
    let start = this.field.mapPoint(x1, y1);
    let end   = this.field.mapPoint(x2, y2);
    line(start.x, start.y, end.x, end.y); 
  }

  point(x1, y1) {
    let pos = this.field.mapPoint(x1, y1);
    point(pos.x,pos.y)
  }

  shape(points) {
    points.forEach((point, index) => {
      let nextIndex = index+1;
      if (nextIndex == points.length) {
        nextIndex = 0;
      }
      let nextPoint = points[nextIndex];
      this.line(point.x, point.y, nextPoint.x, nextPoint.y);
    });
  }

  graph(func) {
    noFill();
    beginShape();
    this.#samplePoints().forEach(x => {
      let y = func(x);
      let mapped = this.field.mapPoint(x, y)
      vertex(mapped.x, mapped.y);
    });
    endShape();
  }

  #samplePoints() {
    let acc = [];
    for (let x = this.field.xWindow.start; x < this.field.xWindow.end; x+=this.field.windowWidth() / 1000) {
      acc.push(x);
    }
    return acc;
  }
}