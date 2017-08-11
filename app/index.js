import 'pixi.js'

import Particle from './graphic/Particle'
import styles from './styles/main.css'

let width = window.innerWidth
let height = window.innerHeight

const renderer = PIXI.autoDetectRenderer(width, height, {
  transparent: true
})
const stage = new PIXI.Container()

let sparks = []

document.body.appendChild(renderer.view)

const updateSparks = () => {
  for (let s of sparks) {
    s.applyGravity(0.01)
    s.update()
  }

  let j = 0
  for (let i = 0; i < sparks.length; i++) {
    const spark = sparks[i]
    if (spark.isAlive()) {
      sparks[j] = spark
      j += 1
    } else {
      stage.removeChild(spark.sprite)
      spark.sprite.destroy()
    }
  }
  sparks.length = j
}

const loop = () => {
  requestAnimationFrame(loop)
  updateSparks()
  renderer.render(stage)
}
loop()

const createCircleSprite = (pos, size = 1) => {
  const graphic = new PIXI.Graphics()
  graphic.beginFill(0xFBCC88, 0.9)
  graphic.lineStyle(0)
  graphic.drawCircle(pos.x, pos.y, size)
  graphic.endFill()
  const sprite = new PIXI.Sprite(graphic.generateCanvasTexture())
  sprite.anchor.set(0.5)
  return sprite
}

const createSpark = (pos, vel) => {
  const sprite = createCircleSprite(pos)
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  return new Particle(sprite, vel)
}

const spawnSpark = (pos, vel) => {
  const spark = createSpark(pos, vel)
  stage.addChild(spark.sprite)
  sparks.push(spark)
}

const createVelocityVector = (mag = 1.0) => {
    let vx = Math.random() * 2 - 1
    let vy = Math.random() * 2 - 1

    const tmy = Math.sqrt(1 - vx * vx)
    if (tmy < Math.abs(vy)) {
      vy = 0 < vy ? tmy : -tmy
    }
    return {x: mag * vx, y: mag * vy}
}

const explode = (pos) => {
  const steps = 300
  for (let i = 0; i < steps; i++) {
    const vel = createVelocityVector(2.0)
    spawnSpark(pos, vel)
  }
}

window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.resize(w, h)
})

window.addEventListener('click', e => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  }
  explode(pos)
})
