class Life {
  constructor(x, y, r) {
    this.r = r;
    this.nodes = [];
    this.edges = [];
    this.cells = [];
    this.grid = {};
    this.cellCount = 0;

    this.genes = randArray(69);

    // Create a new cell (it will get added to the cells array)
    new Cell(this, x, y, r, 0, 0);
  }

  draw() {
    if (debug === 0) {
      this.cells.forEach(p => p.draw());
    } else if (debug === 1) {
      this.edges.forEach(p => p.draw());
      this.nodes.forEach((p, i) => p.draw(i));
    } else {
      this.cells.forEach((p) => p.draw());
    }
  }

  getCellFromGrid(x, y) {
    return this.grid[`${x},${y}`];
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
