class Particle {
  constructor(x, y) {
    this.r = 6;
    this.x = x; // Particle's current x-coordinate
    this.y = y; // Particle's current y-coordinate
    this.prevX = x; // Particle's previous x-coordinate
    this.prevY = y; // Particle's previous y-coordinate
    this.accelerationX = 0; // Particle's acceleration in the x-direction
    this.accelerationY = 0; // Particle's acceleration in the y-direction
    physics.addParticle(this);
  }

  draw(n = '') {
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