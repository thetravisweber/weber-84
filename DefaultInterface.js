class DefaultInterface {

  lineStart;
  resetLineStart();

  pMouseClick = {
    x : -1,
    y : -1,
    time : -1,
    released : -1
  };

  constructor() {

  }

  mouseWheel(event) {
    mainField.zoom(event.delta / 1000);
    draw();
  }

  keyPressed(event) {
    const ADD_POINT_HOTKEY = 'p';
    const ADD_LINE_HOTKEY = 'l';
    const DRAG_CANVAS_HOTKEY = 'm';
    const ANALYZE_HOTKEY = 'a';
    const ROTATE_FORWARD = 'ArrowLeft';
    const ROTATE_BACK = 'ArrowRight';

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
        alert('Go Back\nAnalyze Mode is Very Broken')
        setUserActionMode(ANALYZE);
        break;
      case ROTATE_FORWARD :
        mainField.rotate(PI/40);
        draw();
        break;
      case ROTATE_BACK :
        mainField.rotate(-PI/40);
        draw();
        break;
      default :
        console.log(key);
    }

  }

  setUserActionMode(mode) {
    userActionMode = mode;
  }

  mousePressed() {
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

  registerMousePressForNewLine() {
    if (!lineStart)
      return startLine();
    
    let p1 = mainField.unmapPoint(lineStart.x, lineStart.y);
    let p2 = mainField.unmapPoint(mouseX, mouseY);
    mainField.addChild(new Line(p1.x, p1.y, p2.x, p2.y));
    draw();

    resetLineStart();
  }

  startLine() {
    lineStart = {
      x : mouseX,
      y : mouseY
    }
  }

  resetLineStart() {
    lineStart = false;
  }

  addPoint(x, y) {
    let map = mainField.unmapPoint(x, y);
    mainField.addChild(new Point(map.x, map.y));
    draw();
  }

  moveLastPoint(x, y) {
    mainField.removeLastChild();
    addPoint(x, y);
  }

  mouseReleased() {
    setMouseUpMemory();
  }

  mouseMoved() {
    switch (mouseActionMode()) {
      case ANALYZE :
        hoverAnalysis(mouseX, mouseY);
    }
  }

  mouseDragged() {
    switch (mouseActionMode()) {
      case DRAG_CANVAS :
        dragCanvas();
        break;
      case ADD_POINT :
        moveLastPoint(mouseX, mouseY);
        break;
    }
  }

  dragCanvas() {
    if (isValidMouseDraggedCoords()) {
      mainField.translateBy(mouseX - pMouseClick.x, mouseY - pMouseClick.y);
      draw();
    }
    setMouseDownMemory();
  }

  isValidMouseDraggedCoords() {
    return (!pMouseClick.released) && (pMouseClick.x !== mouseX || pMouseClick.y !== mouseY); 
  }

  setMouseUpMemory() {
    pMouseClick.released = millis();
  }

  setMouseDownMemory() {
    pMouseClick = {
      x : mouseX,
      y : mouseY,
      time : millis(),
      released : false
    }
  }

  mouseActionMode() {
    switch (userActionMode) {
      default :
        return userActionMode;
    }
  }

  userInputMode() {
    switch (userActionMode) {
      default:
        return userActionMode;
    }
  }

  let analyzedElement;
  hoverAnalysis(x, y) {
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
}