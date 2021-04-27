import Phaser from './lib/phaser.js'

export default class Ball extends Phaser.GameObjects.Rectangle {
  vector
  /** @type {Phaser.Scene} */
  scene

  constructor(scene, x, y, width, height, fillColor){
    super(scene, x, y, width, height, fillColor)
    scene.add.existing(this);
    this.vector = {
      x: Phaser.Math.RND.weightedPick([-2,2]),
      y: 4
    }
    this.scene = scene
  }

  update(){
    this.x += this.vector.x
    this.y += this.vector.y
    if (this.x<this.width/2 || this.x>(this.scene.sys.game.canvas.width-this.width/2)){
      this.vector.x = -this.vector.x
    }
    if (this.y<this.height/2){
      this.vector.y = -this.vector.y
    }
  }

  collide(){
    this.vector.y = -this.vector.y
  }
}
