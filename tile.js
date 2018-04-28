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

  // highlight
  highlight() {
    noStroke();
    let myC = players[curPlayer].tokenColor;
    myC.setAlpha(75);
    fill(myC);
    rect(this.x, this.y, this.wh, this.wh);
    myC.setAlpha(255);
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
      tileText = this.index + 1;
    }

    // display tile text
    fill(255);
    text(tileText, this.center.x, this.center.y);
  }

  // show snake or ladder
  showSnadders() {
    if (this.snadder != 0) {
      strokeWeight(4);
      if (this.snadder < 0) {
        stroke(255, 0, 0, 200);
      } else {
        stroke(0, 255, 0, 200);
      }

      let snadderEnd = tiles[this.index + this.snadder].center;
      line(this.center.x, this.center.y, snadderEnd.x, snadderEnd.y);
    }
  }
}
