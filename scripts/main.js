const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

const GROWTH_THRESHOLD = 100;
const debug = 0;

let GROUND;
let running = true;
let physics;
let life;

// const drag = {
//   applyBehavior: function(p) {
//     if (p.y > height - GROUND) {
//       // Below the soil don't fall due to gravity
//       p.addForce(new Vec2D(0, -2));
//       // Experience high drag
//       p.scaleVelocity(0.01);
//     } else {
//       p.scaleVelocity(0.99);
//     }
//   },
//   configure: function(timeStep) {
//     this.timeStep = timeStep;
//   },
// }

function setup() {
  createCanvas(800, 500);
  GROUND = height - 200;

  physics = new Physics();

  // physics = new VerletPhysics2D();
  // const gravity = new GravityBehavior(new Vec2D(0, 1));
  // physics.addBehavior(gravity);

  // physics.addBehavior(drag);

  // const bounds = new Rect(0, 0, width, height);
  // physics.setWorldBounds(bounds);

  life = new Life(width/2, height/2, 30);

  // const a = new Particle(500, 20);
  // const b = new Particle(550, 20);
  // const c = new Particle(100, GROUND + 100);
  // const d = new Particle(140, GROUND - 20);
  // const s1 = new Spring(a, b, 0.1, 60);
  // const s2 = new Spring(c, d, 0.1, 60);
}

function draw() {
  if (running) {
    physics.update();
    // life.update();
  }

  background(255);
  fill(160, 100, 0);
  rect(-1, GROUND, width + 2, height);

  // physics.particles.forEach((p) => p.draw());

  life.draw();
}

function mouseClicked() {
  life.addRandChild();
}

function keyPressed() {
  if (keyCode === 32) {
    running = !running;
  }
}