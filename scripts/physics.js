class Physics {
  constructor() {
    this.gravity = 0.1;
    this.gravityV = new Vec2D(0, this.gravity);
    this.drag = 0.02;
    this.soilDrag = 0.95;
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
    const interations = 3;
    for(let n = 0; n < interations; n++) {
      this.updateParticles();
      this.updateSprings();
    }
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Accelerate due to gravity
      p.accelerationY += this.gravity;

      const tempX = p.x;
      const tempY = p.y;
      
      const velocityX = p.x - p.prevX;
      const velocityY = p.y - p.prevY;
      
      const dragCoefficient = p.y < GROUND ? this.drag : this.soilDrag;

      p.accelerationX -= dragCoefficient * velocityX;
      p.accelerationY -= dragCoefficient * velocityY;
      
      let dx = velocityX + p.accelerationX;
      let dy = velocityY + p.accelerationY;
      
      if (p.y > GROUND) {
        if (dy > 0) {
          // Soil pushes back against gravity
          dy = Math.max(0, dy - 0.1);
        }
      } else if (p.y + dy > GROUND) {
        // Hit the ground
        dy = GROUND - p.y;
      }

      p.x += dx;
      p.y += dy;
      
      p.prevX = tempX;
      p.prevY = tempY;

      // Reset acceleration after updating position
      p.accelerationX = 0;
      p.accelerationY = 0;
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
      s.a.accelerationX += dx;
      s.a.accelerationY += dy;
      s.b.accelerationX -= dx;
      s.b.accelerationY -= dy;
    }
  }
}
