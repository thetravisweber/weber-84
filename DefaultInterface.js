
function mouseWheel(event) {
  mainField.zoom(event.delta / 1000);
  draw();
}

function keyPressed(event) {
  const ADD_POINT_HOTKEY = 'p';
  const ADD_LINE_HOTKEY = 'l';
  const DRAG_CANVAS_HOTKEY = 'm';
  const ANALYZE_HOTKEY = 'a';
  const FULLSCREEN_HOTKEY = 'f';
  const ROTATE_LEFT_HOTKEY = 'ArrowLeft';
  const ROTATE_RIGHT_HOTKEY = 'ArrowRight';


  switch (event.key) {
    case ADD_POINT_HOTKEY :
      setUserActionMode(ADD_POINT);
      break;
    case ADD_LINE_HOTKEY :
      setUserActionMode(ADD_LINE);
      break;
    case DRAG_CANVAS_HOTKEY :
      setUserActionMode(DRAG_CANVAS);
      break;
    case ANALYZE_HOTKEY :
      setUserActionMode(ANALYZE);
      break;
    case FULLSCREEN_HOTKEY :
      toggleFullscreen();
      break;
    case ROTATE_LEFT_HOTKEY:
      mainField.rotate(PI/36);
      draw();
      break;
    case ROTATE_RIGHT_HOTKEY:
      mainField.rotate(-PI/36);
      draw();
      break;
  }

}

let windowIsFullscreen = false;
function toggleFullscreen() {
  if (windowIsFullscreen) {
    closeFullscreen();
  } else {
    openFullscreen();
  }

}
  
/* View in fullscreen */
function openFullscreen() {
  windowIsFullscreen = true;
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  windowIsFullscreen = false;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
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
  let unmapped = mainField.unmapPoint(x, y);
  mainField.addChild(new Point(unmapped.x, unmapped.y));
  draw();
}

function dragPoint() {
  
  if (analyzedElement && analyzedElement.type == POINT) {
    let unmapped = mainField.unmapPoint(mouseX, mouseY);
    analyzedElement.x = unmapped.x;
    analyzedElement.y = unmapped.y;
    draw();
  }
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
  pMouse = {
    x : mouseX,
    y : mouseY
  };
}

let pMouse = {
  x : -1,
  y : -1
};

function mouseDragged() {
  switch (mouseActionMode()) {
    case DRAG_CANVAS :
      dragCanvas();
      break;
    case ADD_POINT :
      dragPoint();
      break;
    case ANALYZE :
      dragElement();
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
  if (newElement == analyzedElement)
    return;
  analyzedElement = newElement;

  draw();
  if (analyzedElement) {
    newElement.highlight();
  }
}

function dragElement() {
  switch (analyzedElement.type) {
    case POINT :
      dragPoint();
      break;
    case LINE :
      dragLine();
      break;
    case FUNCTION :
      dragFunction();
      break;
  }
}

function dragLine() {
  if (analyzedElement.type === LINE) {
    return;
  }
}

function dragFunction() {
  if ((sq(mouseX - pMouse.x) + sq(mouseY - pMouse.y)) > 50)
    return;

  if (analyzedElement.type === FUNCTION) {
    let unmappedMouse = mainField.unmapPoint(mouseX, mouseY);
    let unmappedPMouse = mainField.unmapPoint(pMouse.x, pMouse.y);
    let deltaX = unmappedMouse.x - unmappedPMouse.x;
    let deltaY = unmappedMouse.y - unmappedPMouse.y;
    analyzedElement.translate(deltaX, deltaY);

    draw();
  }
}