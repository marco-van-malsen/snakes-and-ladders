// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// each individual control
class Control {
  // (x,y) = upper left corner of control element
  // (w,h) = width and height of control element
  // (val) = value to show
  // (fnc) = function to execute when clicked
  // (active) = boolean to mark the control as the currently active one in the set
  constructor(x, y, w, h, val, fnc, active) {
    this.active = active;
    this.fnc = fnc;
    this.val = val;
    this.h = h;
    this.w = w;
    this.x = x;
    this.y = y;
  }

  // check if the die was clicked by the user
  isClicked(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
  }

  // draw the control
  show() {
    // draw rectangle
    if (this.active ? fill(100) : fill(200));
    stroke(0);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h);

    // draw text
    if (this.active ? fill(255) : fill(0));
    noStroke();
    text(this.val, this.x + this.w * 0.5, this.y + this.h * 0.5);
  }
}

// create a set of controls
// (x,y) = upper left corner of control-set
// (w,h) = total width and height of control-set
// (cur) = current value
// (min) = mininum value
// (max) = maximum value
// (num) = number of choices
// (fnc) = function to call when clicked
function createControlSet(x, y, w, h, cur, min, max, num, fnc) {
  // calculate interval
  let interval = (max - min) / (num - 1);

  // calculate width of individual control
  let myW = w / num;

  // values for first control in set
  let myVal = min;
  let myX = x;

  // create individual controls
  for (let c = min; c <= max; c += interval) {
    // determine if current control-value matches the current value
    let active = false;

    // this is for booleans
    if (min === 0 && max === 1) {
      if ((c === 0 && cur === false) || (c === 1 && cur === true)) active = true;

      // this is for values
    } else {
      if (c === cur) active = true;
    }

    // create control element and add to array
    let control = new Control(myX, y, myW, h, myVal, fnc, active);
    controls.push(control);

    // update for next control
    myVal += interval;
    myX = round(myX + myW);
  }
}

// handle mouse press events
function mousePressed() {
  // toggle debug mode when Title is clicked
  if (mouseX < cols * tileSize && mouseY <= title) {
    // toggle debug mode
    debug = !debug;

    // disable simulation mode when activating debug mode
    if (debug) simulationMode = false;

    // redraw
    draw();
  }

  // check if control element was pressed
  // if so, then execute the associated function and break
  for (let c of controls) {
    if (c.isClicked(mouseX, mouseY)) c.fnc(c.val);
  }

  // check if the die was clicked
  if (die.clicked(mouseX, mouseY)) {
    // allowed when game is over
    if (state === GAME_OVER) die.roll();

    // allowed when animation has finished in interactive mode
    if (!simulationMode && !players[curPlayer].animate) die.roll();
  }
}

// switch animation mode on/off
function toggleAnimationMode() {
  // toggle animation mode
  animationMode = !animationMode;

  // switch game state
  state = ROLL_STATE;

  // start a new game if the previous game has ended
  if (GameOver()) initGame();

  // resume game loop
  loop();
}

// change grid size
function toggleGridSize(num) {
  // nothing to do, bye bye
  if (num === cols) return;

  // update grid size
  cols = num;
  rows = cols;

  // set maximum possible snakes and ladder
  maxSnakes = cols * 0.5;
  maxLadders = maxSnakes;

  // set active number of snakes and ladders
  numSnakes = floor(cols / 3);
  numLadders = numSnakes;

  // start a new game
  initGame();
}

// change number of ladders
// number of snakes >= number of ladders
function toggleNumLadders(num) {
  if (num === numLadders) return;
  numLadders = num;
  numSnakes = max(numLadders, numSnakes);
  initGame();
}

// change number of players
function toggleNumPlayers(num) {
  if (num === numPlayers) return;
  numPlayers = num;
  initGame();
}

// change number of snakes
// number of ladders <= number of snakes
function toggleNumSnakes(num) {
  if (num === numSnakes) return;
  numSnakes = num;
  numLadders = min(numLadders, numSnakes);
  initGame();
}

// switch simulation mode on or off
function toggleSimulationMode() {
  // toggle simulation mode
  simulationMode = !simulationMode;

  // switch game state
  if (simulationMode) state = ROLL_STATE;

  // start new game if previous game has ended
  if (GameOver()) initGame();

  // resume game loop
  loop();
}