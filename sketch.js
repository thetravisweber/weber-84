let mainField;
const PRIMARY = 220;
const BKG = 0;
const WEIGHT = 3, POINT_WEIGHT = 4;
const DRAG_CANVAS = 'DRAG_CANVAS', ANALYZE = 'ANALYZE';
const ADD_POINT = 'ADD_POINT', ADD_LINE = 'ADD_LINE';

const POINT = 'POINT', LINE = 'LINE', FUNCTION = 'FUNCTION';
let userActionMode = DRAG_CANVAS;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);

  let kids = [
    new Line(4, 5, 8, 7),
    new Point(4, 6),
    new GraphFunction((x => x*x + 4)),
    new GraphFunction((x => sin(x))),
    new Square(createVector(-4, 4), 2)
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