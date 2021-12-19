let mainField;
const PRIMARY = 220;
const BKG = 0;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);

}

function draw() {
  background(BKG);
  mainField.drawGrid();
  mainField.drawAxes();
  mainField.renderEngine.line(0, 0, 2, 3);
  mainField.renderEngine.line(4, 5, -2, 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mainField.reset();
}

function mouseWheel(event) {
  mainField.zoom(event.delta / 1000);
  draw();
}