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