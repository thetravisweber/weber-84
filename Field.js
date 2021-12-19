class Field { // AKA 2-space or 2D space
  xWindow = [-10, 10, 1];
  yWindow = [-10, 10, 1];

  constructor() {
    this.reset();
    this.renderEngine = new TwoSpaceRenderEngine(this);
  }

  reset() {
    this.rotation = new createVector(0, 0);
    this.position = new createVector(width/2, height/2);
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

  drawAxes(includeGrids=false, weight=2) {
    strokeWeight(weight);
    stroke(255,0,0);
    this.renderEngine.line(this.xWindow[0], 0, this.xWindow[1], 0);
    stroke(0, 255, 0);
    this.renderEngine.line(0, this.yWindow[0], 0, this.yWindow[1]);
    stroke(255);
    this.renderEngine.point(0,0,2);
  }

  drawGrid() {
    for (let x = this.xWindow[0]; x < this.xWindow[1]; x+=this.xWindow[2]) {
      this.renderEngine.line(x, this.yWindow[0], x, this.yWindow[1]);
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
}