class Particle {

  constructor(sprite, vel) {
    this.sprite = sprite
    this.vel = vel || {
      x: 0,
      y: 0
    }
    this.acc = {
      x: 0,
      y: 0
    }

    this.mass = 1.0

    const life = Math.floor(Math.random() * 20) + 80
    this.life = life
    this.maxLife = life
  }

  applyForce(f) {
    this.acc.x += f.x / this.mass
    this.acc.y += f.y / this.mass
  }

  applyGravity(g) {
    this.acc.y += g
  }

  isAlive() {
    return 0 < this.life
  }

  resetLife(val) {
    this.life = val
    this.maxLife = val
  }

  update() {
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y

    this.sprite.position.x += this.vel.x
    this.sprite.position.y += this.vel.y

    // this.vel.x *= this.decayRate
    // this.vel.y *= this.decayRate

    this.acc.x = 0
    this.acc.y = 0

    if (this.maxLife / 2.0 < this.life) {
      this.sprite.alpha -= 0.01
    }
    this.life -= 1
  }

  reset(pos, vel) {
    this.pos = pos
    this.vel = vel
    const life = 100
    this.life = life
    this.maxLife = life
  }
}

export default Particle
