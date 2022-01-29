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
    line(start.x, start.y, end.x, end.y);

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

  
  gradient(func) {
    strokeWeight(1);
    this.#sample2DPoints().forEach(pt => {
      let f = func(pt.x, pt.y);
      // Δ
      let d = 2**-24;
      // ∂f/∂x
      let px = (func(pt.x+d, pt.y)-f) / d;
      // ∂f/∂y
      let py = (func(pt.x, pt.y+d)-f) / d;
      // let tail = this.field.mapPoint(pt.x, pt.y);
      // let head = this.field.mapPoint(pt.x + px, pt.y + py);
      // let tail = pt;
      // let head = createVector(pt.x + px, pt.y + py);

      // let t = atan((head.y - tail.y) / (head.x - tail.x));
      // if (tail.x > head.x) {
      //   t += PI;
      // }
      // stroke(255, head.x > tail.x ? 255 : 0, head.y > tail.y ? 255 : 0);
      // this.line(tail.x, tail.y, head.x, head.y);

      this.vector(px, py, pt.x, pt.y);
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