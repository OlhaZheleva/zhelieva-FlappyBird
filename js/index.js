// "use strict";

let game = new Phaser.Game(400, 500, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

var bird;
let upKey;
var spacebar;
var ground;
var pipes;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "#87CEEB";

  // ініціалізуємо елементи
  game.load.image("bird", "img/bird.png");
  game.load.image("button", "img/up.png", 40, 40);
  game.load.image("pipe", "img/pipe.png");
  game.load.image("ground", "img/ground.png");
}

function create() {
  // відображаємо елементи на екрані
  // пташка
  bird = game.add.sprite(
    game.world.width * 0.4,
    game.world.height * 0.5,
    "bird"
  );

  // земля
  ground = game.add.sprite(
    game.world.width * 0,
    game.world.height * 0,
    "ground"
  );

  // додаємо елементи у фізичну систему
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(bird);
  game.physics.arcade.enable(ground);

  bird.body.gravity.y = 1000;

  pipes = game.add.group();
  pipes.enableBody = true;
  pipes.createMultiple(20, "pipe");

  timer = game.time.events.loop(1600, addLongPipes);

  // івент підскок пташки при натисканні на пробіл
  spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  spacebar.onDown.add(upBird(), this);

  // івент підскок пташки при натисканні на клавішу вгору
  upKey = game.input.keyboard.addKey(Phaser.KeyCode.UP);
  upKey.onDown.add(upBird(), this);

  // // завершення гри
  // bird.checkWorldBounds = true;
  // bird.events.onOutOfBounds.add(function () {
  //   alert("Game over!");
  //   location.reload();
  // }, this);
}

function update() {
  game.physics.arcade.collide(bird, ground);
  ground.body.immovable = true;

  if (spacebar.justDown) {
    upBird();
  } else if (upKey.justDown) {
    upBird();
  }
}

function upBird() {
  bird.body.velocity.set(0, -250);
}

function addShotPipe(x, y) {
  var pipe = this.pipes.getFirstDead();
  pipe.reset(x, y);
  pipe.body.velocity.x = -200;
  pipe.checkWorldBounds = true;
  pipe.outOfBoundsKill = true;
}

function addLongPipes() {
  var blank = Math.floor(Math.random() * 5) + 1;
  for (var i = 0; i < 8; i++) {
    if (i != blank && i != blank + 1) {
      this.addShotPipe(400, i * 60 + 10);
    }
  }
}
