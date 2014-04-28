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

  this.game.input.keyboard.addCallbacks(this, this.onDownHandler, this.onUpHandler);
  this.animations.add('running', pAnimations.running, 24, true, false);
  this.animations.add('climbing', pAnimations.climbing, 6, true, false);
  this.animations.add('swimming', pAnimations.swimming, 3, true, false);
  this.anchor.setTo(0.5, 0.5);
  this.frameName = 'p1_stand.png';

  this.states = {
    'standing': new StandingState(),
    'ducking': new DuckingState(),
    // 'jumping': new JumpingState(),
    'climbing': new ClimbingState(),
  };
  this.activeState = 'standing';
  // Attributes
  this.baseSpeed = 0.2;
  this.speed = this.baseSpeed;
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

Player.prototype.reduceAir = function(reduction) {
  this.air -= reduction;
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
  if(entity.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
    entity.y++;
  }
  else if(entity.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
    entity.y--;
  }

  if(entity.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    entity.x -= entity.speed;
    entity.scale.x = -1;
    entity.animations.play('running');
  }
  else if(entity.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
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
    // if colliding with a climbable object
    entity.transitionState('climbing');
    // otherwise just jump
    // entity.transitionState('jump');
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

DuckingState.prototype.enter = function(entity, oldState) {
  entity.frameName = 'p1_duck.png';
};

DuckingState.prototype.onUp = function(entity, e) {
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
  if(e.keyCode === Phaser.Keyboard.UP || e.keyCode === Phaser.Keyboard.W) {
    entity.transitionState('standing');
  }
};

module.exports = Player;

