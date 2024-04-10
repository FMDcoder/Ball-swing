let ropeLength = 600;
let width = 800;
let height = 800;

class Rope {
  constructor(x1, y1, x2, y2, len) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.len = len;
    
    this.vx = 0;
    this.vy = 0;
  }
  
  update() {
    let ms = deltaTime / 1000;
    this.vy += 9.82 * ms;
    
    if(this.vy + this.y2 < 0 || this.vy + this.y2 > height) {
      this.vy *= -0.8;
    }
    
    if(this.vx + this.x2 < 0 || this.vx + this.x2 > width) {
      this.vx *= -0.8;
    }
    
    let res = this.getPullingforce(
      this.x1, this.y1, this.x2 + this.vx, this.y2 + this.vy);
    
    this.vx += res[0];
    this.vy += res[1];
    
    this.y2 = max(0, min(this.y2 + this.vy, height));
    this.x2 = max(0, min(this.x2 + this.vx, width));
  }
  
  show() {
    this.update();
    
    let midY = (this.y1 + this.y2) / 2;
    let midX = (this.x1 + this.x2) / 2;

    let a = height / 2 - midY;
    let dx = max(min(dist(this.x1, this.y1, this.x2, this.y2) - this.len, 0), -this.len);
    
    let startYValue = dx * Math.cosh(-0.5)
    let pnx = this.x1;
    let pny = this.y1;

    strokeWeight(6);
    for (let i = 0; i <= 1; i += 0.01) {
        let yv = dx * Math.cosh(i - 0.5);

        let nx = this.x2 * i + this.x1 * (1 - i);
        let ny = this.y2 * i + this.y1 * (1 - i) + yv - startYValue;
      
        line(nx, ny, pnx, pny);
        pnx = nx;
        pny = ny;
    }
    
    strokeWeight(3);
    circle(this.x1, this.y1, 20);
    circle(this.x2, this.y2, 20);
  }

  setPointOne(x, y) {

    let res = this.getPullingforce(
      x, y, this.x2, this.y2);
    
    this.vx += res[0];
    this.vy += res[1];
    
    this.x1 = x;
    this.y1 = y;
  }
  
  getPullingforce(x1, y1, x2, y2) {
    let ms = deltaTime / 1000;
    
    let distance = dist(x1, y1, x2, y2)
    let ang = atan2(y2 - y1, x2 - x1);
    
    if(distance > this.len) {
      
      let dx = cos(ang) * this.len;
      let dy = sin(ang) * this.len;
      
      let vely = (y1 - y2 - dy) * ms
      let velx = (x1 - x2 - dx) * ms
      
      let ld = sqrt(sq(vely) + sq(velx));
      
      return [velx / ld, vely / ld];
    }
    return[0, 0]
  }
}

let rope = new Rope(100, 100, 100 + ropeLength, 100, ropeLength);

function setup() {
  createCanvas(width, height);
}

function draw() {
  background(220);
  
  rope.show();
}

function mouseMoved() {
  rope.setPointOne(mouseX, mouseY);
}