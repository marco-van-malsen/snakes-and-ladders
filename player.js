// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a player
class Player {
  // initialize player
  constructor(n) {
    this.finished = 0;
    this.history = [];
    this.number = n; //player's number
    this.spot = 0; // Where I am now
    this.tokenColor = color(255, 0, 0); // color assigned to players token

    // animation related
    this.animate = false;
    this.current;
    this.delay = TURN_DELAY;
    this.interpolator = 0;
    this.position = tiles[this.spot].getCenter();
    this.queue = [];
  }

  // update original
  animateMovement() {
    // calculate x,y coordinate based on where player is and is going
    if (this.queue.length > 1) {
      // interpolote new x,y coordinate for player
      this.position.x = lerp(this.queue[0].getCenter()[0], this.queue[1].getCenter()[0], this.easeInOutTile(this.interpolator));
      this.position.y = lerp(this.queue[0].getCenter()[1], this.queue[1].getCenter()[1], this.easeInOutTile(this.interpolator));

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
    this.animate = false
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
      return 2 * t * t
    } else {
      return -1 + (4 - 2 * t) * t;
    }
  }

  // did current player land on a Snake or Ladder?
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
    let tokenSize = 25;
    strokeWeight(2);
    if (playersOnTile > 1) {
      strokeWeight(1);
      tokenSize = 15;
    }

    // draw the player
    push();
    stroke(0);
    fill(this.tokenColor);
    if (playersOnTile === 1) {
      ellipse(tileCenter[0], tileCenter[1], tokenSize);
    } else {
      if (this.number === 0) {
        ellipse(tileCenter[0] - 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 1) {
        ellipse(tileCenter[0] + 10, tileCenter[1] + 10, tokenSize);
      } else if (this.number === 2) {
        ellipse(tileCenter[0] + 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 3) {
        ellipse(tileCenter[0] - 10, tileCenter[1] + 10, tokenSize);
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

      // boolean needed to reverse the player if the throw of the die goes beyond the finish spot
      let reverse = false;

      // always add starting tile to queue
      this.queue.push(tiles[this.spot]);

      // push all cells from the roll into the queue
      for (let step = 1; step <= die.value; step++) {
        // go forward until player hits finish; any remaining steps go backwards
        if (!reverse && this.spot === tiles.length - 1) {
          reverse = true;
        }

        // player must finish on the finish spot; cannot go beyond finish
        // player will move backwards if the die roll would violate this
        if (reverse === true ? this.spot -= 1 : this.spot += 1);
        this.queue.push(tiles[this.spot]);

        // stop once player is on the finish tile
        // if (this.spot === tiles.length - 1) {
        // step = die.value;
        // }
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
      this.spot += tiles[this.spot].snadder
      this.history.push("snadder");
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