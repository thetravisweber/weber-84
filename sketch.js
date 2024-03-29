let mainField;
let sideBar;
const PRIMARY = 220;
const BKG = 0;
const WEIGHT = 3, POINT_WEIGHT = 4;
const DRAG_CANVAS = 'DRAG_CANVAS', ANALYZE = 'ANALYZE';
const ADD_POINT = 'ADD_POINT', ADD_LINE = 'ADD_LINE', ADD_VECTOR = 'ADD_VECTOR';

const POINT = 'POINT', LINE = 'LINE', FUNCTION = 'FUNCTION', VECTOR_FIELD='VECTOR_FIELD';
let userActionMode = DRAG_CANVAS;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);
  
  
  let kids = [
    // new Gradient((x,y) => {
    //   return 2*(x*y*cos(x)**2*sin(y)**2)/(x*y);
    // }),
    // new VectorField((x, y) => {
    //   return sin(x+y);
    // }, (x, y) => {
    //   return cos(x-y);
    // }),
    // new VectorField((x, y) => {
    //   return cos(x)-sin(y)**2;
    // }, (x, y) => {
    //   return cos(y)-sin(x)**2;
    // }),
  ];
  mainField.setChildren(kids);
  
  // UI
  sideBar = new SideBar();
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