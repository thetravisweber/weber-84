class Gradient extends VectorField {
    constructor (func) {
        super((x, y) => {
            let d = 2 ** -24;
            return (func(x+d,y)-func(x,y)) / d;
        }, 
        (x, y) => {
            let d = 2 ** -24;
            return (func(x,y+d)-func(x,y)) / d;
        });
    }

    toString() {
        return '∇f(x, y)';
    }

    static getString(functString) {
        functString = functString.substring(functString.indexOf('=>') + 2);
        functString = functString.replaceAll('**', '^');
        functString = functString.replaceAll('return', '');
        functString = functString.replaceAll(';', '');
        functString = functString.replaceAll('{', '');
        functString = functString.replaceAll('}', '');
        functString = functString.trim();
        functString = '∇f(x, y) = ' + functString;
        return functString;
    }
}