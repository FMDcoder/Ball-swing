/*
    Made by: FMDcoder, Vanessa Nilsson
    Date: 2024-04-10
    License: MIT
*/

let ropeLength = 300;
let elasticityStrengh = Math.pow(10, 10);
let width = 800;
let height = 800;

/**
* Represents a Rope object.
*
* @class
* @constructor
* @param {number} x1 - The x-coordinate of the first point.
* @param {number} y1 - The y-coordinate of the first point.
* @param {number} x2 - The x-coordinate of the second point.
* @param {number} y2 - The y-coordinate of the second point.
* @param {number} len - The length of the rope.
*/
class Rope {
  constructor(x1, y1, x2, y2, len) {

    this.ItemTypeCheck(x1, "x1");
    this.ItemTypeCheck(y1, "y1");
    this.ItemTypeCheck(x2, "x2");
    this.ItemTypeCheck(y2, "y2");
    this.ItemTypeCheck(len, "length");

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.len = len;
    
    this.vx = 0;
    this.vy = 0;
  }

  /**
   * Checks the type of an object.
   * 
   * This method takes in an object and its name as parameters and checks if the object is of type Number.
   * If the object is not of type Number, it throws an error with the name of the object.
   * 
   * @param {any} object - The object to be checked.
   * @param {string} name - The name of the object.
   * @throws {string} - Throws an error if the object is not of type Number.
   * @returns {void}
   */
  ItemTypeCheck(object, name) {
    if(typeof object === Number) {
      throw "ERROR: "+name+" is not a number!";
    }
  }

  /**
   * Plays a random audio from a list of sounds.
   * 
   * This method selects a random audio file from a list of sound files and plays it.
   * It first creates an array of sound file paths.
   * Then, it generates a random index within the range of the array length.
   * The method creates an Audio object with the selected sound file path and plays it.
   * If an error occurs during audio playback, the method logs an error message to the console.
   * 
   * @returns {void}
   */
  playRandomAudio() {
    let sounds = [
      "Sounds/bounce.mp3",
    ]
    try {
      var volume = min(4 * sqrt(sq(this.vy) + sq(this.vx)) / sqrt(sq(400) + sq(400)), 0.2);
      
      console.log(volume);
      if(volume < 0.008) {
        return;
      }

      var randomIndex = Math.floor(Math.random() * sounds.length);
      var audio = new Audio(sounds[randomIndex]);
      audio.volume = volume;

      audio.play();
    } catch(error) {
      console.log("Could not play audio!");
    }
  }
  
  /**
   * Updates the state of the Rope object.
   * 
   * This method calculates the new velocity and position of the Rope object based on the current velocity and forces acting on it.
   * It updates the vertical velocity (vy) by adding the gravitational force and the horizontal velocity (vx) remains unchanged.
   * If the new vertical position (y2 + vy) is outside the canvas height, the vertical velocity is reversed and reduced by 20% to simulate bouncing.
   * If the new horizontal position (x2 + vx) is outside the canvas width, the horizontal velocity is reversed and reduced by 20% to simulate bouncing.
   * The method then calculates the pulling force acting on the Rope object by calling the getPullingforce() method.
   * The pulling force is applied to the horizontal and vertical velocities, resulting in a change in velocity.
   * Finally, the new position of the Rope object is calculated by adding the velocity to the current position, ensuring that the position stays within the canvas boundaries.
   * 
   * @returns {void}
   */
  update() {
    let ms = deltaTime / 1000;
    this.vy += 9.82 * ms;
    
    if(this.vy + this.y2 < 0 || this.vy + this.y2 > height) {
      this.vy *= -0.8;
      this.playRandomAudio();
    }
    
    if(this.vx + this.x2 < 0 || this.vx + this.x2 > width) {
      this.vx *= -0.8;
      this.playRandomAudio();
    }
    
    let res = this.getPullingforce(
      this.x1, this.y1, this.x2 + this.vx, this.y2 + this.vy);
    
    this.vx += res[0];
    this.vy += res[1];
    
    this.y2 = max(0, min(this.y2 + this.vy, height));
    this.x2 = max(0, min(this.x2 + this.vx, width));
  }
  
  /**
   * Displays the Rope object on the canvas.
   * 
   * This method updates the state of the Rope object by calling the update() method.
   * It calculates the midpoint of the Rope object and determines the vertical displacement (a) from the center of the canvas.
   * The method then calculates the horizontal displacement (dx) based on the distance between the two endpoints of the Rope object and the desired length.
   * The startYValue is calculated using the hyperbolic cosine function (Math.cosh) and the dx value.
   * 
   * The method then iterates over a range of values from 0 to 1 with a step of 0.01.
   * For each iteration, it calculates the vertical displacement (yv) using the hyperbolic cosine function and the current iteration value.
   * It calculates the new x and y coordinates (nx and ny) based on the linear interpolation between the two endpoints of the Rope object and the current iteration value.
   * The startYValue is subtracted from the ny value to account for the initial displacement.
   * The method draws a line between the previous coordinates (pnx and pny) and the new coordinates (nx and ny) using the line() function.
   * The previous coordinates are updated to the new coordinates for the next iteration.
   * 
   * Finally, the method sets the stroke weight to 3 and draws circles at the two endpoints of the Rope object using the circle() function.
   * 
   * @returns {void}
   */

  show() {
    this.update();
    
    let midY = (this.y1 + this.y2) / 2;

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

  /**
   * Sets the coordinates of the first endpoint of the Rope object.
   * 
   * This method updates the x and y coordinates of the first endpoint of the Rope object.
   * It calculates the pulling force acting on the Rope object by calling the getPullingforce() method with the new coordinates and the current coordinates of the second endpoint.
   * The pulling force is applied to the horizontal and vertical velocities, resulting in a change in velocity.
   * Finally, the new coordinates are assigned to the x1 and y1 properties of the Rope object.
   * 
   * @param {number} x - The new x coordinate of the first endpoint.
   * @param {number} y - The new y coordinate of the first endpoint.
   * @returns {void}
   */
  setPointOne(x, y) {

    this.ItemTypeCheck(x, "x");
    this.ItemTypeCheck(y, "y");

    let res = this.getPullingforce(
      x, y, this.x2, this.y2);
    
    this.vx += res[0];
    this.vy += res[1];
    
    this.x1 = x;
    this.y1 = y;
  }
  
  /**
   * Calculates the pulling force acting on the Rope object.
   * 
   * This method takes in the coordinates of the two endpoints of the Rope object and calculates the pulling force between them.
   * It first calculates the distance between the two endpoints using the dist() function.
   * Then, it calculates the angle between the two endpoints using the atan2() function.
   * 
   * If the distance is greater than the length of the Rope object, it calculates the displacement (dx and dy) between the two endpoints based on the angle and the length.
   * It then calculates the vertical velocity (vely) and horizontal velocity (velx) by subtracting the displacement from the difference in y and x coordinates respectively, and multiplying it by the time step (ms) and the elasticity strength.
   * The magnitude of the velocity (ld) is calculated using the Pythagorean theorem.
   * 
   * Finally, the method returns an array containing the normalized horizontal velocity (velx / ld) and vertical velocity (vely / ld) as the pulling force acting on the Rope object.
   * If the distance is less than or equal to the length of the Rope object, the method returns [0, 0] indicating no pulling force.
   * 
   * @param {number} x1 - The x coordinate of the first endpoint.
   * @param {number} y1 - The y coordinate of the first endpoint.
   * @param {number} x2 - The x coordinate of the second endpoint.
   * @param {number} y2 - The y coordinate of the second endpoint.
   * @returns {number[]} An array containing the normalized horizontal and vertical velocities as the pulling force acting on the Rope object.
   */
  getPullingforce(x1, y1, x2, y2) {

    this.ItemTypeCheck(x1, "x1");
    this.ItemTypeCheck(y1, "y1");
    this.ItemTypeCheck(x2, "x2");
    this.ItemTypeCheck(y2, "y2");

    let ms = deltaTime / 1000;
    
    let distance = dist(x1, y1, x2, y2)
    let ang = atan2(y2 - y1, x2 - x1);
    
    if(distance > this.len) {
      
      let dx = cos(ang) * this.len;
      let dy = sin(ang) * this.len;
      
      let vely = (y1 - y2 - dy) * ms *  elasticityStrengh
      let velx = (x1 - x2 - dx) * ms *  elasticityStrengh
      
      let ld = sqrt(sq(vely) + sq(velx));
      
      return [velx / ld, vely / ld];
    }
    return[0, 0]
  }
}

let begin = false;
let rope = new Rope(100, 100, 100 + ropeLength, 100, ropeLength);

/**
 * The setup function is a built-in function in p5.js that is called once when the program starts.
 * It is used to initialize the canvas and set up any necessary configurations or variables.
 * 
 * Parameters:
 * None
 * 
 * Returns:
 * None
 */
function setup() {
  createCanvas(width, height);
  background(220);

  noStroke();
  color(255, 255, 255, 0.2);
  rect(0, height * 0.25, width, height * 0.5);
  
  textFont('Courier New', 50);
  textStyle(BOLD);
  textAlign(CENTER);
  text('Click to start', height * 0.5, width * 0.5);
}

/**
 * Draws the canvas and displays the rope.
 * 
 * This function is called repeatedly by the p5.js library to update and display the canvas.
 * It first sets the background color of the canvas to 220 (light gray).
 * Then, it calls the show() method of the rope object to display the rope on the canvas.
 * 
 * @returns {void}
 */
function draw() {
  if(begin) {
    stroke(0);
    background(220);
    rope.show();
  }
}

/**
 * Updates the coordinates of the first endpoint of the Rope object based on the mouse movement.
 * 
 * This function is triggered when the mouse is moved.
 * It takes the current mouse coordinates (mouseX, mouseY) as parameters and updates the x and y coordinates of the first endpoint of the Rope object by calling the setPointOne() method.
 * The setPointOne() method calculates the pulling force acting on the Rope object based on the new coordinates and the current coordinates of the second endpoint.
 * The pulling force is applied to the horizontal and vertical velocities, resulting in a change in velocity.
 * Finally, the new coordinates are assigned to the x1 and y1 properties of the Rope object.
 * 
 * @param {number} mouseX - The current x coordinate of the mouse.
 * @param {number} mouseY - The current y coordinate of the mouse.
 * @returns {void}
 */
function mouseMoved() {
  rope.setPointOne(mouseX, mouseY);
}

function mousePressed() {
  begin = true;
}