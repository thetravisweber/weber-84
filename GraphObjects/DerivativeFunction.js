class DerivativeFunction extends GraphFunction {
    constructor(graphFunction) {
        super(x => {
            return graphFunction.derivative(x);
        });
    }

    static isDerivativeFunction(functionText) {
        if (!functionText.includes("'")) {
            return;
        }
        functionText = functionText.replaceAll("'", "");
        let functionName = this.readName(functionText);
        return this.matchingFunctionExists(functionName);
    }

    static getAntiderivativeFunction(functionText) {
        if (!functionText.includes("'")) {
            return;
        }
        functionText = functionText.replaceAll("'", "");
        // functionText = this.readName(functionText);
        return this.getMatchingFunction(functionText);
    }

}