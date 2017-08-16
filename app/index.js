import 'pixi.js'
import Stats from 'stats.js'

import Spark from './graphic/Spark'
import createFireSeed from './graphic/FireSeed'
import styles from './styles/main.css'

let width = window.innerWidth
let height = window.innerHeight

const app = new PIXI.Application({
  width,
  height,
  transparent: false
})
let renderTexture = PIXI.RenderTexture.create(
  app.renderer.width,
  app.renderer.height
)
let renderTexture2 = PIXI.RenderTexture.create(
  app.renderer.width,
  app.renderer.height
)
const outputSprite = new PIXI.Sprite(renderTexture)
outputSprite.alpha = 0.9
app.stage.addChild(outputSprite)

document.body.appendChild(app.renderer.view)

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const fireworkContainer = new PIXI.particles.ParticleContainer(10000, {
  scale: false,
  position: true,
  rotation: false,
  uvs: false,
  alpha: true
})

app.stage.addChild(fireworkContainer)

let seeds = []
let sparks = []

const updateSeeds = (delta) => {
  for (let s of seeds) {
    s.update(delta)
  }
  for (let i = seeds.length - 1; 0 <= i; i--) {
    const seed = seeds[i]
    if (!seed.isAlive()) {
      seeds.splice(i, 1)
      const pos = seed.getPos()
      explode(pos)
      seed.destroy()
    }
  }
}

const updateSparks = () => {
  for (let s of sparks) {
    s.applyGravity(0.015)
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

const graphic = new PIXI.Graphics()
graphic.beginFill(0xFBDDAA, 0.9)
graphic.lineStyle(0)
graphic.drawCircle(0.0, 0.0, 10.0)
graphic.endFill()
const circleTexture = graphic.generateCanvasTexture()

const createCircleSprite = (pos, size = 1) => {
  const sprite = new PIXI.Sprite(circleTexture)
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  sprite.scale.set(size / 20.0)
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
  const noise = 0.2 * Math.random()
  return {
    x: mag * vx,
    y: mag * vy + noise
  }
}

const explode = (pos) => {
  const steps = 400
  for (let i = 0; i < steps; i++) {
    const vel = createVelocityVector(1.0)
    spawnSpark(pos, vel)
  }
}

const center = {
  x: app.renderer.width / 2.0,
  y: app.renderer.height / 2.0
}

let elapsed = Date.now()

app.ticker.add(delta => {
  stats.begin()

  const now = Date.now()
  updateSeeds((now - elapsed) * 0.001)
  elapsed = now

  updateSparks()

  // swap the buffers
  const temp = renderTexture
  renderTexture = renderTexture2
  renderTexture2 = temp
  outputSprite.texture = renderTexture
  app.renderer.render(fireworkContainer, renderTexture2)

  stats.end()
})

window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  app.renderer.resize(w, h)
  width = w
  height = h
})

window.addEventListener('keydown', e => {
  if (32 === e.keyCode) {
    const count = 7
    const span = width / count
    const destY = 0.3 * height
    const vel = {
      x: 0.0,
      y: -1.8
    }
    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      const pos = {
        x: span * i + (span / 2.0),
        y: height
      }
      const delay = 600 * rand
      window.setTimeout(() => {
        const seed = createFireSeed(app.stage, circleTexture, pos, vel, destY)
        seeds.push(seed)
      }, delay)
    }
  }
})

window.addEventListener('click', e => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  }
  explode(pos)
})
