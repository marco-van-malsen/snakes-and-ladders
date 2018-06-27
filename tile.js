// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a tile on the board
class Tile {
  constructor(index, x, y) {
    this.index = index; // index of tile in array
    this.snadder = 0; // normal tile (zero), snake (negative numbers) or ladder (positive number)
    this.wh = tileSize; // width and height of tile
    this.x = x; // left side of tile (relative to canvas upper left)
    this.y = y; // top side of tile (relative to canvas upper left)
    this.center = createVector(this.x + this.wh * 0.5, this.y + this.wh * 0.5); // center (x,y) of tile
    this.color = (this.index % 2 ? 200 : 100); // checkerboard colors
  }

  // draw tile
  show() {
    // draw tile (override tile color for start and finish)
    if (this.index === 0 || this.index === tiles.length - 1) {
      fill(255, 0, 0);
    } else {
      fill(this.color);
    }

    // draw tile
    noStroke();
    rect(this.x, this.y, this.wh, this.wh);

    // determine content to display
    let tileText;
    if (this.index === 0) {
      tileText = 'start';
    } else if (this.index === tiles.length - 1) {
      tileText = 'finish';
    } else {
      tileText = (debug ? this.index : this.index + 1);
    }

    // display tile text
    fill(255);
    text(tileText, this.center.x, this.center.y);
  }

  // show snake or ladder
  showSnadders() {
    // there is no snadder here, bye bye
    if (this.snadder === 0) return;

    // set colors and weights of line and other geometry
    strokeWeight(4);
    if (this.snadder < 0 ? fill(255, 0, 0, 100) : fill(0, 255, 0, 100));
    if (this.snadder < 0 ? stroke(255, 0, 0, 200) : stroke(0, 255, 0, 200));

    // get tiles where snadders begins and ends
    let tile1 = this.center;
    let tile2 = tiles[this.index + this.snadder].center;

    // draw a simple snadder when game is over, or when not in animiation mode
    if (state === GAME_OVER || !animationMode) {
      line(tile1.x, tile1.y, tile2.x, tile2.y);
      return;
    }

    // draw the snadder as a line
    if (players[curPlayer].spot != this.index || players[curPlayer].moves2go > 0) {
      line(tile1.x, tile1.y, tile2.x, tile2.y);

      // draw a detailed snadder
    } else {
      // calculate distance and angle between tile2 and tile1
      let deltaX = tile2.x - tile1.x;
      let deltaY = tile2.y - tile1.y;
      let angle = atan(deltaY / deltaX);

      // correction of angle
      if (deltaX < 0 && deltaY < 0) {
        angle -= PI;
      } else if (deltaX < 0 && deltaY > 0) {
        angle += PI;
      }

      // calculate snadder dimensions
      let snadderH = tileSize * 0.75;
      let snadderR = snadderH * 0.5;
      let snadderW = sqrt(sq(abs(deltaX)) + sq(abs(deltaY))) + 2 * snadderR;

      // remember current settings
      push();

      // translate to tile1
      translate(tile1.x, tile1.y);
      rotate(angle);

      // draw snadder as a rectangle with rounder corners
      rect(-snadderR, -0.5 * snadderH, snadderW, snadderH, snadderR);

      // restore previous settings
      pop();
    }
  }
}
