// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// enable or disable debug comments
const DEBUG = false;

// define available game states and set initial game state
const WAIT_STATE = 0; /// wait for player to roll the die
const ROLL_STATE = 1; // roll the die
const PREVIEW_STATE = 2; // preview player's move
const MOVE_STATE = 3; // move player to next spot
const SNADDER_STATE = 4; // move player along a Snake or Ladder
let state;

// frame-rate
let fps;

// set initial game simulation mode
let simulationMode = false;

// array of tiles
let tiles = [];

// the players
let players = [];

// keep track of the final result of the playersArea
// initialize at 0 in initGame and increase by one for every finished player
let finalResult;

// number of turns played
let turns;

// the die
let die;

// setup gameboard (columns, rows and tile size)
let cols = 10;
let rows = cols;
let resolution = 40;

// setup control for number of Players
let curPlayer;
let maxPlayers = 4;
let numPlayers = 1;
var sliderPlayers;
var txtPlayers = "";

// setup control for number of Ladders
let maxLadders = cols * 0.5;
let numLadders = 3;
var sliderLadders;
var txtLadders = "";

// setup control for number of snakes
let maxSnakes = cols * 0.5;
let numSnakes = 3;
var sliderSnakes;
var txtSnakes = "";

// setup game areas (title, separator and controlsArea)
let controlsArea = 150;
let playersArea = resolution * (numPlayers + 1);
let separator = 25;
let title = 50;

// setup control for Roll the Die
var buttonRollDie;

function setup() {
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

  // Draw tiles
  for (let tile of tiles) {
    tile.show();
  }

  // Draw snakes and ladders
  for (let tile of tiles) {
    tile.showSnadders();
  }

  // player's turn
  if (state === WAIT_STATE) {
    if (DEBUG) console.log("WAIT_STATE");
    noLoop();

    // roll the die
  } else if (state === ROLL_STATE) {
    if (DEBUG) console.log("ROLL_STATE");

    // roll the die automatically when in simulation mode
    if (simulationMode) {
      rollDie();
    }

    // preview player
  } else if (state === PREVIEW_STATE) {
    if (DEBUG) console.log("PREVIEW_STATE");
    // show preview
    players[curPlayer].showPreview();

    // switch state
    state = MOVE_STATE;

    // move player
  } else if (state === MOVE_STATE) {
    if (DEBUG) console.log("MOVE_STATE");

    // update player
    players[curPlayer].update();

    // switch state
    if (players[curPlayer].isSnadder()) {
      // switch state
      state = SNADDER_STATE;
    } else {
      // continue play
      if (simulationMode ? state = ROLL_STATE : state = WAIT_STATE);

      // switch player
      switchPlayer()
    }

    // player landed or a snadder
  } else if (state === SNADDER_STATE) {
    if (DEBUG) console.log("SNADDER_STATE");
    // move player along snadder
    players[curPlayer].moveSnadder();

    // switch player
    switchPlayer()

    // continue play
    if (simulationMode ? state = ROLL_STATE : state = WAIT_STATE);
  }

  // show the die
  showDie()

  // show the players
  showPlayers();

  // show player information area
  showPlayersArea()

  // check game over state
  if (GameOver()) {
    if (DEBUG) console.log("- YES, GAME OVER");

    // reset the die
    die.value = 0;
    showDie();

    // disable simulation mode
    simulationMode = false;
    checkboxSimulation.checked(simulationMode);

    // interrup the game loop
    noLoop();
  }
}