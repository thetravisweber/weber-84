class GraphObject {
  _renderer;
  _uid = this.createUid();

  setRenderer(renderer) {
    this._renderer = renderer;
  }

  draw() {return false;}

  highlight() {
    this.draw(color(80,80,255), 8);
    this.draw();
  }

  createUid() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  getUid() {
    return this._uid;
  }

  inputElement() {
    let inputs = getInputs();
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].parentElement.getAttribute('el-uid') == this.getUid()) {
        return inputs[i];
      }
    }
  }

}