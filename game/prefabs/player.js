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
    'jumping': new JumpingState(),
    'climbing': new ClimbingState(),
  };
  this.activeState = 'standing';
  // Attributes
  this.air = 100;
  this.baseSpeed = 150;
  this.speed = this.baseSpeed;
  this.doubleJump = true;

  this.game.physics.arcade.enableBody(this);
  this.body.linearDamping = 1;
  this.body.collideWorldBounds = true;
  this.airTickTimer = game.time.events.loop(2500, this.reduceAir, this);
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
};

Player.prototype.reduceAir = function() {
  var reduction = 10;
  var x = this.body.position.x;
  if(x > 750) {
    reduction += ((x - 750) / 1000);
  }
  if(this.air > 0) {
    this.air -= reduction;
  }
  else {
    this.damage(reduction * .01);
  }
  console.log(this.health, this.air);
};

Player.prototype.jump = function() {
  this.body.velocity.y = -400;
};

Player.prototype.canClimb = function() {
  // TODO: Expand the search for a climbable object 1 to the left and right
  var map = this.game.state.states.play.map;
  var curTile = map.getTileWorldXY(this.position.x,this.position.y, 70, 70, 'Meta');
  if(curTile){
    var metaLayer = _.find(map.tilesets, {'name': 'meta_tiles'});
    var tileData = metaLayer.tileProperties[curTile.index - metaLayer.firstgid];
    if(tileData.meta === "1") {
      return curTile;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
};

Player.prototype.canJump = function() {
  if(this.activeState === 'jumping') {
    if(this.doubleJump && !this.states['jumping'].alreadyDoubleJumped){
      return true;
    }
    else {
      return false;
    }
  }
  else if(this.body.onFloor()) {
    return true;
  }
  return false;
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
  entity.body.velocity.x = 0;
  if(entity.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
    entity.y++;
  }
  else if(entity.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
    // entity.y--;
    entity.jump();
  }

  if(entity.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    entity.body.velocity.x = -entity.speed;
    entity.scale.x = -1;
    entity.animations.play('running');
  }
  else if(entity.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
            entity.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    entity.body.velocity.x = entity.speed;
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
    var climbable = entity.canClimb();
    if(climbable){
      entity.transitionState('climbing');
      entity.position.x = climbable.worldX + 35;
    }
    else if(entity.canJump()){
      entity.transitionState('jumping');
    }
    // otherwise just jump
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
  entity.body.velocity.x = 0;
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

ClimbingState.prototype.update = function(entity) {
  if (entity.canClimb()) {
    entity.body.velocity.y = -150;
  }
  else {
    entity.transitionState('standing');
  }
};

ClimbingState.prototype.enter = function (entity, oldState) {
  entity.body.allowGravity = false;
  entity.animations.play('climbing');
};

ClimbingState.prototype.leave = function(entity, newState) {
  entity.body.allowGravity = true;
  entity.animations.stop('climbing');
};

ClimbingState.prototype.onUp = function(entity, e) {
  if(e.keyCode === Phaser.Keyboard.UP || e.keyCode === Phaser.Keyboard.W) {
    entity.transitionState('standing');
  }
};


var JumpingState = function () {
  this.alreadyDoubleJumped = false;
};
JumpingState.prototype = new EntityState();
JumpingState.prototype.constructor = JumpingState;

JumpingState.prototype.enter = function(entity, oldState) {
  this.alreadyDoubleJumped = false;
  entity.jump();
  entity.frameName = 'p1_jump.png';
};

JumpingState.prototype.update = function(entity) {
  if(entity.body.onFloor()){
    entity.transitionState('standing');
  }
  else {
    if(entity.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
    entity.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      entity.body.velocity.x = -entity.speed;
      entity.scale.x = -1;
    }
    else if(entity.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
    entity.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      entity.body.velocity.x = entity.speed;
      entity.scale.x = 1;
    }
  }
};

JumpingState.prototype.onDown = function(entity, e) {
  if(e.keyCode === Phaser.Keyboard.UP || e.keyCode === Phaser.Keyboard.W) {
    if(entity.canJump()){
      this.alreadyDoubleJumped = true;
      entity.jump();
    }
  }
};

module.exports = Player;

