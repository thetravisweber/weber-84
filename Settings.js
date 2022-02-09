class Settings {
  view;

  constructor() {
    this.view = new SettingsView();
  }

  openView() {
    this.view.open();
  }

  closeView() {
    this.view.close();
  }
}