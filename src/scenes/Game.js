import Phaser from '../lib/phaser.js'
import Ball from '../Ball.js'

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors
  /** @type {Phaser.GameObjects.Rectangle} */
  racket
  bricks
  /** @type {Ball} */
  ball
  barriers
  placar
  score
  constructor(){
    super('game')
    this.score = 0
  }

  create(){
    this.racket = this.add.rectangle(
      this.sys.game.canvas.width/2,
      this.sys.game.canvas.height-20, 100, 20, 0xfcaa00).setStrokeStyle(2, 0xfff200)

    this.ball = new Ball(this,
      this.sys.game.canvas.width/2,
      this.sys.game.canvas.height/2, 15, 15, 0xFFFFFF)

    const colors = [0xFF5733, 0xFFB433, 0xF9FF33, 0x33FF60, 0x33FF60, 0x33A1FF, 0x8433FF, 0xE433FF, 0xFF33B8, 0xFF3367];
    for (let i=0; i<10; i++){
      for (let j=0; j<4; j++){
        const barrier = this.add.rectangle(
        48*i+24, 100+32*j, 46, 30, Phaser.Math.RND.weightedPick(colors))
        this.physics.add.existing(barrier, false)
        this.physics.add.overlap(barrier, this.ball, this.barrierball, null, this)
      }
    }
    const style = { color: '#FFF', fontSize: 24 }
    this.placar = this.add.text(240, 10, 'Pontos: 0', style).setOrigin(0.5, 0)

    this.physics.add.existing(this.racket, false)
    this.physics.add.existing(this.ball, false)

    this.physics.add.collider(this.racket, this.ball, this.bounceball, null, this)
    
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update(){
    this.ball.update()
    if (this.cursors.left.isDown && this.racket.x>50){
      this.racket.x -= 5
    }else if (this.cursors.right.isDown && this.racket.x<(this.sys.game.canvas.width-50)){
      this.racket.x += 5
    }
    if (this.ball.y >this.sys.game.canvas.height){
      this.gameOver()
    }
  }

  bounceball(racket, ball){
    if ((ball.x<=(racket.x-racket.width/3) && ball.vector.x>0) || 
        (ball.x>=(racket.x+racket.width/3) && ball.vector.x<0)){
      ball.vector.x = -ball.vector.x
    }
    ball.collide()
  }
  
  barrierball(barrier, ball){
    barrier.destroy()
    ball.collide()
    this.score++
    this.placar.text = `Pontos: ${this.score}`
    if (this.score==40){
      this.gameOver()
    }
  }

  gameOver(){
    const style = { color: '#FFF', fontSize: 48, fontStyle: 'bold' }
    this.add.text(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 'Game Over', style).setOrigin(0.5, 0)
    this.scene.pause()
  }
}