// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

class Die {
  // call a reset function to initialize
  constructor() {
    // set x and y position of the die-center
    this.x = cols * resolution + separator + controlsArea / 2;
    this.y = title + separator + rows * resolution - 75;
    this.wh = 50;
    this.r = this.wh * 0.1;
    this.value = 0;
  }
}

// roll the die
function rollDie() {
  if (state === ROLL_STATE) {
    die.value = random([1, 2, 3, 4, 5, 6]);
    player.roll = die.value;
    player.next = player.spot + die.value;
    showDie(die.value);
  }
}

function showDie(number) {
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
  if (number === 4 || number === 5 || number === 6) {
    ellipse(-13, -13, 3, 3);
  }
  // draw dot 2
  if (number === 2) {
    ellipse(0, -13, 3, 3);
  }
  // draw dot 3
  if (number === 3 || number === 4 || number === 5 || number === 6) {
    ellipse(13, -13, 3, 3);
  }
  // draw dot 4
  if (number === 6) {
    ellipse(-13, 0, 3, 3);
  }
  // draw dot 5
  if (number === 1 || number === 3 || number === 5) {
    ellipse(0, 0, 3, 3);
  }
  // draw dot 6
  if (number === 6) {
    ellipse(13, 0, 3, 3);
  }
  // draw dot 7
  if (number === 3 || number === 4 || number === 5 || number === 6) {
    ellipse(-13, 13, 3, 3);
  }
  // draw dot 8
  if (number === 2) {
    ellipse(0, 13, 3, 3);
  }
  // draw dot 9
  if (number === 4 || number === 5 || number === 6) {
    ellipse(13, 13, 3, 3);
  }

  // restore previous settings
  pop();
};