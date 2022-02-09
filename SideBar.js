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
      addInputForExisting(child.toString(), child.getUid());
    })
  }

  addNewBlankInput(e) {
    let input = getNewBlankInputBox();
    document.getElementsByTagName('inputarea')[0].append(input);
    if (e) {
      let inputs = getInputs();
      inputs[inputs.length - 1].focus();
    }
  }
  
}