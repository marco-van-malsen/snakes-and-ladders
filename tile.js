// Snakes and Ladders
// Original: Daniel Shiffman (The Coding Train)
// Extended: Marco van Malsen

// a tile on the board
class Tile {
  constructor(x, y, wh, index) {
    this.index = index;
    this.snadder = 0;
    this.wh = wh;
    this.x = x;
    this.y = y;

    // checker board pattern
    if (this.index % 2 === 0) {
      this.color = 200;
    } else {
      this.color = 100;
    }
  }

  // find center
  getCenter() {
    let cx = this.x + this.wh / 2;
    let cy = this.y + this.wh / 2;
    return [cx, cy];
  }

  // draw tile
  show() {
    // draw tile (override tile color for start and finish)
    if (this.index === 0 || this.index === tiles.length - 1) {
      fill(255, 0, 0);
    } else {
      fill(this.color);
    }

    noStroke();
    rect(this.x, this.y, this.wh, this.wh);

    // determine content to display
    let tileText;
    if (this.index == 0) {
      tileText = 'start';
    } else if (this.index === tiles.length - 1) {
      tileText = 'finish';
    } else {
      tileText = this.index + 1;
    }

    // display tile text
    textAlign(CENTER, CENTER);
    textSize(12);
    fill(255);
    text(tileText, this.x + this.wh / 2, this.y + this.wh / 2);
  }

  // show snake or ladder
  showSnadders() {
    if (this.snadder != 0) {
      let myCenter = this.getCenter();
      let nextCenter = tiles[this.index + this.snadder].getCenter();
      strokeWeight(4);
      if (this.snadder < 0) {
        stroke(255, 0, 0, 200);
      } else {
        stroke(0, 255, 0, 200);
      }

      line(myCenter[0], myCenter[1], nextCenter[0], nextCenter[1]);
    }
  }
}
