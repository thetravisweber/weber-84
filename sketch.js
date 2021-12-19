let mainField;
const PRIMARY = 220;
const BKG = 0;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);

  let f1 = (x => x+5);

  let kids = [
    new Point(2, 2),
    new Line(4, -5, -2, -2),
    new GraphFunction((x => x*x + 4)),
    new GraphFunction((x => sin(x)))
  ];
  mainField.setChildren(kids);
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

function mousePressed() {
  mainField.translate(mouseX, mouseY);
  draw();
}