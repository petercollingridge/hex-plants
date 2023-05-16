class Cell {
  constructor(
    life, x, y, r,
    gx, gy,
    existingNodes = [], 
    existingEdges = [],
    inputValues,
  ) {
    this.r = r;
    this.life = life;
    this.id = life.cellCount++;

    // Coordinates in a virtual grid of the organism's cells
    this.gx = gx;
    this.gy = gy;

    this.life.cells.push(this);
    this.life.grid[`${gx},${gy}`] = this;

    this.nodes = [];
    this.edges = [];
    this.neighbours = [0,0,0,0,0,0];

    this.center = new Particle(x, y);
    this.life.nodes.push(this.center);

    const edgeStrength = 0.05;
    const crossStrength = 0.2;
    const crossLength = r * Math.sqrt(3);

    for (let i = 0; i < 6; i++) {
      if (existingNodes[i]) {
        this.nodes.push(existingNodes[i]);
      } else {
        // Create a new particle
        const angle = i * Math.PI / 3;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        const p = new Particle(px, py)
        this.nodes.push(p);

        // Add particle to parent
        this.life.nodes.push(p);
      }
    }

    // Add edge springs
    for (let i = 0; i < 6; i++) {
      if (existingEdges[i]) {
        this.edges.push(existingEdges[i]);
      } else {
        const p1 = this.nodes[i];
        const p2 = this.nodes[(i + 1) % 6];
        const edge = new Spring(p1, p2, edgeStrength, r);
        this.edges.push(edge);

        // Add springs to parent
        this.life.edges.push(edge);
      }
    }

    // Add structural springs
    for (let i = 0; i < 6; i++) {
      const p1 = this.nodes[i];
      const p2 = this.nodes[(i + 2) % 6];

      // Spoke spring
      const e1 = new Spring(this.center, p1, crossStrength, r);

      // Cross spring
      const e2 = new Spring(p1, p2, crossStrength, crossLength);

      this.edges.push(e1);
      this.edges.push(e2);
      this.life.edges.push(e1);
      this.life.edges.push(e2);
    }

    this.inputValues = inputValues || randArray(4);
    this.findGrowthRates(life.genes);
    this.growth = 0;
  }

  getNode(n) {
    return this.nodes[n % 6];
  }

  getEdge(n) {
    return this.edges[n % 6];
  }

  addNeighbour(cell, n) {
    this.neighbours[n] = cell;
    cell.neighbours[(n + 3) % 6] = this;
  }

  draw() {
    fill(120, 160, 30, 120);
    stroke(20, 80, 0);
    beginShape();
    this.nodes.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);

    if (debug === 2) {
      fill(0);
      textSize(11);
      noStroke();
      textFont('Arial');
      textAlign(CENTER, CENTER);
      text(this.id, this.center.x, this.center.y + 1);

      for (let i = 0; i < 6; i++) {
        const neighbour = this.neighbours[i];
        if (neighbour) {
          stroke(0);
          line(
            this.center.x,
            this.center.y,
            neighbour.center.x,
            neighbour.center.y);
        }
      }
    }
  }

  grow() {
    if (this.growthDirection !== undefined) {
      this.growth += this.growthRates[this.growthDirection];
      console.log(this.growth);
      if (this.growth > GROWTH_THRESHOLD) {
        this.growth = 0;
        this.addChild(this.growthDirection);
        this.growthDirection = this.getGrowthDirections();
      }
    }
  }

  // Find rate of growing child cells in each direction
  // Returns an 6x5 array of arrays
  // Each item in the first array corresponds to a position
  // Each item is an array where the first number if the growth rate at that position
  // The next four numbers are the input valies for the child cell at that position
  findGrowthRates(genes) {
    const weights1 = genes.slice(0, 40);
    const weights2 = genes.slice(40, 56);
    const weights3 = genes.slice(56, 76);
    const biases1 = genes.slice(76, 80);
    const biases2 = genes.slice(80, 84);
    const biases3 = genes.slice(84, 89);

    this.growthRates = [];
    this.childInputs = [];
    for (let i = 0; i < 6; i++) {
      const allInputs = [0,0,0,0,0,0].concat(this.inputValues);
      allInputs[i] = 1;   // Set value for this position to 1

      const hiddenLayer1 = nextLayer(allInputs, biases1, weights1);
      const hiddenLayer2 = nextLayer(hiddenLayer1, biases2, weights2);
      const output = nextLayer(hiddenLayer2, biases3, weights3);
      this.growthRates.push(Math.max(0, output[0]));
      this.childInputs.push(output.slice(1));
    }

    this.growthDirection = this.getGrowthDirections();
  }

  getGrowthDirections() {
    let growthDirection;
    let maxRate = 0;

    for (let i = 0; i < 6; i++) {
      if (!this.neighbours[i]) {
        if (this.growthRates[i] > maxRate) {
          growthDirection = i;
          maxRate = this.growthRates[i];
        }
      }
    }

    return growthDirection;
  }

  // Create a neighbouring cell along edge n
  addChild(n) {
    if (debug) {
      console.log(`Cell ${this.id} add child at ${n}`);
    }

    if (this.neighbours[n]) {
      console.log('Already a cell at ' + n);
      return;
    }

    // Nodes ajoining edge n
    const p1 = this.getNode(n);
    const p2 = this.getNode(n + 1);

    // Vector to new center is the sum of the vectors to
    // the two nodes along the target edge
    const v1 = p1.add(p2.sub(this.center));

    // Don't add a cell if it would be under the ground
    if (v1.y > height - this.r) {
      console.log('Cell hits ground');
      return;
    }

    const [gx, gy] = getPosition(this.gx, this.gy, n);

    // Find neighbours of new cell
    const neighbours = [0,0,0,0,0,0];

    for (let i = 0; i < 6; i++) {
      if ((i + 3) % 6 === n) {
        neighbours[i] = this;
      } else {
        const [nx, ny] = getPosition(gx, gy, i);
        const neighbour = this.life.getCellFromGrid(nx, ny);
        if (neighbour) {
          neighbours[i] = neighbour;
          // console.log(`Neighbour ${neighbour.id} at position ${i} (${nx}, ${ny})`)
        }
      }
    }

    // Find which nodes and edges are shared with neighbouring cells
    const existingNodes = [0,0,0,0,0,0];
    const existingEdges = [0,0,0,0,0,0];

    for (let i = 0; i < 6; i++) {
      const neighbour = neighbours[i];
      if (neighbour) {
        existingNodes[i] = neighbour.getNode(i + 4);
        existingNodes[(i + 1) % 6] = neighbour.getNode(i + 3);
        existingEdges[i] =  neighbour.getEdge(n + 3);
      }
    }

    const inputValues = this.childInputs[n];
    const cell = new Cell(
      this.life,
      v1.x,
      v1.y,
      this.r,
      gx, gy,
      existingNodes,
      existingEdges,
      inputValues
    );

    for (let i = 0; i < 6; i++) {
      if (neighbours[i]) {
        cell.addNeighbour(neighbours[i], i); 
      }
    }

    return cell;
  }

  addRandChild() {
    const freeSpaces = [];
    for (let i = 0; i < 6; i++) {
      if (!this.neighbours[i]) {
        freeSpaces.push(i);
      }
    }

    if (freeSpaces.length === 0) {
      return false;
    }

    return this.addChild(randFromArray(freeSpaces));
  }
};
