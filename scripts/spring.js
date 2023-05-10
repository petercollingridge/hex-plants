class Spring extends VerletSpring2D {
  constructor(a, b, strength, length) {
    length = length || dist(a.x, a.y, b.x, b.y);
    super(a, b, length, strength);
    physics.addSpring(this);
  }
  
  draw() {
    stroke(0, 0, 0, 128);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
