class UnitVector extends Vector {
  
    constructor(xMagnitude, yMagnitude, xOffset=0, yOffset=0) {
        super(xMagnitude, yMagnitude, xOffset, yOffset);
        if (!this.isUnitVector()) {
            let magnitude = this.magnitude();
            this.x2 = this.x1 + this.xMagnitude() / magnitude;
            this.y2 = this.y1 + this.yMagnitude() / magnitude;
        }
    }
}