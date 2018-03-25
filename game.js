// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// add game controls (number of players)
function createControls() {
  // set location of first control element
  let spacingMajor = 15;
  let spacingMinor = 35;
  let x = cols * resolution + separator + 15;
  let y = title + separator

  // create simulation checkbox
  txtSimulate = createP("Simulate ");
  txtSimulate.position(x, y);
  y += 15;
  checkboxSimulation = createCheckbox("", simulationMode);
  checkboxSimulation.position(x + controlsArea - 35, y);
  checkboxSimulation.changed(switchSimulationMode);
  y += spacingMajor;

  // create text showing number of players
  txtPlayers = createP("# Players : " + numPlayers);
  txtPlayers.position(x, y);
  y += spacingMinor;

  // create slider to control number of players
  sliderPlayers = createSlider(1, maxPlayers, numPlayers);
  sliderPlayers.position(x, y);
  sliderPlayers.input(updateControlsTxt);
  sliderPlayers.changed(updateControls);
  y += spacingMajor;

  // create text showing number of snakes
  txtSnakes = createP("# Snakes : " + numSnakes);
  txtSnakes.position(x, y);
  y += spacingMinor;

  // create slider to control number of snakes
  sliderSnakes = createSlider(1, maxSnakes, numSnakes);
  sliderSnakes.position(x, y);
  sliderSnakes.input(updateControlsTxt);
  sliderSnakes.changed(updateControls);
  y += spacingMajor;

  // create text showing number of ladders
  txtLadders = createP("# Ladders : " + numLadders);
  txtLadders.position(x, y);
  y += spacingMinor;

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
  txtCurPlayer = createP("Player : " + curPlayer);
  txtCurPlayer.center('horizonal');
  txtCurPlayer.position(buttonRollDie.x + buttonRollDie.width / 2 - 30, buttonRollDie.y - 115);
}

// Is the game over?
function GameOver() {
  if (DEBUG) console.log("GAME OVER");

  // count number of players on the finish-tile
  let playersActive = 0;
  for (let p in players) {
    if (players[p].active) {
      playersActive += 1;
    }
  }
  if (DEBUG) console.log("- playersActive=" + playersActive);

  // Game over if all players are on the finish tile
  if (playersActive === 0) {
    if (DEBUG) console.log("- YES, GAME OVER");
    noLoop();
    // initGame();
  }
}

// initialze a new game
function initGame() {
  // adjust framerate
  if (simulationMode) {
    fps = 5; //24;
  } else {
    fps = 5;
  }
  frameRate(fps);

  // setup canvas
  setupCanvas();

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

  // create or reset the die
  // if (!die) {
  die = new Die();
  // } else {
  // die.value = 0;
  // }

  // A new player
  // player = new Player();
  // if (DEBUG) console.log(player);

  // set current player
  curPlayer = 0;

  // create new players (zero players still requires one player for simulation mode)
  players = [];
  if (numPlayers === 0) {
    players.push(new Player(1));
  } else {
    for (var i = 1; i <= numPlayers; i++) {
      players.push(new Player(i));
    }
  }

  // assign colors
  for (let i = 0; i <= players.length - 1; i++) {
    if (i === 0) {
      players[i].tokenColor = color(0, 255, 255);
    } else if (i === 1) {
      players[i].tokenColor = color(255, 0, 255);
    } else if (i === 2) {
      players[i].tokenColor = color(255, 255, 0);
    } else if (i === 3) {
      players[i].tokenColor = color(255, 255, 255);
    }
  }
  // if (DEBUG) console.log(players);

  // update text for controls
  updateControlsTxt();
}

// create the canvas for board and separator
function setupCanvas() {
  let canvasW = (cols * resolution) + separator + controlsArea;
  let canvasH = title + separator + (rows * resolution) + separator + playersArea;
  createCanvas(canvasW, canvasH);
  // if (DEBUG) console.log("canvas : " + canvasW + "x" + canvasH);
}

function showControlsArea() {
  push();
  fill(200);
  noStroke();
  let myX = cols * resolution + separator;
  let myY = title + separator;
  let myW = controlsArea;
  let myH = rows * resolution;
  rect(myX, myY, myW, myH);
  pop();
}

// display game title
function showGameTitle() {
  push();
  // draw background
  fill(200);
  noStroke();
  rect(0, 0, cols * resolution, title);

  // draw text
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Snakes & Ladders", (cols * resolution) / 2, title / 2)
  pop();
}

// display player infomration area
function showPlayersArea() {
  // store current settings
  push();

  // translate to upper left corner
  let myX = 0;
  let myY = title + separator + rows * resolution + separator;
  translate(myX, myY);

  // format text
  textAlign(CENTER, CENTER);

  // draw Turn-column (shows current player)
  // for (let j = 0; j < max(1, numPlayers) + 1; j++) {
  for (let j = 0; j <= players.length; j++) {
    //draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, j * resolution, resolution, resolution);

    fill(255);
    strokeWeight(0);
    if (j === 0) {
      text("Turn", resolution * 0.5, resolution * 0.5);
    } else {
      if (j - 1 === curPlayer) {
        push();
        textSize(20);
        text("X", resolution * 0.5, j * resolution + resolution * 0.5)
        pop();
      }
    }
  }

  // draw PLayer-column
  translate(resolution, 0);
  // for (let j = 0; j < max(1, numPlayers) + 1; j++) {
  for (let j = 0; j <= players.length; j++) {
    //draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, j * resolution, resolution, resolution);

    fill(255);
    strokeWeight(0);
    if (j === 0) {
      text("Player", resolution * 0.5, resolution * 0.5);
    } else {
      text(j, resolution * 0.5, j * resolution + resolution * 0.5);
    }
  }

  // draw Token-column
  translate(resolution, 0);
  for (let j = 0; j < max(1, numPlayers) + 1; j++) {
    //draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, j * resolution, resolution, resolution);

    strokeWeight(0);
    if (j === 0) {
      fill(255);
      text("Token", resolution * 0.5, resolution * 0.5);
    } else {
      fill(players[j - 1].tokenColor);
      stroke(0);
      strokeWeight(2);
      ellipse(resolution * 0.5, j * resolution + resolution * 0.5, 25, 25);
    }
  }

  // draw histogram - background
  translate(resolution, resolution * (max(1, numPlayers) + 1));
  let histW = (cols - 3) * resolution;
  let histH = playersArea;
  fill(10);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, histW, -histH);

  // determine distance between histogram lines
  let histSpacingY = histH / rows;
  let histSpacingX = histW / players[0].history.length;
  histSpacingX = min(histSpacingX, histSpacingY);
  // if (DEBUG) console.log("histSpacingY=" + histSpacingY)
  // if (DEBUG) console.log("histSpacingX=" + histSpacingX)

  // draw histogram - horizontal lines
  push();
  strokeWeight(1);
  stroke(255, 255, 255, 50);
  for (let j = 0; j <= rows - 1; j++) {
    line(0, -j * histSpacingY, histW, -j * histSpacingY)
  }

  // draw histogram - vertical lines
  for (let i = histSpacingX; i < histW; i += histSpacingX) {
    line(i, 0, i, -histH);
  }
  pop();

  // draw histogram per player
  for (let p = 0; p <= players.length - 1; p++) {
    // reset histogram coordinates
    let x1 = y1 = x2 = y2 = 0;

    // get players color
    stroke(players[p].tokenColor);

    // draw histogram based on players history
    for (h = 0; h <= players[p].history.length - 1; h++) {
      // last position is beginning new line
      x1 = x2;
      y1 = y2;
      x2 += histSpacingX;
      y2 = -1 * map(players[p].history[h], 0, 100, 0, playersArea);

      // highlight current player's history with a thicker line
      if (p == curPlayer - 1) {
        strokeWeight(4);
      } else {
        strokeWeight(2);
      }

      // draw player history line
      line(x1, y1, x2, y2);
    }
  }

  //restore previous settings
  pop();
  noLoop();
}

function switchPlayer() {
  // skip when in single player mode
  if (numPlayers === 1) {
    return;
  }

  if (DEBUG) console.log("SWITCH PLAYER");

  // find next player still in play
  let nextPlayer = -1;

  // find next player after current player
  if (DEBUG) console.log("- numPlayers=" + players.length);
  if (DEBUG) console.log("- curPlayer=" + curPlayer);
  if (curPlayer < players.length - 1) {
    for (let i = curPlayer + 1; i <= players.length - 1; i++) {
      if (DEBUG) console.log("- check player:" + i);
      if (players[i].active) {
        if (DEBUG) console.log("- players[" + i + "].active=" + players[i].active);
        nextPlayer = i;
        break;
      }
    }
  }

  // find next player before current player; but only if no new player has been found
  if (nextPlayer < 0) {
    for (let i = 0; i <= curPlayer - 1; i++) {
      if (players[i].active) {
        nextPlayer = i;
        break;
      }
    }
  }

  // set next current player
  if (DEBUG) console.log("- curPlayer=" + curPlayer + "; nextPlayer=" + nextPlayer);
  curPlayer = nextPlayer;

  // update text of game controls
  updateControlsTxt();
}

// switch simulation mode on off
function switchSimulationMode() {
  // togle simulation mode
  simulationMode = !simulationMode;
  initGame();
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
    playersArea = resolution * (max(1, numPlayers) + 1);
  }

  // restart the game
  initGame();
  loop();
}

// update the text of the game controls
function updateControlsTxt() {
  txtPlayers.html("# Players : " + sliderPlayers.value())
  txtSnakes.html("# Snakes : " + sliderSnakes.value())
  txtLadders.html("# Ladders : " + sliderLadders.value())
  let CurPlayerText = curPlayer + 1
  txtCurPlayer.html("Player: " + CurPlayerText)
}