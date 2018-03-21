// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// add game controls (number of players)
function createControls() {
  // set location of first control element
  let spacing = 40;
  let x = cols * resolution + separator + 17;
  let y = title + separator

  // create text showing number of players
  txtPlayers = createP("# Players : " + numPlayers);
  txtPlayers.position(x, y);
  y += spacing;

  // create slider to control number of players
  sliderPlayers = createSlider(0, maxPlayers, numPlayers);
  sliderPlayers.position(x, y);
  sliderPlayers.input(updateControlsTxt);
  sliderPlayers.changed(updateControls);
  y += spacing;

  // create text showing number of snakes
  txtSnakes = createP("# Snakes : " + numSnakes);
  txtSnakes.position(x, y);
  y += spacing;

  // create slider to control number of snakes
  sliderSnakes = createSlider(1, maxSnakes, numSnakes);
  sliderSnakes.position(x, y);
  sliderSnakes.input(updateControlsTxt);
  sliderSnakes.changed(updateControls);
  y += spacing;

  // create text showing number of ladders
  txtLadders = createP("# Ladders : " + numLadders);
  txtLadders.position(x, y);
  y += spacing;

  // create slider to control number of ladders
  sliderLadders = createSlider(1, maxLadders, numLadders);
  sliderLadders.position(x, y);
  sliderLadders.input(updateControlsTxt);
  sliderLadders.changed(updateControls);

  // create button to roll the die
  buttonRollDie = createButton("Roll the Die");
  buttonRollDie.position(cols * resolution + separator + 40, title + separator + rows * resolution - 25);
  buttonRollDie.mousePressed(rollDie);

  // create text showing the current player
  txtCurPlayer = createP("Player : " + 1);
  txtCurPlayer.center('horizonal');
  txtCurPlayer.position(buttonRollDie.x + buttonRollDie.width / 2 - 30, buttonRollDie.y - 115);
}

function resetGame() {
  // set framerate
  if (numPlayers === 0) {
    frameRate(20);
  } else {
    frameRate(5);
  }

  // reset the tiles array
  tiles = [];

  // Create all the tiles from start to finish
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

  // create the die
  if (!die) {
    die = new Die();
  }

  // A new player
  player = new Player();

  // reset the players array
  players = [];

  // create new players (zero players still requires one player for simulation mode)
  if (numPlayers === 0) {
    players.push(new Player);
  } else {
    for (var i = 1; i <= numPlayers; i++) {
      players.push(new Player);
    }
  }

  // restart the game loop
  loop();
}

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
  // update the texts above the controls
  updateControlsTxt();

  // restart the game
  resetGame();
}

// update the text of the game controls
function updateControlsTxt() {
  txtLadders.html("# Ladders : " + sliderLadders.value())
  txtPlayers.html("# Players : " + sliderPlayers.value())
  txtSnakes.html("# Snakes : " + sliderSnakes.value())
}