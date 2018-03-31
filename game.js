// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// create game controls (DOM objects) in top-down order they will be seen
function createControls() {
  // create simulate text and checkbox
  txtSimulation = createP("Simulate");
  checkboxSimulation = createCheckbox("", simulationMode);
  checkboxSimulation.changed(switchSimulationMode);

  // create animate text and checkbox
  txtAnimation = createP("Animate");
  checkboxAnimation = createCheckbox("", animationMode);
  checkboxAnimation.changed(switchAnimationMode);

  // create text for number of players
  txtPlayers = createP("");

  // create slider for number of players
  sliderPlayers = createSlider(1, maxPlayers, numPlayers);
  sliderPlayers.input(updateControlsTxt);
  sliderPlayers.changed(updateControls);

  // create text showing grid size
  txtGrid = createP("");

  // create slider for grid size
  sliderGrid = createSlider(minColsRows, maxColsRows, cols, 2);
  sliderGrid.input(updateControlsTxt);
  sliderGrid.changed(updateControls);

  // create text for number of snakes
  txtSnakes = createP("");

  // create slider for number of snakes
  sliderSnakes = createSlider(1, maxSnakes, numSnakes);
  sliderSnakes.input(updateControlsTxt);
  sliderSnakes.changed(updateControls);

  // create text for number of ladders
  txtLadders = createP("");

  // create slider to control number of ladders
  sliderLadders = createSlider(1, maxLadders, numLadders);
  sliderLadders.input(updateControlsTxt);
  sliderLadders.changed(updateControls);

  // create button to roll the die
  buttonRollDie = createButton("Roll the Die");
  buttonRollDie.mousePressed(rollDie);
}

// is the game over?
function GameOver() {
  // count number of players on the finish-tile
  let playersActive = 0;
  for (let p in players) {
    if (players[p].finished === 0) {
      playersActive += 1;
    }
  }

  // game over if all players are on the finish tile
  if (playersActive === 0) {
    return true;
  } else {
    return false;
  }
}

// initialize a new game
function initGame() {
  // setup canvas
  setupCanvas();

  // move game controls
  moveControls();

  // reset the tiles array
  tiles = [];

  // create all the tiles from start to finish
  let x = 0;
  let y = title + separator + (rows - 1) * resolution;
  let dir = 1;
  for (let i = 0; i < cols * rows; i++) {
    let tile = new Tile(x, y, resolution, i);
    tiles.push(tile);
    x = x + (resolution * dir);

    // move along a winding path up the rows
    if (x >= cols * resolution || x <= -resolution) {
      dir *= -1;
      x += resolution * dir;
      y -= resolution;
    }
  }

  // pick random snakes
  let beginMin = cols;
  let beginMax = tiles.length - 2;
  for (let i = 0; i <= numSnakes - 1; i++) {
    // pick random tile to add snake to (snake on finish tile not allowed)
    let begin = floor(random(beginMin, beginMax));

    // add snake, unless one already exists
    if (tiles[begin].snadder !== 0) {
      i--;
    } else {
      // -1 makes in a snake (drop down a number of spots)
      deltaMin = (begin % cols) + 1;
      deltaMax = begin - 1;
      delta = -1 * floor(random(deltaMin, deltaMax))
      tiles[begin].snadder = delta;
    }
  }

  // pick random ladders
  beginMin = 1;
  beginMax = tiles.length - cols - 1;
  for (let i = 0; i <= numLadders - 1; i++) {
    // pick random tile to add Ladder to
    begin = floor(random(beginMin, beginMax));

    // add ladder, unless one already exists
    if (tiles[begin].snadder != 0) {
      i--;
    } else {
      // 1 makes in a ladder (skip ahead a number of spots)
      deltaMin = cols - (begin % cols);
      deltaMax = tiles.length - begin - 2;
      delta = floor(random(deltaMin, deltaMax))
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
  turns = 1;

  // keep track of final results of players
  finishOrder = 0;

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

  // update text for controls
  updateControlsTxt();

  // switch state
  state = ROLL_STATE;

  // resume game loop
  loop();
}

// add game controls
function moveControls() {
  // set location of first control element
  let spacingMajor = 15;
  let spacingMinor = 35;
  let x = cols * resolution + separator + 15;
  let y = title + separator

  // update simulation text and checkbox
  txtSimulation.position(x, y);
  y += 15;
  checkboxSimulation.position(x + controlsArea - 35, y);
  y += spacingMajor;

  // update animation text and checkbox
  txtAnimation.position(x, y);
  y += 15;
  checkboxAnimation.position(x + controlsArea - 35, y);
  y += spacingMajor;

  // update text and slider for number of players
  txtPlayers.position(x, y);
  y += spacingMinor;
  sliderPlayers.position(x, y);
  y += spacingMajor;

  // update text and slider for grid size
  txtGrid.position(x, y);
  y += spacingMinor;
  sliderGrid.position(x, y);
  y += spacingMajor;

  // update text and slider for number of snakes
  txtSnakes.position(x, y);
  y += spacingMinor;
  sliderSnakes.position(x, y);
  y += spacingMajor;

  // update text and slider for number of ladders
  txtLadders.position(x, y);
  y += spacingMinor;
  sliderLadders.position(x, y);

  // update button to roll the die
  buttonRollDie.position(cols * resolution + separator + 40, title + separator + rows * resolution - 20);
}

// create the canvas
function setupCanvas() {
  let canvasW = (cols * resolution) + separator + controlsArea;
  let canvasH = title + separator + (rows * resolution) + separator + playersArea;
  createCanvas(canvasW, canvasH);
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
  textSize(32);
  text("Snakes & Ladders", (cols * resolution) / 2, title / 2)
  pop();
}

// show players
function showPlayers() {
  for (let p of players) {
    if (!p.animate) {
      p.show();
    }
  }
}

// display player information area
function showPlayersArea() {
  // store current settings
  push();

  // translate to upper left corner
  let myX = 0;
  let myY = title + separator + rows * resolution + separator;
  translate(myX, myY);

  // format text
  textAlign(CENTER, CENTER);

  // player-column
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
    textSize(14);
    text(p + 1, resolution * 0.5, p * resolution + resolution * 0.5);
  }
  translate(0, -resolution);

  // token-column
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
    // draw number matching finishing order for players that have finished
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
      fill(0);
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
  let histSpacingX = histW / turns;
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

  // draw number of turns played in upper left corner of histogram
  let turnsH;
  let turnsW;

  // set height of textbox
  if (numPlayers === 4) {
    turnsH = histSpacingY;
  } else {
    turnsH = histSpacingY * 2;
  }

  // height of textbox; make sure textbox is higher than the textsize
  if (turnsH <= 12) {
    turnsH += histSpacingY;
  }

  // set width of textbox
  if (numPlayers === 1) {
    turnsW = histSpacingY * 3;
  } else {
    turnsW = histSpacingY * 2;
  }

  // set width of textbox; increase if number of turns exceeds 100
  if (turns >= 100 && numPlayers < 4) {
    turnsW += histSpacingY;
  }

  // draw text box
  fill(200);
  stroke(100);
  rect(0, -histH, turnsW, turnsH);

  // draw # turns
  fill(100);
  noStroke();
  textSize(12);
  text(turns, turnsW * 0.5, -histH + turnsH * 0.5);

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

      // read value
      let nextValue = players[p].history[h];

      // in case of a snadder; read next value
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
  // single player mode; just increase the number of turns
  if (numPlayers === 1) {
    turns++;
    return;
  }

  // find next player still in play
  let nextPlayer = -1;

  // find next player after current player
  if (curPlayer < players.length - 1) {
    // find next player still in play
    for (let i = curPlayer + 1; i <= players.length - 1; i++) {
      if (players[i].finished === 0) {
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
  // nextPlayer = -1 ; current player is only player left, no need to switch
  // nextPlayer >= 0 ; two or more players still in play (switch player)
  if (nextPlayer >= 0) {
    curPlayer = nextPlayer;
  }
}

// switch animation mode on or off
function switchAnimationMode() {
  // toggle animation mode
  animationMode = !animationMode;

  // switch game state
  state = ROLL_STATE;

  // start a new game if the previous game has ended
  if (GameOver()) {
    initGame();
  }

  // resume game loop
  loop();
}

// switch simulation mode on or off
function switchSimulationMode() {
  // toggle simulation mode
  simulationMode = !simulationMode;

  // switch game state
  state = ROLL_STATE;

  // start new game if previous game has ended
  if (GameOver()) {
    initGame();
  }

  // resume game loop
  loop();
}

// update the controls
function updateControls() {
  // change the number of players
  if (sliderPlayers.value() != numPlayers) {
    numPlayers = sliderPlayers.value();
    playersArea = resolution * (max(1, numPlayers) + 1);

    // change grid size
  } else if (sliderGrid.value() != cols) {
    cols = sliderGrid.value();
    rows = cols;

    // max number of snakes and ladders is half the grid Size
    // e.g. a grid of 10x10 has max 5 snakes and 5 ladders
    sliderSnakes.attribute('max', cols / 2);
    sliderLadders.attribute('max', cols / 2);

    // the number of ladders is always less or equal to the number of snakes
  } else if (sliderSnakes.value() != numSnakes) {
    numSnakes = sliderSnakes.value();
    numLadders = min(sliderSnakes.value(), sliderLadders.value());
    sliderLadders.value(numLadders);

    // the number of snakes is always greater or equal to the number of ladders
  } else if (sliderLadders.value() != numLadders) {
    numLadders = sliderLadders.value();
    numSnakes = max(sliderSnakes.value(), sliderLadders.value());
    sliderSnakes.value(numSnakes);
  }

  // restart the game
  initGame();
}

// update the text of the game controls
function updateControlsTxt() {
  txtPlayers.html("# Players : " + sliderPlayers.value());
  txtGrid.html("Grid Size : " + sliderGrid.value() + "x" + sliderGrid.value());
  txtSnakes.html("# Snakes : " + sliderSnakes.value());
  txtLadders.html("# Ladders : " + sliderLadders.value());
}