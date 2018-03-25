// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// enable or disable debug comments
const DEBUG = true;

// define available game states and set initial game state
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;

// setup frame-rate
let fps = 60;

// set initial game simulation mode
let simulationMode = false;

// array of tiles
let tiles = [];

// the players
let player;
let players = [];

// The Die
let die;

// setup gameboard (columns, rows and tile size)
let cols = 10;
let rows = cols;
let resolution = 40;

// setup control for number of Players
let curPlayer;
let maxPlayers = 4;
let numPlayers = 4;
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
  // create game controls
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

  for (let player of players) {
    // console.log(p);
    player.show();
  }

  // return;

  // if (DEBUG) console.log("Player: " + curPlayer)

  // player's turn
  if (state === ROLL_STATE) {
    // if (DEBUG) console.log("ROLL_STATE");
    // zero players; automatically roll the die
    if (simulationMode) {
      rollDie();
    }

    showDie()
    // Moving the player
  }
  // } else if (state === MOVE_STATE) {
  //   if (DEBUG) console.log("MOVE_STATE");
  //   player.showPreview();
  //   player.move();
  //
  //   if (player.isSnadder()) {
  //     state = SNADDER_STATE;
  //   } else {
  //     state = ROLL_STATE;
  //   }
  //
  //   // show the player
  //   player.show();
  //
  //   // Moving along a Snake or Ladder
  // } else if (state === SNADDER_STATE) {
  //   if (DEBUG) console.log("SNADDER_STATE");
  //   player.moveSnadder();
  //   state = ROLL_STATE;
  // }

  // Draw die
  // showDie();

  // check game over state
  GameOver();

  // interrupt game logic and wait for player
  if (numPlayers > 0 && state === ROLL_STATE) {
    if (DEBUG) console.log("wait for user");
    noLoop();
  }
}