// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// setup die
class Die {
  // initialize
  constructor() {
    // set width and height of die, x and y position of the die-center and radius
    this.wh = 50;
    this.x = cols * tileSize + separator + controlsArea / 2 - this.wh * 0.5;
    this.y = title + separator + (rows - 1) * tileSize - this.wh * 0.5;
    this.r = this.wh * 0.1;
    this.value = 0;
  }

  // handle mouse press/click events
  clicked(x, y) {
    return (x > die.x && x < die.x + die.wh && y > die.y && y < die.y + die.wh);
  }

  // roll the die (takes an optional parameter for the desired die to be rolled)
  roll(num) {
    if (debug) console.log('roll the die'); // debug

    // start a new game
    if (state === GAME_OVER) initGame();

    // pick a random number between 1 and 6 or desired value when given
    die.value = (num ? num : floor(random(1, 7)));

    // set preview
    players[curPlayer].previewS = players[curPlayer].spot;
    players[curPlayer].previewF = players[curPlayer].spot + die.value;

    // change game state
    state = MOVE_STATE;

    // restart game loop, when in interactive mode
    if (!simulationMode) loop();
  }

  show() {
    if (debug) console.log('show die'); // debug

    // show instructions
    if (!simulationMode) {
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text('Click die to roll', die.x + 0.5 * die.wh, die.y - 15);
    }

    // draw the die outline
    fill(simulationMode ? 255 : players[curPlayer].tokenColor);
    strokeWeight(4);
    stroke(0);
    rect(die.x, die.y, die.wh, die.wh, die.r);

    // remember current settings
    push();

    // set the dot-size and offset
    let dotD = 9; // dot diameter
    let dotXY = 13; // dot offset from center

    // translate to center of die
    // dots are drawn relative to die-center
    translate(die.x + die.wh * 0.5, die.y + die.wh * 0.5);

    // set format for dots
    noStroke();
    fill(0);

    //    DOTS   |    1    |    2    |    3    |    4    |    5    |    6
    //  ---------|---------|---------|---------|---------|---------|---------
    //    1 2 3  |  * * *  |  * 2 *  |  * * 3  |  1 * 3  |  1 * 3  |  1 * 3
    //    4 5 6  |  * 5 *  |  * * *  |  * 5 *  |  * * *  |  * 5 *  |  4 * 6
    //    7 8 9  |  * * *  |  * 8 *  |  7 * *  |  7 * 9  |  7 * 9  |  7 * 9
    //  ---------|---------|---------|---------|---------|---------|---------
    // draw dot 1
    if (die.value === 4 || die.value === 5 || die.value === 6) {
      ellipse(-dotXY, -dotXY, dotD, dotD);
    }

    // draw dot 2
    if (die.value === 2) ellipse(0, -dotXY, dotD, dotD);


    // draw dot 3
    if (die.value === 3 || die.value === 4 || die.value === 5 || die.value === 6) {
      ellipse(dotXY, -dotXY, dotD, dotD);
    }

    // draw dot 4
    if (die.value === 6) ellipse(-dotXY, 0, dotD, dotD);

    // draw dot 5
    if (die.value === 1 || die.value === 3 || die.value === 5) {
      ellipse(0, 0, dotD, dotD);
    }

    // draw dot 6
    if (die.value === 6) ellipse(dotXY, 0, dotD, dotD);

    // draw dot 7
    if (die.value === 3 || die.value === 4 || die.value === 5 || die.value === 6) {
      ellipse(-dotXY, dotXY, dotD, dotD);
    }

    // draw dot 8
    if (die.value === 2) ellipse(0, dotXY, dotD, dotD);

    // draw dot 9
    if (die.value === 4 || die.value === 5 || die.value === 6) {
      ellipse(dotXY, dotXY, dotD, dotD);
    }

    // restore previous settings
    pop();
  }
}