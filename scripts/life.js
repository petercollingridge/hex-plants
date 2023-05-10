class Life {
  constructor(x, y, r) {
    this.r = r;
    this.nodes = [];
    this.springs = [];
    this.cells = [];
    this.grid = {};
    this.cellCount = 0;

    const cell = new Cell(this, x, y, r);
    this.cells.push(cell);
    this.grid['0,0'] = cell;
  }

  draw() {
    if (debug === 0) {
      this.cells.forEach(p => p.draw());
    } else if (debug === 1) {
      this.springs.forEach(p => p.draw());
      this.nodes.forEach((p, i) => p.draw(i));
    } else {
      this.cells.forEach((p) => p.draw());
    }
  }

  addChild(parent, position) {
    this.cells[parent].addChild(position);
  }

  addRandChild() {
    // Add random cell to a random child
    // If cells is full then keep trying
    let child;
    while(!child) {
        const cell = randFromArray(this.cells);
        child = cell.addRandChild();
    }
  }
}
