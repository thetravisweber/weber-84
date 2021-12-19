class Field { // AKA 2-space or 2D space
  xWindow = new AxialWindow(-10, 10, 1);
  yWindow = new AxialWindow(-10, 10, 1);
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

  setChildren(children) {
    this.clearChildren();
    children.forEach(child => this.addChild(child));
  }

  clearChildren() {
    this.#children = [];
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
    this.#renderEngine.line(this.xWindow.start, 0, this.xWindow.end, 0);
    stroke(0, 255, 0);
    this.#renderEngine.line(0, this.yWindow.start, 0, this.yWindow.end);
    stroke(255);
    this.#renderEngine.point(0,0,2);
  }

  #drawGrid(weight=.1) {
    strokeWeight(weight);
    stroke(PRIMARY);
    for (let x = this.xWindow.step; x < this.xWindow.end; x+=this.xWindow.step) {
      this.#renderEngine.line(x, this.yWindow.start, x, this.yWindow.end);
    }
    for (let x = -this.xWindow.step; x > this.xWindow.start; x-=this.xWindow.step) {
      this.#renderEngine.line(x, this.yWindow.start, x, this.yWindow.end);
    }
    for (let y = this.yWindow.step; y < this.yWindow.end; y+=this.yWindow.step) {
      this.#renderEngine.line(this.xWindow.start, y, this.xWindow.end, y);
    }
    for (let y = -this.yWindow.step; y > this.yWindow.start; y-=this.yWindow.step) {
      this.#renderEngine.line(this.xWindow.start, y, this.xWindow.end, y);
    }
  }

  /***
   * Transforms
   */

  zoom(scale) {
    this.xWindow = AxialWindow.from(
      {
        start: this.xWindow.start + scale*this.xWindow.step, 
        end: this.xWindow.end - scale*this.xWindow.step,
        step: this.xWindow.step
      }
    );
    this.yWindow = AxialWindow.from(
      {
        start: this.yWindow.start + scale*this.yWindow.step, 
        end: this.yWindow.end - scale*this.yWindow.step, 
        step: this.yWindow.step
      }
    );
  }

  translate(x, y) {
    console.log(x,y);
  }

  /***
   * Getters
   */
  windowWidth() {
    return this.xWindow.end - this.xWindow.start;
  }

  windowHeight() {
    return this.yWindow.end - this.yWindow.start;
  }

  /***
   * Setters
   */
  setXWindow(window) {
    this.xWindow = window;
  }

  setYWindow(window) {
    this.yWindow = window;
  }
}