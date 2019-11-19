// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/0jjeOYMjmDU

var angleSlider, windSlider;
var tree, wind;
var windForce;

var angleSliderValue = 0;
var lengthModifier = 0.67;

var minSize = 10;
var maxWidth = 12;
var startLength = 120;
var windAmound = 10;

var inertieStep = 0.2;
var inertiaFactor = 0.95;
var angleStep = 0.002;

function setup() {
  createCanvas(600, 600);
  angleSlider = createSlider(PI/20, PI/4, PI/10, 0.01);
  windSlider = createSlider(-1, 1, 0, 0.01);
}

function draw() {
  background(230);
  if(angleSlider.value() != angleSliderValue) {
    tree = [];
    wind = [];
    angleSliderValue = angleSlider.value();
    translate(width/2, height);
    branch(1, startLength, maxWidth, 0, [0, 0]);
  } else {
    if(windSlider.value() != 0) {
        windForce = windSlider.value() + random(windSlider.value() - windSlider.value()/10, windSlider.value() + windSlider.value()/10);
    } else {
        windForce = 0;
    }
    drawWithWind();
  }
}

function branch(level, len, width, currentAngle, coord) {

  tree.push(["line", level, len, width]);

  if (len > minSize) {
    let nbBranch = round(random(2,2+(2/level)));
    let minAngle = - angleSlider.value()*1.5;
    let maxAngle = angleSlider.value()*1.5;
    let deltaAngle = (maxAngle - minAngle) / nbBranch;
    for(let i = 0; i < nbBranch; i++) {

      let branchAngle = random(minAngle + i * deltaAngle, maxAngle - (nbBranch-i-1) * deltaAngle);
      let nextLength = len * random(lengthModifier - lengthModifier * 0.3, lengthModifier + lengthModifier * 0.3);
      let nextWidth = width <= 1 ? 1 : width*0.7;
      tree.push(["rotate", level, branchAngle, branchAngle, 0, currentAngle, currentAngle]);
      branch(level+1, nextLength, nextWidth, currentAngle + branchAngle, [coord[0] + sin(currentAngle) * len, coord[1] + abs(cos(currentAngle) * len) * (abs((currentAngle)) > 90 ? -1 : 1)]);
      tree.push(["pop"]);
    }
  } else {
    stroke(21,144,43);
    let nbLeaves = round(random(3,5));
    let deltaAngle = PI / nbLeaves;
    for(let i = 0; i < nbLeaves; i++) {
        let leaveAngle = random(-PI/2 + i * deltaAngle, PI/2 - (nbLeaves-i-1) * deltaAngle);
        tree.push(["leave", random(1,3), leaveAngle]);
    } 
   }
}

function drawWithWind() {
  translate(width/2, height);
  drawArray(tree[0]);

  if(windForce !== 0) drawWind();
  else wind = [];
}

function drawArray(a) {

  for (let i = 0; i < tree.length; i++) {
    let elem = tree[i];
    if(elem[0] === "line") {
      stroke(139,69,19);
      strokeWeight(elem[3]);
      line(0, 0, 0, -elem[2]);
      translate(0, -elem[2]);
    } else if(elem[0] === "leave") {
      stroke(21,144,43);
      strokeWeight(0.5);
      push();
      rotate(elem[2]);
      line(0, 0, 0, -elem[1]);
      translate(0, -elem[1]);
      pop();
    } else if (elem[0] === "rotate") {
      push();

      let currentAngle = elem[3];
      let objectiveAngle = map(windForce * map(constrain(elem[1],1,10),1,10,0.2,0.8), -1, 1, -PI/10, PI/10);
      let deltaObjAngle = elem[2] + objectiveAngle - currentAngle;
      let inertie = elem[4];
      let newAngle;

      // SI A GAUCHE DE LA DEST
      if(deltaObjAngle > 0) {
        inertie += inertieStep;
      // SI A DROITE DE LA DEST
      } else if (deltaObjAngle < 0) {
        inertie -= inertieStep;
      }

      inertie *= inertiaFactor;
      newAngle = currentAngle + angleStep * inertie;

      tree[i][3] = newAngle;
      tree[i][4] = inertie;
      rotate(newAngle);

    } else if (elem[0] === "pop") {
      pop();
    }
  }
}

function drawWind() {
  stroke(0,255,255);
  strokeWeight(2);
  translate(-width/2, -height + startLength);

  if(wind.length < windAmound) {
    for(let i = wind.length; i < windAmound; i++) {
      if(windForce > 0) {
        wind.push([-width/2, random(height), random(width/2), random(1, 3)])
      } else {
        wind.push([width, random(height), random(width/2), random(1, 3)])        
      } 
    }
  }

  let windCopy = wind;
  for(let i = 0; i < windCopy.length; i++) {
    line(windCopy[i][0], windCopy[i][1], windCopy[i][0] + windCopy[i][2], windCopy[i][1] + 1);
    windCopy[i][0] += windCopy[i][3] * windSlider.value() * 5;
    if((windForce > 0 && windCopy[i][0] > width) || (windForce < 0 && windCopy[i][0] < -width/2)) wind.splice(i,1);
  }
}

/*

      let currentAngle = elem[3];
      let objectiveAngle = map(windForce * map(constrain(elem[1],1,10),1,10,0.2,0.8), -1, 1, -PI/10, PI/10);
      let deltaObjAngle = elem[2] + objectiveAngle - currentAngle;
      let inertie = elem[4];
      let newAngle;

      // SI A GAUCHE DE LA DEST
      if(deltaObjAngle > 0) {
        inertie += inertieStep;
      // SI A DROITE DE LA DEST
      } else if (deltaObjAngle < 0) {
        inertie -= inertieStep;
      }

      inertie *= inertiaFactor;
      newAngle = currentAngle + angleStep * inertie;

      tree[i][3] = newAngle;
      tree[i][4] = inertie;
      rotate(newAngle);

      */
