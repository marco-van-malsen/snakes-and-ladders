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

// setup gameboard (title, separator, columns, rows and tile size and number of snakes and ladders)
let separator = 25;
let cols = 10;
let rows = 10;
let resolution = 40;
let maxLadders = 5;
let maxPlayers = 2;
let maxSnakes = 5;
let numLadders = 3;
let numPlayers = 1;
let numSnakes = 3;
let title = 50;

// setup controls
var sliderLadders;
var sliderPlayers;
var sliderSnakes;
var txtLadders = "";
var txtPlayers = "";
var txtSnakes = "";

function setup() {
  // create the canvas for board and separator
  createCanvas(cols * resolution + 500, title + separator + (rows * resolution));

  // display game title
  noStroke();
  fill(200);
  rect(0, 0, cols * resolution, title);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(100);
  text("Snakes & Ladders", (cols * resolution) / 2, title / 2)

  // create game controls
  createControls();

  // initialize the game
  resetGame();
}

function draw() {
  // set framerate
  frameRate(5);

  // Draw  tiles
  for (let tile of tiles) {
    tile.show();
  }

  // Draw snakes and ladders
  for (let tile of tiles) {
    tile.showSnadders();
  }

  // Rolling the die
  if (state === ROLL_STATE) {
    player.rollDie();
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
    state = ROLL_STATE;
    player.reset();
  }
}