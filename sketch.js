// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// define available game states and set initial game state
const GAME_OVER = 0; // game over
const ROLL_STATE = 1; // roll the die
const MOVE_STATE = 2; // move player to next spot
const SNADDER_STATE = 3; // move player along a Snake or Ladder
let state;

// values required for player animation
const INTERPOLATION_SPEED = 1 / 15;
const TURN_DELAY = 15;

// set initial game animation mode
let animationMode = true;

// array with all game controls
let controls = [];

// enable or disable debugging
let debug = false;

// the die
let die;

// keep track of the final result of the players
// initialize at 0 in initGame and increase by one for every finished player
let finishOrder;

// the players
let players = [];

// set initial game simulation mode
let simulationMode = true;

// all the tiles
let tiles = [];

// delay between turns
let turnDelay;

// number of turns played
let turns;

// setup gameboard (columns, rows and tile size)
let maxColsRows = 14;
let minColsRows = 10;
let cols = 10;
let rows = cols;
let tileSize = 40;

// setup control for number of players
let curPlayer;
let maxPlayers = 4;
let numPlayers = 4;

// setup control for number of ladders
let maxLadders = cols * 0.5;
let numLadders = 3;

// setup control for number of snakes
let maxSnakes = cols * 0.5;
let numSnakes = 3;

// setup game areas (title, separator and controls area)
let controlsArea = 4 * tileSize;
let playersArea;
let separator = 0.5 * tileSize;

// height of rectangle with title in it
let title = tileSize;

// statistics for total times players landed on any snake or ladder
let statsNumLadders;
let statsNumSnakes;

function setup() {
  // default text format
  textAlign(CENTER, CENTER);
  textSize(12);

  // initialize the game
  initGame();
}

function draw() {
  // update everything except the board only when no player is moving
  if (!players[curPlayer].animate) {
    background(245);
    showGameTitle();
    showControlsArea();
    showPlayersArea();
    showStats();
  }
  if (debug) console.clear(); // clear console for debug

  // show the die
  die.show();

  // draw tiles
  if (debug) console.log('draw tiles'); // debug
  for (let tile of tiles) tile.show();

  // draw snakes and ladders
  if (debug) console.log('draw snakes and ladders'); // debug
  for (let tile of tiles) tile.showSnadders();

  // show stationary players
  showPlayers();

  // disable game logic when game is over
  if (state === GAME_OVER) {
    if (debug) console.log('game over'); // debug
    return;
  }

  // wait between turns
  if (turnDelay > 0) {
    if (debug) console.log('animation loop'); // debug
    turnDelay--;
    return;
  }

  // roll the die or wait for player to roll the die
  if (state === ROLL_STATE) {
    if (debug) console.log('ROLL STATE'); // debug
    if (simulationMode ? die.roll() : noLoop());

    // player moving number of spots rolled by die
  } else if (state === MOVE_STATE) {
    if (debug) console.log('MOVE STATE'); // debug
    // show preview
    if (animationMode) {
      players[curPlayer].showPreview();
      players[curPlayer].movePlayer();
      if (players[curPlayer].animate && debug) console.log('start animation loop'); // debug
      if (players[curPlayer].animate) return;
    } else {
      players[curPlayer].updateSimple();
    }

    // update player history
    players[curPlayer].updateHistory();

    // switch game state
    if (players[curPlayer].isSnadder()) {
      // switch game state
      state = SNADDER_STATE;
      return;
    }

    // reset animation
    if (animationMode) players[curPlayer].resetAnimation();

    // check if player is finished
    players[curPlayer].checkFinished();

    // switch player
    switchPlayer();

    // switch game state
    state = ROLL_STATE;

    // player following a snadder
  } else if (state === SNADDER_STATE) {
    if (debug) console.log('SNADDER STATE'); // debug

    //  move player; with animation
    players[curPlayer].movePlayer();
    if (players[curPlayer].animate) return;

    // continue following snadders; then continue main game loop
    if (!players[curPlayer].isSnadder()) {
      players[curPlayer].updateHistory();
      switchPlayer();
      state = ROLL_STATE;
    }
  }

  // check game over state
  if (GameOver()) {
    if (debug) console.log('GAME OVER!'); // debug

    // reset the die
    die.value = 0;
    die.show();

    // switch game state
    state = GAME_OVER;
  }

  if (debug) console.log('run loop() to continue game play'); // debug
  if (debug) noLoop(); // debug only
}