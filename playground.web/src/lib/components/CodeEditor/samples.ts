export const asSample = `
// ============================================================
//  Infinite Top-Down .io Shooter  —  AssemblyScript / Codetoy
// ============================================================

import {
  fill, stroke, rect, circle, line,
  font, text, measureText,
  push, pop, translate, resetTransform,
  lineWidth, beginPath, moveTo, lineTo,
  closePath, fillPath, strokePath
} from "codetoy/canvas"
import * as screen from "codetoy/screen"
import * as input from "codetoy/input"
import { deltaTime, elapsedTime } from "codetoy/time"

// ─────────────────────────── Constants ───────────────────────────

const WALL_T: f64 = 16.0
const BULLET_SPEED: f64 = 480.0
const BULLET_TTL: f64 = 2.2
const BULLET_R: f64 = 5.0
const PLAYER_R: f64 = 14.0
const ENEMY_R: f64 = 13.0
const PLAYER_SPEED: f64 = 220.0
const IFRAMES: f64 = 0.8
const MAX_BULLETS: i32 = 200
const MAX_PARTICLES: i32 = 180
const LASER_RANGE: f64 = 1200.0
const HEALTH_PICKUP_R: f64 = 10.0
const RALLY_HP_THRESHOLD: f64 = 0.30

// ── Upgrade / dash constants ──────────────────────────────────────
const DASH_DURATION: f64 = 0.18      // seconds of dash movement
const DASH_SPEED_MUL: f64 = 5.2      // speed multiplier while dashing
const DASH_RECHARGE: f64 = 3.5       // seconds per charge refill
const DASH_IFRAMES: f64 = 0.22       // invincibility during dash
const POISON_DURATION: f64 = 3.0     // seconds of poison DoT
const POISON_DPS: f64 = 6.0          // damage per second from poison

// Upgrade IDs (match BOSS_NAME index)
const UPG_MAX_HP: i32 = 0      // Crimson — +40 max HP
const UPG_FIRE_RATE: i32 = 1   // Azure   — faster fire rate
const UPG_POISON: i32 = 2      // Venom   — poison bullets
const UPG_DASH: i32 = 3        // Void    — unlock dash (3 charges)
const UPG_DASH_PLUS: i32 = 4   // Solar   — +1 dash charge

// game states
const GS_MENU: i32 = 0
const GS_PLAYING: i32 = 1
const GS_ROOM_CLEAR: i32 = 2
const GS_GAME_OVER: i32 = 3

// enemy roles
const ROLE_GRUNT: i32 = 0
const ROLE_FLANKER: i32 = 1
const ROLE_SNIPER: i32 = 2
const ROLE_TANK: i32 = 3
const ROLE_TURRET: i32 = 4
const ROLE_BOSS: i32 = 5

// AI States
const AI_PATROL: i32 = 1
const AI_CHASE: i32 = 2
const AI_RALLY: i32 = 4
const AI_SEARCH: i32 = 5

// room part types
const PART_START: i32 = 0
const PART_CORRIDOR: i32 = 1
const PART_ARENA: i32 = 2
const PART_CROSS: i32 = 3
const PART_WIDE: i32 = 4
const PART_END: i32 = 5
const PART_BUNKER: i32 = 6
const PART_PILLBOX: i32 = 7
const PART_HALL: i32 = 8
const PART_KEY: i32 = 9

// Boss room theme colours — [r, g, b] packed as 3 separate arrays
// Index 0=Crimson, 1=Azure, 2=Venom, 3=Void, 4=Solar
const BOSS_CR: f64[] = [220.0, 40.0, 30.0, 160.0, 255.0]
const BOSS_CG: f64[] = [30.0, 130.0, 200.0, 40.0, 180.0]
const BOSS_CB: f64[] = [40.0, 255.0, 60.0, 220.0, 0.0]
const BOSS_NAME: string[] = ["CRIMSON", "AZURE", "VENOM", "VOID", "SOLAR"]

// ─────────────────────────── Math helpers ────────────────────────

function dist(ax: f64, ay: f64, bx: f64, by: f64): f64 {
  const dx = ax - bx; const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}
function clamp(v: f64, lo: f64, hi: f64): f64 {
  return v < lo ? lo : (v > hi ? hi : v)
}
function lerp(a: f64, b: f64, t: f64): f64 { return a + (b - a) * t }

function castRayWalls(rx: f64, ry: f64, rdx: f64, rdy: f64,
  walls: Wall[], maxT: f64): f64 {
  var best = maxT
  for (let i = 0; i < walls.length; i++) {
    const w = walls[i]
    var tmin: f64 = 0.0; var tmax: f64 = best
    if (Math.abs(rdx) > 0.0001) {
      var t1 = (w.x - rx) / rdx; var t2 = (w.x + w.w - rx) / rdx
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp }
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2)
    } else if (rx < w.x || rx > w.x + w.w) { continue }
    if (Math.abs(rdy) > 0.0001) {
      var t3 = (w.y - ry) / rdy; var t4 = (w.y + w.h - ry) / rdy
      if (t3 > t4) { const tmp2 = t3; t3 = t4; t4 = tmp2 }
      tmin = Math.max(tmin, t3); tmax = Math.min(tmax, t4)
    } else if (ry < w.y || ry > w.y + w.h) { continue }
    if (tmax >= tmin && tmin >= 0.0 && tmin < best) best = tmin
  }
  return best
}

// ─────────────────────────── Particle ────────────────────────────

class Particle {
  x: f64 = 0; y: f64 = 0; vx: f64 = 0; vy: f64 = 0
  life: f64 = 0; maxLife: f64 = 0
  r: f64 = 0; g: f64 = 0; b: f64 = 0; size: f64 = 0; alive: bool = false

  spawn(x: f64, y: f64, vx: f64, vy: f64, life: f64,
    r: f64, g: f64, b: f64, sz: f64): void {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy
    this.life = life; this.maxLife = life
    this.r = r; this.g = g; this.b = b; this.size = sz; this.alive = true
  }
  update(dt: f64): void {
    if (!this.alive) return
    this.life -= dt
    if (this.life <= 0.0) { this.alive = false; return }
    this.x += this.vx * dt; this.y += this.vy * dt
    this.vx *= 0.92; this.vy *= 0.92
  }
  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    fill(this.r, this.g, this.b, this.life / this.maxLife)
    circle(this.x - camX, this.y - camY, this.size * (this.life / this.maxLife))
  }
}

// ─────────────────────────── Health Pickup ───────────────────────

class HealthPickup {
  x: f64 = 0; y: f64 = 0; alive: bool = false; bobT: f64 = 0.0
  spawn(x: f64, y: f64): void { this.x = x; this.y = y; this.alive = true; this.bobT = 0.0 }
  update(dt: f64): void { if (this.alive) this.bobT += dt }
  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    const bob = Math.sin(this.bobT * 3.0) * 3.0
    fill(60, 220, 100, 0.9)
    circle(this.x - camX, this.y - camY + bob, HEALTH_PICKUP_R)
    fill(255, 255, 255, 0.95)
    font("Arial", 11, "bold")
    text("+", this.x - 5 - camX, this.y + 4 - camY + bob)
  }
}

// ─────────────────────────── Bullet ──────────────────────────────

class Bullet {
  x: f64 = 0; y: f64 = 0; vx: f64 = 0; vy: f64 = 0
  ttl: f64 = 0; damage: f64 = 0; fromPlayer: bool = false; alive: bool = false
  poisoning: bool = false   // Venom upgrade: applies DoT on hit

  fire(x: f64, y: f64, tx: f64, ty: f64, spd: f64, dmg: f64, fp: bool): void {
    const d = dist(x, y, tx, ty); if (d < 0.001) return
    this.x = x; this.y = y
    this.vx = (tx - x) / d * spd; this.vy = (ty - y) / d * spd
    this.ttl = BULLET_TTL; this.damage = dmg; this.fromPlayer = fp; this.alive = true
    this.poisoning = false
  }
  update(dt: f64): void {
    if (!this.alive) return
    this.ttl -= dt; if (this.ttl <= 0.0) { this.alive = false; return }
    this.x += this.vx * dt; this.y += this.vy * dt
  }
  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    if (this.fromPlayer) {
      if (this.poisoning) fill(60, 220, 80)   // Venom: green
      else fill(255, 230, 80)                  // Normal: yellow
    } else fill(255, 80, 80)
    circle(this.x - camX, this.y - camY, BULLET_R)
  }
}

// ─────────────────────────── Wall ────────────────────────────────

class Wall {
  x: f64 = 0; y: f64 = 0; w: f64 = 0; h: f64 = 0

  set(x: f64, y: f64, w: f64, h: f64): void { this.x = x; this.y = y; this.w = w; this.h = h }

  overlapsCircle(cx: f64, cy: f64, r: f64): bool {
    const nx = clamp(cx, this.x, this.x + this.w)
    const ny = clamp(cy, this.y, this.y + this.h)
    const dx = cx - nx; const dy = cy - ny
    return dx * dx + dy * dy < r * r
  }

  draw(camX: f64, camY: f64): void {
    fill(60, 60, 80); rect(this.x - camX, this.y - camY, this.w, this.h)
  }
}

// ─────────────────────────── Door ────────────────────────────────

class Door {
  x: f64 = 0; y: f64 = 0; w: f64 = 0; h: f64 = 0
  active: bool = false
  // Boss door extras
  isBossDoor: bool = false
  colorIndex: i32 = -1       // -1 = regular exit door
  locked: bool = false       // boss doors start locked

  set(x: f64, y: f64, w: f64, h: f64): void {
    this.x = x; this.y = y; this.w = w; this.h = h; this.active = false
    this.isBossDoor = false; this.colorIndex = -1; this.locked = false
  }
  setBoss(x: f64, y: f64, w: f64, h: f64, colorIdx: i32): void {
    this.x = x; this.y = y; this.w = w; this.h = h
    this.active = true; this.isBossDoor = true
    this.colorIndex = colorIdx; this.locked = true
  }
  containsPoint(px: f64, py: f64): bool {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h
  }
  draw(camX: f64, camY: f64): void {
    if (this.isBossDoor) {
      const cr = BOSS_CR[this.colorIndex]
      const cg = BOSS_CG[this.colorIndex]
      const cb = BOSS_CB[this.colorIndex]
      if (this.locked) {
        fill(cr * 0.3, cg * 0.3, cb * 0.3, 0.95)
        rect(this.x - camX, this.y - camY, this.w, this.h, 4)
        stroke(cr, cg, cb, 0.7); lineWidth(2.0)
        rect(this.x - camX, this.y - camY, this.w, this.h, 4)
        fill(cr, cg, cb, 0.9); font("Arial", 10, "bold")
        const lk = "🔒 " + BOSS_NAME[this.colorIndex]
        text(lk, this.x + this.w / 2 - measureText(lk) / 2 - camX, this.y + this.h / 2 - 4 - camY)
        fill(cr, cg, cb, 0.7); font("Arial", 9)
        const lk2 = "BOSS"
        text(lk2, this.x + this.w / 2 - measureText(lk2) / 2 - camX, this.y + this.h / 2 + 9 - camY)
      } else {
        fill(cr * 0.4, cg * 0.4, cb * 0.4, 0.95)
        rect(this.x - camX, this.y - camY, this.w, this.h, 4)
        stroke(cr, cg, cb, 1.0); lineWidth(2.5)
        rect(this.x - camX, this.y - camY, this.w, this.h, 4)
        // Pulsing glow
        const pulse = 0.5 + 0.5 * Math.sin(elapsedTime() * 4.0)
        fill(cr, cg, cb, pulse * 0.3)
        rect(this.x - camX - 3, this.y - camY - 3, this.w + 6, this.h + 6, 5)
        fill(cr, cg, cb, 0.95); font("Arial", 10, "bold")
        const op = "⚔ " + BOSS_NAME[this.colorIndex]
        text(op, this.x + this.w / 2 - measureText(op) / 2 - camX, this.y + this.h / 2 - 4 - camY)
        fill(cr, cg, cb, 0.8); font("Arial", 9)
        const op2 = "BOSS"
        text(op2, this.x + this.w / 2 - measureText(op2) / 2 - camX, this.y + this.h / 2 + 9 - camY)
      }
      return
    }
    fill(this.active ? 80 : 60, this.active ? 255 : 80, this.active ? 160 : 60)
    rect(this.x - camX, this.y - camY, this.w, this.h, 4)
    if (this.active) {
      fill(180, 255, 200); font("Arial", 13, "bold")
      text("EXIT", this.x + this.w / 2 - 16 - camX, this.y + this.h / 2 + 5 - camY)
    }
  }
}

// ─────────────────────────── Actor ───────────────────────────────

class Actor {
  x: f64 = 0; y: f64 = 0; vx: f64 = 0; vy: f64 = 0
  hp: f64 = 0; maxHp: f64 = 0; speed: f64 = 0; radius: f64 = 0
  alive: bool = false; iframes: f64 = 0.0

  takeDamage(amount: f64): void {
    if (!this.alive || this.iframes > 0.0) return
    this.hp -= amount; this.iframes = IFRAMES
    if (this.hp <= 0.0) { this.hp = 0.0; this.alive = false }
  }

  resolveWalls(walls: Wall[]): void {
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i]
      if (w.overlapsCircle(this.x, this.y, this.radius)) {
        const nx = clamp(this.x, w.x, w.x + w.w)
        const ny = clamp(this.y, w.y, w.y + w.h)
        const dx = this.x - nx; const dy = this.y - ny
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 0.001) { this.x += this.radius; continue }
        this.x += (dx / d) * (this.radius - d)
        this.y += (dy / d) * (this.radius - d)
      }
    }
  }

  drawHealthBar(camX: f64, camY: f64): void {
    const bw: f64 = 30.0; const bh: f64 = 4.0
    const bx = this.x - bw / 2 - camX; const by = this.y - this.radius - 10.0 - camY
    fill(60, 20, 20); rect(bx, by, bw, bh, 2)
    fill(80, 220, 80); rect(bx, by, bw * (this.hp / this.maxHp), bh, 2)
  }
}

// ─────────────────────────── Player ──────────────────────────────

class Player extends Actor {
  score: i32 = 0; fireTimer: f64 = 0.0; fireRate: f64 = 0.18

  // ── Persistent upgrades (survive level transitions) ────────────
  upgFireRateStacks: i32 = 0   // each stack = ×0.65 fire rate
  upgPoison: bool = false      // Venom: bullets apply DoT
  upgDashUnlocked: bool = false // Void: dash ability
  upgDashCharges: i32 = 3      // base charges when dash is unlocked
  dashMaxCharges: i32 = 3      // current max (increases with Solar)

  // ── Dash state ─────────────────────────────────────────────────
  dashCharges: i32 = 0          // current available charges
  dashRechargeTimer: f64 = 0.0  // counts toward next recharge
  dashTimer: f64 = 0.0          // remaining dash duration
  dashDx: f64 = 0.0; dashDy: f64 = 0.0  // dash direction
  shiftWasDown: bool = false     // edge detection for shift

  // ── Carried keys (for visual display) ─────────────────────────
  // Stores colorIndex of each collected key (up to 5)
  carriedKeys: i32[] = []
  keyOrbitT: f64 = 0.0   // orbit animation timer

  init(x: f64, y: f64): void {
    this.x = x; this.y = y; this.hp = 100.0; this.maxHp = 100.0
    this.speed = PLAYER_SPEED; this.radius = PLAYER_R
    this.alive = true; this.iframes = 0.0; this.fireTimer = 0.0
    this.dashCharges = this.dashMaxCharges
    this.dashRechargeTimer = 0.0
    this.dashTimer = 0.0
    this.shiftWasDown = false
    this.carriedKeys = []
    this.keyOrbitT = 0.0
    // NOTE: upgrade fields are NOT reset here — they persist across levels.
    // Call initUpgrades() only at true game start.
  }

  initUpgrades(): void {
    this.upgFireRateStacks = 0
    this.upgPoison = false
    this.upgDashUnlocked = false
    this.upgDashCharges = 3
    this.dashMaxCharges = 3
    this.dashCharges = 0
    this.carriedKeys = []
  }

  // Apply a boss upgrade by colorIndex (UPG_* constants)
  applyUpgrade(upgType: i32): void {
    if (upgType == UPG_MAX_HP) {
      this.maxHp += 40.0
      this.hp = Math.min(this.hp + 40.0, this.maxHp)  // also heal the new HP
    } else if (upgType == UPG_FIRE_RATE) {
      this.upgFireRateStacks++
      // Recalculate effective fire rate: base × 0.65^stacks
      var fr: f64 = 0.18
      for (let s = 0; s < this.upgFireRateStacks; s++) fr *= 0.65
      this.fireRate = Math.max(0.06, fr)
    } else if (upgType == UPG_POISON) {
      this.upgPoison = true
    } else if (upgType == UPG_DASH) {
      if (!this.upgDashUnlocked) {
        this.upgDashUnlocked = true
        this.dashMaxCharges = 3
        this.dashCharges = 3
      } else {
        // Already unlocked — treat as extra charge
        this.dashMaxCharges++
        this.dashCharges = Math.min(this.dashCharges + 1, this.dashMaxCharges) as i32
      }
    } else if (upgType == UPG_DASH_PLUS) {
      if (!this.upgDashUnlocked) {
        // Solar before Void — still unlock dash
        this.upgDashUnlocked = true
        this.dashMaxCharges = 3
        this.dashCharges = 3
      } else {
        this.dashMaxCharges++
        this.dashCharges = Math.min(this.dashCharges + 1, this.dashMaxCharges) as i32
      }
    }
  }

  update(dt: f64, walls: Wall[], rcx: f64, rcy: f64): void {
    if (!this.alive) return
    if (this.iframes > 0.0) this.iframes -= dt
    this.keyOrbitT += dt

    // ── Dash recharge ─────────────────────────────────────────
    if (this.upgDashUnlocked && this.dashCharges < this.dashMaxCharges) {
      this.dashRechargeTimer += dt
      if (this.dashRechargeTimer >= DASH_RECHARGE) {
        this.dashRechargeTimer -= DASH_RECHARGE
        this.dashCharges++
        if (this.dashCharges >= this.dashMaxCharges) this.dashRechargeTimer = 0.0
      }
    }

    // ── Active dash movement ──────────────────────────────────
    if (this.dashTimer > 0.0) {
      this.dashTimer -= dt
      this.x += this.dashDx * this.speed * DASH_SPEED_MUL * dt
      this.y += this.dashDy * this.speed * DASH_SPEED_MUL * dt
      this.resolveWalls(walls)
      if (this.fireTimer > 0.0) this.fireTimer -= dt
      return  // skip normal movement during dash
    }

    // ── Dash trigger (Shift key, edge detect) ─────────────────
    const shiftDown = input.isKeyDown("Shift")
    if (this.upgDashUnlocked && shiftDown && !this.shiftWasDown && this.dashCharges > 0) {
      // Dash direction: mouse aim direction (or movement if mouse is close)
      const wmx = input.mouseX() + rcx; const wmy = input.mouseY() + rcy
      var ddx = wmx - this.x; var ddy = wmy - this.y
      const dl = Math.sqrt(ddx * ddx + ddy * ddy)
      if (dl > 0.1) { ddx /= dl; ddy /= dl }
      else { ddx = 1.0; ddy = 0.0 }
      this.dashDx = ddx; this.dashDy = ddy
      this.dashTimer = DASH_DURATION
      this.iframes = Math.max(this.iframes, DASH_IFRAMES)
      this.dashCharges--
    }
    this.shiftWasDown = shiftDown

    // ── Normal movement ───────────────────────────────────────
    var mx: f64 = 0.0; var my: f64 = 0.0
    if (input.isKeyDown("ArrowLeft") || input.isKeyDown("a")) mx -= 1.0
    if (input.isKeyDown("ArrowRight") || input.isKeyDown("d")) mx += 1.0
    if (input.isKeyDown("ArrowUp") || input.isKeyDown("w")) my -= 1.0
    if (input.isKeyDown("ArrowDown") || input.isKeyDown("s")) my += 1.0
    const ml = Math.sqrt(mx * mx + my * my)
    if (ml > 0.001) { mx /= ml; my /= ml }
    this.x += mx * this.speed * dt; this.y += my * this.speed * dt
    this.resolveWalls(walls)
    if (this.fireTimer > 0.0) this.fireTimer -= dt
  }

  canShoot(): bool { return this.fireTimer <= 0.0 && this.dashTimer <= 0.0 }

  shoot(bullets: Bullet[], tx: f64, ty: f64): void {
    for (let i = 0; i < bullets.length; i++) {
      if (!bullets[i].alive) {
        bullets[i].fire(this.x, this.y, tx, ty, BULLET_SPEED, 25.0, true)
        bullets[i].poisoning = this.upgPoison
        this.fireTimer = this.fireRate; return
      }
    }
  }

  drawLaser(camX: f64, camY: f64, walls: Wall[]): void {
    if (!this.alive) return
    const wx = input.mouseX() + camX; const wy = input.mouseY() + camY
    const dx = wx - this.x; const dy = wy - this.y
    const d = Math.sqrt(dx * dx + dy * dy); if (d < 0.001) return
    const rdx = dx / d; const rdy = dy / d
    const hitT = castRayWalls(this.x, this.y, rdx, rdy, walls, LASER_RANGE)
    const hx = this.x + rdx * hitT - camX; const hy = this.y + rdy * hitT - camY
    const ox = this.x - camX; const oy = this.y - camY
    // Venom tints the laser green
    if (this.upgPoison) {
      stroke(60, 255, 80, 0.15); lineWidth(6)
      beginPath(); moveTo(ox, oy); lineTo(hx, hy); strokePath()
      stroke(80, 255, 100, 0.7); lineWidth(1.5)
      beginPath(); moveTo(ox, oy); lineTo(hx, hy); strokePath()
      fill(100, 255, 120, 0.9); circle(hx, hy, 3.5)
    } else {
      stroke(0, 220, 255, 0.15); lineWidth(6)
      beginPath(); moveTo(ox, oy); lineTo(hx, hy); strokePath()
      stroke(0, 220, 255, 0.7); lineWidth(1.5)
      beginPath(); moveTo(ox, oy); lineTo(hx, hy); strokePath()
      fill(0, 240, 255, 0.9); circle(hx, hy, 3.5)
    }
  }

  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    const blink = this.iframes > 0.0 && (Math.floor(this.iframes * 10.0) % 2 == 0)
    const dashing = this.dashTimer > 0.0

    if (!blink) {
      // Void dash aura
      if (dashing) {
        fill(160, 40, 220, 0.45)
        circle(this.x - camX, this.y - camY, this.radius + 10.0)
      }
      // Venom glow if poison active
      if (this.upgPoison) {
        fill(60, 200, 80, 0.18)
        circle(this.x - camX, this.y - camY, this.radius + 6.0)
      }
      fill(80, 180, 255)
      circle(this.x - camX, this.y - camY, this.radius)
      const angle = Math.atan2(input.mouseY() + camY - this.y, input.mouseX() + camX - this.x)
      fill(255, 255, 255)
      circle(this.x - camX + Math.cos(angle) * 10.0, this.y - camY + Math.sin(angle) * 10.0, 4.0)
    }

    // ── Orbiting carried keys ─────────────────────────────────
    const nKeys = this.carriedKeys.length
    for (let ki = 0; ki < nKeys; ki++) {
      const cidx = this.carriedKeys[ki]
      // Each key orbits at a fixed angle offset, all rotating together
      const orbitA = this.keyOrbitT * 2.2 + (ki as f64 / nKeys as f64) * Math.PI * 2.0
      const orbitR: f64 = this.radius + 12.0
      const kx = this.x - camX + Math.cos(orbitA) * orbitR
      const ky = this.y - camY + Math.sin(orbitA) * orbitR
      const cr = BOSS_CR[cidx]; const cg = BOSS_CG[cidx]; const cb = BOSS_CB[cidx]
      // Glow
      fill(cr, cg, cb, 0.35); circle(kx, ky, 8.0)
      // Key body (simplified — head + shaft)
      fill(cr, cg, cb, 0.95)
      circle(kx, ky - 3.0, 4.0)
      rect(kx - 1.5, ky - 1.0, 3.0, 9.0)
      rect(kx - 4.0, ky + 4.0, 4.0, 2.0)
      rect(kx - 4.0, ky + 7.0, 5.5, 2.0)
    }

    this.drawHealthBar(camX, camY)
  }
}

// ─────────────────────────── Enemy ───────────────────────────────

class Enemy extends Actor {
  role: i32 = ROLE_GRUNT
  aiState: i32 = AI_PATROL
  fireTimer: f64 = 0.0; fireRate: f64 = 1.2
  stateTimer: f64 = 0.0
  points: i32 = 100
  orbitDir: f64 = 1.0
  svx: f64 = 0.0; svy: f64 = 0.0

  facingAngle: f64 = 0.0
  targetFacing: f64 = 0.0
  fovAngle: f64 = 0.0; fovRange: f64 = 0.0

  patrolScanAngle: f64 = 0.0
  patrolScanDir: f64 = 1.0
  patrolScanTimer: f64 = 0.0

  wanderAngle: f64 = 0.0; wanderTimer: f64 = 0.0
  patrolX: f64 = 0.0; patrolY: f64 = 0.0
  patrolTimer: f64 = 0.0; pauseTimer: f64 = 0.0

  dodgeVx: f64 = 0.0; dodgeVy: f64 = 0.0
  dodgeTimer: f64 = 0.0

  lastSeenX: f64 = 0.0; lastSeenY: f64 = 0.0; hasLastSeen: bool = false

  trailX: f64[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  trailY: f64[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  trailHead: i32 = 0; trailLen: i32 = 0; trailTarget: i32 = -1

  discoverTimer: f64 = 0.0

  followAllyX: f64 = 0.0; followAllyY: f64 = 0.0
  hasFollowTarget: bool = false

  alertFlash: f64 = 0.0

  // Bounds — set to boss room bounds when inside a boss room
  floorY: f64 = 0.0; floorH: f64 = 0.0; levelW: f64 = 0.0
  minX: f64 = 0.0   // extra horizontal bound (for boss rooms)

  innerR: f64 = 80.0; outerR: f64 = 150.0

  // Boss role extras
  colorIndex: i32 = 0   // theme colour for boss/elite colouring
  phase: i32 = 0        // boss phase (0=normal, 1=enraged at 50%)
  burstTimer: f64 = 0.0 // boss burst-fire cooldown

  // Venom DoT
  poisonTimer: f64 = 0.0   // remaining poison duration
  poisonTick: f64 = 0.0    // tick accumulator (damage every 0.5s)

  init(x: f64, y: f64, role: i32, level: i32, tier: i32,
    floorY: f64, floorH: f64, levelW: f64): void {
    this.x = x; this.y = y; this.role = role
    this.alive = true; this.iframes = 0.0
    this.orbitDir = Math.random() > 0.5 ? 1.0 : -1.0
    this.svx = 0.0; this.svy = 0.0
    this.floorY = floorY; this.floorH = floorH; this.levelW = levelW
    this.minX = 0.0
    this.patrolX = x; this.patrolY = y
    this.patrolTimer = 0.0; this.pauseTimer = 0.0
    this.stateTimer = 0.0; this.alertFlash = 0.0
    this.wanderAngle = Math.random() * Math.PI * 2.0; this.wanderTimer = 0.0

    this.patrolScanAngle = Math.random() * Math.PI * 2.0
    this.patrolScanDir = Math.random() > 0.5 ? 1.0 : -1.0
    this.patrolScanTimer = 1.5 + Math.random() * 2.0

    this.discoverTimer = 0.0
    this.dodgeTimer = 0.0; this.dodgeVx = 0.0; this.dodgeVy = 0.0
    this.hasLastSeen = false; this.lastSeenX = 0.0; this.lastSeenY = 0.0
    this.trailHead = 0; this.trailLen = 0; this.trailTarget = -1
    this.hasFollowTarget = false; this.followAllyX = 0.0; this.followAllyY = 0.0
    this.aiState = AI_PATROL
    this.facingAngle = Math.atan2(floorY + floorH / 2.0 - y, levelW / 2.0 - x)
    this.targetFacing = this.facingAngle
    this.colorIndex = 0; this.phase = 0; this.burstTimer = 0.0
    this.poisonTimer = 0.0; this.poisonTick = 0.0

    const lm = 1.0 + level as f64 * 0.15
    if (role == ROLE_GRUNT) {
      this.maxHp = 60.0 * lm; this.speed = 65.0 + tier as f64 * 6.0
      this.fireRate = 1.1; this.points = 100
      this.fovAngle = 55.0 * Math.PI / 180.0; this.fovRange = 280.0
      this.innerR = 80.0; this.outerR = 150.0
    } else if (role == ROLE_FLANKER) {
      this.maxHp = 50.0 * lm; this.speed = 85.0 + tier as f64 * 8.0
      this.fireRate = 0.9; this.points = 150
      this.fovAngle = 70.0 * Math.PI / 180.0; this.fovRange = 260.0
      this.innerR = 60.0; this.outerR = 130.0
    } else if (role == ROLE_SNIPER) {
      this.maxHp = 40.0 * lm; this.speed = 40.0 + tier as f64 * 4.0
      this.fireRate = 1.8; this.points = 200
      this.fovAngle = 28.0 * Math.PI / 180.0; this.fovRange = 500.0
      this.innerR = 180.0; this.outerR = 350.0
    } else if (role == ROLE_TANK) {
      this.maxHp = 160.0 * lm; this.speed = 45.0 + tier as f64 * 5.0
      this.fireRate = 1.5; this.points = 300
      this.fovAngle = 50.0 * Math.PI / 180.0; this.fovRange = 230.0
      this.innerR = 70.0; this.outerR = 130.0
    } else if (role == ROLE_BOSS) {
      this.maxHp = 600.0 * lm; this.speed = 55.0 + tier as f64 * 4.0
      this.fireRate = 0.28; this.points = 2000
      this.fovAngle = Math.PI; this.fovRange = 700.0
      this.innerR = 90.0; this.outerR = 220.0
    } else { // TURRET
      this.maxHp = 240.0 * lm; this.speed = 0.0
      this.fireRate = 0.42; this.points = 500
      this.fovAngle = Math.PI; this.fovRange = 420.0
      this.innerR = 0.0; this.outerR = 0.0
    }
    this.hp = this.maxHp
    if (role == ROLE_TANK) this.radius = 18.0
    else if (role == ROLE_BOSS) this.radius = 26.0
    else this.radius = ENEMY_R
    this.fireRate = Math.max(0.18, this.fireRate - tier as f64 * 0.06)
  }

  // Restrict patrol/wander to the boss room bounds
  setBounds(minX: f64, floorY: f64, floorH: f64, maxX: f64): void {
    this.minX = minX; this.floorY = floorY; this.floorH = floorH; this.levelW = maxX
  }

  canSeePlayer(px: f64, py: f64, walls: Wall[]): bool {
    const dx = px - this.x; const dy = py - this.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d > this.fovRange) return false
    if (d < 55.0) {
      return castRayWalls(this.x, this.y, dx / d, dy / d, walls, d) >= d - 2.0
    }
    if (this.role != ROLE_TURRET && this.role != ROLE_BOSS) {
      var diff = Math.atan2(dy, dx) - this.facingAngle
      while (diff > Math.PI) diff -= Math.PI * 2.0
      while (diff < -Math.PI) diff += Math.PI * 2.0
      if (Math.abs(diff) > this.fovAngle) return false
    }
    return castRayWalls(this.x, this.y, dx / d, dy / d, walls, d) >= d - 2.0
  }

  _contextDir(goalDx: f64, goalDy: f64, goalBias: f64, walls: Wall[]): f64[] {
    const N: i32 = 8
    const probe: f64 = this.radius * 5.0 + 18.0
    var bestX: f64 = Math.cos(this.wanderAngle)
    var bestY: f64 = Math.sin(this.wanderAngle)
    var bestScore: f64 = -1.0
    for (let i: i32 = 0; i < N; i++) {
      const a = (i as f64 / N as f64) * Math.PI * 2.0
      const rdx = Math.cos(a); const rdy = Math.sin(a)
      const t = castRayWalls(this.x, this.y, rdx, rdy, walls, probe)
      const openFrac = t / probe
      const align = goalDx * rdx + goalDy * rdy
      const score = openFrac * (1.0 - goalBias) + ((align + 1.0) * 0.5) * goalBias
      if (score > bestScore) { bestScore = score; bestX = rdx; bestY = rdy }
    }
    const testX = this.x + bestX * probe * 0.5
    const testY = this.y + bestY * probe * 0.5
    if (testX < this.minX + this.radius || testX > this.levelW - this.radius ||
      testY < this.floorY + this.radius || testY > this.floorY + this.floorH - this.radius) {
      bestX = -bestX; bestY = -bestY
    }
    const out = new Array<f64>(2); out[0] = bestX; out[1] = bestY; return out
  }

  _doWander(dt: f64, walls: Wall[], goalDx: f64, goalDy: f64, goalBias: f64, spd: f64): void {
    this.wanderTimer -= dt
    if (this.wanderTimer <= 0.0) {
      const dir = this._contextDir(goalDx, goalDy, goalBias, walls)
      this.wanderAngle = Math.atan2(dir[1], dir[0]) + (Math.random() - 0.5) * 0.8
      this.wanderTimer = 0.7 + Math.random() * 1.0
    }
    this.svx = lerp(this.svx, Math.cos(this.wanderAngle) * spd, dt * 3.5)
    this.svy = lerp(this.svy, Math.sin(this.wanderAngle) * spd, dt * 3.5)
    this.x += this.svx * dt; this.y += this.svy * dt
    this.resolveWalls(walls)
  }

  _updatePatrolScan(dt: f64, walls: Wall[]): void {
    const SWEEP_SPEED: f64 = 1.6
    this.patrolScanTimer -= dt
    if (this.patrolScanTimer <= 0.0) {
      this.patrolScanDir = -this.patrolScanDir
      this.patrolScanTimer = 1.2 + Math.random() * 1.8
    }
    this.patrolScanAngle += this.patrolScanDir * SWEEP_SPEED * dt
    this.targetFacing = this._safeAngle(this.patrolScanAngle, walls)
  }

  _safeAngle(angle: f64, walls: Wall[]): f64 {
    const probe: f64 = this.radius + 22.0
    const t0 = castRayWalls(this.x, this.y, Math.cos(angle), Math.sin(angle), walls, probe)
    if (t0 >= probe - 1.0) return angle
    for (let step: i32 = 1; step <= 12; step++) {
      const delta = (step as f64) * (Math.PI / 12.0)
      const tL = castRayWalls(this.x, this.y, Math.cos(angle - delta), Math.sin(angle - delta), walls, probe)
      if (tL >= probe - 1.0) return angle - delta
      const tR = castRayWalls(this.x, this.y, Math.cos(angle + delta), Math.sin(angle + delta), walls, probe)
      if (tR >= probe - 1.0) return angle + delta
    }
    return angle + Math.PI
  }

  _smoothFacing(dt: f64, turnsPerSec: f64): void {
    var diff = this.targetFacing - this.facingAngle
    while (diff > Math.PI) diff -= Math.PI * 2.0
    while (diff < -Math.PI) diff += Math.PI * 2.0
    const maxStep = turnsPerSec * Math.PI * 2.0 * dt
    if (Math.abs(diff) <= maxStep) { this.facingAngle = this.targetFacing }
    else { this.facingAngle += maxStep * (diff > 0.0 ? 1.0 : -1.0) }
  }

  _moveToward(tx: f64, ty: f64, dt: f64, spd: f64, walls: Wall[]): void {
    const dx = tx - this.x; const dy = ty - this.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 2.0) {
      this.svx = lerp(this.svx, 0.0, dt * 8.0)
      this.svy = lerp(this.svy, 0.0, dt * 8.0)
      return
    }
    const dir = this._contextDir(dx / d, dy / d, 0.75, walls)
    this.svx = lerp(this.svx, dir[0] * spd, dt * 5.0)
    this.svy = lerp(this.svy, dir[1] * spd, dt * 5.0)
    this.x += this.svx * dt; this.y += this.svy * dt
    this.resolveWalls(walls)
  }

  _steerChase(dt: f64, px: f64, py: f64, walls: Wall[], enemies: Enemy[], tier: i32): void {
    var wRadial: f64 = 1.0; var wOrbit: f64 = 1.1; var wSep: f64 = 0.6
    if (this.role == ROLE_FLANKER) { wRadial = 0.4; wOrbit = 2.2; wSep = 0.5 }
    else if (this.role == ROLE_SNIPER) { wRadial = 0.7; wOrbit = 0.5; wSep = 0.9 }
    else if (this.role == ROLE_TANK) { wRadial = 1.4; wOrbit = 0.6; wSep = 0.4 }
    else if (this.role == ROLE_BOSS) {
      wRadial = 1.2; wOrbit = 1.4; wSep = 0.3
      if (this.phase == 1) { wRadial = 1.8; wOrbit = 1.8 } // enraged
    }
    wOrbit += tier as f64 * 0.1

    var fx: f64 = 0.0; var fy: f64 = 0.0

    const pd = dist(this.x, this.y, px, py)
    if (pd > 0.1) {
      const rdx = (px - this.x) / pd; const rdy = (py - this.y) / pd
      if (pd > this.outerR) {
        const pull = wRadial * clamp((pd - this.outerR) / this.outerR, 0.0, 1.5)
        fx += rdx * pull; fy += rdy * pull
      } else if (pd < this.innerR) {
        const push = wRadial * 2.5 * clamp(1.0 - pd / this.innerR, 0.0, 1.0)
        fx -= rdx * push; fy -= rdy * push
      }
      const tangX = -rdy * this.orbitDir; const tangY = rdx * this.orbitDir
      const bandF: f64 = pd >= this.innerR && pd <= this.outerR ? 1.0
        : pd < this.innerR ? clamp(pd / this.innerR, 0.2, 1.0)
          : clamp(1.0 - (pd - this.outerR) / this.outerR, 0.2, 1.0)
      fx += tangX * wOrbit * bandF; fy += tangY * wOrbit * bandF
    }

    if (pd > 0.1) {
      const rdx2 = (px - this.x) / pd; const rdy2 = (py - this.y) / pd
      const lookahead: f64 = this.speed * 0.55
      const hitT = castRayWalls(this.x, this.y, rdx2, rdy2, walls, lookahead)
      if (hitT < lookahead - 2.0) {
        const hx = this.x + rdx2 * hitT; const hy = this.y + rdy2 * hitT
        var bestNx: f64 = -rdx2; var bestNy: f64 = -rdy2
        var bestWd: f64 = 9999.0
        for (let wi = 0; wi < walls.length; wi++) {
          const w = walls[wi]
          if (!w.overlapsCircle(hx, hy, 8.0)) continue
          const cx2 = clamp(hx, w.x, w.x + w.w)
          const cy2 = clamp(hy, w.y, w.y + w.h)
          const wd = dist(hx, hy, cx2, cy2)
          if (wd < bestWd) {
            bestWd = wd
            const nx2 = hx - cx2; const ny2 = hy - cy2
            const nl = Math.sqrt(nx2 * nx2 + ny2 * ny2)
            if (nl > 0.001) { bestNx = nx2 / nl; bestNy = ny2 / nl }
          }
        }
        const t1x = -bestNy; const t1y = bestNx
        const t2x = bestNy; const t2y = -bestNx
        const rdx3 = (px - this.x) / pd; const rdy3 = (py - this.y) / pd
        const dot1 = t1x * rdx3 + t1y * rdy3
        const dot2 = t2x * rdx3 + t2y * rdy3
        const tx = dot1 >= dot2 ? t1x : t2x
        const ty = dot1 >= dot2 ? t1y : t2y
        const wallStr = 2.2 * (1.0 - hitT / lookahead)
        fx += tx * wallStr; fy += ty * wallStr
      }
    }

    const sepR: f64 = 55.0
    for (let i = 0; i < enemies.length; i++) {
      const o = enemies[i]; if (!o.alive || o === this) continue
      const sd = dist(this.x, this.y, o.x, o.y)
      if (sd < sepR && sd > 0.1) {
        fx += (this.x - o.x) / sd * wSep * (1.0 - sd / sepR)
        fy += (this.y - o.y) / sd * wSep * (1.0 - sd / sepR)
      }
    }

    const fl = Math.sqrt(fx * fx + fy * fy)
    if (fl > 0.001) {
      this.svx = lerp(this.svx, (fx / fl) * this.speed, dt * 6.0)
      this.svy = lerp(this.svy, (fy / fl) * this.speed, dt * 6.0)
    }
    this.x += this.svx * dt; this.y += this.svy * dt
    this.resolveWalls(walls)
  }

  _alertAllies(enemies: Enemy[]): void {
    if (!this.hasLastSeen) return
    for (let i = 0; i < enemies.length; i++) {
      const o = enemies[i]
      if (!o.alive || o === this || o.aiState == AI_CHASE) continue
      if (dist(this.x, this.y, o.x, o.y) < 220.0) {
        o.followAllyX = this.lastSeenX; o.followAllyY = this.lastSeenY
        o.hasFollowTarget = true
        if (o.aiState == AI_PATROL) {
          o.wanderTimer = 0.0
          o.stateTimer = 6.0 + Math.random() * 2.0
          o.aiState = AI_SEARCH
        }
      }
    }
  }

  update(dt: f64, px: f64, py: f64, walls: Wall[], tier: i32, enemies: Enemy[]): void {
    if (!this.alive) return
    if (this.iframes > 0.0) this.iframes -= dt
    if (this.fireTimer > 0.0) this.fireTimer -= dt
    if (this.alertFlash > 0.0) this.alertFlash -= dt
    this.stateTimer -= dt

    // ── Poison DoT ────────────────────────────────────────────
    if (this.poisonTimer > 0.0) {
      this.poisonTimer -= dt
      this.poisonTick += dt
      if (this.poisonTick >= 0.5) {
        this.poisonTick -= 0.5
        this.hp -= POISON_DPS * 0.5
        if (this.hp <= 0.0) { this.hp = 0.0; this.alive = false; return }
      }
    }

    // Boss phase transition
    if (this.role == ROLE_BOSS && this.phase == 0 && this.hp / this.maxHp < 0.5) {
      this.phase = 1
      this.speed *= 1.4
      this.fireRate = Math.max(0.12, this.fireRate * 0.6)
      this.orbitDir = -this.orbitDir  // reverse orbit on enrage
    }

    if (this.role == ROLE_TURRET) {
      if (this.canSeePlayer(px, py, walls)) {
        this.targetFacing = Math.atan2(py - this.y, px - this.x)
        this.aiState = AI_CHASE; this.alertFlash = 0.3
        this._smoothFacing(dt, 1.2)
      } else {
        this.targetFacing += dt * 0.9
        this.aiState = AI_PATROL
        this._smoothFacing(dt, 0.35)
      }
      return
    }

    // Boss always aware if player is in range
    if (this.role == ROLE_BOSS && this.aiState == AI_PATROL) {
      if (dist(this.x, this.y, px, py) < this.fovRange) {
        this._enterChase(px, py)
      }
    }

    if (this.aiState == AI_PATROL) {
      this.trailLen = 0; this.trailTarget = -1
      this._doPatrol(dt, walls)
      this._updatePatrolScan(dt, walls)
      this._smoothFacing(dt, 0.55)
      if (this.canSeePlayer(px, py, walls)) {
        this._enterChase(px, py)
      } else if (this.hasFollowTarget) {
        this.wanderTimer = 0.0
        this.stateTimer = 6.0 + Math.random() * 2.0
        this.hasFollowTarget = false
        this.aiState = AI_SEARCH
      }

    } else if (this.aiState == AI_SEARCH) {
      if (this.trailLen > 0 && this.trailTarget >= 0) {
        this._followTrail(dt, walls)
      } else {
        var sdx: f64 = 0.0; var sdy: f64 = 0.0; var sbias: f64 = 0.0
        if (this.hasFollowTarget) {
          const fdx = this.followAllyX - this.x; const fdy = this.followAllyY - this.y
          const fd = Math.sqrt(fdx * fdx + fdy * fdy)
          if (fd > 20.0) { sdx = fdx / fd; sdy = fdy / fd; sbias = 0.55 }
          else { this.hasFollowTarget = false }
        }
        this._doWander(dt, walls, sdx, sdy, sbias, this.speed * 0.45)
      }
      if (this.hasFollowTarget) {
        this.targetFacing = Math.atan2(this.followAllyY - this.y, this.followAllyX - this.x)
      } else if (this.hasLastSeen) {
        this.targetFacing = Math.atan2(this.lastSeenY - this.y, this.lastSeenX - this.x)
      } else {
        this._updatePatrolScan(dt, walls)
      }
      this._smoothFacing(dt, 0.7)
      if (this.canSeePlayer(px, py, walls)) {
        this._enterChase(px, py)
      } else if (this.stateTimer <= 0.0) {
        this.hasFollowTarget = false; this.trailLen = 0; this.trailTarget = -1
        this.aiState = AI_PATROL
      }

    } else if (this.aiState == AI_CHASE) {
      if (this.discoverTimer > 0.0) {
        this.discoverTimer -= dt
        this.targetFacing = Math.atan2(py - this.y, px - this.x)
        this.lastSeenX = px; this.lastSeenY = py; this.hasLastSeen = true
        this.svx = lerp(this.svx, 0.0, dt * 14.0)
        this.svy = lerp(this.svy, 0.0, dt * 14.0)
        this._smoothFacing(dt, 2.0)
        this._alertAllies(enemies)
        return
      }
      if (this.canSeePlayer(px, py, walls)) {
        this.targetFacing = Math.atan2(py - this.y, px - this.x)
        this._smoothFacing(dt, 2.0)
        this.lastSeenX = px; this.lastSeenY = py; this.hasLastSeen = true
        this._dropCrumb()
        if (this.dodgeTimer > 0.0) {
          this.dodgeTimer -= dt
          this.svx = lerp(this.svx, this.dodgeVx, dt * 10.0)
          this.svy = lerp(this.svy, this.dodgeVy, dt * 10.0)
          this.x += this.svx * dt; this.y += this.svy * dt
          this.resolveWalls(walls)
        } else {
          this._steerChase(dt, px, py, walls, enemies, tier)
        }
        if (this.hp / this.maxHp < RALLY_HP_THRESHOLD && this.role != ROLE_BOSS) {
          this.stateTimer = 4.0 + Math.random() * 2.0
          this.aiState = AI_RALLY
        }
      } else {
        this.stateTimer = 5.0 + Math.random() * 2.0
        this.wanderTimer = 0.0
        if (this.trailLen == 0 && this.hasLastSeen) {
          this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
          this.hasFollowTarget = true
        }
        // Boss never loses interest — immediately re-enter chase toward last seen
        if (this.role == ROLE_BOSS) {
          if (this.hasLastSeen) {
            this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
            this.hasFollowTarget = true
          }
          this.stateTimer = 3.0
        }
        this.aiState = AI_SEARCH
      }

    } else if (this.aiState == AI_RALLY) {
      this._doRally(dt, px, py, walls, enemies)
    }
  }

  _dropCrumb(): void {
    const TRAIL_SIZE: i32 = 8
    if (this.trailLen > 0) {
      const prev = (this.trailHead - 1 + TRAIL_SIZE) % TRAIL_SIZE
      const dx = this.x - this.trailX[prev]; const dy = this.y - this.trailY[prev]
      if (dx * dx + dy * dy < 32.0 * 32.0) return
    }
    this.trailX[this.trailHead] = this.x
    this.trailY[this.trailHead] = this.y
    this.trailHead = (this.trailHead + 1) % TRAIL_SIZE
    if (this.trailLen < TRAIL_SIZE) this.trailLen++
    this.trailTarget = (this.trailHead - 1 + TRAIL_SIZE) % TRAIL_SIZE
  }

  _followTrail(dt: f64, walls: Wall[]): bool {
    const TRAIL_SIZE: i32 = 8
    if (this.trailLen == 0 || this.trailTarget < 0) return false
    const tx = this.trailX[this.trailTarget]; const ty = this.trailY[this.trailTarget]
    const dx = tx - this.x; const dy = ty - this.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 18.0) {
      this.trailLen = 0; this.trailTarget = -1
      if (this.hasLastSeen) {
        this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
        this.hasFollowTarget = true
      }
      return false
    }
    const dir = this._contextDir(dx / d, dy / d, 0.82, walls)
    this.svx = lerp(this.svx, dir[0] * this.speed * 0.75, dt * 5.0)
    this.svy = lerp(this.svy, dir[1] * this.speed * 0.75, dt * 5.0)
    this.x += this.svx * dt; this.y += this.svy * dt
    this.resolveWalls(walls)
    return true
  }

  _enterChase(px: f64, py: f64): void {
    this.lastSeenX = px; this.lastSeenY = py; this.hasLastSeen = true
    this.targetFacing = Math.atan2(py - this.y, px - this.x)
    this.facingAngle = this.targetFacing
    this.alertFlash = 0.9; this.stateTimer = 0.0
    this.discoverTimer = this.role == ROLE_BOSS ? 0.0 : 0.12
    this.aiState = AI_CHASE
  }

  _doPatrol(dt: f64, walls: Wall[]): void {
    if (this.pauseTimer > 0.0) {
      this.pauseTimer -= dt
      this.svx = lerp(this.svx, 0.0, dt * 8.0)
      this.svy = lerp(this.svy, 0.0, dt * 8.0)
      return
    }
    this.patrolTimer -= dt
    const dx0 = this.patrolX - this.x; const dy0 = this.patrolY - this.y
    if (this.patrolTimer <= 0.0 || Math.sqrt(dx0 * dx0 + dy0 * dy0) < 14.0) {
      this.pauseTimer = 1.0 + Math.random() * 2.0
      const wp = this._safeWaypoint(walls)
      this.patrolX = wp[0]; this.patrolY = wp[1]
      this.patrolTimer = 3.0 + Math.random() * 3.0
    }
    const dx = this.patrolX - this.x; const dy = this.patrolY - this.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d > 14.0) {
      const dir = this._contextDir(dx / d, dy / d, 0.6, walls)
      this.svx = lerp(this.svx, dir[0] * this.speed * 0.22, dt * 2.5)
      this.svy = lerp(this.svy, dir[1] * this.speed * 0.22, dt * 2.5)
      this.x += this.svx * dt; this.y += this.svy * dt
    }
    this.resolveWalls(walls)
  }

  _doRally(dt: f64, px: f64, py: f64, walls: Wall[], enemies: Enemy[]): void {
    if (this.canSeePlayer(px, py, walls)) {
      this.lastSeenX = px; this.lastSeenY = py; this.hasLastSeen = true
      this.targetFacing = Math.atan2(py - this.y, px - this.x)
    }
    var nearDist: f64 = 9999.0; var nearIdx: i32 = -1
    for (let i = 0; i < enemies.length; i++) {
      const o = enemies[i]
      if (!o.alive || o === this || o.aiState == AI_RALLY) continue
      const d = dist(this.x, this.y, o.x, o.y)
      if (d < nearDist) { nearDist = d; nearIdx = i }
    }
    if (nearIdx >= 0) {
      const ally = enemies[nearIdx]
      if (!this.canSeePlayer(px, py, walls)) {
        this.targetFacing = Math.atan2(ally.y - this.y, ally.x - this.x)
      }
      this._smoothFacing(dt, 0.8)
      this._moveToward(ally.x, ally.y, dt, this.speed * 0.85, walls)
      this._dropCrumb()
      if (nearDist < 55.0) {
        if (this.hasLastSeen) {
          ally.followAllyX = this.lastSeenX; ally.followAllyY = this.lastSeenY
        } else {
          ally.followAllyX = this.x; ally.followAllyY = this.y
        }
        ally.hasFollowTarget = true
        if (ally.aiState == AI_PATROL) {
          ally.wanderTimer = 0.0
          ally.stateTimer = 6.0 + Math.random() * 2.0
          ally.aiState = AI_SEARCH
        }
        if (this.hasLastSeen) {
          this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
          this.hasFollowTarget = true
        }
        this.stateTimer = 6.0 + Math.random() * 2.0
        this.wanderTimer = 0.0; this.discoverTimer = 0.0
        this.aiState = AI_SEARCH; return
      }
    } else {
      if (this.hasLastSeen) {
        this.targetFacing = Math.atan2(this.lastSeenY - this.y, this.lastSeenX - this.x)
        this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
        this.hasFollowTarget = true
      }
      this._smoothFacing(dt, 0.8)
      this.stateTimer = 6.0 + Math.random() * 2.0
      this.wanderTimer = 0.0; this.discoverTimer = 0.0
      this.aiState = AI_SEARCH; return
    }
    if (this.stateTimer <= 0.0) {
      if (this.hasLastSeen) {
        this.followAllyX = this.lastSeenX; this.followAllyY = this.lastSeenY
        this.hasFollowTarget = true
      }
      this.wanderTimer = 0.0; this.discoverTimer = 0.0
      this.stateTimer = 6.0 + Math.random() * 2.0
      this.aiState = AI_SEARCH
    }
    this.resolveWalls(walls)
  }

  _safeWaypoint(walls: Wall[]): f64[] {
    const margin = this.radius + 4.0
    for (let attempt = 0; attempt < 10; attempt++) {
      var cx = this.x + (Math.random() - 0.5) * 200.0
      var cy = this.y + (Math.random() - 0.5) * 200.0
      cx = clamp(cx, this.minX + margin, this.levelW - margin)
      cy = clamp(cy, this.floorY + margin, this.floorY + this.floorH - margin)
      var bad = false
      for (let wi = 0; wi < walls.length; wi++) {
        if (walls[wi].overlapsCircle(cx, cy, this.radius * 1.8)) { bad = true; break }
      }
      if (!bad) {
        const out = new Array<f64>(2); out[0] = cx; out[1] = cy; return out
      }
    }
    const out = new Array<f64>(2); out[0] = this.x; out[1] = this.y; return out
  }

  onHit(px: f64, py: f64): void {
    if (this.aiState != AI_CHASE && this.aiState != AI_RALLY) return
    const dx = this.x - px; const dy = this.y - py
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 0.1) return
    const nx = dx / d; const ny = dy / d
    const side = Math.random() > 0.5 ? 1.0 : -1.0
    const perpX = -ny * side; const perpY = nx * side
    this.dodgeVx = (perpX * 0.6 + nx * 0.4) * this.speed * 1.4
    this.dodgeVy = (perpY * 0.6 + ny * 0.4) * this.speed * 1.4
    this.dodgeTimer = 0.35 + Math.random() * 0.2
    if (this.aiState == AI_RALLY) {
      this.discoverTimer = 0.0; this.aiState = AI_CHASE
    }
  }

  canShoot(): bool {
    if (this.role == ROLE_TURRET || this.role == ROLE_BOSS) return this.fireTimer <= 0.0
    return this.fireTimer <= 0.0 && this.discoverTimer <= 0.0
  }

  shoot(bullets: Bullet[], tx: f64, ty: f64): void {
    for (let i = 0; i < bullets.length; i++) {
      if (!bullets[i].alive) {
        var spd: f64 = BULLET_SPEED * 0.85; var dmg: f64 = 20.0
        if (this.role == ROLE_SNIPER) { spd = BULLET_SPEED * 1.4; dmg = 35.0 }
        else if (this.role == ROLE_TURRET) { spd = BULLET_SPEED * 1.1; dmg = 30.0 }
        else if (this.role == ROLE_BOSS) {
          spd = BULLET_SPEED * 1.1; dmg = 28.0
          if (this.phase == 1) dmg = 38.0  // enraged
        }
        bullets[i].fire(this.x, this.y, tx, ty, spd, dmg, false)
        this.fireTimer = this.fireRate; return
      }
    }
  }

  // Boss burst: fires a spread of N bullets at once
  shootBurst(bullets: Bullet[], tx: f64, ty: f64, n: i32): void {
    const baseAngle = Math.atan2(ty - this.y, tx - this.x)
    const spread = 0.28
    for (let i = 0; i < n; i++) {
      const off = (i as f64 - (n as f64 - 1.0) * 0.5) * spread
      const angle = baseAngle + off
      const etx = this.x + Math.cos(angle) * 400.0
      const ety = this.y + Math.sin(angle) * 400.0
      for (let j = 0; j < bullets.length; j++) {
        if (!bullets[j].alive) {
          const dmg: f64 = this.phase == 1 ? 32.0 : 22.0
          bullets[j].fire(this.x, this.y, etx, ety, BULLET_SPEED * 1.05, dmg, false)
          break
        }
      }
    }
    this.fireTimer = this.fireRate * 2.5
  }

  drawFOV(camX: f64, camY: f64, walls: Wall[]): void {
    if (!this.alive) return
    const ex = this.x - camX; const ey = this.y - camY
    if (this.role == ROLE_TURRET) {
      const a2 = this.aiState == AI_CHASE
      fill(255, 40, 40, a2 ? 0.20 : 0.07)
      beginPath()
      for (let si: i32 = 0; si <= 24; si++) {
        const aa = (si as f64 / 24.0) * Math.PI * 2.0
        const ct2 = castRayWalls(this.x, this.y, Math.cos(aa), Math.sin(aa), walls, this.fovRange)
        if (si == 0) moveTo(ex + Math.cos(aa) * ct2, ey + Math.sin(aa) * ct2)
        else lineTo(ex + Math.cos(aa) * ct2, ey + Math.sin(aa) * ct2)
      }
      fillPath()
      stroke(255, 100, 60, a2 ? 0.9 : 0.35); lineWidth(2.5)
      beginPath(); moveTo(ex, ey)
      lineTo(ex + Math.cos(this.facingAngle) * (this.radius + 10.0),
        ey + Math.sin(this.facingAngle) * (this.radius + 10.0))
      strokePath()
      return
    }
    if (this.role == ROLE_BOSS) {
      // Boss: 360° threat ring (no cone — boss always aware)
      const cr = BOSS_CR[this.colorIndex]; const cg = BOSS_CG[this.colorIndex]
      const cb = BOSS_CB[this.colorIndex]
      const pulse = 0.4 + 0.15 * Math.sin(elapsedTime() * (this.phase == 1 ? 8.0 : 3.0))
      fill(cr, cg, cb, pulse * 0.12)
      beginPath()
      for (let si: i32 = 0; si <= 24; si++) {
        const aa = (si as f64 / 24.0) * Math.PI * 2.0
        const ct2 = castRayWalls(this.x, this.y, Math.cos(aa), Math.sin(aa), walls, this.fovRange * 0.4)
        if (si == 0) moveTo(ex + Math.cos(aa) * ct2, ey + Math.sin(aa) * ct2)
        else lineTo(ex + Math.cos(aa) * ct2, ey + Math.sin(aa) * ct2)
      }
      fillPath()
      return
    }
    const isChase = this.aiState == AI_CHASE; const isRally = this.aiState == AI_RALLY
    var cr: f64 = 255.0; var cg: f64 = 60.0; var cb: f64 = 60.0; var alpha: f64 = 0.08
    if (isChase) { cg = 80.0; cb = 0.0; alpha = 0.25 }
    else if (isRally) { cr = 255.0; cg = 200.0; cb = 0.0; alpha = 0.12 }
    else if (this.alertFlash > 0.0) { cg = 180.0; alpha = 0.14 }
    const leftA = this.facingAngle - this.fovAngle
    const rightA = this.facingAngle + this.fovAngle
    const steps: i32 = 12
    fill(cr, cg, cb, alpha)
    beginPath(); moveTo(ex, ey)
    for (let s = 0; s <= steps; s++) {
      const t = s as f64 / steps as f64
      const a = leftA + (rightA - leftA) * t
      const ct = castRayWalls(this.x, this.y, Math.cos(a), Math.sin(a), walls, this.fovRange)
      if (s == 0) moveTo(ex + Math.cos(a) * ct, ey + Math.sin(a) * ct)
      else lineTo(ex + Math.cos(a) * ct, ey + Math.sin(a) * ct)
    }
    lineTo(ex, ey); fillPath()
    stroke(cr, cg, cb, isChase ? 0.55 : 0.18); lineWidth(1.0)
    const lt = castRayWalls(this.x, this.y, Math.cos(leftA), Math.sin(leftA), walls, this.fovRange)
    const rt = castRayWalls(this.x, this.y, Math.cos(rightA), Math.sin(rightA), walls, this.fovRange)
    beginPath(); moveTo(ex, ey); lineTo(ex + Math.cos(leftA) * lt, ey + Math.sin(leftA) * lt); strokePath()
    beginPath(); moveTo(ex, ey); lineTo(ex + Math.cos(rightA) * rt, ey + Math.sin(rightA) * rt); strokePath()
    if (this.discoverTimer > 0.0) {
      const pulse = 0.7 + 0.3 * Math.sin(this.discoverTimer * 20.0)
      fill(255, 220, 0, pulse); font("Arial", 18, "bold")
      text("!", ex - 4, ey - this.radius - 16)
    } else if (isChase || this.alertFlash > 0.0) {
      fill(255, 80, 0); font("Arial", 14, "bold")
      text("!", ex - 3, ey - this.radius - 12)
    } else if (isRally) {
      fill(255, 200, 0); font("Arial", 12, "bold")
      text("↑", ex - 4, ey - this.radius - 12)
    } else if (this.aiState == AI_SEARCH) {
      fill(255, 200, 80); font("Arial", 14, "bold")
      text("?", ex - 4, ey - this.radius - 12)
    }
  }

  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    const blink = this.iframes > 0.0 && (Math.floor(this.iframes * 10.0) % 2 == 0)
    if (this.role == ROLE_TURRET) {
      if (!blink) {
        fill(50, 45, 42); circle(this.x - camX, this.y - camY, this.radius + 5)
        fill(this.aiState == AI_CHASE ? 200 : 90,
          this.aiState == AI_CHASE ? 55 : 75,
          this.aiState == AI_CHASE ? 40 : 72)
        circle(this.x - camX, this.y - camY, this.radius)
        stroke(200, 180, 160, 0.95); lineWidth(4.0)
        beginPath(); moveTo(this.x - camX, this.y - camY)
        lineTo(this.x - camX + Math.cos(this.facingAngle) * (this.radius + 10.0),
          this.y - camY + Math.sin(this.facingAngle) * (this.radius + 10.0))
        strokePath()
        fill(255, 255, 255); font("Arial", 8, "bold")
        text("⊕", this.x - 5 - camX, this.y + 3 - camY)
      }
      this.drawHealthBar(camX, camY); return
    }
    if (this.role == ROLE_BOSS) {
      if (!blink) {
        const cr = BOSS_CR[this.colorIndex]; const cg = BOSS_CG[this.colorIndex]
        const cb = BOSS_CB[this.colorIndex]
        // Outer glow ring
        const pulse = 0.5 + 0.5 * Math.sin(elapsedTime() * (this.phase == 1 ? 9.0 : 3.5))
        fill(cr, cg, cb, pulse * 0.3)
        circle(this.x - camX, this.y - camY, this.radius + 12.0)
        // Body
        fill(cr * 0.4, cg * 0.4, cb * 0.4)
        circle(this.x - camX, this.y - camY, this.radius + 4.0)
        fill(cr, cg, cb)
        circle(this.x - camX, this.y - camY, this.radius)
        // Phase 2: extra inner ring
        if (this.phase == 1) {
          fill(255, 255, 255, 0.4)
          circle(this.x - camX, this.y - camY, this.radius * 0.55)
        }
        // Gun barrel
        stroke(255, 255, 255, 0.9); lineWidth(4.0)
        beginPath(); moveTo(this.x - camX, this.y - camY)
        lineTo(this.x - camX + Math.cos(this.facingAngle) * (this.radius + 14.0),
          this.y - camY + Math.sin(this.facingAngle) * (this.radius + 14.0))
        strokePath()
        // Poison overlay on boss
        if (this.poisonTimer > 0.0) {
          fill(40, 200, 60, 0.28 + 0.18 * Math.abs(Math.sin(elapsedTime() * 8.0)))
          circle(this.x - camX, this.y - camY, this.radius + 5.0)
        }
        // Label
        fill(255, 255, 255); font("Arial", 10, "bold")
        text("B", this.x - 4 - camX, this.y + 4 - camY)
      }
      // Big health bar for boss
      const bw: f64 = 60.0; const bh: f64 = 7.0
      const bx = this.x - bw / 2 - camX; const by = this.y - this.radius - 18.0 - camY
      const cr2 = BOSS_CR[this.colorIndex]; const cg2 = BOSS_CG[this.colorIndex]
      const cb2 = BOSS_CB[this.colorIndex]
      fill(40, 10, 10); rect(bx, by, bw, bh, 3)
      fill(cr2, cg2, cb2); rect(bx, by, bw * (this.hp / this.maxHp), bh, 3)
      if (this.phase == 1) {
        fill(255, 255, 255, 0.5); font("Arial", 8, "bold")
        text("ENRAGED", bx - 2, by - 3)
      }
      return
    }
    if (!blink) {
      if (this.role == ROLE_GRUNT) fill(230, 80, 80)
      else if (this.role == ROLE_FLANKER) fill(230, 140, 50)
      else if (this.role == ROLE_SNIPER) fill(180, 80, 220)
      else fill(200, 60, 60)
      if (this.aiState == AI_RALLY) fill(255, 180, 40)
      circle(this.x - camX, this.y - camY, this.radius)
      // Poison overlay — green ring when DoT is active
      if (this.poisonTimer > 0.0) {
        const pt = this.poisonTimer / POISON_DURATION
        fill(40, 200, 60, 0.35 + 0.25 * Math.abs(Math.sin(elapsedTime() * 8.0)))
        circle(this.x - camX, this.y - camY, this.radius + 3.0)
      }
      fill(255, 255, 255); font("Arial", 9, "bold")
      const lbl = this.role == ROLE_GRUNT ? "G" : this.role == ROLE_FLANKER ? "F" :
        this.role == ROLE_SNIPER ? "S" : "T"
      text(lbl, this.x - 4 - camX, this.y + 4 - camY)
    }
    this.drawHealthBar(camX, camY)
  }
}

// ─────────────────────────── Boss Room ───────────────────────────
// A large self-contained room attached to the outer rows of the level.
// Has exactly one door (the entrance/exit) which is locked until the
// matching coloured key is collected.

class BossRoom {
  // World-space bounding box
  x: f64 = 0.0; y: f64 = 0.0; w: f64 = 0.0; h: f64 = 0.0
  colorIndex: i32 = 0      // which BOSS_CR/CG/CB entry
  door: Door = new Door()  // the single entrance/exit door
  walls: Wall[] = []       // interior walls (obstacles)
  enemies: Enemy[] = []    // boss + guards
  pickups: HealthPickup[] = []
  lootZoneX: f64 = 0.0; lootZoneY: f64 = 0.0
  lootZoneW: f64 = 0.0; lootZoneH: f64 = 0.0
  cleared: bool = false    // true once boss dead AND player claims the upgrade
  bossDefeated: bool = false
  doorOnTop: bool = true   // true = door on north wall, false = south wall
  upgradePickup: UpgradePickup = new UpgradePickup()

  build(worldX: f64, worldY: f64, width: f64, height: f64,
    doorX: f64, colorIdx: i32, onTop: bool,
    levelNum: i32, tier: i32): void {
    this.x = worldX; this.y = worldY; this.w = width; this.h = height
    this.colorIndex = colorIdx; this.doorOnTop = onTop
    this.walls = []; this.enemies = []; this.pickups = []
    this.cleared = false; this.bossDefeated = false
    this.upgradePickup = new UpgradePickup()
    const wt = WALL_T
    const cr = BOSS_CR[colorIdx]; const cg = BOSS_CG[colorIdx]; const cb = BOSS_CB[colorIdx]

    // ── Boundary walls ──────────────────────────────────────────
    // The shared wall between the antechamber and the boss room already has a
    // gap cut by the main level builder. We add only the three remaining sides.
    const doorW: f64 = 72.0
    const doorGapX = doorX  // centre of door opening in world X

    if (onTop) {
      // Room is BELOW the level — door is on the top wall (shared with level boundary)
      // Left, right, bottom walls only — top shared wall is the level boundary (already has gap)
      this._addWall(worldX, worldY, wt, height)
      this._addWall(worldX + width - wt, worldY, wt, height)
      this._addWall(worldX, worldY + height - wt, width, wt)
      // Door sits in the gap we cut in the level's bottom boundary wall
      this.door.setBoss(doorGapX - doorW / 2.0, worldY - 4.0, doorW, wt + 8.0, colorIdx)
      // Loot zone at bottom of room
      this.lootZoneX = worldX + width * 0.3
      this.lootZoneY = worldY + height - 90.0
      this.lootZoneW = width * 0.4
      this.lootZoneH = 70.0
    } else {
      // Room is ABOVE the level — door is on the bottom wall (shared with level boundary)
      // Left, right, top walls only — bottom shared wall is the level boundary (already has gap)
      this._addWall(worldX, worldY, width, wt)
      this._addWall(worldX, worldY, wt, height)
      this._addWall(worldX + width - wt, worldY, wt, height)
      // Door sits in the gap we cut in the level's top boundary wall
      this.door.setBoss(doorGapX - doorW / 2.0, worldY + height - 4.0, doorW, wt + 8.0, colorIdx)
      // Loot zone at top of room
      this.lootZoneX = worldX + width * 0.3
      this.lootZoneY = worldY + wt + 10.0
      this.lootZoneW = width * 0.4
      this.lootZoneH = 70.0
    }

    // ── Procedural interior obstacles ───────────────────────────
    // Pick one of 3 layouts based on colorIndex to add variety
    const cx = worldX + width * 0.5
    const cy = worldY + height * 0.5
    const layout = colorIdx % 3

    if (layout == 0) {
      // Ring of 8 pillars around centre
      for (let pi: i32 = 0; pi < 8; pi++) {
        const pa = (pi as f64 / 8.0) * Math.PI * 2.0
        const pr: f64 = Math.min(width, height) * 0.28
        this._addWall(cx + Math.cos(pa) * pr - 20.0, cy + Math.sin(pa) * pr - 20.0, 40.0, 40.0)
      }
      // Inner cross walls
      this._addWall(cx - 14.0, cy - height * 0.18, 28.0, height * 0.36)

    } else if (layout == 1) {
      // Bunker trenches
      const tw: f64 = width * 0.28; const gap: f64 = 70.0
      this._addWall(worldX + width * 0.12, cy - 12.0, tw, wt * 1.5)
      this._addWall(worldX + width * 0.12 + tw + gap, cy - 12.0, tw * 0.9, wt * 1.5)
      this._addWall(worldX + width * 0.15, cy + height * 0.18, tw * 0.9, wt * 1.5)
      this._addWall(worldX + width * 0.15 + tw * 0.9 + gap, cy + height * 0.18, tw, wt * 1.5)
      // Corner pillars
      for (let ci: i32 = 0; ci < 4; ci++) {
        const cpx = ci < 2 ? worldX + width * 0.18 : worldX + width * 0.72
        const cpy = ci % 2 == 0 ? worldY + height * 0.14 : worldY + height * 0.72
        this._addWall(cpx, cpy, 36.0, 36.0)
      }

    } else {
      // Hexagonal arena with 6 cover blocks
      for (let hi: i32 = 0; hi < 6; hi++) {
        const ha = (hi as f64 / 6.0) * Math.PI * 2.0 + Math.PI / 6.0
        const hr: f64 = Math.min(width, height) * 0.30
        this._addWall(cx + Math.cos(ha) * hr - 18.0, cy + Math.sin(ha) * hr - 18.0, 36.0, 36.0)
      }
      // Centre pedestal
      this._addWall(cx - 22.0, cy - 22.0, 44.0, 44.0)
    }

    // ── Spawn enemies ────────────────────────────────────────────
    const lm = 1.0 + levelNum as f64 * 0.15
    const bossSpawnX = cx
    const bossSpawnY = onTop ? worldY + height * 0.55 : worldY + height * 0.45

    const boss = new Enemy()
    boss.init(bossSpawnX, bossSpawnY, ROLE_BOSS, levelNum, tier,
      worldY, height, worldX + width)
    boss.setBounds(worldX, worldY, height, worldX + width)
    boss.colorIndex = colorIdx
    this.enemies.push(boss)

    // Guards: turrets + flankers
    const numTurrets: i32 = 2 + (levelNum >> 1)
    for (let t: i32 = 0; t < numTurrets; t++) {
      const ta = (t as f64 / numTurrets as f64) * Math.PI * 2.0
      const tr2: f64 = Math.min(width, height) * 0.38
      const turret = new Enemy()
      turret.init(cx + Math.cos(ta) * tr2, cy + Math.sin(ta) * tr2,
        ROLE_TURRET, levelNum, tier + 1, worldY, height, worldX + width)
      turret.setBounds(worldX, worldY, height, worldX + width)
      this.enemies.push(turret)
    }

    const numGuards: i32 = 2 + levelNum
    for (let g: i32 = 0; g < numGuards; g++) {
      const gx = worldX + wt + 30.0 + Math.random() * (width - wt * 2.0 - 60.0)
      const gy = worldY + wt + 30.0 + Math.random() * (height - wt * 2.0 - 60.0)
      const guardRole = g % 3 == 0 ? ROLE_FLANKER : ROLE_GRUNT
      const guard = new Enemy()
      guard.init(gx, gy, guardRole, levelNum, tier,
        worldY, height, worldX + width)
      guard.setBounds(worldX, worldY, height, worldX + width)
      this.enemies.push(guard)
    }
  }

  _addWall(x: f64, y: f64, w: f64, h: f64): void {
    const wl = new Wall(); wl.set(x, y, w, h); this.walls.push(wl)
  }

  isBossAlive(): bool {
    if (this.enemies.length == 0) return false
    return this.enemies[0].alive  // boss is always index 0
  }

  // All enemies (including boss) dead
  allEnemiesDead(): bool {
    for (let i = 0; i < this.enemies.length; i++) if (this.enemies[i].alive) return false
    return true
  }

  // Returns combined wall list for collision (own walls only — main level walls
  // are passed separately for raycasting within the boss room)
  get wallList(): Wall[] { return this.walls }

  draw(camX: f64, camY: f64): void {
    const rx = this.x - camX; const ry = this.y - camY
    const cr = BOSS_CR[this.colorIndex]; const cg = BOSS_CG[this.colorIndex]
    const cb = BOSS_CB[this.colorIndex]

    // Floor
    fill(cr * 0.06 + 12.0, cg * 0.06 + 12.0, cb * 0.06 + 12.0)
    rect(rx, ry, this.w, this.h)

    // Tile grid tinted to theme
    stroke(cr, cg, cb, 0.06); lineWidth(0.5)
    const ts: f64 = 48.0
    var tx: f64 = rx
    while (tx < rx + this.w) {
      beginPath(); moveTo(tx, ry); lineTo(tx, ry + this.h); strokePath(); tx += ts
    }
    var ty: f64 = ry
    while (ty < ry + this.h) {
      beginPath(); moveTo(rx, ty); lineTo(rx + this.w, ty); strokePath(); ty += ts
    }

    // Decorative floor rings
    stroke(cr, cg, cb, 0.10); lineWidth(1.5)
    const cx = rx + this.w * 0.5; const cy = ry + this.h * 0.5
    for (let ri: i32 = 1; ri <= 4; ri++) {
      const rr = (ri as f64) * Math.min(this.w, this.h) * 0.12
      beginPath()
      for (let s: i32 = 0; s <= 32; s++) {
        const a = (s as f64 / 32.0) * Math.PI * 2.0
        if (s == 0) moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
        else lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
      }
      strokePath()
    }

    // Loot zone (glows brighter after boss cleared)
    if (this.cleared) {
      const glow = 0.4 + 0.3 * Math.sin(elapsedTime() * 2.5)
      fill(cr, cg, cb, glow * 0.35)
      rect(this.lootZoneX - camX, this.lootZoneY - camY, this.lootZoneW, this.lootZoneH, 8.0)
      stroke(cr, cg, cb, glow); lineWidth(2.0)
      rect(this.lootZoneX - camX, this.lootZoneY - camY, this.lootZoneW, this.lootZoneH, 8.0)
      fill(cr, cg, cb, glow * 0.9); font("Arial", 12, "bold")
      const lootLabel = "✦ LOOT ✦"
      text(lootLabel,
        this.lootZoneX - camX + this.lootZoneW / 2 - measureText(lootLabel) / 2,
        this.lootZoneY - camY + this.lootZoneH / 2 + 5)
    } else if (this.bossDefeated) {
      // Boss dead but not yet claimed — pulse the loot zone hint
      const glow2 = 0.3 + 0.2 * Math.sin(elapsedTime() * 5.0)
      fill(cr, cg, cb, glow2 * 0.2)
      rect(this.lootZoneX - camX, this.lootZoneY - camY, this.lootZoneW, this.lootZoneH, 8.0)
      stroke(cr, cg, cb, glow2 * 0.6); lineWidth(1.5)
      rect(this.lootZoneX - camX, this.lootZoneY - camY, this.lootZoneW, this.lootZoneH, 8.0)
      fill(cr, cg, cb, glow2 * 0.7); font("Arial", 11, "bold")
      const hint = "COLLECT LOOT"
      text(hint,
        this.lootZoneX - camX + this.lootZoneW / 2 - measureText(hint) / 2,
        this.lootZoneY - camY + this.lootZoneH / 2 + 5)
    }

    // Walls
    for (let i = 0; i < this.walls.length; i++) {
      const w = this.walls[i]
      // Tint walls with theme colour
      fill(cr * 0.25 + 25.0, cg * 0.25 + 25.0, cb * 0.25 + 25.0)
      rect(w.x - camX, w.y - camY, w.w, w.h)
    }

    // Door
    this.door.draw(camX, camY)

    // Upgrade pickup (drawn after walls so it's always visible)
    this.upgradePickup.draw(camX, camY)
  }
}

// ─────────────────────────── Upgrade Pickup ──────────────────────
// Spawned in the boss loot zone after boss defeated.
// Player walks over it to claim the upgrade.

class UpgradePickup {
  x: f64 = 0.0; y: f64 = 0.0
  alive: bool = false
  upgType: i32 = 0      // UPG_* constant
  colorIndex: i32 = 0   // boss room colour
  bobT: f64 = 0.0

  spawn(x: f64, y: f64, upgType: i32, colorIndex: i32): void {
    this.x = x; this.y = y; this.alive = true
    this.upgType = upgType; this.colorIndex = colorIndex; this.bobT = 0.0
  }

  update(dt: f64): void { if (this.alive) this.bobT += dt }

  draw(camX: f64, camY: f64): void {
    if (!this.alive) return
    const cr = BOSS_CR[this.colorIndex]; const cg = BOSS_CG[this.colorIndex]
    const cb = BOSS_CB[this.colorIndex]
    const bob = Math.sin(this.bobT * 2.8) * 4.5
    const pulse = 0.5 + 0.5 * Math.abs(Math.sin(this.bobT * 2.0))
    const sx = this.x - camX; const sy = this.y - camY + bob

    // Outer glow ring
    fill(cr, cg, cb, pulse * 0.25); circle(sx, sy, 26.0)
    // Mid ring
    fill(cr * 0.6, cg * 0.6, cb * 0.6, 0.9); circle(sx, sy, 18.0)
    // Core
    fill(cr, cg, cb, 0.95); circle(sx, sy, 12.0)
    // Icon inside
    fill(255, 255, 255, 0.92); font("Arial", 11, "bold")
    var icon = "?"
    if (this.upgType == UPG_MAX_HP) icon = "♥"
    else if (this.upgType == UPG_FIRE_RATE) icon = "⚡"
    else if (this.upgType == UPG_POISON) icon = "☠"
    else if (this.upgType == UPG_DASH) icon = "»"
    else if (this.upgType == UPG_DASH_PLUS) icon = "»+"
    text(icon, sx - measureText(icon) / 2.0, sy + 4.0)
    // Label below
    fill(cr, cg, cb, 0.85); font("Arial", 9, "bold")
    var label = BOSS_NAME[this.colorIndex]
    text(label, sx - measureText(label) / 2.0, sy + 30.0)
  }
}

// ─────────────────────────── Room part ───────────────────────────

class RoomPart {
  worldX: f64 = 0.0; worldY: f64 = 0.0; w: f64 = 0.0; h: f64 = 0.0; type: i32 = PART_CORRIDOR
}

// ─────────────────────────── Key data ────────────────────────────

class KeyInfo {
  x: f64 = 0.0; y: f64 = 0.0
  collected: bool = false
  colorIndex: i32 = 0   // matches the paired boss room
  bobT: f64 = 0.0

  draw(camX: f64, camY: f64): void {
    if (this.collected) return
    this.bobT += 0.016  // approximate dt — drawn every frame anyway
    const bob = Math.sin(this.bobT * 3.0) * 3.5
    const cr = BOSS_CR[this.colorIndex]; const cg = BOSS_CG[this.colorIndex]
    const cb = BOSS_CB[this.colorIndex]
    const glow = 0.55 + 0.45 * Math.abs(Math.sin(this.bobT * 2.5))
    // Outer glow
    fill(cr, cg, cb, glow * 0.35)
    circle(this.x - camX, this.y - camY + bob, 22.0)
    // Key body
    fill(cr, cg, cb, 0.95)
    circle(this.x - camX, this.y - camY - 4.0 + bob, 7.0)
    rect(this.x - 2.5 - camX, this.y - 1.0 - camY + bob, 5.0, 16.0)
    rect(this.x - 7.0 - camX, this.y + 8.0 - camY + bob, 7.0, 3.5)
    rect(this.x - 7.0 - camX, this.y + 13.0 - camY + bob, 9.0, 3.5)
    // White shine
    fill(255, 255, 255, 0.7)
    circle(this.x - 2.0 - camX, this.y - 6.0 - camY + bob, 2.5)
  }
}

// ─────────────────────────── Level ───────────────────────────────

class Level {
  walls: Wall[] = []
  enemies: Enemy[] = []
  pickups: HealthPickup[] = []
  door: Door = new Door()
  parts: RoomPart[] = []
  bossRooms: BossRoom[] = []
  keys: KeyInfo[] = []     // one KeyInfo per boss room
  totalW: f64 = 0.0; floorY: f64 = 0.0; floorH: f64 = 0.0
  spawnX: f64 = 0.0; spawnY: f64 = 0.0

  // Legacy key fields (kept for backward-compat with _drawWorld altar rendering)
  hasKey: bool = false; keyCollected: bool = false
  keyX: f64 = 0.0; keyY: f64 = 0.0

  _tier(hs: i32): i32 {
    if (hs < 500) return 1; if (hs < 1500) return 2
    if (hs < 3000) return 3; if (hs < 6000) return 4; return 5
  }

  build(levelNum: i32, highScore: i32): void {
    this.walls = []; this.enemies = []; this.parts = []; this.pickups = []
    this.bossRooms = []; this.keys = []
    this.hasKey = false; this.keyCollected = false
    const tier = this._tier(highScore)

    const roomH: f64 = 260.0 + Math.min(levelNum as f64 * 6.0, 100.0)
    const ROWS: i32 = 3
    const rowGap: f64 = WALL_T
    const totalH: f64 = roomH * (ROWS as f64) + rowGap * ((ROWS - 1) as f64)
    const gap: f64 = 90.0
    this.floorY = 40.0
    this.floorH = totalH
    const wt = WALL_T

    const rowY0: f64 = this.floorY
    const rowY1: f64 = rowY0 + roomH + rowGap
    const rowY2: f64 = rowY1 + roomH + rowGap

    const pw: f64[] = [380.0, 260.0, 460.0, 360.0, 520.0, 300.0, 340.0, 400.0, 480.0, 440.0]
    const numParts: i32 = Math.min(1 + levelNum, 10) as i32

    // ── Decide how many boss rooms and key rooms ─────────────────
    // 1 boss room from level 1, up to 3 from level 5+
    const numBossRooms: i32 = clamp(1 + (levelNum >> 1) as f64, 1.0, 3.0) as i32

    // Total cols = START + numParts + END
    const numCols = numParts + 2

    // Key room cols: randomly distributed in the non-start/end cols,
    // at least 1 per boss room. We pick numBossRooms distinct cols.
    // (Separate from the PART_KEY legacy system — we use PART_KEY for the altar)
    const availableCols: i32[] = []
    for (let c = 1; c < numCols - 1; c++) availableCols.push(c)
    // Shuffle first numBossRooms entries
    for (let s = 0; s < numBossRooms && s < availableCols.length; s++) {
      const swapIdx = s + (i32)(Math.random() * (availableCols.length - s))
      const tmp2 = availableCols[s]; availableCols[s] = availableCols[swapIdx]
      availableCols[swapIdx] = tmp2
    }
    const keyColSet: i32[] = []
    for (let k = 0; k < numBossRooms && k < availableCols.length; k++) {
      keyColSet.push(availableCols[k])
    }

    // ── Build column X positions ─────────────────────────────────
    let cx2: f64 = 0.0
    const colX: f64[] = []
    const colW: f64[] = []
    const midTypes: i32[] = []

    for (let i = 0; i < numCols; i++) {
      colX.push(cx2)
      let t: i32 = 0
      if (i == 0) { t = PART_START }
      else if (i == numCols - 1) { t = PART_END }
      else {
        // Check if this col is a key col
        var isKeyCol = false
        for (let kc = 0; kc < keyColSet.length; kc++) {
          if (keyColSet[kc] == i) { isKeyCol = true; break }
        }
        t = isKeyCol ? PART_KEY : 1 + (i32)(Math.random() * 8.0)
      }
      midTypes.push(t)
      colW.push(pw[t])
      cx2 += pw[t]
    }
    this.totalW = cx2

    this.spawnX = colX[0] + 80.0
    this.spawnY = rowY1 + roomH * 0.5

    // ── Left boundary wall only — top/bottom are built per-column below ──
    this._addWall(-wt, this.floorY - wt, wt, totalH + wt * 2.0)

    // ── Assign a colour index to each key col ───────────────────
    // keyColSet[k] → colourIndex k (capped to BOSS_CR.length)
    const keyColColorMap: i32[] = []
    for (let k2 = 0; k2 < keyColSet.length; k2++) {
      keyColColorMap.push(k2 % (BOSS_CR.length as i32))
    }

    // ── Pre-assign which outer row each key col uses ─────────────
    // Alternate: even-indexed key cols go below (row 2), odd go above (row 0)
    // This ensures multiple boss rooms never collide vertically.
    const keyColAttachBelow: bool[] = []
    for (let k3 = 0; k3 < keyColSet.length; k3++) {
      keyColAttachBelow.push(k3 % 2 == 0)
    }

    // ── Column loop ──────────────────────────────────────────────
    for (let col = 0; col < numCols; col++) {
      const px2 = colX[col]; const pw3 = colW[col]
      const isStart = midTypes[col] == PART_START
      const isEnd = midTypes[col] == PART_END

      if (col == numCols - 1) {
        this._addWall(px2 + pw3, this.floorY - wt, wt, totalH + wt * 2.0)
      }

      // Check key col membership — determines if outer rows get antechambers
      var colKeyIdx: i32 = -1
      for (let kc2 = 0; kc2 < keyColSet.length; kc2++) {
        if (keyColSet[kc2] == col) { colKeyIdx = kc2; break }
      }
      const isAntechamberCol = colKeyIdx >= 0
      const antechamberBelow = isAntechamberCol ? keyColAttachBelow[colKeyIdx] : false
      // antechamberRow: which outer row is the antechamber?
      // attachBelow=true → antechamber is row 2 (south), boss room is below floorY+totalH
      // attachBelow=false → antechamber is row 0 (north), boss room is above floorY
      const antechamberRow: i32 = antechamberBelow ? 2 : 0

      for (let div = 0; div < 2; div++) {
        const divY: f64 = div == 0 ? rowY0 + roomH : rowY1 + roomH
        const margin: f64 = gap + 20.0
        const gapOff: f64 = margin + Math.random() * (pw3 - margin * 2.0)
        if (gapOff > 2.0) this._addWall(px2, divY, gapOff, rowGap)
        const afterGap = gapOff + gap
        if (afterGap < pw3 - 2.0) this._addWall(px2 + afterGap, divY, pw3 - afterGap, rowGap)
      }

      for (let row = 0; row < ROWS; row++) {
        const ry: f64 = row == 0 ? rowY0 : (row == 1 ? rowY1 : rowY2)
        const rtop: f64 = ry; const rbot: f64 = ry + roomH
        const isMiddleRow = row == 1
        const isStartCell = isMiddleRow && isStart
        const isEndCell = isMiddleRow && isEnd
        const isAntechamber = isAntechamberCol && (row == antechamberRow)

        let rtype: i32 = 0
        if (isMiddleRow) {
          rtype = midTypes[col]
        } else {
          if (isStart || isEnd) { rtype = PART_ARENA }
          else if (isAntechamber) { rtype = PART_KEY }  // antechamber uses same floor art
          else { rtype = 1 + (i32)(Math.random() * 8.0) }
        }

        const p = new RoomPart()
        p.worldX = px2; p.worldY = ry; p.w = pw3; p.h = roomH; p.type = rtype
        this.parts.push(p)

        if (isStartCell) {
          const doorGap2: f64 = 80.0; const wallX = px2 + pw3 - wt
          this._addWall(wallX, rtop, wt, roomH / 2.0 - doorGap2 / 2.0)
          this._addWall(wallX, rtop + roomH / 2.0 + doorGap2 / 2.0, wt, roomH / 2.0 - doorGap2 / 2.0)
          this._addWall(px2 + 100.0, rtop + roomH * 0.22, 36.0, 36.0)
          this._addWall(px2 + 100.0, rtop + roomH * 0.62, 36.0, 36.0)
          this._addWall(px2 + 220.0, rtop + roomH * 0.42, 36.0, 36.0)

        } else if (isAntechamber) {
          // ── Antechamber: themed foyer leading to boss room ───────
          // Interior cover pillars flanking the centre
          this._addWall(px2 + pw3 * 0.12, rtop + roomH * 0.20, 30.0, 30.0)
          this._addWall(px2 + pw3 * 0.12, rtop + roomH * 0.60, 30.0, 30.0)
          this._addWall(px2 + pw3 * 0.78, rtop + roomH * 0.20, 30.0, 30.0)
          this._addWall(px2 + pw3 * 0.78, rtop + roomH * 0.60, 30.0, 30.0)
          // Side walls framing the approach to the boss door
          this._addWall(px2 + pw3 * 0.28, rtop + roomH * 0.08, 12.0, roomH * 0.22)
          this._addWall(px2 + pw3 * 0.60, rtop + roomH * 0.08, 12.0, roomH * 0.22)
          this._addWall(px2 + pw3 * 0.28, rtop + roomH * 0.70, 12.0, roomH * 0.22)
          this._addWall(px2 + pw3 * 0.60, rtop + roomH * 0.70, 12.0, roomH * 0.22)
          // NOTE: The outer wall of this cell (top wall of row0 or bottom wall of row2)
          // is built below with a gap cut for the boss door.

        } else if (rtype == PART_CORRIDOR) {
          this._addWall(px2 + pw3 * 0.4, rtop, pw3 * 0.2, roomH * 0.28)
          this._addWall(px2 + pw3 * 0.4, rbot - roomH * 0.28, pw3 * 0.2, roomH * 0.28)
          this._addWall(px2 + pw3 * 0.5 - 18.0, rtop + roomH * 0.44, 36.0, 36.0)

        } else if (rtype == PART_ARENA) {
          this._addWall(px2 + pw3 * 0.22, rtop + roomH * 0.22, 34.0, 34.0)
          this._addWall(px2 + pw3 * 0.78 - 34.0, rtop + roomH * 0.22, 34.0, 34.0)
          this._addWall(px2 + pw3 * 0.22, rtop + roomH * 0.78 - 34.0, 34.0, 34.0)
          this._addWall(px2 + pw3 * 0.78 - 34.0, rtop + roomH * 0.78 - 34.0, 34.0, 34.0)
          this._addWall(px2 + pw3 * 0.35, rtop + roomH * 0.36, pw3 * 0.3, roomH * 0.10)
          this._addWall(px2 + pw3 * 0.35, rtop + roomH * 0.54, pw3 * 0.3, roomH * 0.10)

        } else if (rtype == PART_CROSS) {
          this._addWall(px2 + pw3 * 0.2, rtop + roomH * 0.08, pw3 * 0.15, roomH * 0.32)
          this._addWall(px2 + pw3 * 0.65, rtop + roomH * 0.60, pw3 * 0.15, roomH * 0.32)
          this._addWall(px2 + pw3 * 0.42, rtop + roomH * 0.42, 36.0, 36.0)

        } else if (rtype == PART_WIDE) {
          this._addWall(px2 + pw3 * 0.15, rtop + roomH * 0.18, 42.0, 42.0)
          this._addWall(px2 + pw3 * 0.5, rtop + roomH * 0.58, 42.0, 42.0)
          this._addWall(px2 + pw3 * 0.75, rtop + roomH * 0.14, 42.0, 42.0)
          this._addWall(px2 + pw3 * 0.35, rtop + roomH * 0.34, 42.0, 42.0)

        } else if (isEndCell) {
          const ecx = px2 + pw3 * 0.5; const ecy = rtop + roomH * 0.5
          for (let pi: i32 = 0; pi < 6; pi++) {
            const pa = (pi as f64 / 6.0) * Math.PI * 2.0
            this._addWall(ecx + Math.cos(pa) * 90.0 - 18.0,
              ecy + Math.sin(pa) * 90.0 - 18.0, 36.0, 36.0)
          }

        } else if (rtype == PART_BUNKER) {
          const sg: f64 = 70.0
          const sy1 = rtop + roomH * 0.30; const sy2 = rtop + roomH * 0.65
          this._addWall(px2 + pw3 * 0.15, sy1, pw3 * 0.28, wt * 1.5)
          this._addWall(px2 + pw3 * 0.15 + pw3 * 0.28 + sg, sy1, pw3 * 0.45 - sg, wt * 1.5)
          this._addWall(px2 + pw3 * 0.15, sy2, pw3 * 0.45 - sg, wt * 1.5)
          this._addWall(px2 + pw3 * 0.15 + pw3 * 0.45, sy2, pw3 * 0.28, wt * 1.5)
          this._addWall(px2 + pw3 * 0.08, rtop + roomH * 0.10, 30.0, 55.0)
          this._addWall(px2 + pw3 * 0.82, rtop + roomH * 0.55, 30.0, 55.0)

        } else if (rtype == PART_PILLBOX) {
          const bx2 = px2 + pw3 * 0.35; const by2 = rtop + roomH * 0.35
          const bw2: f64 = pw3 * 0.30; const bh2: f64 = roomH * 0.30; const fg: f64 = 52.0
          this._addWall(bx2, by2, bw2 / 2.0 - fg / 2.0, wt)
          this._addWall(bx2 + bw2 / 2.0 + fg / 2.0, by2, bw2 / 2.0 - fg / 2.0, wt)
          this._addWall(bx2, by2 + bh2, bw2 / 2.0 - fg / 2.0, wt)
          this._addWall(bx2 + bw2 / 2.0 + fg / 2.0, by2 + bh2, bw2 / 2.0 - fg / 2.0, wt)
          this._addWall(bx2, by2 + wt, wt, bh2 / 2.0 - fg / 2.0)
          this._addWall(bx2, by2 + bh2 / 2.0 + fg / 2.0, wt, bh2 / 2.0 - fg / 2.0)
          this._addWall(bx2 + bw2, by2 + wt, wt, bh2 / 2.0 - fg / 2.0)
          this._addWall(bx2 + bw2, by2 + bh2 / 2.0 + fg / 2.0, wt, bh2 / 2.0 - fg / 2.0)

        } else if (rtype == PART_HALL) {
          this._addWall(px2 + pw3 * 0.12, rtop + roomH * 0.08, 36.0, roomH * 0.26)
          this._addWall(px2 + pw3 * 0.12, rtop + roomH * 0.66, 36.0, roomH * 0.26)
          this._addWall(px2 + pw3 * 0.78, rtop + roomH * 0.08, 36.0, roomH * 0.26)
          this._addWall(px2 + pw3 * 0.78, rtop + roomH * 0.66, 36.0, roomH * 0.26)
          this._addWall(px2 + pw3 * 0.47, rtop + roomH * 0.42, 36.0, 36.0)

        } else if (rtype == PART_KEY && isMiddleRow) {
          // Altar room — same as original but key colour matches boss room
          const acx = px2 + pw3 * 0.5; const acy = rtop + roomH * 0.5
          this._addWall(acx - 100.0, acy - 60.0, 40.0, 18.0)
          this._addWall(acx + 60.0, acy - 60.0, 40.0, 18.0)
          this._addWall(acx - 100.0, acy + 42.0, 40.0, 18.0)
          this._addWall(acx + 60.0, acy + 42.0, 40.0, 18.0)
          this._addWall(px2 + pw3 * 0.08, rtop + roomH * 0.15, 18.0, roomH * 0.28)
          this._addWall(px2 + pw3 * 0.08, rtop + roomH * 0.57, 18.0, roomH * 0.28)
          this._addWall(px2 + pw3 * 0.84, rtop + roomH * 0.15, 18.0, roomH * 0.28)
          this._addWall(px2 + pw3 * 0.84, rtop + roomH * 0.57, 18.0, roomH * 0.28)

          // Store key info
          if (colKeyIdx >= 0) {
            this.hasKey = true; this.keyX = acx; this.keyY = acy  // legacy
            const ki = new KeyInfo()
            ki.x = acx; ki.y = acy; ki.collected = false
            ki.colorIndex = keyColColorMap[colKeyIdx]
            this.keys.push(ki)
          }
        }

        // ── Spawn enemies ───────────────────────────────────────
        if (!isStartCell && !isAntechamber) {
          if (isEndCell) {
            const turret = new Enemy()
            turret.init(px2 + pw3 * 0.5, rtop + roomH * 0.5,
              ROLE_TURRET, levelNum, tier, this.floorY, this.floorH, this.totalW)
            this.enemies.push(turret)
            for (let g: i32 = 0; g < 2; g++) {
              const ga = (g as f64 + 0.5) * Math.PI
              const guard = new Enemy()
              guard.init(px2 + pw3 * 0.5 + Math.cos(ga) * 70.0,
                rtop + roomH * 0.5 + Math.sin(ga) * 70.0,
                ROLE_GRUNT, levelNum, tier + 1, this.floorY, this.floorH, this.totalW)
              this.enemies.push(guard)
            }
          } else {
            // Key room altar turrets
            if (rtype == PART_KEY && isMiddleRow) {
              const acx2 = px2 + pw3 * 0.5; const acy2 = rtop + roomH * 0.5
              for (let kt: i32 = 0; kt < 2; kt++) {
                const ka = (kt as f64) * Math.PI
                const kturret = new Enemy()
                kturret.init(acx2 + Math.cos(ka) * 85.0, acy2 + Math.sin(ka) * 55.0,
                  ROLE_TURRET, levelNum, tier, this.floorY, this.floorH, this.totalW)
                this.enemies.push(kturret)
              }
              // Extra sniper guard for key rooms
              const ksn = new Enemy()
              ksn.init(acx2 + (Math.random() - 0.5) * 120.0, acy2 + (Math.random() - 0.5) * 80.0,
                ROLE_SNIPER, levelNum, tier, this.floorY, this.floorH, this.totalW)
              this.enemies.push(ksn)
            }
            if (rtype == PART_PILLBOX && Math.random() < 0.6) {
              const t2 = new Enemy()
              t2.init(px2 + pw3 * 0.5, rtop + roomH * 0.5,
                ROLE_TURRET, levelNum, tier, this.floorY, this.floorH, this.totalW)
              this.enemies.push(t2)
            }
            const baseCount: i32 = Math.min(1 + (levelNum >> 1), 6) as i32
            const hsBonus: i32 = (i32)(highScore as f64 / 2000.0)
            const count = baseCount + hsBonus
            for (let e = 0; e < count; e++) {
              const ex = px2 + pw3 * 0.18 + Math.random() * pw3 * 0.64
              const ey = rtop + roomH * 0.14 + Math.random() * roomH * 0.72
              const role = this._pickRole(tier, e)
              const en = new Enemy()
              en.init(ex, ey, role, levelNum, tier,
                this.floorY, this.floorH, this.totalW)
              this.enemies.push(en)
            }
          }
        }
      } // end row loop

      // ── Build outer boundary wall segments for this column ───────
      // Top boundary (above row 0): solid unless this col's antechamber is row 0
      // Bottom boundary (below row 2): solid unless this col's antechamber is row 2
      // We build these per-column so we can cut a gap for the boss door.
      const doorW: f64 = 72.0
      const doorCentreX: f64 = px2 + pw3 * 0.5  // door always centred on column

      if (isAntechamberCol && !antechamberBelow) {
        // Antechamber is row 0 (north) — cut gap in TOP boundary for boss door
        const doorLeft = doorCentreX - doorW / 2.0 - px2
        const doorRight = doorCentreX + doorW / 2.0 - px2
        if (doorLeft > 0.0) this._addWall(px2, this.floorY - wt, doorLeft, wt)
        if (doorRight < pw3) this._addWall(px2 + doorRight, this.floorY - wt, pw3 - doorRight, wt)
        // Bottom boundary: solid for this column
        this._addWall(px2, this.floorY + totalH, pw3, wt)
      } else if (isAntechamberCol && antechamberBelow) {
        // Antechamber is row 2 (south) — cut gap in BOTTOM boundary for boss door
        const doorLeft2 = doorCentreX - doorW / 2.0 - px2
        const doorRight2 = doorCentreX + doorW / 2.0 - px2
        if (doorLeft2 > 0.0) this._addWall(px2, this.floorY + totalH, doorLeft2, wt)
        if (doorRight2 < pw3) this._addWall(px2 + doorRight2, this.floorY + totalH, pw3 - doorRight2, wt)
        // Top boundary: solid for this column
        this._addWall(px2, this.floorY - wt, pw3, wt)
      } else {
        // No antechamber — solid boundary on both sides for this column
        this._addWall(px2, this.floorY - wt, pw3, wt)
        this._addWall(px2, this.floorY + totalH, pw3, wt)
      }

      // ── Build boss room immediately beyond the antechamber ───────
      if (isAntechamberCol) {
        const bColorIdx = keyColColorMap[colKeyIdx]
        const brW: f64 = pw3   // exactly the column width — no overlap
        const brH: f64 = 520.0 + Math.random() * 100.0

        if (antechamberBelow) {
          // Boss room starts at the bottom boundary of the level
          const brY = this.floorY + totalH + wt
          const br = new BossRoom()
          br.build(px2, brY, brW, brH, doorCentreX, bColorIdx, true, levelNum, tier)
          this.bossRooms.push(br)
        } else {
          // Boss room ends at the top boundary of the level
          const brY = this.floorY - wt - brH
          const br2 = new BossRoom()
          br2.build(px2, brY, brW, brH, doorCentreX, bColorIdx, false, levelNum, tier)
          this.bossRooms.push(br2)
        }
      }
    } // end col loop

    // ── Exit door ────────────────────────────────────────────────
    const last = numCols - 1
    const lastX = colX[last]; const lastW2 = colW[last]
    this.door.set(lastX + lastW2 * 0.35, rowY1 + roomH * 0.25, lastW2 * 0.3, roomH * 0.5)
    // Exit door active from start (keys only gate boss rooms now)
    this.door.active = true
  }

  _addWall(x: f64, y: f64, w: f64, h: f64): void {
    const wl = new Wall(); wl.set(x, y, w, h); this.walls.push(wl)
  }

  _pickRole(tier: i32, idx: i32): i32 {
    if (tier <= 1) return ROLE_GRUNT
    if (tier == 2) return idx % 3 == 0 ? ROLE_FLANKER : ROLE_GRUNT
    if (tier == 3) {
      if (idx % 4 == 0) return ROLE_FLANKER
      if (idx % 5 == 0) return ROLE_SNIPER
      return ROLE_GRUNT
    }
    if (idx % 5 == 0) return ROLE_TANK
    if (idx % 3 == 0) return ROLE_FLANKER
    if (idx % 4 == 0) return ROLE_SNIPER
    return ROLE_GRUNT
  }

  allMainEnemiesDead(): bool {
    for (let i = 0; i < this.enemies.length; i++) if (this.enemies[i].alive) return false
    return true
  }

  // Collect all walls from main level + all boss rooms for raycasting
  allWalls(): Wall[] {
    var all: Wall[] = []
    for (let i = 0; i < this.walls.length; i++) all.push(this.walls[i])
    for (let b = 0; b < this.bossRooms.length; b++) {
      const br = this.bossRooms[b]
      for (let i = 0; i < br.walls.length; i++) all.push(br.walls[i])
    }
    return all
  }
}

// ─────────────────────────── Game globals ────────────────────────

var gameState: i32 = GS_MENU
var player: Player = new Player()
var bullets: Bullet[] = []
var particles: Particle[] = []
var level: Level = new Level()
var currentLevel: i32 = 1
var highScore: i32 = 0
var transitionTimer: f64 = 0.0
var camX: f64 = 0.0; var camY: f64 = 0.0
var shakeTimer: f64 = 0.0; var shakeIntensity: f64 = 0.0
var levelKills: i32 = 0
var levelTotalEnemies: i32 = 0
var bossesCleared: i32 = 0  // total boss rooms cleared this run

// ── Floating popup notifications (upgrade claimed, key picked up, etc.) ──
const MAX_POPUPS: i32 = 6
var popupTexts: string[] = ["", "", "", "", "", ""]
var popupTimers: f64[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
var popupCR: f64[] = [255.0, 255.0, 255.0, 255.0, 255.0, 255.0]
var popupCG: f64[] = [255.0, 255.0, 255.0, 255.0, 255.0, 255.0]
var popupCB: f64[] = [255.0, 255.0, 255.0, 255.0, 255.0, 255.0]

// ─────────────────────────── Helpers ─────────────────────────────

function initBullets(): void {
  bullets = []; for (let i = 0; i < MAX_BULLETS; i++) bullets.push(new Bullet())
}
function initParticles(): void {
  particles = []; for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle())
}
function spawnParticles(x: f64, y: f64, n: i32, r: f64, g: f64, b: f64): void {
  var s = 0
  for (let i = 0; i < particles.length && s < n; i++) {
    if (!particles[i].alive) {
      const a = Math.random() * Math.PI * 2.0; const sp = 60.0 + Math.random() * 120.0
      particles[i].spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp,
        0.4 + Math.random() * 0.4, r, g, b, 3.0 + Math.random() * 3.0); s++
    }
  }
}
function screenShake(intensity: f64, dur: f64): void { shakeIntensity = intensity; shakeTimer = dur }

function showPopup(msg: string, cr: f64, cg: f64, cb: f64): void {
  for (let i = 0; i < MAX_POPUPS; i++) {
    if (popupTimers[i] <= 0.0) {
      popupTexts[i] = msg; popupTimers[i] = 2.2
      popupCR[i] = cr; popupCG[i] = cg; popupCB[i] = cb
      return
    }
  }
  // All slots full — overwrite oldest
  popupTexts[0] = msg; popupTimers[0] = 2.2
  popupCR[0] = cr; popupCG[0] = cg; popupCB[0] = cb
}

function drawPopups(): void {
  const sw = screen.width(); const sh = screen.height()
  var yOff: f64 = sh / 2.0 - 30.0
  for (let i = 0; i < MAX_POPUPS; i++) {
    if (popupTimers[i] <= 0.0) continue
    const t = popupTimers[i] / 2.2   // 1→0
    const alpha = t < 0.3 ? t / 0.3 : (t > 0.85 ? (t - 0.85) / 0.15 : 1.0)
    // Rise upward as it fades
    const rise = (1.0 - t) * 40.0
    fill(popupCR[i], popupCG[i], popupCB[i], alpha * 0.9)
    font("Arial", 20, "bold")
    const tw = measureText(popupTexts[i])
    // Drop shadow
    fill(0, 0, 0, alpha * 0.5)
    text(popupTexts[i], sw / 2.0 - tw / 2.0 + 1, yOff - rise + 1)
    fill(popupCR[i], popupCG[i], popupCB[i], alpha * 0.95)
    text(popupTexts[i], sw / 2.0 - tw / 2.0, yOff - rise)
    yOff -= 28.0
  }
}

function startGame(): void {
  currentLevel = 1; player = new Player(); initBullets(); initParticles()
  player.initUpgrades()
  level = new Level(); level.build(currentLevel, highScore)
  player.init(level.spawnX, level.spawnY); player.score = 0
  levelKills = 0
  levelTotalEnemies = level.enemies.length
  for (let b = 0; b < level.bossRooms.length; b++) {
    levelTotalEnemies += level.bossRooms[b].enemies.length
  }
  bossesCleared = 0
  camX = 0.0; camY = 0.0; gameState = GS_PLAYING
}

function loadNextLevel(): void {
  const savedHp = player.hp
  // Save all upgrade state before reinit
  const savedMaxHp = player.maxHp
  const savedFireRate = player.fireRate
  const savedFireStacks = player.upgFireRateStacks
  const savedPoison = player.upgPoison
  const savedDashUnlocked = player.upgDashUnlocked
  const savedDashMax = player.dashMaxCharges
  const savedScore = player.score

  currentLevel++; initBullets(); initParticles()
  level = new Level(); level.build(currentLevel, highScore)
  player.init(level.spawnX, level.spawnY)

  // Restore everything that survives a level transition
  player.hp = Math.min(savedHp, savedMaxHp)
  player.maxHp = savedMaxHp
  player.fireRate = savedFireRate
  player.upgFireRateStacks = savedFireStacks
  player.upgPoison = savedPoison
  player.upgDashUnlocked = savedDashUnlocked
  player.dashMaxCharges = savedDashMax
  player.dashCharges = savedDashMax  // full charges on new level
  player.score = savedScore
  // Clear carried keys — they were for this level's boss rooms
  player.carriedKeys = []

  levelKills = 0
  levelTotalEnemies = level.enemies.length
  for (let b = 0; b < level.bossRooms.length; b++) {
    levelTotalEnemies += level.bossRooms[b].enemies.length
  }
  camX = 0.0; camY = 0.0; gameState = GS_PLAYING
}

// ─────────────────────────── HUD ─────────────────────────────────

function drawHUD(): void {
  const sw = screen.width(); const sh = screen.height()

  // ── HP bar ────────────────────────────────────────────────────
  fill(30, 10, 10, 0.7); rect(10, sh - 30, 160, 16, 4)
  fill(80, 220, 80); rect(10, sh - 30, 160.0 * (player.hp / player.maxHp), 16, 4)
  fill(220, 220, 220); font("Arial", 12); text("HP", 14, sh - 16)
  if (player.maxHp > 100.0) {
    fill(180, 255, 180, 0.8); font("Arial", 10)
    text((player.hp as i32).toString() + "/" + (player.maxHp as i32).toString(), 176, sh - 16)
  }

  // ── Dash stamina pips ─────────────────────────────────────────
  if (player.upgDashUnlocked) {
    const dashBarY: f64 = sh - 54.0
    fill(20, 10, 30, 0.75); rect(10, dashBarY, 160, 14, 4)
    const pipW: f64 = (160.0 - 4.0) / player.dashMaxCharges as f64 - 2.0
    for (let c = 0; c < player.dashMaxCharges; c++) {
      const pipX: f64 = 12.0 + c as f64 * (pipW + 2.0)
      if (c < player.dashCharges) {
        fill(160, 40, 220, 0.95); rect(pipX, dashBarY + 2, pipW, 10, 3)
      } else if (c == player.dashCharges && player.dashCharges < player.dashMaxCharges) {
        const frac = player.dashRechargeTimer / DASH_RECHARGE
        fill(60, 20, 80, 0.8); rect(pipX, dashBarY + 2, pipW, 10, 3)
        fill(120, 30, 160, 0.9); rect(pipX, dashBarY + 2, pipW * frac, 10, 3)
      } else {
        fill(40, 20, 50, 0.7); rect(pipX, dashBarY + 2, pipW, 10, 3)
      }
    }
    fill(180, 120, 255, 0.85); font("Arial", 10, "bold")
    text("DASH [SHIFT]", 14, dashBarY - 2)
  }

  // ── Active upgrades row ───────────────────────────────────────
  var upgX: f64 = 10.0
  const upgY: f64 = player.upgDashUnlocked ? sh - 72.0 : sh - 52.0
  if (player.upgFireRateStacks > 0) {
    fill(40, 130, 255, 0.9); font("Arial", 10, "bold")
    const fs = "⚡×" + player.upgFireRateStacks.toString()
    text(fs, upgX, upgY); upgX += measureText(fs) + 6
  }
  if (player.upgPoison) {
    fill(30, 200, 80, 0.9); font("Arial", 10, "bold")
    text("☠", upgX, upgY); upgX += 16
  }
  if (player.maxHp > 100.0) {
    fill(255, 100, 120, 0.9); font("Arial", 10, "bold")
    const hbonus = "♥+" + ((player.maxHp - 100.0) as i32).toString()
    text(hbonus, upgX, upgY); upgX += measureText(hbonus) + 6
  }
  if (player.dashMaxCharges > 3 && player.upgDashUnlocked) {
    fill(160, 40, 220, 0.9); font("Arial", 10, "bold")
    const ds = "»+" + (player.dashMaxCharges - 3).toString()
    text(ds, upgX, upgY)
  }

  // ── Score / floor ─────────────────────────────────────────────
  fill(255, 230, 80); font("Arial", 18, "bold")
  text("Score: " + player.score.toString(), 10, 30)
  fill(200, 200, 200); font("Arial", 13); text("Best: " + highScore.toString(), 10, 50)

  fill(180, 220, 255); font("Arial", 15, "bold")
  const ls = "FLOOR B" + currentLevel.toString()
  text(ls, sw / 2.0 - measureText(ls) / 2.0, 28)

  // ── Boss room key / status ────────────────────────────────────
  for (let b = 0; b < level.bossRooms.length; b++) {
    const br = level.bossRooms[b]
    const ki = b < level.keys.length ? level.keys[b] : null
    const cr = BOSS_CR[br.colorIndex]; const cg = BOSS_CG[br.colorIndex]
    const cb = BOSS_CB[br.colorIndex]
    const yOff: f64 = 52.0 + (b as f64) * 18.0

    if (br.cleared) {
      fill(cr, cg, cb, 0.9); font("Arial", 12, "bold")
      var upgName = ""
      if (br.colorIndex == UPG_MAX_HP) upgName = "+MAX HP"
      else if (br.colorIndex == UPG_FIRE_RATE) upgName = "+FIRE RATE"
      else if (br.colorIndex == UPG_POISON) upgName = "+POISON"
      else if (br.colorIndex == UPG_DASH) upgName = "+DASH"
      else upgName = "+DASH CHARGE"
      const clr = "✔ " + BOSS_NAME[br.colorIndex] + "  " + upgName
      text(clr, sw / 2.0 - measureText(clr) / 2.0, yOff)
    } else if (br.bossDefeated) {
      const pulse2 = 0.7 + 0.3 * Math.abs(Math.sin(elapsedTime() * 4.0))
      fill(cr, cg, cb, pulse2); font("Arial", 12, "bold")
      const bd = "⚡ GRAB UPGRADE — " + BOSS_NAME[br.colorIndex]
      text(bd, sw / 2.0 - measureText(bd) / 2.0, yOff)
    } else if (ki != null && ki.collected) {
      fill(cr, cg, cb, 0.85); font("Arial", 12, "bold")
      const entered = "⚔ " + BOSS_NAME[br.colorIndex] + " BOSS ROOM OPEN"
      text(entered, sw / 2.0 - measureText(entered) / 2.0, yOff)
    } else {
      fill(cr, cg, cb, 0.7); font("Arial", 11, "bold")
      const findKey = "🗝 FIND " + BOSS_NAME[br.colorIndex] + " KEY"
      text(findKey, sw / 2.0 - measureText(findKey) / 2.0, yOff)
    }
  }

  // ── Kill counter + exit ───────────────────────────────────────
  fill(255, 140, 80); font("Arial", 13)
  const killStr = levelKills.toString() + "/" + levelTotalEnemies.toString() + " killed"
  text(killStr, sw - measureText(killStr) - 8, 22)

  fill(80, 255, 160, 0.7); font("Arial", 13)
  const exitHint = "EXIT →"
  text(exitHint, sw - measureText(exitHint) - 8, 38)

  if (bossesCleared > 0) {
    fill(255, 200, 80, 0.9); font("Arial", 12, "bold")
    const bc = "Boss clears: " + bossesCleared.toString()
    text(bc, sw - measureText(bc) - 8, 56)
  }
}

// ─────────────────────────── Draw world ──────────────────────────

function _drawWorld(rcx: f64, rcy: f64): void {
  const sw = screen.width(); const sh = screen.height()
  fill(28, 28, 40); rect(0, 0, sw, sh)

  // ── Boss rooms (drawn first — behind level rows) ─────────────
  for (let b = 0; b < level.bossRooms.length; b++) {
    level.bossRooms[b].draw(rcx, rcy)
  }

  // ── Level floor parts ────────────────────────────────────────
  for (let i = 0; i < level.parts.length; i++) {
    const p = level.parts[i]
    const rx = p.worldX - rcx; const ry = p.worldY - rcy
    const pw2 = p.w; const ph = p.h

    if (p.type == PART_START) fill(48, 44, 36)
    else if (p.type == PART_END) fill(28, 36, 50)
    else if (p.type == PART_KEY) fill(38, 32, 48)
    else if (p.type == PART_BUNKER) fill(32, 36, 32)
    else if (p.type == PART_PILLBOX) fill(40, 36, 30)
    else fill(36, 34, 44)
    rect(rx, ry, pw2, ph)

    stroke(255, 255, 255, 0.04); lineWidth(0.5)
    const ts: f64 = 40.0
    var tx2: f64 = rx
    while (tx2 < rx + pw2) {
      beginPath(); moveTo(tx2, ry); lineTo(tx2, ry + ph); strokePath(); tx2 += ts
    }
    var ty2: f64 = ry
    while (ty2 < ry + ph) {
      beginPath(); moveTo(rx, ty2); lineTo(rx + pw2, ty2); strokePath(); ty2 += ts
    }

    if (p.type == PART_END) {
      const mx = rx + pw2 * 0.5
      fill(180, 150, 0, 0.25)
      for (let ci: i32 = 0; ci < 3; ci++) {
        const cy3 = ry + ph * 0.5 + (ci as f64 - 1.0) * 28.0
        rect(rx + pw2 * 0.2, cy3 - 6.0, pw2 * 0.6, 12.0, 2.0)
      }
      fill(38, 50, 68, 0.9); rect(mx - 34.0, ry + 6.0, 68.0, 42.0, 3.0)
      stroke(80, 110, 160, 0.8); lineWidth(1.5)
      beginPath(); moveTo(mx, ry + 6.0); lineTo(mx, ry + 48.0); strokePath()
      fill(255, 200, 60, 0.95); circle(mx + 38.0, ry + 26.0, 6.0)
      fill(255, 255, 200, 0.7); circle(mx + 38.0, ry + 26.0, 3.0)
      fill(120, 150, 200, 0.8); font("monospace", 9.0, "bold")
      text("B" + currentLevel.toString(), mx - 8.0, ry + 20.0)

    } else if (p.type == PART_KEY) {
      // Could be: (a) altar room (middle row, has a key), or (b) antechamber (outer row)
      // Detect by whether a key lives in this column at this worldX
      var keyForThisCol: i32 = -1  // colorIndex of key at this col, -1 = none
      for (let ki2 = 0; ki2 < level.keys.length; ki2++) {
        const k = level.keys[ki2]
        if (Math.abs(k.x - (p.worldX + pw2 * 0.5)) < 5.0) {
          keyForThisCol = k.colorIndex; break
        }
      }
      // Find the boss room for this column (same worldX range)
      var bossColorForCol: i32 = -1
      for (let bri = 0; bri < level.bossRooms.length; bri++) {
        const brt = level.bossRooms[bri]
        if (brt.x >= p.worldX - 2.0 && brt.x <= p.worldX + 2.0) {
          bossColorForCol = brt.colorIndex; break
        }
      }
      const themeCR: f64 = bossColorForCol >= 0 ? BOSS_CR[bossColorForCol] : (keyForThisCol >= 0 ? BOSS_CR[keyForThisCol] : 180.0)
      const themeCG: f64 = bossColorForCol >= 0 ? BOSS_CG[bossColorForCol] : (keyForThisCol >= 0 ? BOSS_CG[keyForThisCol] : 140.0)
      const themeCB: f64 = bossColorForCol >= 0 ? BOSS_CB[bossColorForCol] : (keyForThisCol >= 0 ? BOSS_CB[keyForThisCol] : 80.0)

      if (keyForThisCol >= 0) {
        // ── Altar room (middle row) ──────────────────────────────
        const acx = rx + pw2 * 0.5; const acy = ry + ph * 0.5
        // Circular mosaic
        stroke(themeCR, themeCG, themeCB, 0.20); lineWidth(1.5)
        for (let cr: i32 = 1; cr <= 3; cr++) {
          const rad = (cr as f64) * 38.0
          beginPath()
          for (let cs: i32 = 0; cs <= 32; cs++) {
            const ca = (cs as f64 / 32.0) * Math.PI * 2.0
            if (cs == 0) moveTo(acx + Math.cos(ca) * rad, acy + Math.sin(ca) * rad)
            else lineTo(acx + Math.cos(ca) * rad, acy + Math.sin(ca) * rad)
          }
          strokePath()
        }
        // 8-pointed star
        fill(themeCR, themeCG, themeCB, 0.12)
        for (let sp: i32 = 0; sp < 8; sp++) {
          const sa = (sp as f64 / 8.0) * Math.PI * 2.0
          beginPath(); moveTo(acx, acy)
          lineTo(acx + Math.cos(sa) * 70.0, acy + Math.sin(sa) * 70.0)
          lineTo(acx + Math.cos(sa + Math.PI / 8.0) * 30.0,
            acy + Math.sin(sa + Math.PI / 8.0) * 30.0)
          fillPath()
        }
        // Altar base
        var thisKeyCollected = false
        for (let ki3 = 0; ki3 < level.keys.length; ki3++) {
          if (Math.abs(level.keys[ki3].x - (p.worldX + pw2 * 0.5)) < 5.0) {
            thisKeyCollected = level.keys[ki3].collected; break
          }
        }
        if (!thisKeyCollected) {
          fill(90, 75, 55, 0.95); rect(acx - 18.0, acy - 18.0, 36.0, 36.0, 4.0)
          fill(themeCR * 0.5 + 60.0, themeCG * 0.5 + 50.0, themeCB * 0.5 + 40.0)
          rect(acx - 14.0, acy - 14.0, 28.0, 28.0, 3.0)
        } else {
          fill(60, 50, 40, 0.7); rect(acx - 18.0, acy - 18.0, 36.0, 36.0, 4.0)
          fill(80, 75, 65, 0.5); rect(acx - 14.0, acy - 14.0, 28.0, 28.0, 3.0)
        }
      } else {
        // ── Antechamber (outer row) — themed foyer to boss room ──
        const acx2 = rx + pw2 * 0.5; const acy2 = ry + ph * 0.5
        // Diagonal hazard stripes along edges
        fill(themeCR, themeCG, themeCB, 0.08)
        for (let hs: i32 = 0; hs < 6; hs++) {
          const hsx = rx + (hs as f64 / 6.0) * pw2
          beginPath()
          moveTo(hsx, ry); lineTo(hsx + pw2 / 6.0, ry)
          lineTo(hsx + pw2 / 6.0 - ph * 0.15, ry + ph)
          lineTo(hsx - ph * 0.15, ry + ph)
          fillPath()
        }
        // Two concentric rings toward the boss door side
        stroke(themeCR, themeCG, themeCB, 0.18); lineWidth(1.5)
        for (let ri: i32 = 1; ri <= 2; ri++) {
          const rr2 = (ri as f64) * Math.min(pw2, ph) * 0.18
          beginPath()
          for (let rs: i32 = 0; rs <= 24; rs++) {
            const ra = (rs as f64 / 24.0) * Math.PI * 2.0
            if (rs == 0) moveTo(acx2 + Math.cos(ra) * rr2, acy2 + Math.sin(ra) * rr2)
            else lineTo(acx2 + Math.cos(ra) * rr2, acy2 + Math.sin(ra) * rr2)
          }
          strokePath()
        }
        fill(themeCR, themeCG, themeCB, 0.55); font("Arial", 16, "bold")
        const arrow = "⚔ BOSS"
        text(arrow, rx + pw2 / 2 - measureText(arrow) / 2, ry + ph / 2 + 6)
        // Warning stripe border
        stroke(themeCR, themeCG, themeCB, 0.35); lineWidth(3.0)
        rect(rx + 4, ry + 4, pw2 - 8, ph - 8, 3)
      }

    } else if (p.type == PART_START) {
      fill(60, 55, 40, 0.2)
      rect(rx + pw2 * 0.55, ry + ph * 0.35, pw2 * 0.28, ph * 0.30, 3.0)
      stroke(120, 110, 70, 0.3); lineWidth(1.0)
      for (let ml: i32 = 0; ml < 4; ml++) {
        const mly = ry + ph * 0.4 + (ml as f64) * (ph * 0.06)
        beginPath(); moveTo(rx + pw2 * 0.57, mly); lineTo(rx + pw2 * 0.81, mly); strokePath()
      }

    } else if (p.type == PART_BUNKER) {
      fill(200, 160, 0, 0.10)
      for (let bs: i32 = 0; bs < 5; bs++) {
        const bsx = rx + (bs as f64) * (pw2 / 5.0)
        beginPath()
        moveTo(bsx, ry + ph * 0.82); lineTo(bsx + pw2 * 0.12, ry + ph * 0.82)
        lineTo(bsx + pw2 * 0.06, ry + ph); lineTo(bsx - pw2 * 0.06, ry + ph)
        fillPath()
      }

    } else if (p.type == PART_ARENA) {
      stroke(255, 255, 255, 0.06); lineWidth(2.0)
      const ar = ph * 0.28
      beginPath()
      for (let as2: i32 = 0; as2 <= 24; as2++) {
        const aa2 = (as2 as f64 / 24.0) * Math.PI * 2.0
        const apx = rx + pw2 * 0.5 + Math.cos(aa2) * ar
        const apy = ry + ph * 0.5 + Math.sin(aa2) * ar
        if (as2 == 0) moveTo(apx, apy); else lineTo(apx, apy)
      }
      strokePath()
    }
  }

  // ── Walls, doors, pickups ────────────────────────────────────
  for (let i = 0; i < level.walls.length; i++) level.walls[i].draw(rcx, rcy)
  level.door.draw(rcx, rcy)
  for (let i = 0; i < level.pickups.length; i++) level.pickups[i].draw(rcx, rcy)

  // ── Keys on altars ───────────────────────────────────────────
  for (let ki = 0; ki < level.keys.length; ki++) level.keys[ki].draw(rcx, rcy)

  // ── Main level enemies (FOV then body) ───────────────────────
  for (let i = 0; i < level.enemies.length; i++)
    if (level.enemies[i].alive) level.enemies[i].drawFOV(rcx, rcy, level.walls)
  for (let i = 0; i < level.enemies.length; i++) level.enemies[i].draw(rcx, rcy)

  // ── Boss room enemies ────────────────────────────────────────
  for (let b = 0; b < level.bossRooms.length; b++) {
    const br = level.bossRooms[b]
    const allW = level.allWalls()
    for (let i = 0; i < br.enemies.length; i++)
      if (br.enemies[i].alive) br.enemies[i].drawFOV(rcx, rcy, allW)
    for (let i = 0; i < br.enemies.length; i++) br.enemies[i].draw(rcx, rcy)
    for (let i = 0; i < br.pickups.length; i++) br.pickups[i].draw(rcx, rcy)
  }

  // ── Player, laser, bullets, particles ───────────────────────
  player.drawLaser(rcx, rcy, level.allWalls())
  for (let i = 0; i < bullets.length; i++)
    if (bullets[i].alive && bullets[i].fromPlayer) bullets[i].draw(rcx, rcy)
  for (let i = 0; i < bullets.length; i++)
    if (bullets[i].alive && !bullets[i].fromPlayer) bullets[i].draw(rcx, rcy)
  player.draw(rcx, rcy)
  for (let i = 0; i < particles.length; i++) particles[i].draw(rcx, rcy)

  // ── Boss HP bars drawn last (on top) ─────────────────────────
  for (let b2 = 0; b2 < level.bossRooms.length; b2++) {
    const br2 = level.bossRooms[b2]
    if (br2.isBossAlive()) {
      // Separate large HUD-style boss bar at top of screen
      const sw2 = screen.width()
      const cr = BOSS_CR[br2.colorIndex]; const cg = BOSS_CG[br2.colorIndex]
      const cb = BOSS_CB[br2.colorIndex]
      const boss = br2.enemies[0]
      // Only show if player is inside or near the boss room
      const playerInRoom = player.x > br2.x - 100.0 && player.x < br2.x + br2.w + 100.0 &&
        player.y > br2.y - 100.0 && player.y < br2.y + br2.h + 100.0
      if (playerInRoom) {
        const barW: f64 = 300.0; const barH: f64 = 14.0
        const barX = sw2 / 2.0 - barW / 2.0; const barY: f64 = 64.0
        fill(20, 10, 10, 0.8); rect(barX - 4, barY - 20, barW + 8, barH + 28, 6)
        fill(cr * 0.1, cg * 0.1, cb * 0.1); rect(barX, barY, barW, barH, 4)
        fill(cr, cg, cb); rect(barX, barY, barW * (boss.hp / boss.maxHp), barH, 4)
        fill(cr, cg, cb, 0.9); font("Arial", 12, "bold")
        const bossLabel = BOSS_NAME[br2.colorIndex] + " BOSS"
        text(bossLabel, sw2 / 2.0 - measureText(bossLabel) / 2.0, barY - 5)
        if (boss.phase == 1) {
          fill(255, 255, 255, 0.8); font("Arial", 9, "bold")
          text("⚠ ENRAGED", barX + barW - 52, barY + barH + 12)
        }
      }
    }
  }
}

// ─────────────────────────── Main update ─────────────────────────

export function update(): void {
  const dt = Math.min(deltaTime(), 0.05) as f64
  const sw = screen.width(); const sh = screen.height()

  if (gameState == GS_MENU) { startGame(); return }

  if (gameState == GS_GAME_OVER) {
    fill(10, 8, 14, 0.95); rect(0, 0, sw, sh)
    fill(255, 80, 80); font("Arial", 44, "bold")
    const go = "GAME OVER"; text(go, sw / 2.0 - measureText(go) / 2.0, sh / 2.0 - 60.0)
    fill(255, 230, 80); font("Arial", 22, "bold")
    const sc = "Score: " + player.score.toString()
    text(sc, sw / 2.0 - measureText(sc) / 2.0, sh / 2.0)
    fill(200, 200, 200); font("Arial", 16)
    const hs2 = "High Score: " + highScore.toString()
    text(hs2, sw / 2.0 - measureText(hs2) / 2.0, sh / 2.0 + 34.0)
    if (bossesCleared > 0) {
      fill(255, 180, 60); font("Arial", 14, "bold")
      const bc = "Boss rooms cleared: " + bossesCleared.toString()
      text(bc, sw / 2.0 - measureText(bc) / 2.0, sh / 2.0 + 58.0)
      // Show which upgrades were collected
      var upgList = ""
      if (player.upgFireRateStacks > 0) upgList += "⚡ "
      if (player.upgPoison) upgList += "☠ "
      if (player.maxHp > 100.0) upgList += "♥ "
      if (player.upgDashUnlocked) upgList += "» "
      if (upgList.length > 0) {
        fill(220, 220, 255, 0.8); font("Arial", 13)
        const ul = "Upgrades: " + upgList
        text(ul, sw / 2.0 - measureText(ul) / 2.0, sh / 2.0 + 78.0)
      }
    }
    fill(160, 200, 255); font("Arial", 15)
    const restart = "Press any key to restart"
    text(restart, sw / 2.0 - measureText(restart) / 2.0, sh / 2.0 + 84.0)
    return
  }

  if (gameState == GS_ROOM_CLEAR) {
    transitionTimer -= dt; _drawWorld(camX, camY)
    fill(20, 40, 20, 0.75); rect(0, 0, sw, sh)
    fill(80, 255, 160); font("Arial", 36, "bold")
    const rc = "FLOOR CLEARED"; text(rc, sw / 2.0 - measureText(rc) / 2.0, sh / 2.0 - 50.0)
    const pct = levelTotalEnemies > 0
      ? (levelKills as f64 / levelTotalEnemies as f64 * 100.0) : 0.0
    const pctStr = levelKills.toString() + " / " + levelTotalEnemies.toString()
      + "  (" + (pct as i32).toString() + "% eliminated)"
    fill(255, 200, 80); font("Arial", 18, "bold")
    text(pctStr, sw / 2.0 - measureText(pctStr) / 2.0, sh / 2.0 + 4.0)
    fill(180, 220, 180); font("Arial", 15)
    const ns = "Proceeding to next floor..."
    text(ns, sw / 2.0 - measureText(ns) / 2.0, sh / 2.0 + 36.0)
    if (transitionTimer <= 0.0) loadNextLevel()
    return
  }

  // ── PLAYING ──────────────────────────────────────────────────

  camX = lerp(camX, player.x - sw / 2.0, Math.min(dt * 8.0, 1.0))
  camY = lerp(camY, player.y - sh / 2.0, Math.min(dt * 8.0, 1.0))
  // Extend cam bounds to cover boss rooms
  var minCamY = level.floorY - sh * 0.5
  var maxCamY = level.floorY + level.floorH - sh * 0.5
  for (let b = 0; b < level.bossRooms.length; b++) {
    const br = level.bossRooms[b]
    if (br.y < minCamY + sh * 0.5) minCamY = br.y - sh * 0.4
    if (br.y + br.h > maxCamY + sh * 0.5) maxCamY = br.y + br.h - sh * 0.6
  }
  camX = clamp(camX, -sw * 0.1, level.totalW - sw * 0.9)
  camY = clamp(camY, minCamY, maxCamY)

  var sox: f64 = 0.0; var soy: f64 = 0.0
  if (shakeTimer > 0.0) {
    shakeTimer -= dt; sox = (Math.random() - 0.5) * shakeIntensity
    soy = (Math.random() - 0.5) * shakeIntensity
  }
  const rcx = camX + sox; const rcy = camY + soy

  // Build combined wall list for this frame (main + boss rooms)
  const allWalls = level.allWalls()

  player.update(dt, allWalls, rcx, rcy)

  // Dash trail particles
  if (player.dashTimer > 0.0) {
    spawnParticles(player.x, player.y, 2, 160.0, 40.0, 220.0)
  }

  if ((input.isMouseDown(0) || input.isKeyDown(" ")) && player.canShoot() && player.alive) {
    const wmx = input.mouseX() + rcx; const wmy = input.mouseY() + rcy
    player.shoot(bullets, wmx, wmy)
    spawnParticles(player.x, player.y, 3, 255, 230, 80)
  }

  const tier = level._tier(highScore)

  // ── Update main level enemies ─────────────────────────────────
  for (let i = 0; i < level.enemies.length; i++) {
    const en = level.enemies[i]; if (!en.alive) continue
    en.update(dt, player.x, player.y, allWalls, tier, level.enemies)
    if (en.canShoot() && en.canSeePlayer(player.x, player.y, allWalls)) {
      en.shoot(bullets, player.x, player.y)
    }
  }

  // ── Update boss room enemies ──────────────────────────────────
  for (let b = 0; b < level.bossRooms.length; b++) {
    const br = level.bossRooms[b]
    // Only activate boss room enemies if door is unlocked (player can enter)
    if (br.door.locked) continue
    for (let i = 0; i < br.enemies.length; i++) {
      const en = br.enemies[i]; if (!en.alive) continue
      en.update(dt, player.x, player.y, allWalls, tier, br.enemies)
      if (en.canShoot() && en.canSeePlayer(player.x, player.y, allWalls)) {
        // Boss fires burst, others fire single shots
        if (en.role == ROLE_BOSS && en.burstTimer <= 0.0 && Math.random() < 0.15) {
          en.shootBurst(bullets, player.x, player.y, en.phase == 1 ? 5 : 3)
          en.burstTimer = 3.5 - (en.phase as f64) * 1.0
        } else {
          en.shoot(bullets, player.x, player.y)
        }
      }
      if (en.burstTimer > 0.0) en.burstTimer -= dt
    }

    // Track boss defeated flag — spawn upgrade pickup in loot zone centre
    if (!br.bossDefeated && !br.isBossAlive() && br.enemies.length > 0) {
      br.bossDefeated = true
      const boss2 = br.enemies[0]
      spawnParticles(boss2.x, boss2.y, 30,
        BOSS_CR[br.colorIndex], BOSS_CG[br.colorIndex], BOSS_CB[br.colorIndex])
      screenShake(10.0, 0.6)
      player.score += 3000
      if (player.score > highScore) highScore = player.score
      showPopup("⚔ " + BOSS_NAME[br.colorIndex] + " BOSS DEFEATED  +3000",
        BOSS_CR[br.colorIndex], BOSS_CG[br.colorIndex], BOSS_CB[br.colorIndex])
      // Spawn the upgrade pickup at the loot zone centre
      const upgX = br.lootZoneX + br.lootZoneW * 0.5
      const upgY = br.lootZoneY + br.lootZoneH * 0.5
      br.upgradePickup.spawn(upgX, upgY, br.colorIndex, br.colorIndex)
      // Also spawn a few health pickups scattered in the loot zone
      for (let lp = 0; lp < 3; lp++) {
        const pk2 = new HealthPickup()
        pk2.spawn(
          br.lootZoneX + br.lootZoneW * 0.15 + Math.random() * br.lootZoneW * 0.7,
          br.lootZoneY + br.lootZoneH * 0.15 + Math.random() * br.lootZoneH * 0.7
        )
        br.pickups.push(pk2)
      }
    }

    // Update upgrade pickup + claim check
    if (br.upgradePickup.alive) {
      br.upgradePickup.update(dt)
      if (dist(player.x, player.y, br.upgradePickup.x, br.upgradePickup.y) < PLAYER_R + 18.0) {
        br.upgradePickup.alive = false
        br.cleared = true
        bossesCleared++
        player.score += 1500
        if (player.score > highScore) highScore = player.score
        // Apply the upgrade — upgType == colorIndex
        player.applyUpgrade(br.colorIndex)
        // Build popup text for this upgrade
        var upgPopupMsg = "UPGRADE: "
        if (br.colorIndex == UPG_MAX_HP) upgPopupMsg += "♥ MAX HP +40"
        else if (br.colorIndex == UPG_FIRE_RATE) upgPopupMsg += "⚡ FASTER FIRE RATE"
        else if (br.colorIndex == UPG_POISON) upgPopupMsg += "☠ POISON BULLETS"
        else if (br.colorIndex == UPG_DASH) upgPopupMsg += "» DASH UNLOCKED"
        else upgPopupMsg += "» +1 DASH CHARGE"
        showPopup(upgPopupMsg,
          BOSS_CR[br.colorIndex], BOSS_CG[br.colorIndex], BOSS_CB[br.colorIndex])
        // Remove key from player orbit once used
        for (let ki2 = 0; ki2 < player.carriedKeys.length; ki2++) {
          if (player.carriedKeys[ki2] == br.colorIndex) {
            player.carriedKeys.splice(ki2, 1)
            break
          }
        }
        spawnParticles(br.upgradePickup.x, br.upgradePickup.y, 32,
          BOSS_CR[br.colorIndex], BOSS_CG[br.colorIndex], BOSS_CB[br.colorIndex])
        screenShake(5.0, 0.3)
      }
    }

    // Update boss room pickups
    for (let i = 0; i < br.pickups.length; i++) {
      const pk = br.pickups[i]; if (!pk.alive) continue
      pk.update(dt)
      if (dist(pk.x, pk.y, player.x, player.y) < HEALTH_PICKUP_R + PLAYER_R) {
        player.hp = Math.min(player.maxHp, player.hp + 30.0)
        pk.alive = false; spawnParticles(pk.x, pk.y, 8, 80, 220, 100)
      }
    }
  }

  // ── Key collection ────────────────────────────────────────────
  for (let ki = 0; ki < level.keys.length; ki++) {
    const k = level.keys[ki]; if (k.collected) continue
    k.bobT += dt
    if (dist(player.x, player.y, k.x, k.y) < 30.0) {
      k.collected = true
      // Add key to player's orbit ring
      player.carriedKeys.push(k.colorIndex)
      // Show pickup popup
      showPopup("🗝 " + BOSS_NAME[k.colorIndex] + " KEY",
        BOSS_CR[k.colorIndex], BOSS_CG[k.colorIndex], BOSS_CB[k.colorIndex])
      // Unlock the paired boss room door
      if (ki < level.bossRooms.length) {
        level.bossRooms[ki].door.locked = false
        spawnParticles(k.x, k.y, 20,
          BOSS_CR[k.colorIndex], BOSS_CG[k.colorIndex], BOSS_CB[k.colorIndex])
        screenShake(4.0, 0.35)
        player.score += 300
        if (player.score > highScore) highScore = player.score
      }
    }
  }

  // ── Health pickups (main level) ───────────────────────────────
  for (let i = 0; i < level.pickups.length; i++) {
    const pk = level.pickups[i]; if (!pk.alive) continue
    pk.update(dt)
    if (dist(pk.x, pk.y, player.x, player.y) < HEALTH_PICKUP_R + PLAYER_R) {
      player.hp = Math.min(player.maxHp, player.hp + 25.0)
      pk.alive = false; spawnParticles(pk.x, pk.y, 8, 80, 220, 100)
    }
  }

  // ── Bullets ───────────────────────────────────────────────────
  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i]; if (!b.alive) continue
    b.update(dt); if (!b.alive) continue

    // Wall collision (all walls)
    for (let w = 0; w < allWalls.length; w++) {
      if (allWalls[w].overlapsCircle(b.x, b.y, BULLET_R)) {
        spawnParticles(b.x, b.y, 4, 200, 200, 160)
        b.alive = false; break
      }
    }
    if (!b.alive) continue

    if (b.fromPlayer) {
      // Hit main level enemies
      for (let e = 0; e < level.enemies.length; e++) {
        const en = level.enemies[e]; if (!en.alive) continue
        if (dist(b.x, b.y, en.x, en.y) < BULLET_R + en.radius) {
          const wasAlive = en.alive
          en.takeDamage(b.damage); b.alive = false
          en.onHit(player.x, player.y)
          if (b.poisoning) { en.poisonTimer = POISON_DURATION; en.poisonTick = 0.0 }
          spawnParticles(b.x, b.y, 6, b.poisoning ? 60.0 : 255.0, b.poisoning ? 200.0 : 80.0, b.poisoning ? 60.0 : 80.0)
          if (!en.alive && wasAlive) {
            spawnParticles(en.x, en.y, 12, 230, 60, 60)
            levelKills++; player.score += en.points
            if (player.score > highScore) highScore = player.score
            if (Math.random() < 0.35) {
              const pk3 = new HealthPickup(); pk3.spawn(en.x, en.y)
              level.pickups.push(pk3)
            }
          }
          break
        }
      }
      if (!b.alive) continue
      // Hit boss room enemies
      for (let bb = 0; bb < level.bossRooms.length; bb++) {
        const br3 = level.bossRooms[bb]; if (br3.door.locked) continue
        for (let e2 = 0; e2 < br3.enemies.length; e2++) {
          const en2 = br3.enemies[e2]; if (!en2.alive) continue
          if (dist(b.x, b.y, en2.x, en2.y) < BULLET_R + en2.radius) {
            const wasAlive2 = en2.alive
            en2.takeDamage(b.damage); b.alive = false
            en2.onHit(player.x, player.y)
            if (b.poisoning) { en2.poisonTimer = POISON_DURATION; en2.poisonTick = 0.0 }
            // Coloured sparks for boss hits
            spawnParticles(b.x, b.y, 6,
              BOSS_CR[br3.colorIndex], BOSS_CG[br3.colorIndex], BOSS_CB[br3.colorIndex])
            if (!en2.alive && wasAlive2) {
              spawnParticles(en2.x, en2.y, en2.role == ROLE_BOSS ? 30 : 12,
                BOSS_CR[br3.colorIndex], BOSS_CG[br3.colorIndex], BOSS_CB[br3.colorIndex])
              levelKills++; player.score += en2.points
              if (player.score > highScore) highScore = player.score
              if (en2.role != ROLE_BOSS && Math.random() < 0.3) {
                const pk4 = new HealthPickup(); pk4.spawn(en2.x, en2.y)
                br3.pickups.push(pk4)
              }
            }
            break
          }
        }
        if (!b.alive) break
      }
    } else {
      // Enemy bullet hitting player
      if (player.alive && dist(b.x, b.y, player.x, player.y) < BULLET_R + PLAYER_R) {
        player.takeDamage(b.damage); b.alive = false
        spawnParticles(b.x, b.y, 8, 80, 160, 255); screenShake(6.0, 0.2)
        if (!player.alive) {
          spawnParticles(player.x, player.y, 20, 80, 160, 255)
          if (player.score > highScore) highScore = player.score
          gameState = GS_GAME_OVER
        }
      }
    }
  }

  // ── Boss door entrance check ──────────────────────────────────
  // Player walks through an unlocked boss door → teleport into room entrance
  for (let b3 = 0; b3 < level.bossRooms.length; b3++) {
    const br4 = level.bossRooms[b3]
    if (br4.door.locked) continue
    if (br4.door.containsPoint(player.x, player.y)) {
      // Push player just past the door into the boss room
      const dCx = br4.door.x + br4.door.w * 0.5
      if (br4.doorOnTop) {
        // Door on top of room → push player downward into room
        player.y = br4.y + WALL_T + PLAYER_R + 10.0
        player.x = dCx
      } else {
        // Door on bottom of room → push player upward into room
        player.y = br4.y + br4.h - WALL_T - PLAYER_R - 10.0
        player.x = dCx
      }
    }
  }

  for (let i = 0; i < particles.length; i++) particles[i].update(dt)

  // Exit door is always active (boss rooms are optional)
  level.door.active = true
  if (level.door.active && player.alive && level.door.containsPoint(player.x, player.y)) {
    player.score += 500
    if (player.score > highScore) highScore = player.score
    gameState = GS_ROOM_CLEAR; transitionTimer = 2.5
  }

  _drawWorld(rcx, rcy)
  drawHUD()

  // Tick and draw floating popups
  for (let pi = 0; pi < MAX_POPUPS; pi++) {
    if (popupTimers[pi] > 0.0) popupTimers[pi] -= dt
  }
  drawPopups()
}

export function onKeyDown(key: string): void {
  if (gameState == GS_GAME_OVER) startGame()
}
export function onMouseDown(button: i32): void {
  if (gameState == GS_GAME_OVER) startGame()
}
`


export const csharpSample = `
using System;
using System.Collections.Generic;

// ── Constants ─────────────────────────────────────────
const int    TILE    = 24;
const int    WORLD_W = 60;
const int    WORLD_H = 32;
const int    DEPTH   = 6;
const double GRAV    = 980.0;
const double SPD     = 144.0;
const double JUMP    = -420.0;
const int    HOTBAR  = 6;   // slot 0 = eraser, slots 1-5 = blocks

// ── Block palette  (index 0 = eraser/air, 1-5 = real blocks) ──
// palette[0] is the eraser slot — never placed, just sets world=0

Block[] palette = {
    new("Erase",   0,   0,   0, true),   // slot 0 — remove block
    new("Grass",  87, 166,  72),
    new("Dirt",  134, 100,  67),
    new("Stone", 140, 140, 140),
    new("Wood",  165, 120,  60),
    new("Sand",  220, 205, 150),
};

// ── World ─────────────────────────────────────────────
int[,] world = new int[WORLD_W, WORLD_H]; // 0=air, 1..5=palette index
int[]  surfY  = new int[WORLD_W];

// ── Entity list ───────────────────────────────────────
var    entities   = new List<Entity>();
Player player     = null!;
double enemyTimer = 0;

// ── HUD state ─────────────────────────────────────────
int    selectedSlot  = 1;   // default to Grass
int    playerHealth  = 10;
double flashTimer    = 0;
bool   mouseHeld     = false;
bool   mouseJustDown = false;
double placeCooldown = 0;
double camX = 0, camY = 0;
double time = 0;

// ══════════════════════════════════════════════════════
//  WORLD GENERATION
// ══════════════════════════════════════════════════════
void GenWorld() {
    var rng = new Random(42);
    for (int x = 0; x < WORLD_W; x++) {
        int sy = 14 + (int)(Math.Sin(x * 0.35) * 2.5 + Math.Sin(x * 0.12) * 4.0);
        surfY[x] = sy;
        for (int y = 0; y < WORLD_H; y++) {
            if      (y < sy)      world[x, y] = 0;
            else if (y == sy)     world[x, y] = 1; // grass  → palette[1]
            else if (y <= sy + 3) world[x, y] = 2; // dirt   → palette[2]
            else                  world[x, y] = 3; // stone  → palette[3]
        }
        for (int y = sy + 5; y < WORLD_H - 1; y++)
            if (rng.NextDouble() < 0.05) world[x, y] = 4; // wood ore
    }
    for (int x = 22; x < 32; x++)
        world[x, surfY[x]] = 5; // sand strip
}

// ══════════════════════════════════════════════════════
//  PHYSICS
// ══════════════════════════════════════════════════════
bool IsSolid(int bx, int by) =>
    bx >= 0 && bx < WORLD_W && by >= 0 && by < WORLD_H && world[bx, by] > 0;

bool Overlaps(Entity a, Entity b) =>
    a.X < b.X + b.W && a.X + a.W > b.X &&
    a.Y < b.Y + b.H && a.Y + a.H > b.Y;

double SweepX(double x, double y, double w, double h, double dx) {
    if (dx == 0) return 0;
    double nx  = x + dx;
    int    col = dx < 0 ? (int)(nx / TILE) : (int)((nx + w - 1) / TILE);
    int    r0  = (int)((y + 1.0)     / TILE);
    int    r1  = (int)((y + h - 2.0) / TILE);
    for (int row = r0; row <= r1; row++) {
        if (IsSolid(col, row)) {
            nx = dx < 0 ? (col + 1) * TILE : col * TILE - w;
            return nx - x;
        }
    }
    return dx;
}

double SweepY(double x, double y, double w, double h, double dy, out bool landed) {
    landed = false;
    if (dy == 0) return 0;
    double ny  = y + dy;
    int    row = dy < 0 ? (int)(ny / TILE) : (int)((ny + h) / TILE);
    int    c0  = (int)((x + 1.0)     / TILE);
    int    c1  = (int)((x + w - 2.0) / TILE);
    for (int col = c0; col <= c1; col++) {
        if (IsSolid(col, row)) {
            if (dy > 0) { landed = true; ny = row * TILE - h; }
            else                         ny = (row + 1) * TILE;
            return ny - y;
        }
    }
    return dy;
}

void StepEntity(Entity e, double dt) {
    e.VY = Math.Min(e.VY + GRAV * dt, 900.0);

    double adx = SweepX(e.X, e.Y, e.W, e.H, e.VX * dt);
    if (Math.Abs(adx - e.VX * dt) > 0.5) e.VX = 0;
    e.X  = Math.Clamp(e.X + adx, 0, (WORLD_W - 2) * TILE);

    bool landed;
    double ady = SweepY(e.X, e.Y, e.W, e.H, e.VY * dt, out landed);
    if (landed || Math.Abs(ady - e.VY * dt) > 0.5) e.VY = 0;
    e.OnGround = landed;
    e.Y       += ady;
}

// ══════════════════════════════════════════════════════
//  2.5D BLOCK RENDERING
// ══════════════════════════════════════════════════════
void DrawBlock(double sx, double sy, double r, double g, double b,
               double lit, bool drawTop) {
    double T = TILE, D = DEPTH;
    r *= lit; g *= lit; b *= lit;
    Canvas.Fill(r, g, b);
    Canvas.Rect(sx, sy, T, T);
    if (drawTop) {
        Canvas.Fill(Math.Min(255, r * 1.35), Math.Min(255, g * 1.35), Math.Min(255, b * 1.2));
        Canvas.Polygon(new double[] { sx, sy,  sx+T, sy,  sx+T+D, sy-D,  sx+D, sy-D });
    }
    Canvas.Fill(r * 0.55, g * 0.55, b * 0.55);
    Canvas.Polygon(new double[] { sx+T, sy,  sx+T+D, sy-D,  sx+T+D, sy+T-D,  sx+T, sy+T });
}

// ── Eraser slot icon (X cross) ────────────────────────
void DrawEraserIcon(double sx, double sy, double size) {
    double p = size * 0.2;
    Canvas.Fill(220, 80, 80);
    Canvas.Line(sx + p, sy + p, sx + size - p, sy + size - p);
    Canvas.Line(sx + size - p, sy + p, sx + p, sy + size - p);
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
GenWorld();
player = new Player { X = 300, Y = 50, Tag = "player", Health = 10 };
entities.Add(player);

Input.OnKeyDown(key => {
    if ((key == "w" || key == "W" || key == " ") && player.OnGround) player.VY = JUMP;
    if (key == "1") selectedSlot = 0; if (key == "2") selectedSlot = 1;
    if (key == "3") selectedSlot = 2; if (key == "4") selectedSlot = 3;
    if (key == "5") selectedSlot = 4; if (key == "6") selectedSlot = 5;
});
Input.OnMouseDown(btn => { if (btn == 0) { mouseHeld = true; mouseJustDown = true; } });
Input.OnMouseUp  (btn => { if (btn == 0)   mouseHeld = false; });

// ══════════════════════════════════════════════════════
//  MAIN LOOP
// ══════════════════════════════════════════════════════
Screen.OnUpdate(() => {
    double dt = Math.Min(Screen.DeltaTime, 0.033);
    time         += dt;
    placeCooldown = Math.Max(0, placeCooldown - dt);
    flashTimer    = Math.Max(0, flashTimer    - dt);

    // ── Player movement ──────────────────────────────
    double mx = 0;
    if (Input.IsKeyDown("a") || Input.IsKeyDown("A") || Input.IsKeyDown("ArrowLeft"))  { mx = -1; player.FaceRight = false; }
    if (Input.IsKeyDown("d") || Input.IsKeyDown("D") || Input.IsKeyDown("ArrowRight")) { mx =  1; player.FaceRight = true;  }
    player.VX = mx * SPD;

    // ── Enemy spawning ───────────────────────────────
    enemyTimer -= dt;
    if (enemyTimer <= 0 && entities.Count < 10) {
        enemyTimer = 5.0 + new Random().NextDouble() * 4.0;
        var rng2 = new Random((int)(time * 9999));
        int side = rng2.Next(2) == 0 ? -1 : 1;
        int ex   = Math.Clamp((int)(player.X / TILE) + side * 18, 2, WORLD_W - 3);
        entities.Add(new Enemy {
            X = ex * TILE, Y = (surfY[ex] - 2) * TILE, Tag = "enemy", Health = 3
        });
    }

    // ── Tile interaction (reach + click) ─────────────
    double wMX    = Input.MouseX + camX;
    double wMY    = Input.MouseY + camY;
    int    tmx    = (int)(wMX / TILE);
    int    tmy    = (int)(wMY / TILE);
    double rdx    = wMX - (player.X + player.W * 0.5);
    double rdy    = wMY - (player.Y + player.H * 0.5);
    bool   inReach = Math.Sqrt(rdx * rdx + rdy * rdy) < 5 * TILE
                  && tmx >= 0 && tmx < WORLD_W && tmy >= 0 && tmy < WORLD_H;

    bool didHitEnemy = false;

    if (mouseJustDown) {
        // Hit enemies
        for (int i = entities.Count - 1; i >= 0; i--) {
            if (entities[i] is not Enemy en) continue;
            double ex2 = en.X - camX, ey2 = en.Y - camY;
            if (Input.MouseX >= ex2 && Input.MouseX <= ex2 + en.W &&
                Input.MouseY >= ey2 && Input.MouseY <= ey2 + en.H) {
                en.Health--;
                en.DmgTimer = 0.3;
                if (en.Health <= 0) entities.RemoveAt(i);
                didHitEnemy = true;
                break;
            }
        }
    }

    if (!didHitEnemy && inReach && placeCooldown <= 0) {
        bool isEraser = palette[selectedSlot].Eraser;
        if (mouseHeld) {
            if (isEraser) {
                // Eraser — remove any block on hold
                if (world[tmx, tmy] > 0) { world[tmx, tmy] = 0; placeCooldown = 0.08; }
            } else {
                // Place block on empty tile
                if (world[tmx, tmy] == 0) {
                    world[tmx, tmy] = selectedSlot; // palette index == world value
                    placeCooldown = 0.14;
                }
            }
        }
    }

    mouseJustDown = false;

    // ── Step entities ────────────────────────────────
    for (int i = entities.Count - 1; i >= 0; i--) {
        var e = entities[i];
        if (e is Enemy en3) {
            double dx = player.X - en3.X;
            en3.VX       = Math.Sign(dx) * 60.0;
            en3.FaceRight = dx > 0;
            if (Overlaps(en3, player) && en3.DmgTimer <= 0) {
                playerHealth--;
                en3.DmgTimer = 1.2;
                flashTimer   = 0.45;
                if (playerHealth <= 0) {
                    playerHealth = 10;
                    player.X = 300; player.Y = 50; player.VX = 0; player.VY = 0;
                }
            }
            en3.DmgTimer = Math.Max(0, en3.DmgTimer - dt);
        }
        StepEntity(e, dt);
    }

    // ── Camera ───────────────────────────────────────
    camX += ((player.X - Screen.Width  * 0.5 + player.W * 0.5) - camX) * dt * 10;
    camY += ((player.Y - Screen.Height * 0.5 + player.H * 0.5) - camY) * dt * 10;
    camX  = Math.Clamp(camX, 0, WORLD_W * TILE - Screen.Width);
    camY  = Math.Clamp(camY, 0, WORLD_H * TILE - Screen.Height);

    // ════════════════════════════════════════════════
    //  DRAW
    // ════════════════════════════════════════════════

    // Sky
    double skyT = 0.5 + Math.Sin(time * 0.07) * 0.5;
    Canvas.Fill(30 + skyT * 55, 100 + skyT * 65, 200 + skyT * 35);
    Canvas.Rect(0, 0, Screen.Width, Screen.Height);
    double sunA = time * 0.07;
    Canvas.Fill(255, 230, 100);
    Canvas.Circle(Screen.Width  * 0.5 + Math.Cos(sunA) * Screen.Width  * 0.38,
                  Screen.Height * 0.2 - Math.Sin(sunA) * Screen.Height * 0.25, 14);

    // World
    int bx0 = Math.Max(0, (int)(camX / TILE) - 1);
    int bx1 = Math.Min(WORLD_W - 1, bx0 + (int)(Screen.Width  / TILE) + 3);
    int by0 = Math.Max(0, (int)(camY / TILE) - 1);
    int by1 = Math.Min(WORLD_H - 1, by0 + (int)(Screen.Height / TILE) + 3);

    for (int bx = bx0; bx <= bx1; bx++)
    for (int by = by0; by <= by1; by++) {
        int bt = world[bx, by];
        if (bt == 0) continue;
        var blk     = palette[bt];
        double sx   = bx * TILE - camX;
        double sy   = by * TILE - camY;
        double lit  = Math.Clamp(1.0 - Math.Max(0, by - surfY[bx]) * 0.06, 0.2, 1.0);
        bool drawTop = by == 0 || world[bx, by - 1] == 0;
        DrawBlock(sx, sy, blk.R, blk.G, blk.B, lit, drawTop);
    }

    // Hover highlight — red tint for eraser, white for place
    if (inReach) {
        bool isEraser = palette[selectedSlot].Eraser;
        Canvas.Fill(isEraser ? 255 : 255, isEraser ? 80 : 255, isEraser ? 80 : 255,
                    isEraser ? 0.30 : 0.18);
        Canvas.Rect(tmx * TILE - camX, tmy * TILE - camY, TILE, TILE);
    }

    // Entities
    foreach (var e in entities) {
        double ex = e.X - camX, ey = e.Y - camY;
        if (ex < -40 || ex > Screen.Width + 40) continue;
        if (e is Enemy en4) {
            bool hit = en4.DmgTimer > 0;
            Canvas.Fill(hit ? 255 : 100, hit ? 80 : 170, hit ? 60 : 90);
            Canvas.Rect(ex + 2, ey + 11, 11, 13, 2);
            Canvas.Fill(160, 200, 140);
            Canvas.Rect(ex + 3, ey + 1, 9, 11, 2);
            Canvas.Fill(220, 30, 30);
            if (en4.FaceRight) { Canvas.Circle(ex + 10, ey + 6, 1.5); Canvas.Circle(ex + 8, ey + 6, 1.5); }
            else               { Canvas.Circle(ex + 5,  ey + 6, 1.5); Canvas.Circle(ex + 3, ey + 6, 1.5); }
            Canvas.Fill(60, 90, 60);
            Canvas.Rect(ex + 3, ey + 24, 4, 8);
            Canvas.Rect(ex + 8, ey + 24, 4, 8);
            for (int h = 0; h < 3; h++) {
                Canvas.Fill(h < en4.Health ? 220 : 55, 45, 45);
                Canvas.Rect(ex + h * 6, ey - 7, 5, 4, 1);
            }
        } else if (e is Player p) {
            bool hit = flashTimer > 0;
            Canvas.Fill(50, 70, 160);
            Canvas.Rect(ex + 2, ey + 18, 5, 9);
            Canvas.Rect(ex + 8, ey + 18, 5, 9);
            Canvas.Fill(hit ? 255 : 70, hit ? 80 : 130, hit ? 70 : 220);
            Canvas.Rect(ex + 1, ey + 8, 13, 12, 2);
            Canvas.Fill(200, 165, 130);
            Canvas.Rect(ex + 3, ey, 9, 10, 2);
            Canvas.Fill(70, 45, 25);
            Canvas.Rect(ex + 3, ey, 9, 3, 2);
            Canvas.Fill(30, 50, 160);
            Canvas.Rect(p.FaceRight ? ex + 10 : ex + 2, ey + 4, 2, 2);
        }
    }

    // ── HUD ─────────────────────────────────────────

    // Health bar
    Canvas.Fill(0, 0, 0, 0.5);  Canvas.Rect(8, 8, 104, 13, 4);
    Canvas.Fill(flashTimer > 0 ? 255 : 215, 45, 45);
    Canvas.Rect(9, 9, playerHealth * 10.0, 11, 3);
    Canvas.Fill(210, 210, 210); Canvas.Font("Arial", 9);
    Canvas.Text($"HP {playerHealth}/10", 13, 19);

    // Hotbar (6 slots: 0=erase, 1-5=blocks)
    double hbW = HOTBAR * 44.0;
    double hbX = Screen.Width / 2 - hbW / 2;
    double hbY = Screen.Height - 50;
    Canvas.Fill(0, 0, 0, 0.55);
    Canvas.Rect(hbX - 2, hbY - 2, hbW + 4, 46, 7);

    for (int i = 0; i < HOTBAR; i++) {
        bool sel  = i == selectedSlot;
        var  blk2 = palette[i];
        Canvas.Fill(sel ? 210 : 75, sel ? 210 : 75, sel ? 210 : 85, sel ? 0.92 : 0.45);
        Canvas.Rect(hbX + i * 44, hbY, 40, 40, 5);
        if (blk2.Eraser) {
            // Draw eraser X icon
            Canvas.LineWidth(2.5);
            DrawEraserIcon(hbX + i * 44 + 7, hbY + 8, 24);
            Canvas.LineWidth(1);
        } else {
            DrawBlock(hbX + i * 44 + 7, hbY + 8, blk2.R, blk2.G, blk2.B, 1.0, true);
        }
        Canvas.Fill(200, 200, 200); Canvas.Font("Arial", 9);
        Canvas.Text($"{i + 1}", hbX + i * 44 + 3, hbY + 12);
    }

    // Selected slot label
    Canvas.Fill(255, 255, 200); Canvas.Font("Arial", 12, "bold");
    string nm = palette[selectedSlot].Name;
    Canvas.Text(nm, Screen.Width / 2 - Canvas.MeasureText(nm) / 2, hbY - 6);

    // Controls
    Canvas.Fill(255, 255, 255, 0.4); Canvas.Font("Arial", 10);
    Canvas.Text("WASD/Space · LClick place/erase/hit · 1-6 select (1=erase)",
                Screen.Width / 2 - 190, Screen.Height - 8);
});

// ══════════════════════════════════════════════════════
//  TYPES  (after all top-level statements)
// ══════════════════════════════════════════════════════
class Entity {
    public double X, Y, VX, VY;
    public double W = 14, H = 28;
    public bool   OnGround;
    public string Tag      = "";
    public double DmgTimer;
    public int    Health   = 3;
    public bool   FaceRight = true;
}
class Player : Entity { public Player() { W = 15; H = 28; } }
class Enemy  : Entity { public Enemy()  { W = 15; H = 32; } }
record Block(string Name, double R, double G, double B, bool Eraser = false);
`