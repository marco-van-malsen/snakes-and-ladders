// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// add game controls (number of players)
function createControls() {
  // set location of first control element
  let spacing = 40;
  let x = cols * resolution + separator + 17;
  let y = title + separator

  // draw the conrols area
  fill(200);
  rect(cols * resolution + separator, height - rows * resolution, controlsArea, rows * resolution);

  // create control for number of players
  txtPlayers = createP("# Players : " + numPlayers);
  txtPlayers.position(x, y);
  y += spacing;

  sliderPlayers = createSlider(0, maxPlayers, numPlayers);
  sliderPlayers.position(x, y);
  sliderPlayers.input(updateControlsTxt);
  sliderPlayers.changed(updateControls);
  y += spacing;

  // create control for number of snakes)
  txtSnakes = createP("# Snakes : " + numSnakes);
  txtSnakes.position(x, y);
  y += spacing;

  sliderSnakes = createSlider(1, maxSnakes, numSnakes);
  sliderSnakes.position(x, y);
  sliderSnakes.input(updateControlsTxt);
  sliderSnakes.changed(updateControls);
  y += spacing;

  // create control for number of ladders
  txtLadders = createP("# Ladders : " + numLadders);
  txtLadders.position(x, y);
  y += spacing;

  sliderLadders = createSlider(1, maxLadders, numLadders);
  sliderLadders.position(x, y);
  sliderLadders.input(updateControlsTxt);
  sliderLadders.changed(updateControls);

  // create die-roll button, with text
  buttonRollDie = createButton("Roll the Die");
  buttonRollDie.position(cols * resolution + separator + 40, height - 25);
  buttonRollDie.mousePressed(rollDie);
}

function resetGame() {
  // stop game loop to reset the game
  noLoop();

  // reset the tiles array
  tiles = [];

  // Create all the tiles from bottom to top
  let x = 0;
  let y = title + separator + (rows - 1) * resolution;
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

  // restart the game loop
  loop();
}

// roll the die
function rollDie() {
  if (state === ROLL_STATE) {
    var dieRoll = random([1, 2, 3, 4, 5, 6]);
    showDie(dieRoll);
    player.next = player.spot + dieRoll;
  }
}

function showDie(number) {
  // remember current settings
  push();

  // translate to center of where die will be drawn
  translate(cols * resolution + separator + controlsArea / 2, height - 75);

  // draw the die
  rectMode(CENTER);
  fill(255);
  strokeWeight(4);
  stroke(0);
  rect(0, 0, 50, 50, 5, 5, 5, 5);
  // rectMode(CORNER);
  // draw the dots
  //   DOTS  |    1    |    2    |    3    |    4    |    5    |    6
  //  -------|---------|---------|---------|---------|---------|---------
  //  1 2 3  |  * * *  |  * 2 *  |  * * 3  |  1 * 3  |  1 * 3  |  1 * 3
  //  4 5 6  |  * 5 *  |  * * *  |  * 5 *  |  * * *  |  * 5 *  |  4 * 6
  //  7 8 9  |  * * *  |  * 8 *  |  7 * *  |  7 * 9  |  7 * 9  |  7 * 9
  //  -------|---------|---------|---------|---------|---------|---------

  // draw dot 1
  if (number === 4 || number === 5 || number === 6) {
    ellipse(-13, -13, 3, 3);
  }
  // draw dot 2
  if (number === 2) {
    ellipse(0, -13, 3, 3);
  }
  // draw dot 3
  if (number === 3 || number === 4 || number === 5 || number === 6) {
    ellipse(13, -13, 3, 3);
  }
  // draw dot 4
  if (number === 6) {
    ellipse(-13, 0, 3, 3);
  }
  // draw dot 5
  if (number === 1 || number === 3 || number === 5) {
    ellipse(0, 0, 3, 3);
  }
  // draw dot 6
  if (number === 6) {
    ellipse(13, 0, 3, 3);
  }
  // draw dot 7
  if (number === 3 || number === 4 || number === 5 || number === 6) {
    ellipse(-13, 13, 3, 3);
  }
  // draw dot 8
  if (number === 2) {
    ellipse(0, 13, 3, 3);
  }
  // draw dot 9
  if (number === 4 || number === 5 || number === 6) {
    ellipse(13, 13, 3, 3);
  }

  // display current player
  translate(0, -40);
  noStroke();
  fill(100);
  textAlign(CENTER, CENTER);
  // textFormat(BOLD);
  textSize(14);
  text("Player : 1", 0, 0);

  // restore previous settings
  pop();
};

// update the controls
function updateControls() {
  // the number of ladders is always less or equal to the number of snakes
  if (sliderSnakes.value() != numSnakes) {
    numSnakes = sliderSnakes.value();
    numLadders = min(sliderSnakes.value(), sliderLadders.value());
    sliderLadders.value(numLadders);
    // the number of snakes is always greater or equal to the number of ladders
  } else if (sliderLadders.value() != numLadders) {
    numLadders = sliderLadders.value();
    numSnakes = max(sliderSnakes.value(), sliderLadders.value());
    sliderSnakes.value(numSnakes);
  } else if (sliderPlayers.value() != numPlayers) {
    numPlayers = sliderPlayers.value();
  }
  updateControlsTxt();
  resetGame();
}

// update the text of the game controls
function updateControlsTxt() {
  txtLadders.html("# Ladders : " + sliderLadders.value())
  txtPlayers.html("# Players : " + sliderPlayers.value())
  txtSnakes.html("# Snakes : " + sliderSnakes.value())
}