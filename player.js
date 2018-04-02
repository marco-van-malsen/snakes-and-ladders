// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a player
class Player {
  // initialize player
  constructor(n) {
    this.finished = 0; // player finishing position (1 for winner, 2 for 2nd place etc.)
    this.history = []; // history of spots where player landed, including snakes ladders
    this.number = n; //player's number
    this.spot = 0; // player's position on the board
    this.tokenColor = color(255, 0, 0); // color assigned to players token

    // animation related
    this.animate = false; // animite player or not
    this.delay = TURN_DELAY; // delay after move animation is complete
    this.interpolator = 0; // interpolator for move animation
    this.position = tiles[this.spot].getCenter(); // player's XY-coordinate on the board
    this.queue = []; // animiation queue
  }

  // animate player's movement
  animateMovement() {
    // calculate x,y coordinate based on where player is and is going
    if (this.queue.length > 1) {
      // interpolote new x,y coordinate for player
      this.position.x = lerp(this.queue[0].getCenter()[0],
        this.queue[1].getCenter()[0], this.easeInOutTile(this.interpolator));
      this.position.y = lerp(this.queue[0].getCenter()[1],
        this.queue[1].getCenter()[1], this.easeInOutTile(this.interpolator));

      // increase interpolator speed
      this.interpolator += INTERPOLATION_SPEED;

      // drop the first cell after the interpolation has finished
      if (this.interpolator >= 1) {
        this.interpolator = 0;
        this.queue.shift();
      }

      return;
    }

    // delay between steps in animated frames
    if (animationMode) {
      if (this.delay != 0) {
        this.delay--;
        return;
      }
    }

    // reset player
    this.animate = false;
    this.delay = TURN_DELAY;
    this.queue = [];
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
    if (t < 0.5) {
      return 2 * t * t;
    } else {
      return -1 + (4 - 2 * t) * t;
    }
  }

  // did current player land on a snake or ladder?
  isSnadder() {
    let tile = tiles[this.spot];
    return (tile && tile.snadder !== 0);
  }

  // move player along snake or ladder
  moveSnadder() {
    // trigger the animation
    if (!this.animate) {
      this.animate = true;

      // add begin and end of snadder to queue
      this.queue.push(tiles[this.spot]);
      this.queue.push(tiles[this.spot + tiles[this.spot].snadder]);
    }

    // repat until animation is finished
    if (this.animate) {
      this.animateMovement();
      return;
    }
  }

  // display players not currently at play
  show() {
    // get players position on the board
    let playerTile = tiles[this.spot];
    let tileCenter = playerTile.getCenter();

    // get total number of players on current tile
    let playersOnTile = 0;
    for (let i = 0; i <= players.length - 1; i++) {
      if (this.spot === players[i].spot) {
        playersOnTile += 1;
      }
    }

    // determine token size based on number of players occupying a tile
    let tokenSize = resolution * 0.6;
    strokeWeight(2);
    if (playersOnTile > 1) {
      strokeWeight(1);
      tokenSize = resolution * 0.4;
    }

    // draw the player
    push();
    stroke(0);
    fill(this.tokenColor);
    if (playersOnTile === 1) {
      ellipse(tileCenter[0], tileCenter[1], tokenSize);
    } else {
      // set offset of player relative to tile center
      let offset = resolution * 0.25;
      if (this.arrayindex === 0) {
        // player 0 in upper left corner
        ellipse(tileCenter[0] - offset, tileCenter[1] - offset, tokenSize);
      } else if (this.number === 1) {
        // player 1 in lower right corner
        ellipse(tileCenter[0] + offset, tileCenter[1] + offset, tokenSize);
      } else if (this.number === 2) {
        // player 2 in upper right left corner
        ellipse(tileCenter[0] + offset, tileCenter[1] - offset, tokenSize);
      } else if (this.number === 3) {
        // player 1 in lower left corner
        ellipse(tileCenter[0] - offset, tileCenter[1] + offset, tokenSize);
      }
    }

    pop();
  }

  // show currently moving player
  showAnimation() {
    stroke(0);
    strokeWeight(2);
    fill(this.tokenColor);
    ellipse(this.position.x, this.position.y, 25);
  }

  // update the player
  update() {
    // trigger the animation (just once)
    if (!this.animate) {
      // trigger animation
      this.animate = true;

      // always push the starting cell on the queue
      this.queue.push(tiles[this.spot]);

      // push all cells from the roll into the queue
      for (let step = 1; step <= die.value; step++) {
        // but stop when player reaches finish tile
        if (this.spot < tiles.length - 1) {
          this.spot++;
          this.queue.push(tiles[this.spot]);
        }
      }
    }

    // repeat until animation is finished
    if (this.animate) {
      this.animateMovement();
      return;
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
