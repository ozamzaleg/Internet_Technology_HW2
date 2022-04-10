var flappy_bird_red;
var flappy_bird_yellow;
var myObstacles = [];
var myScore;
var myContemporaryScore;
var myBestScore;
var mySound;
var bestScore;
var myStartBackground;
var myGameOverBackground;
var startBtn;
var onSound;
var offSound;
var soundEnabled = false;
var isBirdRed = true;
const CRASH_GROUND = 69;

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}


function startGame() {
    myGameArea.start();
    state.current = state.getReady;
}

function addImgOrTextComponent() {
    onSound = new component(25, 20, "image/sound.png", 20, 20, "image");
    offSound = new component(25, 20, "image/no_sound.png", 20, 20, "image");
    flappy_bird = new component(25, 20, "image/flappy_bird_red.png", 70, 120, "image");
    flappy_bird.gravity = 0.05;
    choose_flappy_bird_red = new component(25, 20, "image/flappy_bird_red.png", 410, 10, "image");
    choose_flappy_bird_yellow = new component(29, 22, "image/flappy_bird_yellow.png", 440, 9, "image");
    myScore = new component("25px", "Consolas", "black", 220, 35, "text");
    myBestScore = new component("15px", "Consolas", "black", 318, 182, "text");
    myContemporaryScore = new component("15px", "Consolas", "black", 315, 142, "text");
    myBackground = new component(656, 270, "image/flappy_bird_background.png", 0, 0, "image");
    getReady = new component(220, 200, "image/start_game_background.png", 120, 35, "image");
    myGameOverBackground = new component(220, 140, "image/game_over_background.png", 140, 60, "image");
    startBtn = new component(43, 25, "image/start_button.png", 232, 215, "image");
    addSoundComponent();
}

function addSoundComponent() {
    mySoundHit = new sound("audio/snd_hit.wav");
    mySoundFlap = new sound("audio/snd_flap.wav");
    mySoundPoint = new sound("audio/snd_point.wav");
    mySoundStart = new sound("audio/snd_start.wav");
    addMedalComponent();
}

function addMedalComponent() {
    goldMedal = new component(40, 40, "image/gold_medal.png", 170, 135, "image");
    silverMedal = new component(40, 40, "image/silver_medal.png", 170, 135, "image");
    bronzeMedal = new component(40, 40, "image/bronze_medal.png", 170, 135, "image");
    startGame();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.type = type;
    this.score = 0;
    this.bestScore = 0;
    this.width = width;
    this.height = height;
    this.gravity = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottomOrUp();
    }
    this.hitBottomOrUp = function() {
        var rockbottom = myGameArea.canvas.height - CRASH_GROUND;
        var rocktop = 0;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            gameOver();
            return;
        } else if (this.y < rocktop) {
            this.y = rocktop;
            gameOver();
            return;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (flappy_bird.crashWith(myObstacles[i])) {
            gameOver();
            return;
        }
    }
    myGameArea.clear();
    switch (state.current) {
        case state.getReady:
            myBackground.update();
            getReady.update();
            updateSoundView();
            choose_flappy_bird_yellow.update();
            choose_flappy_bird_red.update();
            return;
        case state.game:
            myBackground.update();
            break;
    }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(140)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 100;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 90;
        maxGap = 110;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(20, height, "image/pipe.png", x, 0, "image"));
        myObstacles.push(new component(25, 20, "image/top_pipe.png", x - 2.5, height, "image"));
        myObstacles.push(new component(25, 20, "image/top_pipe.png", x - 2.5, height + gap - 20, "image"));
        myObstacles.push(new component(20, x - height - gap - 258, "image/pipe.png", x, height + gap, "image"));
        if (flappy_bird.x >= myObstacles[0].x) {
            mySoundPoint.play();
            myScore.score += 1;
        }
    }
    if (myObstacles[0].x <= -25) {
        myObstacles.shift();
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 1;
        myObstacles[i].update();
    }
    flappy_bird.newPos();
    flappy_bird.update();
    myScore.text = myScore.score;
    myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function updateSoundView() {
    if (soundEnabled)
        onSound.update();
    else
        offSound.update();
}

myGameArea.canvas.addEventListener("click", function(event) {
    let clickX = event.offsetX;
    let clickY = event.offsetY;

    switch (state.current) {
        case state.getReady:
            if (clickX >= onSound.x && clickX <= onSound.x + onSound.width && clickY >= onSound.y && clickY <= onSound.y + onSound.height) {
                soundEnabled = !soundEnabled;
                updateSoundView();
            } else {
                state.current = state.game;
                mySoundStart.play();
            }
            if (clickX >= choose_flappy_bird_red.x && clickX <= choose_flappy_bird_red.x + choose_flappy_bird_red.width && clickY >= choose_flappy_bird_red.y && clickY <= choose_flappy_bird_red.y + choose_flappy_bird_red.height) {
                flappy_bird.image.src = "image/flappy_bird_red.png"
                isBirdRed = true;
            }
            if (clickX >= choose_flappy_bird_yellow.x && clickX <= choose_flappy_bird_yellow.x + choose_flappy_bird_yellow.width && clickY >= choose_flappy_bird_yellow.y && clickY <= choose_flappy_bird_yellow.y + choose_flappy_bird_yellow.height) {
                flappy_bird.image.src = "image/flappy_bird_yellow.png"
                isBirdRed = false;
            }
            break;
        case state.game:
            mySoundFlap.play();
            flappy_bird.speedY -= 2.5;
            break;
        case state.over:
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.width && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.height) {
                myObstacles = [];
                flappy_bird.speedY = 0;
                myScore.score = 0;
                addImgOrTextComponent();
            }
            break;
    }
});

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        if (!soundEnabled)
            return;

        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

function checkWhichMedal(scoreMedal) {
    if (scoreMedal <= 5) {
        bronzeMedal.update();
    } else if (scoreMedal <= 10) {
        silverMedal.update();
    } else {
        goldMedal.update();
    }
}

function gameOver() {
    mySoundHit.play();
    myGameOverBackground.update()
    var best = localStorage.getItem('bestScore') || 0;
    if (myScore.score > best) {
        localStorage.setItem('bestScore', myScore.score);
        myBestScore.text = myScore.score;
    } else {
        myBestScore.text = best;
    }
    myContemporaryScore.text = myScore.score;
    myContemporaryScore.update();
    myBestScore.update();
    startBtn.update();
    checkWhichMedal(myScore.score);
    myGameArea.stop();
    state.current = state.over;
}