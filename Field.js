class Field { // AKA 2-space or 2D space
  xWindow = new AxialWindow(-10, 10, 1);
  yWindow = new AxialWindow(-10, 10, 1);
  #renderEngine = new TwoSpaceRenderEngine(this);
  #children = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.rotation = 0;
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

  getChildByUid(uid) {
    for (let i = 0; i < this.#children.length; i++) {
      if (this.#children[i].getUid() == uid) {
        return this.#children[i];
      }
    }
  }

  removeChildByUid(uid) {
    for (let i = 0; i < this.#children.length; i++) {
      if (this.#children[i].getUid() == uid) {
        this.#children.splice(i, 1);
      }
    }
  }

  getChild(childIndex) {
    return this.#children[childIndex];
  }

  getChildren() {
    return this.#children;
  }

  clearChildren() {
    this.#children = [];
  }

  removeLastChild() {
    this.#children.splice(this.#children.length - 1, 1);
  }

  /***
   * Map Function
   */

  mapPoint(x1, y1) {
    let x2 = (x1/this.windowWidth())*width;
    let y2 = -((y1/this.windowHeight())) * height;

    let rotationMatrix = RotationMatrix.from(this.rotation);
    let pos = rotationMatrix.applyTo(createVector(x2, y2));

    return createVector(pos.x + this.position.x, pos.y + this.position.y);
  }

  unmapPoint(x1, y1) {

    let rotationMatrix = RotationMatrix.from(-this.rotation);
    let pos = rotationMatrix.applyTo(createVector(x1 - this.position.x, y1 - this.position.y));

    let x2 = pos.x * this.windowWidth() / width;
    let y2 = - pos.y * this.windowHeight() / height;

    return createVector(x2, y2);
  }

  findGraphElement(x, y) {
    const DISTANCE_CUSHION = 5;
    
    for (let i = 0; i < this.#children.length; i++) {
      let child = this.#children[i];
      switch (child.type) {
        case POINT :
          if (this.isOverPoint(child, x, y, DISTANCE_CUSHION))
            return child;
          break;
        case LINE :
          if (this.isOverLine(child, x, y, DISTANCE_CUSHION))
            return child;
          break;
        case FUNCTION :
          if  (this.isOverFunction(child._func, x, y, DISTANCE_CUSHION))
            return child;
          break;
      }
    }
  }

  isOverPoint(point, x, y, cushion) {
    let mapped = this.mapPoint(point.x, point.y);
    if (dist(mapped.x, mapped.y, x, y) < cushion)
      return true;
  }

  isOverLine(line, x, y, cushion) {
    let unmapped = this.unmapPoint(x, y);
    let unmappedX = unmapped.x;
    let unmappedY = unmapped.y;

    /***
     *  Distance formula for the line
     *  Ax+By+C=0
     *  A = -slope
     *  B = 1
     *  C = -y-intercept
     */ 
    let distanceToLine;

    let m = line.slope();
    let b = line.yIntercept();
    
    let closestXForInfiniteLine = ( ( unmappedX + m * unmappedY ) - m * b ) / ( sq(m) + 1 );
    let mappedClosestPoint;
    if ( closestXForInfiniteLine < line.lesserX() || closestXForInfiniteLine > line.greaterX() ) {
      let distToP1 = dist(unmappedX, unmappedY, line.x1, line.y1);
      let distToP2 = dist(unmappedX, unmappedY, line.x2, line.y2);
      if (distToP1 < distToP2) {
        mappedClosestPoint = this.mapPoint(line.x1, line.y1);
      } else {
        mappedClosestPoint = this.mapPoint(line.x2, line.y2);
      }
    } else {
      let closestYForInfiniteLine = ( m * ( unmappedX + m * unmappedY ) + b ) / ( sq(m) + 1 );
      mappedClosestPoint = this.mapPoint(closestXForInfiniteLine, closestYForInfiniteLine);
    }

    distanceToLine = dist(x, y, mappedClosestPoint.x, mappedClosestPoint.y);
    if (distanceToLine < cushion) 
      return true;
  }

  isOverFunction(func, x, y, cushion) {
    const NUMBER_OF_ATTEMPTS = 100;
    
    // checks if circle radius cushion around point (x, y) crosses func
    let unmapped = this.unmapPoint(x, y);
    let funcOfUnmapped = func(unmapped.x);
    for (let t = 0; t < TWO_PI; t += TWO_PI / NUMBER_OF_ATTEMPTS) {

      let unmappedPointAtCushionDist = this.unmapPoint(x+cushion*cos(t), y+cushion*sin(t));
      if ( (func(unmappedPointAtCushionDist.x) > unmappedPointAtCushionDist.y) != (funcOfUnmapped > unmapped.y))
        return true;

    }
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

  // Set origin to position x, y
  translate(x, y) {

    this.position = createVector(x, y);

    let translateOffset = this.windowTranslation(x, y);
    this.setXWindow({
      start : translateOffset.x - this.windowWidth() * 0.5,
      end : translateOffset.x + this.windowWidth() * 0.5,
      step : this.xWindow.step
    });
    this.setYWindow({
      start : translateOffset.y - this.windowHeight() * 0.5,
      end : translateOffset.y + this.windowHeight() * 0.5,
      step : this.yWindow.step
    });
  }

  rotate(theta) {
    this.rotation += theta;
  }

  translateBy(deltaX, deltaY) {
    this.translate(this.position.x + deltaX, this.position.y + deltaY);
  }

  windowTranslation(x, y) {
    let x2 = (width * 0.5 - x) / width * this.windowWidth();
    let y2 = -(height * 0.5 - y) / height * this.windowHeight();

    return createVector(x2, y2);
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

  windowCenter() {
    return {
      x : this.xWindow.start + this.windowWidth() * 0.5,
      y : this.yWindow.start + this.windowHeight() * 0.5
    }
  }

  windowCenterHorizontal() {
    return this.windowCenter().x;
  }

  windowCenterVertical() {
    return this.windowCenter().y;
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