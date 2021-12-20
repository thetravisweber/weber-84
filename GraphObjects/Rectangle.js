class Rectangle extends Quadrilateral {
  constructor(position, width, height) {
    let topLeft = createVector(position.x - width/2, position.y + height/2);
    let topRight = createVector(position.x + width/2, position.y + height/2);
    let bottomRight = createVector(position.x + width/2, position.y - height/2);
    let bottomLeft = createVector(position.x - width/2, position.y - height/2); 
    super(
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    );
  }
}