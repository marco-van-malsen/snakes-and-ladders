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
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.val = val;
    this.fnc = fnc;
    this.active = active;
  }

  // draw the control
  show() {
    // set background color
    if (this.active ? fill(100) : fill(200));

    // draw rectangle
    stroke(0);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h);

    // determine text color
    if (this.active ? fill(255) : fill(0));

    // draw text
    noStroke();
    text(this.val, this.x + this.w * 0.5, this.y + this.h * 0.5);
  }

  isClicked(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
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
  let myW = round(w / num);

  // values for first control in set
  let myVal = min;
  let myX = x;

  // create individual controls
  for (let c = min; c <= max; c += interval) {
    // determine if current control-value matches the current value
    let active = false;

    // this is for booleans
    if (min === 0 && max === 1) {
      if ((c === 0 && cur === false) || (c === 1 && cur === true)) {
        active = true;
      }

      // this is for values
    } else {
      if (c === cur) {
        active = true;
      }
    }

    // create control element and add to array
    let control = new Control(myX, y, myW, h, myVal, fnc, active);
    controls.push(control);

    // update for next control
    myVal += interval;
    myX += myW;
  }
}

// handle mouse press events
function mousePressed() {
  // check if control element was pressed
  // if so, then execute the associated function and break
  for (let c = 0; c <= controls.length - 1; c++) {
    if (controls[c].isClicked(mouseX, mouseY)) {
      controls[c].fnc(controls[c].val);
      break;
    }
  }

  // check if the die was clicked
  // only allowed when simulationMode is not active
  if (!simulationMode && !players[curPlayer].animate &&
    mouseX > die.x && mouseX < die.x + die.wh &&
    mouseY > die.y && mouseY < die.y + die.wh) {
    rollDie();
  }
}

// switch animation mode on/off
function toggleAnimationMode() {
  // toggle animation mode
  animationMode = !animationMode;

  // switch game state
  state = ROLL_STATE;

  // start a new game if the previous game has ended
  if (GameOver()) {
    initGame();
  }

  // resume game loop
  loop();
}

// change grid size
function toggleGridSize(num) {
  if (num === cols) {
    return;
  }

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
function toggleNumLadders(num) {
  if (num === numLadders) {
    return;
  }
  numLadders = num;
  // number of snakes >= number of ladders
  numSnakes = max(numLadders, numSnakes);
  initGame();
}

// change number of players
function toggleNumPlayers(num) {
  if (num === numPlayers) {
    return;
  }
  numPlayers = num;
  initGame();
}

// change number of snakes
function toggleNumSnakes(num) {
  if (num === numSnakes) {
    return;
  }
  numSnakes = num;
  // number of ladders <= number of snakes
  numLadders = min(numLadders, numSnakes);
  initGame();
}

// switch simulation mode on or off
function toggleSimulationMode() {
  // toggle simulation mode
  simulationMode = !simulationMode;

  // switch game state
  state = ROLL_STATE;

  // start new game if previous game has ended
  if (GameOver()) {
    initGame();
  }

  // resume game loop
  loop();
}
