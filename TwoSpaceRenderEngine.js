class TwoSpaceRenderEngine {

  constructor(field) {
    this.field = field;
  }

  line(x1, y1, x2, y2) {
    let start = this.field.mapPoint(x1, y1);
    let end   = this.field.mapPoint(x2, y2);
    line(start.x, start.y, end.x, end.y); 
  }

  vector(xMagnitude, yMagnitude, x, y) {
    let start = createVector(x, y);
    let end   = createVector(x+xMagnitude, y+yMagnitude);

    let t = atan((end.y - start.y) / (end.x - start.x));
    if (start.x > end.x) {
      t += PI;
    }
    let forwardAngle = t + 19*PI/16;
    let backwardAngle = t - 19*PI/16;

    let magnitude = sqrt(yMagnitude**2 + xMagnitude**2);
    let headRatio = 12;
    this.shape([
      end,
      createVector(
        end.x + (cos(forwardAngle) * magnitude / headRatio),
        end.y + (sin(forwardAngle) * magnitude / headRatio)
      ),
      createVector(
        end.x + (cos(backwardAngle) * magnitude / headRatio),
        end.y + (sin(backwardAngle) * magnitude / headRatio)
      )
    ]);
    this.line(start.x, start.y, end.x, end.y);
  }

  point(x1, y1) {
    let pos = this.field.mapPoint(x1, y1);
    point(pos.x,pos.y)
  }

  shape(points) {
    beginShape();
    points.forEach(point => {
      let mapped = this.field.mapPoint(point.x, point.y);
      vertex(mapped.x, mapped.y);
    });
    endShape();
    let max = points.length-1;
    this.line(points[0].x, points[0].y, points[max].x, points[max].y);
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

  vectorField(xFunc, yFunc) {
    this.#sample2DPoints().forEach(pt => {
      // <h(x, y), k(x, y)>
      this.vector(xFunc(pt.x, pt.y), yFunc(pt.x, pt.y), pt.x, pt.y);
    });
  }

  gradient(func) {
    this.#sample2DPoints().forEach(pt => {
      // f(x, y)
      let f = func(pt.x, pt.y);
      // Δ
      let d = 2**-24;
      // ∂f/∂x
      let Fx = (func(pt.x+d, pt.y)-f) / d;
      // ∂f/∂y
      let Fy = (func(pt.x, pt.y+d)-f) / d;
      // <∂f/∂x, ∂f/∂y>
      this.vector(Fx, Fy, pt.x, pt.y);
    });
  }

  #sample2DPoints() {
    let acc = [];
    for (let x = this.field.xWindow.start; x < this.field.xWindow.end; x+=this.field.windowWidth() / 33) {
      for (let y = this.field.yWindow.start; y < this.field.yWindow.end; y+=this.field.windowHeight() / 33) {
        acc.push(createVector(x, y));
      }
    }
    return acc;
  }
}