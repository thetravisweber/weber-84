
function mouseWheel(event) {
  mainField.zoom(event.delta / 1000);
  draw();
}

function createInputBox() {
  let uibox = document.createElement('uibox');
  let inputarea = document.createElement('inputarea');
  let newInputBtn = document.createElement('button');
  newInputBtn.innerText = 'New';
  newInputBtn.onclick = addNewBlankInput;
  newInputBtn.id = 'new-input-btn';
  uibox.append(inputarea);
  uibox.append(newInputBtn);
  document.body.append(uibox);
  addNewBlankInput();
}

function addNewBlankInput() {
  document.getElementsByTagName('inputarea')[0].append(getNewBlankInput());
}

function getNewBlankInput() {
  let inputbox = document.createElement('inputbox');
  inputbox.id = createUid();
  let inputEl = document.createElement('input');
  inputEl.placeholder = 'new Line, Point, Function';
  inputEl.addEventListener('input', controlGraphObjectCreation)
  let deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'x';
  deleteBtn.onclick = deleteInput;
  inputbox.append(inputEl);
  inputbox.append(deleteBtn);
  return inputbox;
}

function controlGraphObjectCreation() {
  console.log('IS ? ');
  console.log(GraphFunction.isGraphFunction(this.value));
  console.log('FUNC : ');
  console.log(GraphFunction.getFunctionText(this.value));
  if (GraphFunction.isGraphFunction(this.value)) {
    return mainField.addChild(new GraphFunction(GraphFunction.creatFunction(GraphFunction.getFunctionText(this.value))));
  }
  // if (Point.isPoint(this.value)) {
  //   return kids.push(new Point(Point.getPointText(this.value)));
  // }
  // if (Line.isLine(this.value)) {
  //   return kids.push(new Line(Line.getLineText(this.value)));
  // }
}

function deleteInput() {
  console.log('NEED TO DELETE THIS ON GRAPH');
  this.parentElement.remove();
}

function createUid() {
  return Math.floor( Math.random() * Number.MAX_SAFE_INTEGER );
}

function keyPressed(event) {
  const ADD_POINT_HOTKEY = 'p';
  const ADD_LINE_HOTKEY = 'l';
  const DRAG_CANVAS_HOTKEY = 'm';
  const ANALYZE_HOTKEY = 'a';
  const FULLSCREEN_HOTKEY = 'f';
  const ESCAPE_HOTKEY = 'Escape';
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
    case ESCAPE_HOTKEY : 
      closeFullscreen();
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
  if (isInput()) {
    return;
  }
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

function isInput() {
  let inputs = [...document.getElementsByTagName('input')];
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i] === document.activeElement) {
      return true;
    }
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
      updateFocus();
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
let isFocusingOnAnalyzedElement = false;
function hoverAnalysis(x, y) {
  if (isFocusingOnAnalyzedElement)
    return;
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
    analyzedElement.highlight();
  }
}

let popup
function updateFocus() {
  if (popup)
    popup.removePopup();
  analyzedElement = mainField.findGraphElement(mouseX, mouseY);
  isFocusingOnAnalyzedElement = !!analyzedElement;
  draw();
  if (!analyzedElement)
    return;
  analyzedElement.highlight();
  openAnalysisMenu(mouseX, mouseY, analyzedElement);
}

function openAnalysisMenu(x, y, analyzedElement) {
  popup = new Popup(x, y, analyzedElement);
}