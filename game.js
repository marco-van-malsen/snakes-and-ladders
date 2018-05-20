// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

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
  return (playersActive === 0);
}

// initialize a new game
function initGame() {
  // setup canvas
  setupCanvas();

  // reset the tiles array
  tiles = [cols * rows];

  // create all the tiles from start to finish
  let x = 0;
  let y = title + separator + (rows - 1) * tileSize;
  let dir = 1;
  for (let t = 0; t < cols * rows; t++) {
    tiles[t] = new Tile(t, x, y);
    x = x + (tileSize * dir);

    // move along a winding path up the rows
    if (x >= cols * tileSize || x < 0) {
      dir *= -1;
      x += tileSize * dir;
      y -= tileSize;
    }
  }

  // pick random snakes
  if (!debug) {
    let beginMin = cols;
    let beginMax = tiles.length - 2;
    for (let s = 0; s <= numSnakes - 1; s++) {
      // pick random tile to add snake to (snake on finish tile not allowed)
      let begin = floor(random(beginMin, beginMax));

      // add snake, unless one already exists
      if (tiles[begin].snadder !== 0) {
        s--;
      } else {
        // create a snake: player will drop down a number of spots
        deltaMin = (begin % cols) + 1;
        deltaMax = begin - 1;
        delta = -1 * floor(random(deltaMin, deltaMax));
        tiles[begin].snadder = delta;
      }
    }
  }

  // pick random ladders
  if (!debug) {
    beginMin = 1;
    beginMax = tiles.length - cols - 1;
    for (let l = 0; l <= numLadders - 1; l++) {
      // pick random tile to add Ladder to
      begin = floor(random(beginMin, beginMax));

      // add ladder, unless one already exists
      if (tiles[begin].snadder != 0) {
        l--;
      } else {
        // create a ladder (player will skip ahead a number of spots)
        deltaMin = cols - (begin % cols);
        deltaMax = tiles.length - begin - 2;
        delta = floor(random(deltaMin, deltaMax));

        // do not allow ladder to end on snake with equal length
        if (tiles[begin + delta].snadder === -delta) {
          l--;
        } else {
          tiles[begin].snadder = delta;
        }
      }
    }
  }

  // fixed snadders for debugging purposes
  if (debug) {
    tiles[5].snadder = 44;
    tiles[49].snadder = 46;
    tiles[95].snadder = -36;
    tiles[59].snadder = -54;
  }

  // create or reset the die
  die = new Die();

  // create new players (zero players still requires one player for simulation mode)
  players = [numPlayers];
  for (let p = 0; p < numPlayers; p++) {
    players[p] = new Player(p);
  }

  // set current player
  curPlayer = 0;

  // set number of turns played
  turns = 1;

  // keep track of final results of players
  finishOrder = 0;

  // assign colors
  for (let p = 0; p <= players.length - 1; p++) {
    if (p === 0) {
      players[p].tokenColor = color(0, 255, 255);
    } else if (p === 1) {
      players[p].tokenColor = color(255, 0, 255);
    } else if (p === 2) {
      players[p].tokenColor = color(255, 255, 0);
    } else if (p === 3) {
      players[p].tokenColor = color(255, 255, 255);
    }
  }

  // switch state
  state = ROLL_STATE;

  // resume game loop
  loop();
}

// create the canvas
function setupCanvas() {
  playersArea = tileSize * (numPlayers + 1);
  let canvasW = (cols * tileSize) + separator + controlsArea;
  let canvasH = title + separator + (rows * tileSize) + separator + playersArea;
  createCanvas(canvasW, canvasH);
}

// draw background for controls
function showControlsArea() {
  // draw background
  fill(200);
  noStroke();
  let myX = cols * tileSize + separator;
  let myY = title + separator;
  let myW = controlsArea;
  let myH = rows * tileSize;
  rect(myX, myY, myW, myH);

  // nuke the game controls
  controls = [];

  // set text format
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);

  // simulate
  text('Simulate', myX + 5, myY + 20);
  createControlSet(myX + 110, myY + 10, 40, 20, simulationMode, 0, 1, 2, toggleSimulationMode);

  // animate
  text('Animate', myX + 5, myY + 50);
  createControlSet(myX + 110, myY + 40, 40, 20, animationMode, 0, 1, 2, toggleAnimationMode);

  // player selection
  text('# Players :', myX + 5, myY + 80);
  createControlSet(myX + 10, myY + 90, myW - 20, 20, numPlayers, 1, 4, 4, toggleNumPlayers);

  // grid size
  text('# Columns / Rows :', myX + 5, myY + 130);
  createControlSet(myX + 10, myY + 140, myW - 20, 20, cols, 10, 14, 3, toggleGridSize);

  // number of Snakes
  text('# Snakes :', myX + 5, myY + 180);
  createControlSet(myX + 10, myY + 190, myW - 20, 20, numSnakes, 1, maxSnakes, maxSnakes, toggleNumSnakes);

  // number of Ladders
  text('# Ladders :', myX + 5, myY + 230);
  createControlSet(myX + 10, myY + 240, myW - 20, 20, numLadders, 1, maxLadders, maxLadders, toggleNumLadders);

  // show all controls
  textAlign(CENTER, CENTER);
  for (let control in controls) {
    controls[control].show();
  }
}

// display game title
function showGameTitle() {
  // draw background
  fill(200);
  noStroke();
  rect(0, 0, cols * tileSize, title);

  // draw text
  push();
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Snakes & Ladders', cols * tileSize * 0.5, title * 0.5);
  pop();
}

// show stationary players
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
  let myY = title + separator + rows * tileSize + separator;
  translate(myX, myY);

  // player-column
  // draw header
  fill(100);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, tileSize, tileSize);
  fill(255);
  strokeWeight(0);
  text('Player', tileSize * 0.5, tileSize * 0.5);

  // draw player numbers
  translate(0, tileSize);
  for (let p = 0; p <= numPlayers - 1; p++) {
    // draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, p * tileSize, tileSize, tileSize);

    // draw number
    fill(255);
    strokeWeight(0);
    let playerNumber = (debug ? p : p + 1);
    text(playerNumber, tileSize * 0.5, p * tileSize + tileSize * 0.5);
  }

  translate(0, -tileSize);

  // token-column
  // draw header
  translate(tileSize, 0);
  fill(100);
  stroke(0);
  strokeWeight(1);
  rect(0, 0, tileSize, tileSize);
  fill(255);
  strokeWeight(0);
  text('Token', tileSize * 0.5, tileSize * 0.5);

  // draw tokens
  translate(0, tileSize);
  for (let p = 0; p <= numPlayers - 1; p++) {
    // draw rectangle
    fill(100);
    stroke(0);
    strokeWeight(1);
    rect(0, p * tileSize, tileSize, tileSize);

    // draw tokens
    fill(players[p].tokenColor);
    stroke(0);
    strokeWeight(2);
    ellipse(0.5 * tileSize, p * tileSize + 0.5 * tileSize, 25, 25);

    // draw 'X' for current player
    // draw number matching finishing order for players that have finished
    let tokenText = '';
    if (numPlayers > 1) {
      // mark current player with X
      if (p === curPlayer) {
        tokenText = 'X';
      }

      // mark finished players with their finishing place
      if (players[p].finished > 0) {
        tokenText = players[p].finished;
      }

      // draw text on token
      fill(0);
      text(tokenText, 0.5 * tileSize, p * tileSize + 0.5 * tileSize);
    }
  }

  translate(0, -tileSize);

  // draw histogram - background
  translate(tileSize, tileSize * (max(1, numPlayers) + 1));
  let histW = width - 2 * tileSize;
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
  for (let r = 0; r <= rows - 1; r++) {
    line(0, -r * histSpacingY, histW, -r * histSpacingY);
  }

  // draw histogram - vertical lines
  if (histSpacingX >= 8) {
    for (let x = histSpacingX; x < histW; x += histSpacingX) {
      line(x, 0, x, -histH);
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
  text(turns, turnsW * 0.5, -histH + turnsH * 0.5);

  // draw histogram per player
  for (let p = 0; p <= players.length - 1; p++) {
    // reset histogram coordinates
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    // get players color; add some alpha for 'other' players
    stroke(players[p].tokenColor);

    // draw histogram based on players history
    for (let h = 0; h <= players[p].history.length - 1; h++) {
      // reset snadder
      let drawSnadder = false;

      // read value
      let nextValue = players[p].history[h];

      // in case of a snadder; read next value
      if (nextValue === 'snadder') {
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
  let nextPlayer = null;

  // find next player after current player
  if (curPlayer < players.length - 1) {
    // find next player still in play
    for (let p = curPlayer + 1; p <= players.length - 1; p++) {
      if (players[p].finished === 0) {
        nextPlayer = p;
        break;
      }
    }
  }

  // find next player before current player; but only if no new player has been found
  if (nextPlayer === null) {
    // bump number of turns
    turns++;

    // find next player still in play
    for (let p = 0; p <= curPlayer; p++) {
      if (players[p].finished === 0) {
        nextPlayer = p;
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

  // set turn delay (6 @ 60 fps = 0.1 seconds)
  if (animationMode) turnDelay = 6;
}
