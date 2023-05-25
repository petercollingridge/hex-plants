class Spring {
  constructor(a, b, strength, length) {
    this.a = a;
    this.b = b;
    this.strength = strength;
    this.length = length || dist(a.x, a.y, b.x, b.y);
    physics.addSpring(this);
  }

  draw() {
    stroke(0, 0, 0, 128);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
