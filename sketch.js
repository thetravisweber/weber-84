let mainField;
const PRIMARY = 220;
const BKG = 0;
const WEIGHT = 3, POINT_WEIGHT = 4;
const DRAG_CANVAS = 'DRAG_CANVAS', ANALYZE = 'ANALYZE';
const ADD_POINT = 'ADD_POINT', ADD_LINE = 'ADD_LINE', ADD_VECTOR = 'ADD_VECTOR';

const POINT = 'POINT', LINE = 'LINE', FUNCTION = 'FUNCTION';
let userActionMode = DRAG_CANVAS;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);

  let kids = [
    new Vector(2, 2),
    new Vector(1, 2, 2, 2)
  ];
  mainField.setChildren(kids);
  
  // UI
  createInputBox();
}

function draw() {
  background(BKG);
  mainField.draw();
}

function windowResized() {
  resizeCanvas(windowWidth*0.99, windowHeight*0.99);
  mainField.reset();
  draw();
}