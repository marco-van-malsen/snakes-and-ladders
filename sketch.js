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
  // create the canvas for board and separator
  createCanvas(cols * resolution + separator + controlsArea, title + separator + (rows * resolution));
  background(245);

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

  // Draw the player
  // player.show();

  // skip rest of code
  // return;

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