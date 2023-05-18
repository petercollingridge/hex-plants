class Physics {
  constructor() {
    this.gravity = 0.2;
    this.drag = 0.99;
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
      const p = this.particles[i];

      // Accelerate due to gravity
      p.dy += this.gravity;

      // Slow velocity due to drag
      p.dx *= this.drag;
      p.dy *= this.drag;

      // Move particles
      p.x += p.dx;

      const newY = p.y + p.dy;
      // Apply gravity if we are above the ground
      if (newY < height - GROUND) {
        p.y = newY;
      } else {
        // Cancel gravity
        p.dy = 0;
        // If currently above ground, move to suface
        if (p.y < height - GROUND) {
          p.y = height - GROUND
        }
      }
    }
  }

  updateSprings() {

  }
}
