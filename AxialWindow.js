class AxialWindow {
  constructor(start, end, step=1) {
    if (step<0) {
      throw 'scale cannot be negative';
    }
    if (end < start) {
      let min = this.minimumScale(start, end, step);
      this.start = min.start;
      this.end = min.end;
      this.step = min.step;
    } else {
      this.start = start;
      this.end = end;
      this.step = step;
    }
  }

  minimumScale(start, end, step) {
    let middle = (start + end) / 2;
    start = middle - step;
    end = middle + step;
    return new AxialWindow(start, end, step);
  }

  static from(obj) {
    return new AxialWindow(obj.start, obj.end, obj.step);
  }
}