// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// define available game states and set initial game state
const ROLL_STATE = 1; // roll the die
const MOVE_STATE = 2; // move player to next spot
const SNADDER_STATE = 3; // move player along a Snake or Ladder
let state;

// values required for player animation
let INTERPOLATION_SPEED = 1 / 15;
let TURN_DELAY = 15;

// set initial game animation mode
let animationMode = true;

// set initial game simulation mode
let simulationMode = true;

// all the tiles
let tiles = [];

// the players
let players = [];

// keep track of the final result of the players
// initialize at 0 in initGame and increase by one for every finished player
let finishOrder;

// number of turns played
let turns;

// the die
let die;

// setup gameboard (columns, rows and tile size)
maxColsRows = 14;
minColsRows = 10;
let cols = 10;
let rows = cols;
let resolution = 40;

// setup control for number of players
let curPlayer;
let maxPlayers = 4;
let numPlayers = 2;
var sliderPlayers;
var txtPlayers = "";

// setup control for number of ladders
let maxLadders = cols * 0.5;
let numLadders = 3;
var sliderLadders;
var txtLadders = "";

// setup control for number of snakes
let maxSnakes = cols * 0.5;
let numSnakes = 3;
var sliderSnakes;
var txtSnakes = "";

// setup game areas (title, separator and controls area)
let controlsArea = 4 * resolution;
let playersArea = resolution * (numPlayers + 1);
let separator = 0.5 * resolution;
let title = resolution;

// setup control for Roll the Die-button
var buttonRollDie;

function setup() {
  // create the controls
  createControls();

  // initialize the game
  initGame();
}

function draw() {
  // draw canvas
  background(245);

  // display game title
  showGameTitle();

  // highlight the conrols area
  showControlsArea();

  // show player information area
  showPlayersArea();

  // draw tiles
  for (let tile of tiles) {
    tile.show();
  }

  // draw snakes and ladders
  for (let tile of tiles) {
    tile.showSnadders();
  }

  // show the die
  showDie();

  // show the players
  showPlayers();

  // show player information area
  showPlayersArea()

  // roll the die or wait for player to roll the die
  if (state === ROLL_STATE) {
    if (simulationMode) {
      rollDie();
    } else {
      noLoop();
    }

    // move player
  } else if (state === MOVE_STATE) {
    // move player (with animation)
    if (animationMode) {
      // move the player
      players[curPlayer].update();
      players[curPlayer].showAnimation();

      // continue until animation has finished
      if (players[curPlayer].animate) {
        return;
      }

      // move player (no animation)
    } else {
      players[curPlayer].updateSimple();
    }

    // update players history
    players[curPlayer].updateHistory();

    // switch state
    if (players[curPlayer].isSnadder()) {
      // switch state
      state = SNADDER_STATE;
    } else {
      // check if player is finished
      players[curPlayer].checkFinished();

      // continue play
      state = ROLL_STATE;

      // switch player
      switchPlayer()
    }

    // player landed or a snadder
  } else if (state === SNADDER_STATE) {
    // move player along snadder
    players[curPlayer].moveSnadder();
    players[curPlayer].showAnimation();

    // continue until animation is finished
    if (players[curPlayer].animate) {
      return;
    }

    // update players history
    players[curPlayer].updateHistory();

    // allow for one snadder leading to another
    if (players[curPlayer].isSnadder()) {
      return;
    }

    // switch player
    switchPlayer();

    // continue play
    state = ROLL_STATE;
  }

  // check game over state
  if (GameOver()) {
    die.value = 0;
    // reset the die
    showDie();

    // show players on the finish tile and update info area
    showPlayers();
    showPlayersArea();

    // interrupt the game loop
    noLoop();
  }
}
