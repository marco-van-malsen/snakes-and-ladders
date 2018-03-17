// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// Fefine available game states and set initial game state
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;

// Array of tiles
let tiles = [];

// One player
let player;

// set default number of column and rows (can be changed later)
let cols = 10;
let rows = 10;

// current position (spot) of player on board
let index = 0;

function setup() {
  // Size of tile, columns and rows
  let resolution = 40;

  // create the canvas for board and controls
  createCanvas(cols * resolution, rows * resolution);

  // Create all the tiles from bottom to top
  let x = 0;
  let y = (rows - 1) * resolution;
  let dir = 1;
  for (let i = 0; i < cols * rows; i++) {
    let tile = new Tile(x, y, resolution, i, i + 1);
    tiles.push(tile);
    x = x + (resolution * dir);
    // Move along a winding path up the rows
    if (x >= cols * resolution || x <= -resolution) {
      dir *= -1;
      x += resolution * dir;
      y -= resolution;
    }
  }

  // Pick random Snakes
  for (let i = 0; i < 3; i++) {
    let index = floor(random(cols, tiles.length - 1));
    // -1 makes in a Snake (drop down a number of spots)
    tiles[index].snadder = -1 * floor(random(index % cols, index - 1));
  }

  // Pick random Ladders
  for (let i = 0; i < 3; i++) {
    let index = floor(random(0, tiles.length - cols));
    tiles[index].snadder = floor(random(cols - (index % cols), tiles.length - index - 1));
  }

  // A new player
  player = new Player();
}

function draw() {
  // set framerate
  //frameRate(5);

  // Draw all the tiles, snakes, and ladders
  for (let tile of tiles) {
    tile.show();
  }
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
    index++;
  }
}