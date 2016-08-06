var cat;
var objective;
var catSize = 30;
var catSpeed = 1;
var maxSpeed = 20;
var runSpeed = 1;
var speedIncreaseCounter = 0;
var speedIncreaseInterval = 2000;
var changeDirectionInterval = 20;

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            gameArea.x = false;
            gameArea.y = false;
        })
        window.addEventListener('touchstart', function (e) {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            gameArea.x = false;
            gameArea.y = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function startGame() {
    gameArea.start();
    cat = new buildCat(catSize, catSize, "blue", 10, 120);
   // objective = new buildObjective(10, 10, "red");
}

//BUILD CAT
function buildCat(width, height, colour, x, y) {
    this.width = width;
    this.height = height;
    this.xDirection = 1;
    this.yDirection = -1;
    this.changeXDirectionCounter = 0;
    this.changeYDirectionCounter = 0;

    this.x = x;
    this.y = y;
    this.update = function() {
        var context = gameArea.context;

        this.changeXDirectionCounter++;
        this.changeYDirectionCounter++;

        if (this.x > gameArea.canvas.width || this.x < 0)
        {
            this.xDirection = this.xDirection * -1
            this.changeXDirectionCounter = 0;
        }
        else
        {
            if (this.changeXDirectionCounter % changeDirectionInterval == 0) {
                this.xDirection = randomBetween(-1, 1);
                this.changeXDirectionCounter = randomBetween(0, changeDirectionInterval - 1);
            }
        }
        if (this.y > gameArea.canvas.height || this.y < 0)
        {
            this.yDirection = this.yDirection * -1
            this.changeYDirectionCounter = 0;
        }
        else
        {
            if (this.changeYDirectionCounter % changeDirectionInterval == 0) {
                this.yDirection = randomBetween(-1, 1);
                this.changeYDirectionCounter = randomBetween(0, changeDirectionInterval - 1);
            }
        }

        this.x += catSpeed * this.xDirection;
        this.y += catSpeed * this.yDirection;
        context.fillStyle = colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    this.clicked = function() {
        var myleft = this.x - 5;
        var myright = this.x + (this.width) + 10;
        var mytop = this.y - 5;
        var mybottom = this.y + (this.height) + 10; //strange buffer for bottom distance?
        var clicked = true;
        if ((mybottom < gameArea.y) || (mytop > gameArea.y)
         || (myright < gameArea.x) || (myleft > gameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
    this.clickReaction = function(clickX, clickY) {
        this.centerX = this.x + (catSize / 2);
        this.centerY = this.y + (catSize / 2);

        if (clickX > this.centerX) {
            this.xDirection = -1;
            this.x -= runSpeed;
            this.changeXDirectionCounter = 0;
        }
        else {
            this.xDirection = 1;
            this.x += runSpeed;
            this.changeXDirectionCounter = 0;
        }
        if (clickY > this.centerY) {
            this.yDirection = -1;
            this.y -= runSpeed;
            this.changeYDirectionCounter = 0;
        }
        else {
            this.yDirection = 1;
            this.y += runSpeed;
            this.changeYDirectionCounter = 0;
        }
    }
    return this;
}

//function buildObjective(width, height, colour)
//{
//    this.width = width;
//    this.height = height;
//    this.x = randomBetween(1, gameArea.x);
//    this.y = randomBetween(1, gameArea.y);
//    this.update = function() {
//        var context = gameArea.context;
//        context.fillStyle = colour;
//        context.fillRect(this.x, this.y, this.width, this.height);
//}

function updateGameArea() 
{
    gameArea.clear();
    if (gameArea.x && gameArea.y) 
    {
        if (cat.clicked()) 
        {
            cat.clickReaction(gameArea.x, gameArea.y);
        }
    }
    cat.update();

    speedIncreaseCounter++;
    if (speedIncreaseCounter == speedIncreaseInterval && catSpeed < maxSpeed)
    {
        catSpeed++;
        speedIncreaseCounter = 0;      
    }
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
