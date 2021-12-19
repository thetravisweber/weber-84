class Field { // AKA 2-space or 2D space
  xWindow = [-10, 10, 1];
  yWindow = [-10, 10, 1];
  #renderEngine = new TwoSpaceRenderEngine(this);
  #children = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.rotation = new createVector(0, 0);
    this.position = new createVector(width/2, height/2);
  }

  /***
   * Parenting
   */

  addChild(child) {
    child.setRenderer(this.#renderEngine);
    this.#children.push(child);
  }


  /***
   * Map Function
   */

  mapPoint(x1, y1) {
    let x2 = (x1/this.windowWidth())*width + this.position.x;
    let y2 = -((y1/this.windowHeight())) * height + this.position.y;
    return createVector(x2, y2);
  }

  /***
   * Draw Methods
   */

  draw() {
    this.#drawGrid();
    this.#drawAxes();
    this.#drawChildren();
  }

  #drawChildren() {
    this.#children.forEach(child => {
      child.draw();
    });
  }

  #drawAxes(weight=2) {
    strokeWeight(weight);
    stroke(255,0,0);
    this.#renderEngine.line(this.xWindow[0], 0, this.xWindow[1], 0);
    stroke(0, 255, 0);
    this.#renderEngine.line(0, this.yWindow[0], 0, this.yWindow[1]);
    stroke(255);
    this.#renderEngine.point(0,0,2);
  }

  #drawGrid(weight=.1) {
    strokeWeight(weight);
    stroke(PRIMARY);
    for (let x = this.xWindow[2]; x < this.xWindow[1]; x+=this.xWindow[2]) {
      this.#renderEngine.line(x, this.yWindow[0], x, this.yWindow[1]);
    }
    for (let x = -this.xWindow[2]; x > this.xWindow[0]; x-=this.xWindow[2]) {
      this.#renderEngine.line(x, this.yWindow[0], x, this.yWindow[1]);
    }
    for (let y = this.yWindow[2]; y < this.yWindow[1]; y+=this.yWindow[2]) {
      this.#renderEngine.line(this.xWindow[0], y, this.xWindow[1], y);
    }
    for (let y = -this.yWindow[2]; y > this.yWindow[0]; y-=this.yWindow[2]) {
      this.#renderEngine.line(this.xWindow[0], y, this.xWindow[1], y);
    }
  }

  /***
   * Getters
   */
  windowWidth() {
    return this.xWindow[1] - this.xWindow[0];
  }

  windowHeight() {
    return this.yWindow[1] - this.yWindow[0];
  }

  /***
   * Setters
   */
  setXWindow(start, end, step=this.xWindow[2]) {
    if (step<0) {
      return false;
    }
    if (end < start) {
      this.xWindow = this.minimumScale(start, end, step);
      return false;
    }
    this.xWindow = [start, end, step];
    return true;
  }

  setYWindow(start, end, step=this.yWindow[2]) {
    if (step<0) {
      return false;
    }
    if (end < start) {
      this.yWindow = this.minimumScale(start, end, step);
      return false;
    }
    this.yWindow = [start, end, step];
  }

  zoom(scale) {
    this.setXWindow(this.xWindow[0] + scale*this.xWindow[2], this.xWindow[1] - scale*this.xWindow[2]);
    this.setYWindow(this.yWindow[0] + scale*this.yWindow[2], this.yWindow[1] - scale*this.yWindow[2])
  }


  /***
   * Helpers
   */
  minimumScale(start, end, step) {
    let middle = (start + end) / 2;
    start = middle - step;
    end = middle + step;
    return [start, end, step];
  }
}