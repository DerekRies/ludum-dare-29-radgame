
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
    this.load.tilemap('purplemap', 'assets/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('purple', 'assets/purple.png');
    this.load.json('tilemap', 'assets/tilemaps/base.json');

    // All the base map resources
    this.load.tilemap('base', 'assets/tilemaps/base.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('items', 'assets/tilemaps/items_spritesheet.png');
    this.load.image('winter', 'assets/tilemaps/winter.png');
    this.load.image('buildings', 'assets/tilemaps/buildings.png');
    this.load.image('tiles', 'assets/tilemaps/tiles.png');
    this.load.image('meta', 'assets/tilemaps/meta_tiles.png');
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
