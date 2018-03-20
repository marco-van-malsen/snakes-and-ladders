// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// define available game states and set initial game state
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;

// array of tiles
let tiles = [];

// one player
let player;

// The Die
let die;

// setup gameboard (columns, rows and tile size)
let cols = 10;
let rows = cols;
let resolution = 40;

// setup game (title, separator and controlsArea)
let controlsArea = 150;
let separator = 25;
let title = 50;

// setup control for number of Players
let maxPlayers = 2;
let numPlayers = 1;
var sliderPlayers;
var txtPlayers = "";

// setup control for number of Ladders
let maxLadders = 5;
let numLadders = 3;
var sliderLadders;
var txtLadders = "";

// setup control for number of snakes
let maxSnakes = 5;
let numSnakes = 3;
var sliderSnakes;
var txtSnakes = "";

// setup control for Roll the Die
var buttonRollDie;

function setup() {
  // set framerate
  frameRate(5);

  // create game controls
  createControls();

  // initialize the game
  resetGame();
}

function draw() {
  // create the canvas for board and separator
  createCanvas(cols * resolution + separator + controlsArea, title + separator + (rows * resolution));
  background(245);

  // display game title
  fill(200);
  noStroke();
  rect(0, 0, cols * resolution, title);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(100);
  text("Snakes & Ladders", (cols * resolution) / 2, title / 2)

  // Draw tiles
  for (let tile of tiles) {
    tile.show();
  }

  // Draw snakes and ladders
  for (let tile of tiles) {
    tile.showSnadders();
  }

  // draw the conrols area
  fill(200);
  noStroke();
  rect(cols * resolution + separator, height - rows * resolution, controlsArea, rows * resolution);

  // player's turn
  if (state === ROLL_STATE) {
    // run in simulation mode if zero players
    if (numPlayers === 0) {
      rollDie();
    }
    player.showPreview();
    state = MOVE_STATE;

    // Moving the player
  } else if (state === MOVE_STATE) {
    player.move();
    if (player.isSnadder()) {
      state = SNADDER_STATE;
    } else {
      state = ROLL_STATE;
    }
    // Moving along a Snake or Ladder
  } else if (state === SNADDER_STATE) {
    player.moveSnadder();
    state = ROLL_STATE;
  }

  // Draw the player
  player.show();

  // Is the game over?
  if (player.spot >= tiles.length - 1) {
    resetGame();
  }

  // wait for player to roll the die
  if (numPlayers > 0) {
    noLoop();
  }
}