class VectorField extends GraphObject {
    constructor (xFunc, yFunc) {
        super();
        this._xFunc = xFunc;
        this._yFunc = yFunc;
        this.type = VECTOR_FIELD;
    }

    draw(color=PRIMARY, weight=1) {
        stroke(color);
        strokeWeight(weight);
        this._renderer.vectorField(this._xFunc, this._yFunc);
    }

    toString() {
        return `<${VectorField.getString(this._xFunc.toString())}, ${VectorField.getString(this._yFunc.toString())}>`;
    }

    static getString(functString) {
        functString = functString.substring(functString.indexOf('=>') + 2);
        functString = functString.replaceAll('**', '^');
        functString = functString.replaceAll('return', '');
        functString = functString.replaceAll(';', '');
        functString = functString.replaceAll('{', '');
        functString = functString.replaceAll('}', '');
        functString = functString.trim();
        return functString;
    }
}