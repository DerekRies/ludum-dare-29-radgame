(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1200, 760, Phaser.AUTO, 'rad-game');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var pAnimations = {
  'running': [
    'p1_walk01.png',
    'p1_walk02.png',
    'p1_walk03.png',
    'p1_walk04.png',
    'p1_walk05.png',
    'p1_walk06.png',
    'p1_walk07.png',
    'p1_walk08.png',
    'p1_walk09.png',
    'p1_walk10.png',
    'p1_walk11.png'
  ],

  'climbing': [
    'p1_climb1.png',
    'p1_climb2.png'
  ],

  'swimming': [
    'p1_swim1.png',
    'p1_swim2.png'
  ]
};

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'p1');

  this.animations.add('running', pAnimations.running, 24, true, false);
  this.animations.add('climbing', pAnimations.climbing, 6, true, false);
  this.animations.add('swimming', pAnimations.swimming, 3, true, false);
  this.anchor.setTo(0.5, 0.5);

  this.frameName = 'p1_stand.png';
  this.speed = 0.2;
  this.states = {
    'standing': new StandingState(),
    'ducking': new DuckingState(),
    // 'jumping': new JumpingState(),
    'climbing': new ClimbingState(),
  };
  this.activeState = 'standing';
  this.game.input.keyboard.addCallbacks(this, this.onDownHandler, this.onUpHandler);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.onDownHandler = function(input) {
  this.states[this.activeState].onDown(this, input);
};

Player.prototype.onUpHandler = function(input) {
  this.states[this.activeState].onUp(this, input);
};

Player.prototype.update = function() {
  this.states[this.activeState].update(this);
/*
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    this.x-= this.speed;
    this.scale.x = -1;
    this.animations.play('running');
  }
  else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
    this.x += this.speed;
    this.scale.x = 1;
    this.animations.play('running');
  }
  else {
    // this.animations.stop('running');
    // this.frameName = 'p1_stand.png';
    this.animations.play('swimming');
  }

  if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    this.y -= 0.1;
    this.frameName = 'p1_jump.png';
  }
  else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
    this.y += 0.1;
    this.frameName = 'p1_duck.png';
  }*/
};

Player.prototype.transitionState = function(newState) {
  this.states[this.activeState].leave(this, newState);
  this.states[newState].enter(this, this.activeState);
  this.activeState = newState;
};


var EntityState = function () {};
EntityState.prototype.update = function(entity) {};
EntityState.prototype.leave = function(entity, newState) {};
EntityState.prototype.enter = function(entity, oldState) {};
EntityState.prototype.onDown = function(entity, input) {};
EntityState.prototype.onUp = function(entity, input) {};


var StandingState = function () {};
StandingState.prototype = new EntityState();
StandingState.prototype.constructor = StandingState;
StandingState.prototype.update = function(entity) {
  function left () {
    return entity.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.A);
  }
  function right () {
    return entity.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.D);
  }
  if(left()) {
    entity.x -= entity.speed;
    entity.scale.x = -1;
    entity.animations.play('running');
  }
  else if(right()) {
    entity.x += entity.speed;
    entity.scale.x = 1;
    entity.animations.play('running');
  }
  else {
    entity.animations.stop('running');
    entity.frameName = 'p1_stand.png';
  }
};

StandingState.prototype.onDown = function(entity, e) {
  if(e.keyCode === Phaser.Keyboard.UP || e.keyCode === Phaser.Keyboard.W) {
    entity.transitionState('climbing');
  }
  if(e.keyCode === Phaser.Keyboard.DOWN || e.keyCode === Phaser.Keyboard.S) {
    entity.transitionState('ducking');
  }
};

StandingState.prototype.leave = function(entity, newState) {
  entity.animations.stop('running');
};
StandingState.prototype.enter = function(entity, oldState) {
  entity.frameName = 'p1_stand.png';
};


var DuckingState = function () {};
DuckingState.prototype = new EntityState();
DuckingState.prototype.constructor = DuckingState;
DuckingState.prototype.update = function(entity) {
  // body...
};

DuckingState.prototype.enter = function(entity, oldState) {
  entity.frameName = 'p1_duck.png';
};

DuckingState.prototype.onUp = function(entity, e) {
  console.log(e);
  if(e.keyCode === Phaser.Keyboard.DOWN || e.keyCode === Phaser.Keyboard.S) {
    entity.transitionState('standing');
  }
};

var ClimbingState = function () {};
ClimbingState.prototype = new EntityState();
ClimbingState.prototype.constructor = ClimbingState;

ClimbingState.prototype.enter = function (entity, oldState) {
  entity.animations.play('climbing');
};

ClimbingState.prototype.leave = function(entity, newState) {
  entity.animations.stop('climbing');
};

ClimbingState.prototype.onUp = function(entity, e) {
  console.log(e);
  if(e.keyCode === Phaser.Keyboard.UP || e.keyCode === Phaser.Keyboard.W) {
    entity.transitionState('standing');
  }
};

module.exports = Player;


},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Beneath the Surface', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],6:[function(require,module,exports){
var Player = require('../prefabs/player');
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      // this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;

      // this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      // this.sprite.events.onInputDown.add(this.clickListener, this);

      var x = this.game.width/2,
          y = this.game.height/2;
      // this.player = new Player(this.game, x, y);
      this.player = new Player(this.game, x, y);
      this.game.add.existing(this.player)
      window.player = this.player;
      console.log(this);

    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
},{"../prefabs/player":2}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    // this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    // this.load.image('yeoman', 'assets/yeoman-logo.png');
    // this.load.image('player', 'assets/Player/p1_front.png');
    // this.load.spritesheet('p1', 'assets/Player/p1_spritesheet.png', 72, 97)
    this.load.atlasJSONArray('p1', 'assets/greenalien.png', 'assets/greenalien.json');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])