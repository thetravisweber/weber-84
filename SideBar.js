class SideBar {

  uibox;
  contentBox;
  isOpen = true;

  constructor() {
    this.createContainer();
    this.addInputsForExistingGraphObjects();
    this.addNewBlankInput();
  }

  addChild(child) {
    this.contentBox.append(child);
  }

  createContainer() {
    this.uibox = document.createElement('uibox');

    this.createTopBar();

    this.contentBox = document.createElement('div');
    this.contentBox.className = "content-box";
    this.uibox.append(this.contentBox);

    let inputarea = document.createElement('inputarea');
    this.addChild(inputarea);

    let newInputBtn = document.createElement('button');
    newInputBtn.innerText = 'New';
    newInputBtn.onclick = this.addNewBlankInput;
    newInputBtn.id = 'new-input-btn';
    this.addChild(newInputBtn);

    document.body.append(this.uibox);
  }

  createTopBar() {
    let topBar = document.createElement("topbar");

    let openAndClose = document.createElement("button");
    openAndClose.innerText = "<<";
    openAndClose.onclick = () => {this.openOrClose()};
    openAndClose.id = 'open-and-close-btn';

    topBar.append(openAndClose);
    this.uibox.append(topBar);
  }

  openOrClose() {
    this.children().forEach( child => {
      child.classList.toggle("closed");
    });
  }

  topBar() {
    return document.getElementsByTagName('topbar')[0];
  }

  children() {
    return [...this.uibox.children];
  }

  addInputsForExistingGraphObjects() {
    mainField.getChildren().forEach(child => {
      this.addInputForExisting(child.toString(), child.getUid());
    })
  }

  addNewBlankInput(e) {
    let input = this.getNewBlankInputBox();
    document.getElementsByTagName('inputarea')[0].append(input);
    if (e) {
      let inputs = this.inputs();
      inputs[inputs.length - 1].focus();
    }
  }
    
    
  addInputForExisting(text, uid) {
    let inputbox = this.getNewBlankInputBox();
    inputbox.setAttribute('el-uid', uid);
    inputbox.getElementsByClassName('ui-input')[0].value = text;
    document.getElementsByTagName('inputarea')[0].append(inputbox);
  }

  getNewBlankInputBox() {
    let inputbox = document.createElement('inputbox');
    inputbox.id = createUid();
    let inputEl = document.createElement('input');
    inputEl.placeholder = 'new Line, Point, Function';
    inputEl.oninput = controlGraphObjectCreation;
    inputEl.className = 'ui-input';
    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = '×';
    deleteBtn.onclick = this.deleteInput;
    inputbox.append(inputEl);
    inputbox.append(deleteBtn);
    return inputbox;
  }

  inputs() {
    return [...document.getElementsByClassName('ui-input')];
  }

  getInput(index) {
    return this.inputs()[index];
  }

  deleteInput() {
    // delete graph object
    let uid = this.parentElement.getAttribute('el-uid');
    mainField.removeChildByUid(uid);
    draw();
    // delete input element
    this.parentElement.remove();
  }

  controlInput(e) {
    switch (e.key) {
      case 'Tab' :
        e.preventDefault();
        if (keyIsDown(SHIFT)) {
          this.focusOnLastInput();
        } else {
          this.focusOnNextInput();
        }
        break;
      case 'Enter' :
        document.getElementById('new-input-btn').click();
        break;
      case 'Backspace' :
        let activeInput = document.activeElement;
        if (!activeInput.value) {
          e.preventDefault();
          this.focusOnLastInput();
          activeInput.parentElement.remove();
        }
        break;
    }
  }

}