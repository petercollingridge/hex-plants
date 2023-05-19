class Physics {
  constructor() {
    this.gravity = 0.2;
    this.drag = 0.95;
    this.soilDrag = 0.02;
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
    const interations = 1;
    for(let n = 0; n < interations; n++) {
      this.updateParticles();
      this.updateSprings();
    }
    return this;
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.y < GROUND) {
        // Accelerate due to gravity
        p.dy += this.gravity;
        
        // Slow velocity due to air drag
        p.dx *= this.drag;
        p.dy *= this.drag;

        // Hit soil
        if (p.y + p.dy > GROUND) {
          p.dy = GROUND - p.y;
        }
      } else {
        // Drag is much higher in the soil
        p.dx *= this.soilDrag;
        p.dy *= this.soilDrag;

        // Soil pushes back against particles to so degree
        if (p.dy > 0) {
          p.dy = Math.max(0, p.dy - 0.01);
        }
      }

      // Move particles
      p.x += p.dx;
      p.y += p.dy;

      // const newY = p.y + p.dy;
      // // Apply gravity if we are above the ground
      // // Or force acts upwards
      // if (newY < GROUND || p.dy < 0) {
      //   p.y = newY;
      // } else {
      //   // Cancel gravity
      //   p.dy = 0;
      //   // If currently above ground, move to suface
      //   if (p.y < GROUND) {
      //     p.y = GROUND
      //   }
      // }
    }
  }

  updateSprings() {
    for (let i = 0; i < this.springs.length; i++) {
      const s = this.springs[i];
      let dx = s.b.x - s.a.x;
      let dy = s.b.y - s.a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + EPSILON;
      const force = s.strength * (dist - s.length) / dist;

      dx *= force;
      dy *= force;
      s.a.dx += dx;
      s.a.dy += dy;
      s.b.dx -= dx;
      s.b.dy -= dy;
    }
  }
}
