
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
  addInputsForExistingGraphObjects();
  addNewBlankInput();
}

// add inputs for starting graph objects
function addInputsForExistingGraphObjects() {
  mainField.getChildren().forEach(child => {
    addInputForExisting(child.toString(), child.getUid());
  })
}

function addInputForExisting(text, uid) {
  let inputbox = getNewBlankInput();
  inputbox.setAttribute('el-uid', uid);
  inputbox.getElementsByTagName('input')[0].value = text;
  document.getElementsByTagName('inputarea')[0].append(inputbox);
}

function addNewBlankInput(e) {
  let input = getNewBlankInput();
  document.getElementsByTagName('inputarea')[0].append(input);
  if (e) {
    let inputs = getInputs();
    inputs[inputs.length - 1].focus();
  }
}

function getNewBlankInput() {
  let inputbox = document.createElement('inputbox');
  inputbox.id = createUid();
  let inputEl = document.createElement('input');
  inputEl.placeholder = 'new Line, Point, Function';
  inputEl.oninput = controlGraphObjectCreation;
  let deleteBtn = document.createElement('button');
  deleteBtn.innerText = '×';
  deleteBtn.onclick = deleteInput;
  inputbox.append(inputEl);
  inputbox.append(deleteBtn);
  return inputbox;
}

function getInputs() {
  return [...document.getElementsByTagName('input')];
}

function controlGraphObjectCreation() {
  if (this.parentElement.getAttribute('el-uid')) {
    mainField.removeChildByUid(this.parentElement.getAttribute('el-uid'));
  }
  this.setAttribute('el-uid', '');
  if (Line.isLine(this.value)) {
    let line = Line.getLine(this.value);
    mainField.addChild(line);
    this.parentElement.setAttribute('el-uid', line.getUid());
    return draw();  
  }
  if (Vector.isVector(this.value)) {
    let vector = Vector.getVector(this.value);
    mainField.addChild(vector);
    this.parentElement.setAttribute('el-uid', vector.getUid());
    return draw();
  }
  if (GraphFunction.isGraphFunction(this.value)) {
    let functionText = GraphFunction.getFunctionText(this.value);
    let func = GraphFunction.createFunction(functionText);
    let graphFunction = new GraphFunction(func);
    mainField.addChild(graphFunction);
    this.parentElement.setAttribute('el-uid', graphFunction.getUid());
    return draw();
  }
  if (Point.isPoint(this.value)) {
    let point = Point.getPointVector(this.value);
    let graphPoint = new Point(point.x, point.y);
    mainField.addChild(graphPoint);
    this.parentElement.setAttribute('el-uid', graphPoint.getUid());
    return draw();
  }
  draw();
}

function deleteInput() {
  // delete graph object
  let uid = this.parentElement.getAttribute('el-uid');
  mainField.removeChildByUid(uid);
  draw();
  // delete input element
  this.parentElement.remove();
}

function createUid() {
  return Math.floor( Math.random() * Number.MAX_SAFE_INTEGER );
}

function controlInput(e) {
  switch (e.key) {
    case 'Tab' :
      e.preventDefault();
      if (keyIsDown(SHIFT)) {
        focusOnLastInput();
      } else {
        focusOnNextInput();
      }
      break;
    case 'Enter' :
      document.getElementById('new-input-btn').click();
      break;
    case 'Backspace' :
      let activeInput = document.activeElement;
      if (!activeInput.value) {
        e.preventDefault();
        focusOnLastInput();
        activeInput.parentElement.remove();
      }
      break;
  }
}


function focusOnNextInput() {
  let inputs = getInputs();
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i] === document.activeElement) {
      if (i < inputs.length - 1) {
        return inputs[i+1].focus();
      }
      return document.getElementById('new-input-btn').focus();
    }
  }
}

function focusOnLastInput() {
  let inputs = getInputs();
  for (let i = 1; i < inputs.length; i++) {
    if (inputs[i] === document.activeElement) {
      return inputs[i-1].focus();
    }
  }
}

function keyPressed(event) {
  if (isInput()) {
    return controlInput(event);
  }
  const ADD_POINT_HOTKEY = 'p';
  const ADD_LINE_HOTKEY = 'l';
  const ADD_VECTOR_HOTKEY = 'v';
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
    case ADD_VECTOR_HOTKEY :
      setUserActionMode(ADD_VECTOR);
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
  let inputs = getInputs();
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
    case ADD_VECTOR :
      registerMousePressForNewVector();
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

// line
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

// vector
let vectorStart;
resetVectorStart();

function registerMousePressForNewVector() {
  if (!vectorStart)
    return startVector();
  
  let head = mainField.unmapPoint(mouseX, mouseY);
  let tail = mainField.unmapPoint(vectorStart.x, vectorStart.y);
  mainField.addChild(new Vector(head.x - tail.x, head.y - tail.y, tail.x, tail.y));
  draw();

  resetVectorStart();
}

function startVector() {
  vectorStart = {
    x : mouseX,
    y : mouseY
  }
}

function resetVectorStart() {
  vectorStart = false;
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
  if (isInput()) {
    return;
  }
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
  if (isFocusingOnAnalyzedElement) {
    return;
  }
  analyzedElement = mainField.findGraphElement(x, y);

  draw();
  if (!analyzedElement) {
    isFocusingOnAnalyzedElement = false;
    return;
  }

  analyzedElement.highlight();
  if (analyzedElement.type === FUNCTION) {
    let p = mainField.unmapPoint(mouseX, 1);
    analyzedElement.highlightTangent(p.x);
  }
}

function dragElement() {
  if (!analyzedElement) {
    return;
  }
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