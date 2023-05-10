class Cell {
  constructor(
    life, x, y, r,
    existingNodes = [], 
    existingEdges = []
  ) {
    this.life = life;
    this.id = life.cells.length;
    this.r = r;
    this.nodes = [];
    this.edges = [];
    this.neighbours = [0,0,0,0,0,0];
      
    this.center = new Particle(x, y);
    this.life.particles.push(this.center);
  
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
        this.life.particles.push(p);
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
        this.life.springs.push(edge);
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
      this.life.springs.push(e1);
      this.life.springs.push(e2);
    }
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
  
  draw(n) {
    fill(120, 160, 30, 120);
    stroke(20, 80, 0);
    beginShape();
    this.nodes.forEach((p, i) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);

    if (debug === 2) {
      fill(0);
      textSize(11);
      noStroke();
      textFont('Arial');
      textAlign(CENTER, CENTER);
      text(n, this.center.x, this.center.y + 1);
      
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
  
  // Create a neighbouring cell along edge n
  addChild(n) {
    console.log(`Cell ${this.id} add child at ${n}`);

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
    
    if (v1.y > height - this.r) {
      return;
    }
    
    const existingNodes = [0,0,0,0,0,0];
    const existingEdges = [0,0,0,0,0,0];
    existingNodes[(n + 4) % 6] = p1;
    existingNodes[(n + 3) % 6] = p2;
    existingEdges[(n + 3) % 6] = this.edges[n];
    
    // Check for neighbour anti-clockwise from this new cell
    const neighbour1 = this.neighbours[(n + 5) % 6];
    if (neighbour1) {
      const sharedNode = neighbour1.getNode(n + 1);
      const sharedEdge = neighbour1.getEdge(n + 1);
      existingNodes[(n + 5) % 6] = sharedNode;
      existingEdges[(n + 4) % 6] = sharedEdge;
    }
    
    // Check for neighbour clockwise from this new cell
    const neighbour2 = this.neighbours[(n + 1) % 6];
    if (neighbour2) {
      const sharedNode = neighbour2.getNode(n);
      const sharedEdge = neighbour2.getEdge(n + 5);
      existingNodes[(n + 2) % 6] = sharedNode;
      existingEdges[(n + 2) % 6] = sharedEdge;
    }
    
    const cell = new Cell(
      this.life,
      v1.x,
      v1.y,
      this.r,
      existingNodes,
      existingEdges
    );
    
    this.addNeighbour(cell, n);
    this.life.cells.push(cell);
    
    if(neighbour1) {
      cell.addNeighbour(neighbour1, (n + 4) % 6);
    }
    if(neighbour2) {
      cell.addNeighbour(neighbour2, (n + 2) % 6);
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
