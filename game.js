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
}

// Is the game over?
function GameOver() {
  // if (DEBUG) console.clear();
  if (DEBUG) console.log("GAME OVER");

  // count number of players on the finish-tile
  let playersActive = 0;
  for (let p in players) {
    if (players[p].finished === 0) {
      playersActive += 1;
    }
  }
  if (DEBUG) console.log("- playersActive=" + playersActive);

  // Game over if all players are on the finish tile
  if (playersActive === 0) {
    return true;
  } else {
    return false;
  }
}

// initialze a new game
function initGame() {
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
  // if (DEBUG) console.log("MAKE SNAKES");
  let beginMin = cols;
  let beginMax = tiles.length - 2;
  // if (DEBUG) console.log("- beginMin:" + beginMin);
  // if (DEBUG) console.log("- beginMax:" + beginMax);
  for (let i = 0; i <= numSnakes - 1; i++) {
    // pick random tile to add Snake to (snake on finish tile not allowed)
    let begin = floor(random(beginMin, beginMax));

    // add snake, unless one already exists
    if (tiles[begin].snadder !== 0) {
      i--;
    } else {
      // if (DEBUG) console.log("- snake:" + i);
      // if (DEBUG) console.log("  - begin:" + begin);
      // -1 makes in a Snake (drop down a number of spots)
      deltaMin = (begin % cols) + 1;
      deltaMax = begin - 1;
      delta = -1 * floor(random(deltaMin, deltaMax))
      // if (DEBUG) console.log("  - deltaMin:" + deltaMin);
      // if (DEBUG) console.log("  - deltaMax:" + deltaMax);
      // if (DEBUG) console.log("  - delta:" + delta);
      tiles[begin].snadder = delta;
    }
  }

  // Pick random ladders
  // if (DEBUG) console.log("MAKE LADDERS");
  beginMin = 1;
  beginMax = tiles.length - cols - 1;
  // if (DEBUG) console.log("- beginMin:" + beginMin);
  // if (DEBUG) console.log("- beginMax:" + beginMax);
  for (let i = 0; i <= numLadders - 1; i++) {
    // pick random tile to add Ladder to
    begin = floor(random(beginMin, beginMax));

    // add ladder, unless one already exists
    if (tiles[begin].snadder != 0) {
      i--;
    } else {
      // if (DEBUG) console.log("- ladder:" + i);
      // if (DEBUG) console.log("  - begin:" + begin);
      // 1 makes in a ladder (skip ahead a number of spots)
      deltaMin = cols - (begin % cols);
      deltaMax = tiles.length - begin - 2;
      delta = floor(random(deltaMin, deltaMax))
      // if (DEBUG) console.log("  - deltaMin:" + deltaMin);
      // if (DEBUG) console.log("  - deltaMax:" + deltaMax);
      // if (DEBUG) console.log("  - delta:" + delta);
      tiles[begin].snadder = delta;
    }
  }

  // create or reset the die
  die = new Die();

  // create new players (zero players still requires one player for simulation mode)
  players = [];
  if (numPlayers === 0) {
    players.push(new Player(0));
  } else {
    for (var i = 1; i <= numPlayers; i++) {
      players.push(new Player(i - 1));
    }
  }

  // set current player
  curPlayer = 0;

  // set number of turns played
  turns = 0;

  // keep track of final results of players
  finalResult = 0;

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

  // adjust framerate
  updateFPS();

  // switch state
  if (simulationMode) {
    state = ROLL_STATE;
  } else {
    state = WAIT_STATE;
  }

  // resume game loop
  loop();
}

// create the canvas for board and separator
function setupCanvas() {
  let canvasW = (cols * resolution) + separator + controlsArea;
  let canvasH = title + separator + (rows * resolution) + separator + playersArea;
  createCanvas(canvasW, canvasH);
  // if (DEBUG) console.log("canvas : " + canvasW + "x" + canvasH);
}

// draw background for controls
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

// show players
function showPlayers() {
  for (let p of players) {
    p.show();
  }
}

// display player information area
function showPlayersArea() {
  // if (DEBUG) console.log("SHOW PLAYERS AREA")
  // store current settings
  push();

  // translate to upper left corner
  let myX = 0;
  let myY = title + separator + rows * resolution + separator;
  translate(myX, myY);

  // format text
  textAlign(CENTER, CENTER);

  // draw Player-column
  // draw header
  fill(100);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, resolution, resolution);
  fill(255);
  strokeWeight(0);
  text("Player", resolution * 0.5, resolution * 0.5);

  // draw player numbers
  translate(0, resolution);
  for (let p = 0; p <= numPlayers - 1; p++) {
    // draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, p * resolution, resolution, resolution);

    // draw number
    fill(255);
    strokeWeight(0);
    text(p + 1, resolution * 0.5, p * resolution + resolution * 0.5);
  }
  translate(0, -resolution);

  // draw Token-column
  // draw header
  translate(resolution, 0);
  fill(100);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, resolution, resolution);
  fill(255);
  strokeWeight(0);
  text("Token", resolution * 0.5, resolution * 0.5);

  // draw tokens
  translate(0, resolution);
  for (let p = 0; p <= numPlayers - 1; p++) {
    // draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, p * resolution, resolution, resolution);

    // draw tokens
    fill(players[p].tokenColor);
    stroke(0);
    strokeWeight(2);
    ellipse(0.5 * resolution, p * resolution + 0.5 * resolution, 25, 25);

    // draw "X" for current player
    // draw finalResult for players that have finished
    let tokenText = "";
    if (numPlayers > 1) {
      // mark current player with X
      if (p === curPlayer) {
        tokenText = "X";
      }

      // mark finished players with their finishing place
      if (players[p].finished > 0) {
        tokenText = players[p].finished;
      }

      // draw text on token
      noFill();
      stroke(0);
      textSize(14);
      text(tokenText, 0.5 * resolution, p * resolution + 0.5 * resolution);
    }
  }
  translate(0, -resolution);

  // draw histogram - background
  translate(resolution, resolution * (max(1, numPlayers) + 1));
  let histW = width - 2 * resolution;
  let histH = playersArea;
  fill(10);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, histW, -histH);

  // determine distance between histogram lines
  let histSpacingY = histH / rows;
  let histSpacingX = histW / (turns + 1);
  histSpacingX = min(histSpacingX, histSpacingY);

  // draw histogram - horizontal lines
  push();
  strokeWeight(1);
  stroke(255, 255, 255, 50);
  for (let j = 0; j <= rows - 1; j++) {
    line(0, -j * histSpacingY, histW, -j * histSpacingY)
  }

  // draw histogram - vertical lines
  if (histSpacingX >= 8) {
    for (let i = histSpacingX; i < histW; i += histSpacingX) {
      line(i, 0, i, -histH);
    }
  }
  pop();

  // draw histogram per player
  for (let p = 0; p <= players.length - 1; p++) {
    // reset histogram coordinates
    let x1 = y1 = x2 = y2 = 0;

    // get players color; add some alpha for 'other' players
    stroke(players[p].tokenColor);

    // draw histogram based on players history
    for (let h = 0; h <= players[p].history.length - 1; h++) {
      // reset snadder
      let drawSnadder = false;

      // read value (read as string to deal with strings and numbers)
      let nextValue = players[p].history[h];

      // // in case of a snadder; read next value
      if (nextValue === "snadder") {
        drawSnadder = true;
        h++;
        nextValue = players[p].history[h];
      }

      // last position is beginning new line
      x1 = x2;
      y1 = y2;

      // draw vertical line for snadders
      if (drawSnadder ? x2 = x1 : x2 += histSpacingX);
      y2 = -1 * map(nextValue, 0, cols * rows, 0, playersArea);

      // draw player history line
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
  }

  // restore previous settings
  pop();
}

function switchPlayer() {
  // skip in single player mode
  if (numPlayers === 1) {
    turns++;
    return;
  }

  if (DEBUG) console.log("SWITCH PLAYER");

  // find next player still in play
  let nextPlayer = -1;

  // find next player after current player
  if (DEBUG) console.log("- numPlayers=" + players.length);
  if (DEBUG) console.log("- curPlayer=" + curPlayer);
  if (curPlayer < players.length - 1) {
    // find next player still in play
    for (let i = curPlayer + 1; i <= players.length - 1; i++) {
      if (DEBUG) console.log("- check player:" + i);
      if (players[i].finished === 0) {
        if (DEBUG) console.log("- players[" + i + "].finished=" + players[i].finished);
        nextPlayer = i;
        break;
      }
    }
  }

  // find next player before current player; but only if no new player has been found
  if (nextPlayer < 0) {
    // bump number of turns
    turns++;

    // find next player still in play
    for (let i = 0; i <= curPlayer - 1; i++) {
      if (players[i].finished === 0) {
        nextPlayer = i;
        break;
      }
    }
  }

  // set next current player (nextPlayer starts at -1)
  // nextPlayer = -1 ; this means current player is only player left
  // nextPlayer >= 0 ; two or more players still in play (switch to next player)
  if (nextPlayer >= 0) {
    curPlayer = nextPlayer;
  }
  if (DEBUG) console.log("- nextPlayer=" + curPlayer);
}

// switch simulation mode on or off
function switchSimulationMode() {
  // toggle simulation mode
  simulationMode = !simulationMode;

  // switch game state and adjust framerate
  updateFPS();

  // switch game state and adjust framerate
  if (simulationMode) {
    state = ROLL_STATE;
  } else {
    state = WAIT_STATE;
  }

  // start a new game if the previous game has ended
  if (GameOver()) {
    initGame();
  }

  // resume game loop
  loop();
}

// update the controls
function updateControls() {
  // the number of ladders is always less or equal to the number of snakes
  if (sliderSnakes.value() != numSnakes) {
    numSnakes = sliderSnakes.value();
    if (DEBUG) console.log("set numSnakes:" + numSnakes);
    numLadders = min(sliderSnakes.value(), sliderLadders.value());
    sliderLadders.value(numLadders);

    // the number of snakes is always greater or equal to the number of ladders
  } else if (sliderLadders.value() != numLadders) {
    numLadders = sliderLadders.value();
    if (DEBUG) console.log("set numLadders:" + numLadders);
    numSnakes = max(sliderSnakes.value(), sliderLadders.value());
    sliderSnakes.value(numSnakes);

  } else if (sliderPlayers.value() != numPlayers) {
    numPlayers = sliderPlayers.value();
    if (DEBUG) console.log("set numPlayers:" + numPlayers);
    playersArea = resolution * (max(1, numPlayers) + 1);
  }

  // restart the game
  initGame();
}

// update the text of the game controls
function updateControlsTxt() {
  txtPlayers.html("# Players : " + sliderPlayers.value())
  txtSnakes.html("# Snakes : " + sliderSnakes.value())
  txtLadders.html("# Ladders : " + sliderLadders.value())
}

// set framerate depending on interactive or simulation mode
function updateFPS() {
  if (simulationMode) {
    fps = 60;
  } else {
    fps = 5;
  }
  frameRate(fps);
}