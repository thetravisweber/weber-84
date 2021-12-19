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
  fill(255);
  mainField.drawGrid();
  mainField.drawAxes();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mainField.reset();
}