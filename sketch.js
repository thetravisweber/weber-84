let mainField;
const PRIMARY = 220;
const BKG = 0;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);


  mainField.addChild(new Point(2, 2));
  mainField.addChild(new Line(4, 5, -2, 1));
}

function draw() {
  background(BKG);
  mainField.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mainField.reset();
}

function mouseWheel(event) {
  mainField.zoom(event.delta / 1000);
  draw();
}