class ScaledVector extends Vector {
  draw(color=PRIMARY, weight=WEIGHT) {
    this._renderer.graph(this.lineFunc);
  }

  lineFunc = (x) => {
    return this.slope()*x + this.yIntercept();
  }
}