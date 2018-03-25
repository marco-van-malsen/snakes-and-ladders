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
    this.spot = 0; // Where I am now
    this.roll = -1; // What was my last roll
    this.next = -1; // Where I'm going
    this.number = n; //player's number
    this.animated = true;
    this.delay = TURN_DELAY;
    this.done = false;
    this.half_done = false;
    this.interpolator = 0;
    this.current = tiles[0];
    this.queue = this.current;
    this.position = this.current.getCenter();
    this.steps = 0;
    this.history = [];
    this.tokenColor = 127;
  }

  // Is player on a Snake or Ladder?
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
    // console.log("follow snadder")
    let tile = tiles[this.spot];
    this.spot += tile.snadder;
  }

  // Display on the current tile
  show() {
    // get players position on the port
    let playerTile = tiles[this.spot];

    // Just get out of here if it's not a valid tile
    if (!playerTile) return;

    // get total number of players on current tile
    let playersOnTile = 0;
    for (let i = 1; i <= numPlayers; i++) {
      if (this.spot === players[i - 1].spot) {
        playersOnTile += 1;
      }
    }

    // determine token size based on number of players occupying a tile
    let tokenSize = 25;
    if (playersOnTile > 1) {
      tokenSize = 15;
    }

    // draw the player
    push();
    fill(this.tokenColor);
    stroke(0);
    strokeWeight(2);
    let tileCenter = playerTile.getCenter();
    if (playersOnTile === 1) {
      ellipse(tileCenter[0], tileCenter[1], tokenSize);
    } else {
      if (this.number === 1) {
        ellipse(tileCenter[0] - 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 2) {
        ellipse(tileCenter[0] + 10, tileCenter[1] - 10, tokenSize);
      } else if (this.number === 3) {
        ellipse(tileCenter[0] - 10, tileCenter[1] + 10, tokenSize);
      } else if (this.number === 4) {
        ellipse(tileCenter[0] + 10, tileCenter[1] + 10, tokenSize);
      }
    }
    pop();
  }

  // highlight the tiles ahead
  showPreview() {
    let start = max(0, this.spot);
    let end = min(this.next, tiles.length - 1);
    for (let i = start; i <= end; i++) {
      tiles[i].highlight();
    }
  }

  // switch to next player

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