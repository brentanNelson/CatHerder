var cat;
var catSpeed = 1;
var maxSpeed = 20;
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
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function startGame() {
    gameArea.start();
    cat = buildCat(30, 30, "blue", 10, 120);
}

function buildCat(width, height, color, x, y) {
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
            if (changeXDirectionCounter % changeDirectionInterval == 0) {
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
            if (changeYDirectionCounter % changeDirectionInterval == 0) {
                this.yDirection = randomBetween(-1, 1);
                this.changeYDirectionCounter = randomBetween(0, changeDirectionInterval - 1);
            }
        }

        this.x += catSpeed * this.xDirection;
        this.y += catSpeed * this.yDirection;
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    return this;
}

function updateGameArea() {
    gameArea.clear();
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
