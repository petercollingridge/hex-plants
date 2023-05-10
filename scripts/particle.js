class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(x, y);
    this.r = 6;
    physics.addParticle(this);
  }
  
  draw(n) {
    stroke(20);
    fill(255);
    circle(this.x, this.y, this.r * 2);
    
    fill(0);
    textSize(8);
    noStroke();
    textFont('Arial');
    textAlign(CENTER, CENTER);
    text(n, this.x, this.y + 1);
  }
}
