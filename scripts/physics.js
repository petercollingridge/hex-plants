class Physics {
  constructor() {
    this.gravity = 1;
    this.particles = [];
    this.springs = [];
  }

  addParticle(p) {
    this.particles.push(p);
  }

  addSpring(s) {
    this.springs.push(s);
  }

  update() {
    this.updateParticles();
    this.updateSprings();
    return this;
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[j];
      
      // Accelerate due to gravity
      p.dy += this.gravity;
      
      // Slow velocity due to drag
      p.dx *= this.drag;
      p.dy *= this.drag;

      // Move particles
      p.update();
    }
  }

  updateSprings() {

  }
}
