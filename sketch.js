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

// setup gameboard (header for game controls, columns, rows and tile size and number of snakes and ladders)
let header = 100;
let cols = 10;
let rows = 10;
let resolution = 40;
let numSnakes = 3;
let numLadders = 3;
let title = 50;

// current position (spot) of player on board
let index = 0;

function setup() {
  // create the canvas for board and controls
  createCanvas(cols * resolution, title + header + (rows * resolution));

  // display game title
  noStroke();
  fill(200);
  rect(0, 0, width, title);
  textAlign(CENTER, CENTER);
  textSize(36);
  // fill(255);
  // text("Snakes & Ladders", width / 2 + 1, title / 2 + 1)
  // fill(0);
  // text("Snakes & Ladders", width / 2 - 1, title / 2 - 1)
  fill(100);
  text("Snakes & Ladders", width / 2, title / 2)

  // Create all the tiles from bottom to top
  let x = 0;
  let y = title + header + (rows - 1) * resolution;
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
  for (let i = 0; i <= numSnakes - 1; i++) {
    // pick random tile to add Snake to (snake on finish tile not allowed)
    let index = floor(random(cols, tiles.length - 2));

    // add snake, unless one already exists
    if (tiles[index].snadder < 0) {
      i--;
    } else {
      // -1 makes in a Snake (drop down a number of spots)
      tiles[index].snadder = -1 * floor(random(index % cols, index - 1));
    }
  }

  // Pick random ladders
  for (let i = 0; i <= numLadders - 1; i++) {
    // pick random tile to add Ladder to
    let index = floor(random(0, tiles.length - cols));

    // add ladder, unless one already exists
    if (tiles[index].snadder > 0) {
      i--;
    } else {
      // 1 makes in a ladder (skip ahead a number of spots)
      tiles[index].snadder = floor(random(cols - (index % cols), tiles.length - index - 1));
    }
  }

  // A new player
  player = new Player();
}

function draw() {
  // set framerate
  //frameRate(5);

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
    index++;
  }
}