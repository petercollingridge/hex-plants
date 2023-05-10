const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

const debug = 0;
const running = 1;

let physics;
let cell;

function setup() {
  createCanvas(800, 500);

  physics = new VerletPhysics2D();
  const gravity = new GravityBehavior(new Vec2D(0, 1));
  physics.addBehavior(gravity);
  
  const bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  
  life = new Life(width/2, height/2, 30);
  
  // life.addChild(0, 1);
  // life.addChild(0, 0);
}

function draw() {
  if (running) {
    physics.update();
  }
  background(255);
  life.draw();
}

function mouseClicked() {
  life.addRandChild();
}