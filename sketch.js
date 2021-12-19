let mainField;
const PRIMARY = 220;
const BKG = 0;
const DRAG_CANVAS = 'DRAG_CANVAS', ADD_POINT = 'ADD_POINT';
let userActionMode = ADD_POINT;

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

function keyPressed() {

  const P_KEYCODE = 80;
  const ADD_POINT_HOTKEY_KEYCODE = P_KEYCODE;

  const M_KEYCODE = 77;
  const DRAG_CANVAS_HOTKEY_KEYCODE = M_KEYCODE;

  switch (keyCode) {
    case ADD_POINT_HOTKEY_KEYCODE :
      setUserActionMode(ADD_POINT);
      break;
    case DRAG_CANVAS_HOTKEY_KEYCODE :
      setUserActionMode(DRAG_CANVAS);
      break;
    default :
      console.log(keyCode);
  }

}

function setUserActionMode(mode) {
  userActionMode = mode;
}

function mousePressed() {
  switch (mouseActionMode()) {
    case DRAG_CANVAS :
      break;
    case ADD_POINT :
      addPoint(mouseX, mouseY);
      break;
  }
  setMouseMemory();
}

function addPoint(x, y) {
  let map = mainField.unmapPoint(x, y);
  mainField.addChild(new Point(map.x, map.y));
  draw();
}

function moveLastPoint(x, y) {
  mainField.removeLastChild();
  addPoint(x, y);
}

let pMouseClick = {
  x : -1,
  y : -1,
  time : -1,
  released : -1
};

function mouseReleased() {
  setMouseUpMemory();
}

function mouseDragged() {
  switch (mouseActionMode()) {
    case DRAG_CANVAS :
      dragCanvas();
      break;
    case ADD_POINT :
      moveLastPoint(mouseX, mouseY);
      break;
  }
}

function dragCanvas() {
  if (isValidMouseDraggedCoords()) {
    mainField.translateBy(mouseX - pMouseClick.x, mouseY - pMouseClick.y);
    draw();
  }
  setMouseDownMemory();
}

function isValidMouseDraggedCoords() {
  return (!pMouseClick.released) && (pMouseClick.x !== mouseX || pMouseClick.y !== mouseY); 
}

function setMouseUpMemory() {
  pMouseClick.released = millis();
}

function setMouseDownMemory() {
  pMouseClick = {
    x : mouseX,
    y : mouseY,
    time : millis(),
    released : false
  }
}

function setMouseMemory() {
  pMouseClick = {
    x : mouseX,
    y : mouseY,
    time : millis(),
    released : false
  }
}

function mouseActionMode() {
  switch (userActionMode) {
    case DRAG_CANVAS :
      return userActionMode;
    case ADD_POINT :
      return userActionMode;
  }
}

function userInputMode() {
  switch (userActionMode) {
    default:
      return userActionMode;
  }
}