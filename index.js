window.onload= function (){
    // Modal box for credits
    const modal = document.querySelector('#modal');
    const openModal = document.querySelector('#credits');
    const closeModal = document.querySelector('#close');
    openModal.addEventListener("click", () => {
        modal.showModal();
    });
  
    closeModal.addEventListener("click", () => {
        modal.close();
    });
}
  
// The size of the game canvas
var boxSize = 20;
var rows = 20;
var columns = 20;

// To make the game bigger if the screen is bigger to make it a little more responsive
function resize(){
    if(window.innerWidth > 1300 && window.innerHeight > 1200)
    {
         boxSize = 30;
    }
    else{
        boxSize = 20;
    }
 }
// Variables for game over, points, start and fruit color
// and the snake's color are initiated
var gameOver = false;
var points = 0;
var start = false;
var fruitColor = "DeepPink";
var snakeColor = "Chartreuse";

// Audio for the game when the snake touches fruit
const audio = new Audio();
audio.src = "Rise02.mp3";

class Fruit {
    constructor() {
        // The fruits coordinates are decided randomly
        this.newFruit = function(){
            this.fruitX = Math.floor((Math.random()*columns))*boxSize;
            this.fruitY = Math.floor((Math.random()*rows))*boxSize;
        }

        // The fruit is drawn out with the coordinates and fruitColor
        this.placeFruit = function() {
            ctx.fillStyle=fruitColor;
            ctx.fillRect(this.fruitX, this.fruitY, boxSize, boxSize);
            ctx.strokeStyle="black";
            ctx.strokeRect(this.fruitX, this.fruitY, boxSize, boxSize);
        }
    }
}
 
class Snake {
    constructor() {
        // The snake is initiated with 3 segments, no speed in y-axis and starts going to the right in x-axis
        this.segments = [{ x: boxSize * 5, y: boxSize * 5 }, { x: boxSize * 4, y: boxSize * 5 }, { x: boxSize * 3, y: boxSize * 5 }];
        this.vy = 0;
        this.vx = boxSize;

        // The snake is drawn out by going through every segment in createSnakeSegment function
        this.createSnake = function () {
            this.segments.forEach(this.createSnakeSegment);
        };

        // Every snake segment is drawn out on the game canvas
        this.createSnakeSegment = function (snakeSegment) {
            ctx.fillStyle = snakeColor;
            ctx.fillRect(snakeSegment.x, snakeSegment.y, boxSize, boxSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(snakeSegment.x, snakeSegment.y, boxSize, boxSize);
        };

        // For the snake's movement
        this.snakeMovement = function () {
            // the future head that comes after the next update is set as a variable
            var head = { x: this.segments[0].x + this.vx, y: this.segments[0].y + this.vy };
            // this head is added to the beginning of the segments list to become the head
            this.segments.unshift(head);
           
            /* To avoid gameOver when the snake touches the apple (since the apple will become one of the segments),
            the process of removing a snake segment is skipped instead */
            if(this.detectFruit())
            {
                audio.play();
                // If the snake discovers an apple, a new apple is generated
                Apple.newFruit();
            }
            else {
                // The last snake segment is removed because the new head has been added
                this.segments.pop();
            }
        };

        // To change direction of the snake
        this.changeDirection = function (direction) {
            // The snake's direction is changed depending on the arrow key that is pressed
            // where boxSize is right in x-axis and down in y-axis
            // and -boxSize left in x-axis and up in y-axis
            switch (direction) {
                case "ArrowLeft":
                    this.vy = 0;
                    this.vx = -boxSize;
                    break;
                case "ArrowRight":
                    this.vy = 0;
                    this.vx = boxSize;
                    break;
                case "ArrowUp":
                    this.vx = 0;
                    this.vy = -boxSize;
                    break;
                case "ArrowDown":
                    this.vx = 0;
                    this.vy = boxSize;
                    break;
            }
        };

        // To detect the apples
        this.detectFruit = function () {
            // When the snake's head touches the apple the user gets a point
            // och returns true for the if-condition in snakeMovement
            if (this.segments[0].x === Apple.fruitX && this.segments[0].y === Apple.fruitY) {
                points += 1;
                document.getElementById("points").innerHTML = points;
                return true;
            }
        };

        // To detect collision with the walls
        this.wallCollision = function () {
            // If the snake head comes outside of the game canvas it is game over
            if(this.segments[0].x > gameCanvas.width || this.segments[0].x < -boxSize || this.segments[0].y > gameCanvas.height || this.segments[0].y < -boxSize)
            {
                gameOver = true;
            }
        }

        // To detect collision with tail
        this.detectTail = function() {
            // Variables are created for the snakehead's coordinates
            let headX = this.segments[0].x;
            let headY = this.segments[0].y;
            // Iterates through every segment of the snake
            for(let i=1; i < this.segments.length; ++i)
            {
                // Variables are created for the segments' current coordinates
                let currentX = this.segments[i].x;
                let currentY = this.segments[i].y;
                // If the snake head touches any of the other segments it is game over
                if(headX === currentX && headY === currentY)
                {
                    gameOver = true;
                    break;
                }
            }
            return;
        }

    }
}

// To clear the game canvas after every update to animate the game
function clearScreen() {
    ctx.fillStyle ="black";
    ctx.fillRect(0,0, gameCanvas.width, gameCanvas.height);
}

// To toggle screens when game is started/restarted/over
function toggleScreen(id, toggle){
    let element = document.getElementById(id);
    // Switches between block and none in display
    let display = ( toggle ) ? 'block' : 'none';
    element.style.display = display;
}

// When the Start Game button is clicked, this function starts
function startGame(){
    // Start screen becomes invisible and game canvas becomes visible
    toggleScreen("start", false);
    toggleScreen("gameCanvas", true);
    // To set up the game
    setUp();
}

// When the Restart button is clicked, this function starts
function restart(){
    // Restart screen becomes invisible and game canvas becomes visible
    toggleScreen("restart", false);
    toggleScreen("gameCanvas", true);
    // To set up the game
    setUp();
}

function setUp() {
    // gameOver and points are resetted for every start
    gameOver = false;
    points = 0;
    document.getElementById("points").innerHTML = points;
    gameCanvas = document.getElementById('gameCanvas');
    // The size of the game canvas
    resize();
    gameCanvas.width = rows * boxSize;
    gameCanvas.height = columns * boxSize;
    
    
    // To be able to draw the object in 2D
    ctx = gameCanvas.getContext("2d");
    // For shadows on the objects
    ctx.shadowBlur = 5;
    ctx.shadowColor = "black";
    // Create the object Apple and decide its coordinates
    Apple = new Fruit();
    Apple.newFruit();
    // Create the object PlayerSnake
    PlayerSnake = new Snake();
    // To listen after the user's arrow keys and put the information
    // in the changeDirection function
    document.addEventListener("keyup", function(event){
        var direction = event.key;
        PlayerSnake.changeDirection(direction);
    });
    // Update the game
    update();
}

// What will happen when game is over
function isGameOver () {
    console.log(boxSize)
    if (gameOver){
        // The user gets a popup for game over
        window.alert("Game Over");
        // Game canvas becomes invisible and restart screen becomes visible
        toggleScreen("gameCanvas", false);
        toggleScreen("restart", true)
        // returnes true which is used in the update function
        return true
    }
}

// Update the game for every 150 ms
function update() {
    // If the game is over it will be returned to cancel the function
    if(isGameOver()) {
        return
    }
    // For every 150 ms the screen is cleared, Apple is drawn out, PlayerSnake is created,
    // PlayerSnake is moving and detects collision with fruit, walls and tail
    setTimeout(function onTick(){
        clearScreen();
        Apple.placeFruit();
        PlayerSnake.createSnake();
        PlayerSnake.snakeMovement();
        PlayerSnake.detectFruit();
        PlayerSnake.wallCollision();
        PlayerSnake.detectTail();
        // recalling itself to continue the update
        update();
    }, 100)
}

