var cat;
var objective;
var windows;
var score = 0;
var scoreIncrement = 20;
var windowWidth = 5;
var windowHeight = 50;
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
        window.addEventListener('mousedown', function(e) {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
        });
        window.addEventListener('mouseup', function(e) {
            gameArea.x = false;
            gameArea.y = false;
        });
        window.addEventListener('touchstart', function(e) {
            gameArea.x = e.pageX;
            gameArea.y = e.pageY;
        });
        window.addEventListener('touchend', function(e) {
            gameArea.x = false;
            gameArea.y = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}


function startGame() {
    score = 0;
    gameArea.start();
    cat = new buildCat(catSize, catSize, "blue", gameArea.canvas.width / 2, gameArea.canvas.height / 2);
    objective = new buildObjective(10, 10, "green");
    windows = [new buildWindow(windowWidth, windowHeight, "red", gameArea.canvas.width - windowWidth, gameArea.canvas.height / 2),
               new buildWindow(windowWidth, windowHeight, "red", 0, gameArea.canvas.height / 2),
               new buildWindow(windowHeight, windowWidth, "red", gameArea.canvas.width / 2, gameArea.canvas.height - windowWidth),
               new buildWindow(windowHeight, windowWidth, "red", gameArea.canvas.width / 2, 0)];
    toggleButton();
}

//BUILD WINDOW
function buildWindow(width, height, colour, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        var context = gameArea.context;
        context.fillStyle = colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
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

        if (this.x > gameArea.canvas.width || this.x < 0) {
            this.xDirection = this.xDirection * -1;
            this.changeXDirectionCounter = 0;
        } else {
            if (this.changeXDirectionCounter % changeDirectionInterval == 0) {
                this.xDirection = randomBetween(-1, 1);
                this.changeXDirectionCounter = randomBetween(0, changeDirectionInterval - 1);
            }
        }
        if (this.y > gameArea.canvas.height || this.y < 0) {
            this.yDirection = this.yDirection * -1
            this.changeYDirectionCounter = 0;
        } else {
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
    this.collision = function(otherObj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherObj.x;
        var otherright = otherObj.x + (otherObj.width);
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + (otherObj.height);
        var collision = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
            collision = false;
        }
        return collision;
    }
    this.clicked = function() {
        var myleft = this.x - 5;
        var myright = this.x + (this.width) + 10; //strange buffer needed?
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
        } else {
            this.xDirection = 1;
            this.x += runSpeed;
            this.changeXDirectionCounter = 0;
        }
        if (clickY > this.centerY) {
            this.yDirection = -1;
            this.y -= runSpeed;
            this.changeYDirectionCounter = 0;
        } else {
            this.yDirection = 1;
            this.y += runSpeed;
            this.changeYDirectionCounter = 0;
        }
    }
    return this;
}

function buildObjective(width, height, colour) {
    this.width = width;
    this.height = height;
    this.x = randomBetween(1, gameArea.canvas.width);
    this.y = randomBetween(1, gameArea.canvas.height);
    this.update = function () {
        var context = gameArea.context;
        context.fillStyle = colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    this.resetPosition = function() {
        this.x = randomBetween(1, gameArea.canvas.width);
        this.y = randomBetween(1, gameArea.canvas.height);
    }
}

function updateGameArea() 
{
    gameArea.clear();
    if (cat.collision(objective)) {
        objective.resetPosition();
        updateScore();
    }

    if (gameArea.x && gameArea.y) {
        if (cat.clicked()) {
            cat.clickReaction(gameArea.x, gameArea.y);
        }
    }
    cat.update();
    objective.update();
    for (var i = 0; i < windows.length; i++) {
        if (cat.collision(windows[i])) {
            catEscaped();
        }
        windows[i].update();
    }
    speedIncreaseCounter++;
    if (speedIncreaseCounter == speedIncreaseInterval && catSpeed < maxSpeed) {
        catSpeed++;
        speedIncreaseCounter = 0;
    }
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateScore() {
    score = score + scoreIncrement;
    $("#score").html("Score: " + score);
}

function catEscaped() {
    gameArea.stop();
    toggleButton();
    $("#score").html("Your cat escaped! Game over! <br> Your final score was: " + score);
}

function toggleButton() {
    $("#startOver").toggle();
}

function newGame() {
    gameArea.clear();
    $("#score").html("Score: " + score);
    startGame();
}