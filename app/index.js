import 'pixi.js'
import Stats from 'stats.js'

import Spark from './graphic/Spark'
import styles from './styles/main.css'

let width = window.innerWidth
let height = window.innerHeight

const app = new PIXI.Application({
  width,
  height,
  transparent: false
})

document.body.appendChild(app.renderer.view)

const fireworkContainer = new PIXI.particles.ParticleContainer(10000, {
  scale: false,
  position: true,
  rotation: false,
  uvs: false,
  alpha: true
})

app.stage.addChild(fireworkContainer)

let sparks = []

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
      fireworkContainer.removeChild(spark.sprite)
      spark.sprite.destroy()
    }
  }
  sparks.length = j
}

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const graphic = new PIXI.Graphics()
graphic.beginFill(0xFBCC88, 0.9)
graphic.lineStyle(0)
graphic.drawCircle(0.0, 0.0, 10.0)
graphic.endFill()
const circleTexture = graphic.generateCanvasTexture()

const createCircleSprite = (pos, size = 1) => {
  const sprite = new PIXI.Sprite(circleTexture)
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  sprite.scale.set(size / 10.0)
  sprite.anchor.set(0.5)
  return sprite
}

const createSpark = (pos, vel) => {
  const size = 1 + Math.random()
  const sprite = createCircleSprite(pos, size)
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  return new Spark(sprite, vel)
}

const spawnSpark = (pos, vel) => {
  const spark = createSpark(pos, vel)
  fireworkContainer.addChild(spark.sprite)
  sparks.push(spark)
}

const createVelocityVector = (mag = 1.0) => {
  const vx = Math.random() * 2 - 1
  let vy = Math.random() * 2 - 1
  const tmy = Math.sqrt(1 - vx * vx)
  if (tmy < Math.abs(vy)) {
    vy = 0 < vy ? tmy : -tmy
  }
  return {
    x: mag * vx,
    y: mag * vy
  }
}

const explode = (pos) => {
  const steps = 300
  for (let i = 0; i < steps; i++) {
    const vel = createVelocityVector(2.0)
    spawnSpark(pos, vel)
  }
}

app.ticker.add(delta => {
  stats.begin()
  updateSparks()
  stats.end()
})

window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  app.renderer.resize(w, h)
})

window.addEventListener('click', e => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  }
  explode(pos)
})
