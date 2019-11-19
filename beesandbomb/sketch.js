
let bgColor = 100;

let angle = 0;
let w = 10;
let ma;
let maxD;

function setup() {
  createCanvas(400, 400, WEBGL);
  ma = atan(cos(QUARTER_PI));
  maxD = dist(0, 0, 200, 200);
  ortho(-400, 400, 400, -400, 0, 1000);
}

function draw() {
  let ra = map((-angle/50) % 1, 0, 1, 0, 2*PI)
  let raX, raY;

  if(ra <= PI) {
    raX = map(ra, 0, PI, -1, 1)
  } else {
    raX = map(ra, PI, 2*PI, 1, -1)    
  }

  if(ra <= PI/2) {
    raY = map(ra, 0, PI/2, 0, 1)
  } else if(ra <= 3*PI/2) {
    raY = map(ra, PI/2, 3*PI/2, 1, -1)    
  } else {
    raY = map(ra, 3*PI/2, 2*PI, -1, 0)        
  }

  directionalLight(0, 0, 255, raX, 0.33, raY);
  directionalLight(0, 0, 255, -raX, 0.33, -raY);
  directionalLight(255, 0, 0, raY, 0.33, -raX);
  directionalLight(255, 0, 0, -raY, 0.33, raX);

  directionalLight(0, 255, 0, -raY*0.33, -1, raX*0.33);
  background(212, 237, 255);

  rotateX(-ma);
  //rotateY(ra)﻿;
  rotateY(-PI/4)﻿;

  for (let z = 0; z < height; z += w) {
    for (let x = 0; x < width; x += w) {
      push();
      let d = dist(x, z, width / 2, height / 2);
      let offset = map(d*d*d, 0, maxD*maxD*maxD, -PI, PI);
      let a = angle + offset;
      let h = floor(map(sin(a), -1, 1, 100, 300));
      translate(x - width / 2, 0, z - height / 2);
      ambientMaterial(180);
      box(w, h, w);
      pop();
    }
  }

  angle -= 0.08;
}