// "use strict";

let game = new Phaser.Game(280, 512, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
  restartGame: restartGame,
});

var bird;
let upKey;
var spacebar;
var ground;

let playing = false;
let startButton;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  // ініціалізуємо елементи
  game.load.image("bird", "img/bird.png");
  game.load.image("ground", "img/ground.png");
  game.load.spritesheet("button", "img/button.png");
  game.load.image("background", "img/background.png");

  // Pipes
  game.load.image("pipe", "img/pipe-bottom.png");
}

function create() {
  // відображаємо елементи на екрані

  // фон
  background = game.add.sprite(
    game.world.width * 0,
    game.world.height * 0,
    "background"
  );

  // пташка
  bird = game.add.sprite(
    game.world.width * 0.4,
    game.world.height * 0.5,
    "bird"
  );

  // земля
  ground = game.add.sprite(
    game.world.width * 0,
    game.world.height - 50,
    "ground"
  );

  // кнопка "розпочати гру"
  startButton = game.add.button(
    game.world.width * 0.5,
    game.world.height * 0.5,
    "button",
    startGame,
    this,
    1,
    0,
    2
  );
  startButton.anchor.set(0.5);

  // додаємо елементи у фізичну систему
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(bird);
  game.physics.arcade.enable(ground);

  // труби
  pipes = game.add.group(); //สร้าง gorup
  pipes.enableBody = true; //เพิ่ม physics ให้กับ group

  //createMultiple(quantity, key, frame, exists)
  pipes.createMultiple(20, "pipe"); //สร้าง pide 20 อัน
  //หน่วงเวลาไว้ 1.6 วินาที

  // timer = game.time.events.loop(Phaser.Timer.SECOND * 2, addLongPipes, this);

  // івент підскок пташки при натисканні на пробіл
  spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

  // // івент підскок пташки при натисканні на клавішу вгору
  // upKey = game.input.keyboard.addKey(Phaser.KeyCode._onKeyUp);

  // завершення гри
  bird.checkWorldBounds = true;
  bird.events.onOutOfBounds.add(function () {
    alert("Game over!");
    location.reload();
  }, this);
}

function update() {
  game.physics.arcade.collide(bird, ground, gameOver);
  ground.body.immovable = true;

  if (spacebar.justDown) {
    upBird();
  }
}

// перезавантаження гри = почати наново
function restartGame() {
  game.time.events.remove(timer);

  game.state.startGame();
}

// функція завершення гри
function gameOver() {
  alert("Game over!");
  location.reload();
}

function upBird() {
  bird.body.velocity.set(0, -250);
}

// функція початку гри
function startGame() {
  startButton.destroy();
  bird.body.gravity.y = 1000;
  playing = true;
}

function addShotPipe(x, y) {
  var pipe = this.pipes.getFirstDead();
  pipe.reset(x, y);
  pipe.body.velocity.x = -200;

  pipe.checkWorldBounds = true;
  pipe.outOfBoundsKill = true;
}

function addLongPipes() {
  //สุ่มตำแหน่ง
  var blank = Math.floor(Math.random() * 5) + 1;
  //สร้าง pipe 8 อัน
  for (var i = 0; i < 8; i++) {
    //ตำแหน่งที่สุ่มและบวกหนึ่งจะไม่แสดง pipe
    if (i != blank && i != blank + 1) {
      //แสดง pipe
      addShotPipe(400, i * 60 + 10);
    }
  }
}
