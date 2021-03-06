// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a player
class Player {
  // initialize player
  constructor(n) {
    this.finished = 0; // player finishing position (1 for winner, 2 for 2nd place etc.)
    this.number = n; // player's number
    this.spot = 0; // player's position on the board
    this.tokenColor = color(255, 0, 0); // color assigned to players token
    this.tokenColorAlpha = color(255, 0, 0, 100); // color assigned to players token

    // statistics related
    this.dieRolls = [0, 0, 0, 0, 0, 0]; // statistics, store the number of times player rolled which side of the die
    this.history = []; // history of spots where player landed, including snakes ladders

    // preview related
    this.previewS = null; // first tile of preview, player's current position
    this.previewF = null; // last tile of preview, depends on die-roll value

    // animation related
    this.animate = false; // animate player or not
    this.delay = TURN_DELAY; // delay after move animation is complete
    this.interpolator = 0; // interpolator for move animation
    this.moves2go = 0; // moves left; starts on die face value and decrements by 1 during animation
    this.position = createVector(0, 0); // player's XY-coordinate on the gameboard
    this.queue = []; // animiation queue
  }

  // animate player's movement
  calculateXY() {
    // calculate x,y coordinate based on where player is and is going
    this.position.x = lerp(this.queue[0].center.x, this.queue[1].center.x, this.easeInOutTile(this.interpolator));
    this.position.y = lerp(this.queue[0].center.y, this.queue[1].center.y, this.easeInOutTile(this.interpolator));

    // increase interpolator speed
    this.interpolator += INTERPOLATION_SPEED;

    // drop the first cell after the interpolation has finished
    if (this.interpolator >= 1) this.interpolator = 0;

    // delay between steps in animated frames
    if (animationMode) {
      if (this.delay != 0) {
        this.delay--;
        return;
      }
    }

    // reset animation delay and queue
    this.delay = TURN_DELAY;
    this.queue = [];

    // advance player to next tile
    if (state === MOVE_STATE) {
      this.moves2go--;
      this.spot++;

      // stop when player has moved the number of spots / reached finish
      if (this.moves2go === 0 || this.spot === tiles.length - 1) {
        this.animate = false;
      }

      // update player when following snadder
    } else if (state === SNADDER_STATE) {
      this.animate = false;
      this.spot += tiles[this.spot].snadder;
    }
  }

  // player has finished; mark player finishing position
  checkFinished() {
    if (this.spot >= tiles.length - 1) {
      finishOrder += 1;
      this.finished = finishOrder;
    }
  }

  // ease in and out of tile
  easeInOutTile(t) {
    return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  }

  // did current player land on a snake or ladder?
  isSnadder() {
    if (tiles[this.spot].snadder < 0) statsNumSnakes += 1;
    if (tiles[this.spot].snadder > 0) statsNumLadders += 1;
    if (tiles[this.spot].snadder !== 0 && debug) console.log('SNADDER!'); // debug
    return (tiles[this.spot].snadder !== 0);
  }

  // move the player
  movePlayer() {
    if (debug) console.log('move player, with animation'); // debug

    // trigger the animation
    if (!this.animate) {
      // trigger the animation
      this.animate = true;

      // player inherits current die value
      if (state === MOVE_STATE) players[curPlayer].moves2go = die.value;

      // repeat until animation is finished
    } else {
      // clear queue just in case
      this.queue = [];

      // first element in queue-array is always player's current spot
      this.queue.push(tiles[this.spot]);

      if (state === MOVE_STATE) {
        // second element is the next tile when player is still moving
        this.queue.push(tiles[this.spot + 1]);

        // second element is the end of the snadder
      } else if (state === SNADDER_STATE) {
        this.queue.push(tiles[this.spot + tiles[this.spot].snadder]);
      }

      // animate player movement
      this.calculateXY();
      this.showAnimation();
    }
  }

  // reset animiation
  resetAnimation() {
    this.moves2go = 0;
    this.previewF = null;
    this.previewS = null;
    this.queue = [];
  }

  // display players not currently at play
  show() {
    if (debug) console.log('show player token'); // debug

    // get center of current player's position on the board
    let tileCenter = tiles[this.spot].center;

    // get total number of stationary players on current tile
    let playersOnTile = 0;
    for (var p of players) {
      if (this.spot === p.spot && !p.animate) playersOnTile++;
    }

    // determine token size based on number of players occupying a tile
    let tokenSize = tileSize * 0.6;
    strokeWeight(2);
    if (playersOnTile > 1) {
      strokeWeight(1);
      tokenSize = tileSize * 0.4;
    }

    // draw the player
    push();
    stroke(0);
    fill(this.tokenColor);
    if (playersOnTile === 1) {
      ellipse(tileCenter.x, tileCenter.y, tokenSize);
    } else {
      // set offset of player relative to tile center
      let offset = tileSize * 0.25;
      if (this.number === 0) {
        // player 0 in upper left corner
        ellipse(tileCenter.x - offset, tileCenter.y - offset, tokenSize);
      } else if (this.number === 1) {
        // player 1 in lower right corner
        ellipse(tileCenter.x + offset, tileCenter.y + offset, tokenSize);
      } else if (this.number === 2) {
        // player 2 in upper right left corner
        ellipse(tileCenter.x + offset, tileCenter.y - offset, tokenSize);
      } else if (this.number === 3) {
        // player 1 in lower left corner
        ellipse(tileCenter.x - offset, tileCenter.y + offset, tokenSize);
      }
    }

    pop();
  }

  // show currently moving player
  showAnimation() {
    stroke(0);
    strokeWeight(2);
    fill(this.tokenColor);
    ellipse(this.position.x, this.position.y, tileSize * 0.6);
  }

  // preview
  showPreview() {
    if (debug) console.log('show preview'); // debug

    // set first and last tile
    let start = this.previewS;
    let finish = min(this.previewF, tiles.length - 1);

    // calculate some dimensions
    let e = tileSize * 0.5; // distance between center of tile and its edges
    let h = e * 0.75; // distance between center of tile and edge of highlight

    // set outline and fill colors and line thickness
    noFill();
    stroke(players[curPlayer].tokenColor);
    strokeWeight(4);

    // process all tiles
    for (let t = start; t <= finish; t++) {
      // remember current settings
      push();

      // get current (cur), next (nxt) and previous (prv) tiles
      let cur = tiles[t].center;
      let nxt;
      let prv;
      if (t < finish) nxt = tiles[t + 1].center;
      if (t > start) prv = tiles[t - 1].center;

      // translate to tile center
      translate(cur.x, cur.y);

      // first and last tile
      //    e    e
      // |-----|-----|
      // |     |     |
      // +-----------+ ----------
      // |           |         |
      // |     ------| -----  e|
      // |   /       |   h|    |
      // |  |  +     | ----------
      // |  \        |   h|    |
      // |   --------| -----  e|
      // |           |         |
      // +-----------+ ---------
      //
      if (t === start || t === finish) {
        // rotate if needed
        if (t === start && nxt.x === cur.x) {
          rotate(-HALF_PI);
        } else if (t === start && nxt.x < cur.x) {
          rotate(PI);
        } else if (t === finish && cur.x > prv.x) {
          rotate(PI);
        } else if (t === finish && cur.y < prv.y) {
          rotate(HALF_PI);
        }

        // draw lines
        line(0, -h, e, -h);
        arc(0, 0, 2 * h, 2 * h, HALF_PI, -HALF_PI, OPEN);
        line(0, h, e, h);

        // in between tiles (straights)
        //    e     e
        // |-----|-----|
        // |     |     |
        // +-----------+ ----------
        // |           |         |
        // |-----------| -----  e|
        // |           |   h|    |
        // |     +     | ----------
        // |           |   h|    |
        // |-----------| -----  e|
        // |           |         |
        // +-----------+ ----------
        //
      } else if (nxt.y === cur.y && cur.y === prv.y) {
        // draw lines
        line(-e, -h, e, -h);
        line(-e, h, e, h);

        // in between tiles (corners)
        //              e     e
        //           |-----|-----|
        //           |   h | h   |
        //           | |---|---| |
        //           | |   |   | |
        //  -------- +-----------+
        //   |       | |       | |
        //  e|  ---- |-        | |
        //   |  h|   |         | |
        //  -------- |     +   | |
        //   |  h|   |        /  |
        //  e|  ---- |-------    |
        //   |       |           |
        //  -------- +-----------+
        //
      } else {
        // rotate if needed
        if (cur.x === prv.x && cur.y < prv.y && cur.x > nxt.x && cur.y === nxt.y) {
          rotate(-HALF_PI);
        } else if (cur.x < prv.x && cur.y === prv.y && cur.x === nxt.x && cur.y > nxt.y) {
          rotate(HALF_PI);
        } else if (cur.x === prv.x && cur.y < prv.y && cur.x < nxt.x && cur.y === nxt.y) {
          rotate(PI);
        }

        // draw lines
        line(-e, -h, -h, -h); // inner horizontal
        line(-h, -h, -h, -e); // inner vertical
        arc(0, 0, 2 * h, 2 * h, 0, HALF_PI, OPEN); // corner
        line(-e, h, 0, h); // outer horizontal
        line(h, 0, h, -e); // out vertical
      }

      // restore previous settings
      pop();
    }
  }

  // update player after animation has finished
  updateHistory() {
    // add player's spot to the history
    if (state === MOVE_STATE) {
      this.history.push(this.spot);
      this.dieRolls[die.value - 1]++;

      // update player's spot after the snadder to the history
    } else if (state === SNADDER_STATE) {
      this.spot += tiles[this.spot].snadder;
      this.history.push('snadder');
      this.history.push(this.spot);
    }
  }

  // move player without animation
  updateSimple() {
    if (debug) console.log('update player, no animation'); // debug
    this.spot += die.value; // advance player
    this.spot = min(this.spot, tiles.length - 1); // do not overshoot finish
  }
}