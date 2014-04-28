var Player = require('../prefabs/player');

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;

      // this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      // this.sprite.events.onInputDown.add(this.clickListener, this);

      // this.map = this.game.add.tilemap('purplemap');
      // this.map.addTilesetImage('purple');
      // this.firstLayer = this.map.createLayer('Ground');
      // this.firstLayer.resizeWorld();

      this.tilemapJson = this.game.cache.getJSON('tilemap');
      this.tilemapSpawns = _.find(this.tilemapJson.layers, { 'name': 'Spawns'});



      this.map = this.game.add.tilemap('base');
      this.map.addTilesetImage('tiles', 'tiles');
      this.map.addTilesetImage('items_spritesheet', 'items');
      this.map.addTilesetImage('buildings', 'buildings');
      this.map.addTilesetImage('winter', 'winter');
      this.map.addTilesetImage('meta_tiles', 'meta');
      this.bgTerrainLayer = this.map.createLayer('Bg Terrain');
      this.terrainLayer = this.map.createLayer('Terrain');
      this.decorationLayer = this.map.createLayer('Decoration Layer');
      this.collisionLayer = this.map.createLayer('Collision');
      this.metaLayer = this.map.createLayer('Meta');
      this.terrainLayer.resizeWorld();

      this.metaLayer.visible = false;
      this.collisionLayer.visible = false;

      console.log(this.collisionLayer);

      this.map.setCollisionBetween(65,66, true, this.collisionLayer);
      this.player = new Player(this.game, 0, 0);
      this.game.add.existing(this.player)
      this.game.physics.arcade.gravity.y = 1000;
      this.spawnPlayer();

      window.player = this.player;
      // Meta tile properties
      // 1 - Climbable
      // 2 - Collectible
      // 3 - Interactible
      // 4 - Killzone

      this.game.camera.follow(this.player);
    },
    update: function() {
      this.game.physics.arcade.collide(this.player, this.collisionLayer);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    },
    spawnPlayer: function () {
      console.log(this.tilemapSpawns);
      var playerSpawns = _.select(this.tilemapSpawns.objects, { 'name': 'Player Spawn'});
      var playerSpawn = _.find(playerSpawns, function(spawn) {
        return Math.round(Math.random()) === 1;
      }) || playerSpawns[0];
      var x = Math.random() * playerSpawn.width + playerSpawn.x;
      var y = Math.random() * playerSpawn.height + playerSpawn.y;
      this.player.reset(x,y);
      console.log(playerSpawn);
    }
  };

  module.exports = Play;