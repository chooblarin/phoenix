import 'pixi-particles'

class FireSeed {

  constructor(destY, vel, emitter) {
    this.destY = destY
    this.vel = vel
    this.emitter = emitter
    this.theta = 0.0
    this._isAlive = true
  }

  update(delta) {
    if (this.emitter.ownerPos.y < this.destY) {
      this._isAlive = false
      return
    }

    this.theta += delta * 16.0

    this.emitter.update(delta)
    this.emitter.updateOwnerPos(
      this.emitter.ownerPos.x + this.vel.x + 0.2 * Math.cos(this.theta),
      this.emitter.ownerPos.y + this.vel.y
    )
  }

  destroy() {
    this.emitter.destroy()
  }

  isAlive() {
    return this._isAlive
  }

  getPos() {
    return {
      x: this.emitter.ownerPos.x,
      y: this.emitter.ownerPos.y
    }
  }
}

const emitterOption = {
  "alpha": {
    "start": 0.8,
    "end": 0.02
  },
  "scale": {
    "start": 0.2,
    "end": 0.001,
    "minimumScaleMultiplier": 1
  },
  "color": {
    "start": "#e3f9ff",
    "end": "#0ec8f8"
  },
  "speed": {
    "start": 1,
    "end": 0,
    "minimumSpeedMultiplier": 1
  },
  "acceleration": {
    "x": 0,
    "y": 0
  },
  "maxSpeed": 0,
  "startRotation": {
    "min": 0,
    "max": 0
  },
  "noRotation": false,
  "rotationSpeed": {
    "min": 0,
    "max": 0
  },
  "lifetime": {
    "min": 1,
    "max": 3
  },
  "blendMode": "normal",
  "frequency": 0.02,
  "emitterLifetime": -1,
  "maxParticles": 1000,
  "pos": {
    "x": 0,
    "y": 0
  },
  "addAtBack": false,
  "spawnType": "point"
}

function createFireSeed(container, texture, pos, vel, destY) {
  const emitter = new PIXI.particles.Emitter(container, [texture], emitterOption)
  emitter.updateOwnerPos(pos.x, pos.y)
  return new FireSeed(destY, vel, emitter)
}

export default createFireSeed
