let mainField;
const PRIMARY = 220;
const BKG = 0;
const WEIGHT = 3, POINT_WEIGHT = 4;
const DRAG_CANVAS = 'DRAG_CANVAS', ANALYZE = 'ANALYZE';
const ADD_POINT = 'ADD_POINT', ADD_LINE = 'ADD_LINE';

const POINT = 'POINT', LINE = 'LINE', FUNCTION = 'FUNCTION';
let userActionMode = ADD_POINT;

function setup() {
  createCanvas(windowWidth * .99, windowHeight * .99);
  mainField = new Field();
  noLoop();
  rectMode(CENTER);

  let f1 = (x => x+5);

  let kids = [
    new Line(4, 5, 8, 7),
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

  const L_KEYCODE = 76;
  const ADD_LINE_HOTKEY_KEYCODE = L_KEYCODE;

  const M_KEYCODE = 77;
  const DRAG_CANVAS_HOTKEY_KEYCODE = M_KEYCODE;

  const A_KEYCODE = 65;
  const ANALYZE_HOTKEY_KEYCODE = A_KEYCODE;

  switch (keyCode) {
    case ADD_POINT_HOTKEY_KEYCODE :
      setUserActionMode(ADD_POINT);
      break;
    case ADD_LINE_HOTKEY_KEYCODE :
      setUserActionMode(ADD_LINE);
      break;
    case DRAG_CANVAS_HOTKEY_KEYCODE :
      setUserActionMode(DRAG_CANVAS);
      break;
    case ANALYZE_HOTKEY_KEYCODE :
      setUserActionMode(ANALYZE);
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
    case ADD_LINE :
      registerMousePressForNewLine();
      break;
    case ADD_POINT :
      addPoint(mouseX, mouseY);
      break;
    case ANALYZE :
      break;
  }
  setMouseDownMemory();
}

let lineStart;
resetLineStart();

function registerMousePressForNewLine() {
  if (!lineStart)
    return startLine();
  
  let p1 = mainField.unmapPoint(lineStart.x, lineStart.y);
  let p2 = mainField.unmapPoint(mouseX, mouseY);
  mainField.addChild(new Line(p1.x, p1.y, p2.x, p2.y));
  draw();

  resetLineStart();
}

function startLine() {
  lineStart = {
    x : mouseX,
    y : mouseY
  }
}

function resetLineStart() {
  lineStart = false;
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

function mouseMoved() {
  switch (mouseActionMode()) {
    case ANALYZE :
      hoverAnalysis(mouseX, mouseY);
  }
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

function mouseActionMode() {
  switch (userActionMode) {
    default :
      return userActionMode;
  }
}

function userInputMode() {
  switch (userActionMode) {
    default:
      return userActionMode;
  }
}

let analyzedElement;
function hoverAnalysis(x, y) {
  let newElement = mainField.findGraphElement(x, y);
  console.log('OLD');
  console.log(analyzedElement);
  console.log('NEW');
  console.log(newElement);
  if (newElement == analyzedElement)
    return;

  analyzedElement = newElement;
  draw();

  if (newElement) {
    newElement.highlight();
  }
}