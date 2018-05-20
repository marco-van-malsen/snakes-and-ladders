// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a player
class Player {
  // initialize player
  constructor(n) {
    this.finished = 0; // player finishing position (1 for winner, 2 for 2nd place etc.)
    this.history = []; // history of spots where player landed, including snakes ladders
    this.number = n; // player's number
    this.spot = 0; // player's position on the board
    this.tokenColor = color(255, 0, 0); // color assigned to players token
    this.tokenColorAlpha = color(255, 0, 0, 100); // color assigned to players token

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
    if (this.interpolator >= 1) {
      this.interpolator = 0;
    }

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
    let tile = tiles[this.spot];
    return (tile && tile.snadder !== 0);
  }

  // move the player
  movePlayer() {
    // trigger the animation
    if (!this.animate) {
      // trigger the animation
      this.animate = true;

      // player inherits current die value
      if (state === MOVE_STATE) {
        players[curPlayer].moves2go = die.value;
      }

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

  // display players not currently at play
  show() {
    // get players position on the board
    let tileCenter = tiles[this.spot].center;

    // get total number of players on current tile
    let playersOnTile = 0;
    for (let p = 0; p <= players.length - 1; p++) {
      // players still moving are ignored here
      if (this.spot === players[p].spot && !players[p].animate) {
        playersOnTile += 1;
      }
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

      // get current and next tile
      let tileCurr = tiles[t].center;
      let tileNext;
      let tilePrev;
      if (t < finish) tileNext = tiles[t + 1].center;
      if (t > start) tilePrev = tiles[t - 1].center;

      // translate to tile center
      translate(tileCurr.x, tileCurr.y);

      // first and last tile
      if (t === start || t === finish) {
        // rotate if needed
        if (t === start && tileNext.x === tileCurr.x) {
          rotate(-HALF_PI);
        } else if (t === start && tileNext.x < tileCurr.x) {
          rotate(PI);
        } else if (t === finish && tileCurr.x > tilePrev.x) {
          rotate(PI);
        } else if (t === finish && tileCurr.y < tilePrev.y) {
          rotate(HALF_PI);
        }

        // draw lines
        line(0, -h, e, -h);
        arc(0, 0, 2 * h, 2 * h, HALF_PI, -HALF_PI, OPEN);
        line(0, h, e, h);

        // in between tiles (straights)
      } else if (tileNext.y === tileCurr.y && tileCurr.y === tilePrev.y) {
        // draw lines
        line(-e, -h, e, -h);
        line(-e, h, e, h);

        // in between tiles (corners)
      } else {
        // rotate if needed
        if (tileCurr.x === tilePrev.x && tileCurr.y < tilePrev.y && tileCurr.x > tileNext.x && tileCurr.y === tileNext.y) {
          rotate(-HALF_PI);
        } else if (tileCurr.x < tilePrev.x && tileCurr.y === tilePrev.y && tileCurr.x === tileNext.x && tileCurr.y > tileNext.y) {
          rotate(HALF_PI);
        } else if (tileCurr.x === tilePrev.x && tileCurr.y < tilePrev.y && tileCurr.x < tileNext.x && tileCurr.y === tileNext.y) {
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

      // update player's spot after the snadder to the history
    } else if (state === SNADDER_STATE) {
      this.spot += tiles[this.spot].snadder;
      this.history.push('snadder');
      this.history.push(this.spot);
    }
  }

  // move player without animation
  updateSimple() {
    // advance player
    this.spot += die.value;

    // player cannot overshoot finish
    this.spot = min(this.spot, tiles.length - 1);
  }
}
