// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// constants
let INTERPOLATION_SPEED = 1 / 15;
let TURN_DELAY = 15;

// A player
class Player {
  // initialize player
  constructor(n) {
    this.active = true; // player in play, not finish
    this.history = [];
    this.number = n; //player's number
    this.spot = 0; // Where I am now
    this.tokenColor = color(255, 0, 0); // color assigned to players token
    // this.roll = -1; // What was my last roll
    // this.next = -1; // Where I'm going
    // this.animated = true;
    // this.delay = TURN_DELAY;
    // this.done = false;
    // this.half_done = false;
    // this.interpolator = 0;
    // this.current = tiles[0];
    // this.queue = this.current;
    // this.position = this.current.getCenter();
    // this.steps = 0;
  }

  // get color with some alpha added
  alphaColor() {
    let myR = red(this.tokenColor);
    let myG = green(this.tokenColor);
    let myB = blue(this.tokenColor);
    return color(myR, myG, myB, 175);
  }

  // Did current player land on a Snake or Ladder?
  isSnadder() {
    let tile = tiles[this.spot];
    return (tile && tile.snadder !== 0);
  }

  // Update spot to next
  move() {
    if (DEBUG) console.log("move the player")
    this.update();
    this.spot = this.next;
  }

  // Move according to the Snake or Ladder
  moveSnadder() {
    if (DEBUG) console.log("MOVE SNADDER")
    if (DEBUG) console.log("- start: " + this.spot)
    if (DEBUG) console.log("- delta: " + tiles[this.spot].snadder)
    this.spot += tiles[this.spot].snadder;
    this.history.push("snadder");
    this.history.push(this.spot);
  }

  // Display on the current tile
  show() {
    // if (DEBUG) console.log("SHOW PLAYER: " + curPlayer);
    // get players position on the board
    let playerTile = tiles[this.spot];

    // Just get out of here if it's not a valid tile
    // if (!playerTile) return;

    // get total number of players on current tile
    let playersOnTile = 0;
    for (let i = 0; i <= players.length - 1; i++) {
      if (this.spot === players[i].spot) {
        playersOnTile += 1;
      }
    }
    // if (DEBUG) console.log("- playersOnTile: " + playersOnTile);

    // determine token size based on number of players occupying a tile
    let tokenSize = 25;
    if (playersOnTile > 1) {
      tokenSize = 15;
    }
    // if (DEBUG) console.log("- tokenSize: " + tokenSize);

    // draw the player
    push();

    stroke(0);
    fill(this.tokenColor);
    if (this.number - 1 === curPlayer ? strokeWeight(2) : strokeWeight(1));

    let tileCenter = playerTile.getCenter();
    if (playersOnTile === 1) {
      ellipse(tileCenter[0], tileCenter[1], tokenSize);
    } else {
      if (this.number === 1) {
        ellipse(tileCenter[0] - 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 2) {
        ellipse(tileCenter[0] + 10, tileCenter[1] + 10, tokenSize);
      } else if (this.number === 3) {
        ellipse(tileCenter[0] + 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 4) {
        ellipse(tileCenter[0] - 10, tileCenter[1] + 10, tokenSize);
      }
    }
    pop();
  }

  // highlight the tiles ahead
  showPreview() {
    if (DEBUG) console.log("SHOW PREVIEW");
    let start = max(0, this.spot);
    let end = min(this.spot + die.value, tiles.length - 1);
    if (DEBUG) console.log("- start=" + start);
    if (DEBUG) console.log("- end=" + end);
    for (let i = start; i <= end; i++) {
      tiles[i].highlight();
    }
  }

  // update the player
  updateNew() {
    // do the animation

    // put player on new spot and add to history
    if (this.spot + die.value <= tiles.length - 1) {
      this.spot = this.spot + die.value;
    } else {
      this.spot = tiles.length - 1;
      this.active = false;
    }

    //  add new spot to history
    this.history.push(this.spot);
  }

  // update original
  updateOFF() {
    // if (state !== MOVE_STATE) {
    // return;
    // }
    if (DEBUG) console.log("update");

    if (this.queue.length > 1) {
      let x = lerp(this.queue[0].getCenter()[0], this.queue[1].getCenter()[0], this.easeInOutQuad(this.interpolator));
      let y = lerp(this.queue[0].getCenter()[1], this.queue[1].getCenter()[1], this.easeInOutQuad(this.interpolator));

      this.interpolator += INTERPOLATION_SPEED;

      if (this.interpolator >= 1) {
        this.interpolator = 0;
        this.queue.shift();
      }
      return;
    }

    if (this.half_done) {
      this.done = true;
    }

    if (this.delay != 0) {
      this.delay--;
      return;
    }

    this.delay = TURN_DELAY;

    // steps is number rolled
    let steps = this.roll;
    while (steps > 0) {
      if (this.current.next) {
        // this.current = this.current.next;
        // this.queue.push(this.current);
        // this.steps++;
        steps--;
      } else {
        this.half_done = true;
        break;
      }
    }

    if (this.current.jump) {
      this.current = this.current.jump;
      this.queue.push(this.current);
    }
  }

  easeInOutQuad(t) {
    if (t < 0.5) {
      return 2 * t * t
    } else {
      return -1 + (4 - 2 * t) * t;
    }
  }
}