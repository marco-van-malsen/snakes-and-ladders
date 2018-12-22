// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// game over, when there are no more active players
function GameOver() {
  for (let p of players) {
    if (p.finished === 0) return false;
  }
  return true;
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
    x += tileSize * dir;

    // move along a winding path up the rows
    if (x >= cols * tileSize || x < 0) {
      dir *= -1;
      x += tileSize * dir;
      y -= tileSize;
    }
  }

  // pick random snakes (snake not allowed on finish tile)
  let beginMin = cols;
  let beginMax = tiles.length - 2;
  for (let s = 0; s <= numSnakes - 1; s++) {
    // pick random tile to add snake to
    let begin = floor(random(beginMin, beginMax));

    // add snake, unless snadder already defined
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

  // pick random ladders
  beginMin = 1;
  beginMax = tiles.length - cols - 1;
  for (let l = 0; l <= numLadders - 1; l++) {
    // pick random tile to add ladder to
    begin = floor(random(beginMin, beginMax));

    // add ladder, unless snadder already defined
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

  // reset statistics
  statsNumLadders = 0;
  statsNumSnakes = 0;

  // create or reset the die
  die = new Die();

  // create new players
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
      players[p].tokenColorAlpha = color(0, 255, 255, 100);
    } else if (p === 1) {
      players[p].tokenColor = color(255, 0, 255);
      players[p].tokenColorAlpha = color(255, 0, 255, 100);
    } else if (p === 2) {
      players[p].tokenColor = color(255, 255, 0);
      players[p].tokenColorAlpha = color(255, 255, 0, 100);
    } else if (p === 3) {
      players[p].tokenColor = color(255, 255, 255);
      players[p].tokenColorAlpha = color(255, 255, 255, 100);
    }
  }

  // set initial game state
  state = ROLL_STATE;

  // resume game loop
  loop();
}

// calculate size of canvas, then create
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

  // (re)create game controls
  controls = [];

  // distance and dimensions
  let deltaX1 = 5; // distance between left edge and controls set text
  let deltaX2 = 110; // distance between left edge and controls set with text before it
  let deltaX3 = 5; // distance between left edge and controls set with text above it

  let deltaY1 = 10; // distance between top edge and first control set
  let deltaY2 = 25; // distance between control sets, with text before it
  let deltaY3 = 30; // distance between control sets, with text above it
  let deltaY4 = 15; // distance between control set and the text above it

  let controlH = 20; // height of control set
  let controlW1 = 40; // width of control set with text before it
  let controlW2 = myW - deltaX1 * 2 - 5; // width of control set with text above it

  // set text format
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);

  // simulate
  myY += deltaY1;
  text('Simulate', myX + deltaX1, myY);
  createControlSet(myX + deltaX2, myY, controlW1, controlH, simulationMode, 0, 1, 2, toggleSimulationMode);

  // animate
  myY += deltaY2;
  text('Animate', myX + deltaX1, myY);
  createControlSet(myX + deltaX2, myY, controlW1, controlH, animationMode, 0, 1, 2, toggleAnimationMode);

  // player selection
  myY += deltaY3;
  text('# Players :', myX + deltaX1, myY);
  myY += deltaY4;
  createControlSet(myX + deltaX3, myY, controlW2, controlH, numPlayers, 1, 4, 4, toggleNumPlayers);

  // grid size
  myY += deltaY3;
  text('# Columns / Rows :', myX + deltaX1, myY);
  myY += deltaY4;
  createControlSet(myX + deltaX3, myY, controlW2, controlH, cols, 10, 14, 3, toggleGridSize);

  // number of snakes
  myY += deltaY3;
  text('# Snakes :', myX + deltaX1, myY);
  myY += deltaY4;
  createControlSet(myX + deltaX3, myY, controlW2, controlH, numSnakes, 1, maxSnakes, maxSnakes, toggleNumSnakes);

  // number of ladders
  myY += deltaY3;
  text('# Ladders :', myX + deltaX1, myY);
  myY += deltaY4;
  createControlSet(myX + deltaX3, myY, controlW2, controlH, numLadders, 1, maxLadders, maxLadders, toggleNumLadders);

  // pick your own die value
  myY += deltaY3;
  if (debug && !simulationMode) {
    text('Roll this die :', myX + deltaX1, myY);
    myY += deltaY4;
    createControlSet(myX + deltaX3, myY, controlW2, controlH, die.value, 1, 6, 6, die.roll);
  }

  // show all controls
  textAlign(CENTER, CENTER);
  for (let c in controls) controls[c].show();
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
    if (!p.animate) p.show();
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

  // draw player tokens
  translate(0, tileSize);
  for (let p in players) {
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
      if (curPlayer === players[p].number) tokenText = 'X';

      // mark finished players with their finishing place
      if (players[p].finished > 0) tokenText = players[p].finished;

      // draw text on token
      fill(0);
      text(tokenText, 0.5 * tileSize, p * tileSize + 0.5 * tileSize);
    }
  }

  // translate back to previous coordinate
  translate(0, -tileSize);

  // draw histogram - background
  translate(tileSize, tileSize * (max(1, numPlayers) + 1));
  let histW = (cols - 1) * tileSize;
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
  stroke(255, 50);
  for (let r = 0; r <= rows - 1; r++) {
    line(0, -r * histSpacingY, histW, -r * histSpacingY);
  }

  // draw histogram - vertical lines
  if (histSpacingX >= 8) {
    for (let x = histSpacingX; x < histW; x += histSpacingX) {
      line(x, 0, x, -histH);
    }
  }

  // restore previous settings
  pop();

  // create variables for histogram size
  let turnsH;
  let turnsW;

  // set height of textbox
  turnsH = (numPlayers === 4 ? histSpacingY : histSpacingY * 2);

  // height of textbox; make sure textbox is higher than the textsize
  if (turnsH <= 12) turnsH += histSpacingY;

  // set width of textbox
  turnsW = (numPlayers === 1 ? histSpacingY * 3 : histSpacingY * 2);

  // set width of textbox; increase if number of turns exceeds 100
  if (turns >= 100 && numPlayers < 4) turnsW += histSpacingY;

  // draw text box
  fill(200);
  stroke(100);
  rect(0, -histH, turnsW, turnsH);

  // draw # turns
  fill(100);
  noStroke();
  text(turns, turnsW * 0.5, -histH + turnsH * 0.5);

  // draw histogram per player
  for (let p in players) {
    // reset histogram coordinates
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    // get and set player's color
    stroke(players[p].tokenColor);

    // draw player histogram
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

// graph to display the number of times each die-value was rolled
function showStats() {
  // calculate available area for statistics graph
  // myX,yY = lower left corner
  let myH = (numPlayers + 1) * tileSize;
  let myW = controlsArea;
  let myX = cols * tileSize + separator;
  let myY = title + separator + rows * tileSize + separator + myH;

  // draw background
  fill(10);
  noStroke();
  rect(myX, myY, myW, -myH);

  // draw line
  noFill();
  stroke(255, 50);
  strokeWeight(1);
  line(myX, myY - 0.5 * tileSize, myX + myW, myY - 0.5 * tileSize);

  // calcalate totals
  let totals = [0, 0, 0, 0, 0, 0]; // total times a die face was rolled, 1 through 6
  for (let p in players) {
    for (let d in players[p].dieRolls) {
      totals[d] += players[p].dieRolls[d];
    }
  }

  // determine vertical scale
  let maxRolledDieFace = max(totals); // get die-value that was rolled the most
  let scale = (myH - tileSize) / max(maxRolledDieFace, statsNumSnakes, statsNumLadders);

  // determine bar width
  let statsNum = 6 + 2;
  let barW = round(myW / statsNum);

  // draw vertical lines to separator statistics
  noFill()
  stroke(255, 50);
  strokeWeight(1);
  for (let stat = 1; stat < statsNum; stat++) {
    line(myX + stat * barW, myY, myX + stat * barW, myY - myH);
  }

  // draw statistics (one for each die side (6) and two to show snakes and ladders)
  let barY = myY - 0.5 * tileSize;
  for (let dieValue = 1; dieValue <= 6; dieValue++) {
    // determine lower left corner of current bar
    let barX = myX + (dieValue - 1) * barW;

    // draw die values below graph
    fill(255);
    noStroke();
    text(dieValue, barX + 0.5 * barW, barY + 0.25 * tileSize);

    // draw graph bars
    for (let p in players) {
      let total = totals[dieValue - 1];
      if (total > 0) {
        let barH = total * scale;
        fill(255);
        text(total, barX + 0.5 * barW, barY - barH - 0.25 * tileSize);
        fill(255, 50);
        noStroke();
        rect(barX, barY, barW, -barH);
      }
    }
  }

  // draw graph bar for snakes
  barX = myX + (7 - 1) * barW;
  barH = statsNumSnakes * scale;
  fill(255);
  text("S", barX + 0.5 * barW, barY + 0.25 * tileSize);
  if (statsNumSnakes > 0) text(statsNumSnakes, barX + 0.5 * barW, barY - barH - 0.25 * tileSize);
  fill(255, 0, 0, 150);
  rect(barX, barY, barW, -barH);

  // draw graph bar for ladders
  barX = myX + (8 - 1) * barW;
  barH = statsNumLadders * scale;
  fill(255);
  text("L", barX + 0.5 * barW, barY + 0.25 * tileSize);
  if (statsNumLadders > 0) text(statsNumLadders, barX + 0.5 * barW, barY - barH - 0.25 * tileSize);
  fill(0, 255, 0, 150);
  rect(barX, barY, barW, -barH);
}

// show the path
function showPathAndEdges() {
  // define look and feel for lines
  noFill();
  stroke(0);
  let weight = 4;
  strokeWeight(weight);

  // determine edges
  let lower = tiles[0].y + tileSize;
  let left = 0;
  let upper = tiles[tiles.length - 1].y;
  let right = tiles[tiles.length - cols].x + tileSize;

  // draw outline
  rect(left + 0.5 * weight, upper, cols * tileSize - 0.5 * weight, rows * tileSize - 0.5 * weight);

  // draw lines
  for (let y = lower - tileSize; y > upper; y -= tileSize * 2) {
    line(0, y, (cols - 1) * tileSize - 0.5 * weight, y);
  }

  // draw more lines
  for (let y = lower - tileSize * 2; y > upper; y -= tileSize * 2) {
    line(tileSize + 0.5 * weight, y, cols * tileSize, y);
  }
}

// find next eligible player
function switchPlayer() {
  // single player mode; just increase the number of turns
  if (numPlayers === 1) {
    turns++;
    return;
  }

  // find next player still in play
  let nextPlayer = null;

  // find next player still in play (after current player)
  if (curPlayer < players.length - 1) {
    for (let p = curPlayer + 1; p <= players.length - 1; p++) {
      if (players[p].finished === 0) {
        nextPlayer = p;
        break;
      }
    }
  }

  // find next player still in play (before current player)
  // but only if no new player has been found
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
  if (nextPlayer >= 0) curPlayer = nextPlayer;

  // set turn delay (12 @ 60 fps = 0.2 seconds)
  if (animationMode) turnDelay = 12;
}