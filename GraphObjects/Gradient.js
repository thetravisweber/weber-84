class Gradient extends GraphObject {
    constructor (func) {
        super();
        this._func = func;
        this.type = GRADIENT;
    }

    draw(color=PRIMARY, weight=WEIGHT) {
        stroke(color);
        strokeWeight(weight);
        this._renderer.gradient(this._func);
    }

}