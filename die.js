// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

class Die {
  // call a reset function to initialize
  constructor() {
    // set x and y position of the die-center
    this.x = cols * resolution + separator + controlsArea / 2;
    this.y = title + separator + rows * resolution - 60;
    this.wh = 50;
    this.r = this.wh * 0.1;
    this.value = 0;
  }
}

// roll the die
function rollDie() {
  // if (DEBUG) console.clear();
  // if (DEBUG) console.log("ROLL THE DIE");

  // pick a random number 1 to 6
  die.value = random([1, 2, 3, 4, 5, 6]);
  if (DEBUG) console.log("- die rolled a " + die.value);

  // switch state
  state = PREVIEW_STATE;

  // start looping, when in interactive mode
  if (!simulationMode) {
    loop();
  }
}

function showDie() {
  // remember current settings
  push();

  // translate to center of where die will be drawn
  translate(die.x, die.y);

  // draw the die outline
  rectMode(CENTER);
  fill(255);
  strokeWeight(4);
  stroke(0);
  rect(0, 0, die.wh, die.wh, die.r, die.r, die.r, die.r);

  // draw the dots
  //   DOTS  |    1    |    2    |    3    |    4    |    5    |    6
  //  -------|---------|---------|---------|---------|---------|---------
  //  1 2 3  |  * * *  |  * 2 *  |  * * 3  |  1 * 3  |  1 * 3  |  1 * 3
  //  4 5 6  |  * 5 *  |  * * *  |  * 5 *  |  * * *  |  * 5 *  |  4 * 6
  //  7 8 9  |  * * *  |  * 8 *  |  7 * *  |  7 * 9  |  7 * 9  |  7 * 9
  //  -------|---------|---------|---------|---------|---------|---------
  // draw dot 1
  if (die.value === 4 || die.value === 5 || die.value === 6) {
    ellipse(-13, -13, 3, 3);
  }
  // draw dot 2
  if (die.value === 2) {
    ellipse(0, -13, 3, 3);
  }
  // draw dot 3
  if (die.value === 3 || die.value === 4 || die.value === 5 || die.value === 6) {
    ellipse(13, -13, 3, 3);
  }
  // draw dot 4
  if (die.value === 6) {
    ellipse(-13, 0, 3, 3);
  }
  // draw dot 5
  if (die.value === 1 || die.value === 3 || die.value === 5) {
    ellipse(0, 0, 3, 3);
  }
  // draw dot 6
  if (die.value === 6) {
    ellipse(13, 0, 3, 3);
  }
  // draw dot 7
  if (die.value === 3 || die.value === 4 || die.value === 5 || die.value === 6) {
    ellipse(-13, 13, 3, 3);
  }
  // draw dot 8
  if (die.value === 2) {
    ellipse(0, 13, 3, 3);
  }
  // draw dot 9
  if (die.value === 4 || die.value === 5 || die.value === 6) {
    ellipse(13, 13, 3, 3);
  }

  // restore previous settings
  pop();
}