// "use strict";

let game = new Phaser.Game(280, 512, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

var bird;
let upKey;
var spacebar;
var ground;

let playing = false;
let startButton;

let pipesGroup;
let gapsGroup;
let nextPipes;
let currentPipe;

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
  game.load.image("pipeTop", "img/pipe-top.png");
  game.load.image("pipeBottom", "img/pipe-bottom.png");
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


  gapsGroup = game.physics.add.group();
  pipesGroup = game.physics.add.group();
  scoreboardGroup = game.physics.add.staticGroup();


}

function update() {

  game.physics.arcade.collide(bird, ground, gameOver);
  ground.body.immovable = true;


  if (spacebar.justDown) {
    upBird();
  }

  pipesGroup.children.iterate(function (child) {
    if (child == undefined) return;

    if (child.x < -50) child.destroy();
    else child.setVelocityX(-100);
  });

  gapsGroup.children.iterate(function (child) {
    child.body.setVelocityX(-100);
  });

  nextPipes++;
  if (nextPipes === 130) {
    makePipes(game.game.games[0]);
    nextPipes = 0;
  }
}


// завантаження нової гри 

function prepareGame() {
  framesMoveUp = 0
  nextPipes = 0
  currentPipe = assets.obstacle.pipe.green
  score = 0
  gameOver = false
  backgroundDay.visible = true
  backgroundNight.visible = false
  messageInitial.visible = true

  birdName = getRandomBird()
  player = game.physics.add.sprite(60, 265, birdName)
  player.setCollideWorldBounds(true)
  player.anims.play(getAnimationBird(birdName).clapWings, true)
  player.body.allowGravity = false

  game.physics.add.collider(player, ground, hitBird, null, game)
  game.physics.add.collider(player, pipesGroup, hitBird, null, game)

  game.physics.add.overlap(player, gapsGroup, updateScore, null, game)

  ground.anims.play(assets.animation.ground.moving, true)
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

  // makePipes();
}

function makePipes() {
  if (!gameStarted || gameOver) return;

  const pipeTopY = Phaser.Math.Between(-120, 120);

  const gap = game.add.line(288, pipeTopY + 210, 0, 0, 0, 98);
  gapsGroup.add(gap);
  gap.body.allowGravity = false;
  gap.visible = false;

  const pipeTop = pipesGroup.create(288, pipeTopY, currentPipe.top);
  pipeTop.body.allowGravity = false;

  const pipeBottom = pipesGroup.create(288, pipeTopY + 420, currentPipe.bottom);
  pipeBottom.body.allowGravity = false;
}



