import { useEffect, useRef } from 'react'
import { hexToRgb } from '../utils'

const TAU = Math.PI * 2
const rand = (min, max) => min + Math.random() * (max - min)

export default function Atmosphere({ accent }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const bg = document.createElement('canvas')
    const bgCtx = bg.getContext('2d')
    const accentRgb = hexToRgb(accent)
    const accentCss = `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let resizeFrame = 0
    let lastFrame = 0
    let lastTime = 0
    let nextShooter = 0
    let visible = !document.hidden
    let stars = []
    let motes = []
    let shooters = []

    const paintStatic = () => {
      bg.width = Math.round(width * dpr)
      bg.height = Math.round(height * dpr)
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bgCtx.clearRect(0, 0, width, height)

      const horizon = height * 0.735
      const sunX = width * 0.7
      const sunY = horizon - 5
      const sunRadius = Math.max(70, width * 0.19)

      const sky = bgCtx.createLinearGradient(0, 0, 0, horizon)
      sky.addColorStop(0, '#05030b')
      sky.addColorStop(0.34, '#0d0716')
      sky.addColorStop(0.61, '#1b0d27')
      sky.addColorStop(0.82, '#35162f')
      sky.addColorStop(1, '#6c3042')
      bgCtx.fillStyle = sky
      bgCtx.fillRect(0, 0, width, horizon + 1)

      const violetHaze = bgCtx.createRadialGradient(
        width * 0.12,
        height * 0.16,
        0,
        width * 0.12,
        height * 0.16,
        width * 0.95,
      )
      violetHaze.addColorStop(0, `rgba(${accentCss}, 0.22)`)
      violetHaze.addColorStop(0.5, `rgba(${accentCss}, 0.06)`)
      violetHaze.addColorStop(1, `rgba(${accentCss}, 0)`)
      bgCtx.fillStyle = violetHaze
      bgCtx.fillRect(0, 0, width, horizon)

      const sunsetGlow = bgCtx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        sunRadius * 2.5,
      )
      sunsetGlow.addColorStop(0, 'rgba(255, 220, 175, 0.5)')
      sunsetGlow.addColorStop(0.3, 'rgba(255, 159, 126, 0.28)')
      sunsetGlow.addColorStop(0.63, `rgba(${accentCss}, 0.13)`)
      sunsetGlow.addColorStop(1, `rgba(${accentCss}, 0)`)
      bgCtx.fillStyle = sunsetGlow
      bgCtx.fillRect(0, 0, width, horizon)

      const sun = bgCtx.createRadialGradient(sunX, sunY, 1, sunX, sunY, sunRadius * 0.31)
      sun.addColorStop(0, 'rgba(255, 241, 211, 0.96)')
      sun.addColorStop(0.55, 'rgba(255, 199, 148, 0.9)')
      sun.addColorStop(1, 'rgba(255, 157, 125, 0)')
      bgCtx.fillStyle = sun
      bgCtx.beginPath()
      bgCtx.arc(sunX, sunY, sunRadius * 0.34, 0, TAU)
      bgCtx.fill()

      const cloudShadow = bgCtx.createLinearGradient(0, horizon * 0.77, 0, horizon)
      cloudShadow.addColorStop(0, 'rgba(10, 5, 18, 0)')
      cloudShadow.addColorStop(0.55, 'rgba(9, 4, 16, 0.36)')
      cloudShadow.addColorStop(1, 'rgba(7, 3, 12, 0.82)')
      bgCtx.fillStyle = cloudShadow
      bgCtx.fillRect(0, horizon * 0.7, width, horizon * 0.31)

      ;[
        { x: 0.18, y: 0.67, w: 0.46, h: 0.017, a: 0.13 },
        { x: 0.66, y: 0.62, w: 0.4, h: 0.013, a: 0.1 },
        { x: 0.4, y: 0.7, w: 0.56, h: 0.015, a: 0.09 },
      ].forEach((cloud) => {
        const gradient = bgCtx.createLinearGradient(
          (cloud.x - cloud.w / 2) * width,
          0,
          (cloud.x + cloud.w / 2) * width,
          0,
        )
        gradient.addColorStop(0, 'rgba(255, 203, 176, 0)')
        gradient.addColorStop(0.5, `rgba(255, 203, 176, ${cloud.a})`)
        gradient.addColorStop(1, 'rgba(255, 203, 176, 0)')
        bgCtx.fillStyle = gradient
        bgCtx.beginPath()
        bgCtx.ellipse(
          cloud.x * width,
          cloud.y * height,
          (cloud.w * width) / 2,
          (cloud.h * height) / 2,
          0,
          0,
          TAU,
        )
        bgCtx.fill()
      })

      const sea = bgCtx.createLinearGradient(0, horizon, 0, height)
      sea.addColorStop(0, '#4b2337')
      sea.addColorStop(0.12, '#2a132e')
      sea.addColorStop(0.46, '#140b1e')
      sea.addColorStop(1, '#06030b')
      bgCtx.fillStyle = sea
      bgCtx.fillRect(0, horizon, width, height - horizon)

      const horizonLine = bgCtx.createLinearGradient(0, 0, width, 0)
      horizonLine.addColorStop(0, 'rgba(255, 183, 150, 0)')
      horizonLine.addColorStop(0.45, 'rgba(255, 183, 150, 0.28)')
      horizonLine.addColorStop(0.78, 'rgba(255, 213, 178, 0.5)')
      horizonLine.addColorStop(1, 'rgba(255, 183, 150, 0)')
      bgCtx.fillStyle = horizonLine
      bgCtx.fillRect(0, horizon - 0.5, width, 1.2)

      const reflection = bgCtx.createRadialGradient(
        sunX,
        horizon,
        0,
        sunX,
        horizon,
        width * 0.42,
      )
      reflection.addColorStop(0, 'rgba(255, 172, 128, 0.22)')
      reflection.addColorStop(0.5, `rgba(${accentCss}, 0.08)`)
      reflection.addColorStop(1, 'rgba(255, 172, 128, 0)')
      bgCtx.fillStyle = reflection
      bgCtx.fillRect(0, horizon, width, height - horizon)

      const moonX = width * 0.865
      const moonY = height * 0.078
      const moonRadius = Math.max(11, width * 0.031)
      const moonGlow = bgCtx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 58)
      moonGlow.addColorStop(0, 'rgba(236, 220, 255, 0.16)')
      moonGlow.addColorStop(0.5, 'rgba(196, 158, 255, 0.07)')
      moonGlow.addColorStop(1, 'rgba(196, 158, 255, 0)')
      bgCtx.fillStyle = moonGlow
      bgCtx.beginPath()
      bgCtx.arc(moonX, moonY, 58, 0, TAU)
      bgCtx.fill()

      bgCtx.fillStyle = 'rgba(244, 234, 255, 0.76)'
      bgCtx.beginPath()
      bgCtx.arc(moonX, moonY, moonRadius, 0, TAU)
      bgCtx.fill()
      bgCtx.globalCompositeOperation = 'destination-out'
      bgCtx.beginPath()
      bgCtx.arc(moonX + moonRadius * 0.66, moonY - moonRadius * 0.3, moonRadius * 0.96, 0, TAU)
      bgCtx.fill()
      bgCtx.globalCompositeOperation = 'source-over'
    }

    const resetParticles = () => {
      const starCount = Math.max(38, Math.min(110, Math.round(width * 0.24)))
      stars = Array.from({ length: starCount }, () => ({
        x: rand(0, width),
        y: rand(0, height * 0.67),
        r: rand(0.35, 1.45),
        phase: rand(0, TAU),
        speed: rand(0.4, 1.7),
        opacity: rand(0.35, 0.95),
        tint: Math.random() < 0.18 ? `rgba(${accentCss}, 0.9)` : 'rgba(255, 249, 240, 0.95)',
      }))

      motes = Array.from({ length: width < 400 ? 12 : 17 }, () => ({
        x: rand(0, width),
        y: rand(height * 0.25, height),
        r: rand(0.8, 2),
        speed: rand(4, 11),
        sway: rand(4, 16),
        phase: rand(0, TAU),
        alpha: rand(0.16, 0.46),
        warm: Math.random() < 0.45,
      }))

      shooters = []
      nextShooter = performance.now() + rand(2800, 6200)
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintStatic()
      resetParticles()
      draw(performance.now() / 1000, 0)
    }

    const draw = (time, dt) => {
      const horizon = height * 0.735
      const sunX = width * 0.7

      ctx.drawImage(bg, 0, 0, width, height)

      stars.forEach((star) => {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase))
        ctx.globalAlpha = star.opacity * twinkle
        ctx.fillStyle = star.tint
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, TAU)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      if (!motionQuery.matches) {
        if (time * 1000 > nextShooter) {
          const fromLeft = Math.random() < 0.75
          shooters.push({
            x: rand(fromLeft ? 0.02 : 0.3, fromLeft ? 0.68 : 0.95) * width,
            y: rand(0.05, 0.34) * height,
            vx: rand(360, 520) * (fromLeft ? 1 : -0.7),
            vy: rand(120, 190),
            life: 0,
            duration: rand(0.7, 1.05),
            length: rand(70, 130),
          })
          nextShooter = time * 1000 + rand(3800, 9000)
        }

        shooters = shooters.filter((shooter) => shooter.life < shooter.duration)
        shooters.forEach((shooter) => {
          shooter.life += dt
          shooter.x += shooter.vx * dt
          shooter.y += shooter.vy * dt
          const progress = shooter.life / shooter.duration
          const alpha = Math.sin(Math.PI * progress) * 0.85
          const tailX = shooter.x - (shooter.vx / 520) * shooter.length
          const tailY = shooter.y - (shooter.vy / 520) * shooter.length
          const trail = ctx.createLinearGradient(shooter.x, shooter.y, tailX, tailY)
          trail.addColorStop(0, `rgba(255, 244, 228, ${alpha})`)
          trail.addColorStop(0.4, `rgba(${accentCss}, ${alpha * 0.55})`)
          trail.addColorStop(1, `rgba(${accentCss}, 0)`)
          ctx.strokeStyle = trail
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(shooter.x, shooter.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()
          ctx.fillStyle = `rgba(255, 250, 240, ${alpha})`
          ctx.beginPath()
          ctx.arc(shooter.x, shooter.y, 1.5, 0, TAU)
          ctx.fill()
        })

        motes.forEach((mote) => {
          mote.y -= mote.speed * dt
          mote.phase += dt * 0.55
          if (mote.y < height * 0.2) {
            mote.y = height + rand(4, 40)
            mote.x = rand(0, width)
          }
          const x = mote.x + Math.sin(mote.phase) * mote.sway
          ctx.globalAlpha = mote.alpha
          ctx.fillStyle = mote.warm ? 'rgba(255, 196, 156, 0.9)' : `rgba(${accentCss}, 0.95)`
          ctx.beginPath()
          ctx.arc(x, mote.y, mote.r, 0, TAU)
          ctx.fill()
          ctx.globalAlpha = mote.alpha * 0.18
          ctx.beginPath()
          ctx.arc(x, mote.y, mote.r * 4, 0, TAU)
          ctx.fill()
        })
        ctx.globalAlpha = 1

        for (let line = 0; line < 5; line += 1) {
          const y = horizon + 20 + line * 17
          if (y > height) break
          const shimmerWidth = 16 + line * 7 + Math.sin(time * 1.4 + line * 2.1) * 9
          const shimmerAlpha =
            0.16 * (1 - line / 7) * (0.55 + 0.45 * Math.sin(time * 2 + line * 1.7))
          ctx.fillStyle = `rgba(255, 192, 150, ${Math.max(0, shimmerAlpha)})`
          ctx.beginPath()
          ctx.ellipse(
            sunX + Math.sin(time * 0.8 + line) * 7,
            y,
            shimmerWidth,
            1.1,
            0,
            0,
            TAU,
          )
          ctx.fill()
        }

        for (let wave = 0; wave < 4; wave += 1) {
          const baseY = horizon + 34 + wave * 23
          if (baseY > height + 10) break
          ctx.beginPath()
          for (let x = 0; x <= width; x += 10) {
            const y =
              baseY +
              Math.sin(x * 0.018 + time * (0.32 + wave * 0.04) + wave * 1.9) *
                (2.5 + wave * 1.4) +
              Math.sin(x * 0.045 - time * 0.22) * 0.9
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.strokeStyle =
            wave % 2 === 0
              ? `rgba(255, 188, 148, ${0.1 - wave * 0.014})`
              : `rgba(${accentCss}, ${0.11 - wave * 0.015})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      if (!visible) return
      if (now - lastFrame < 32) return
      const dt = Math.min(0.06, (now - (lastTime || now)) / 1000)
      lastTime = now
      lastFrame = now
      if (motionQuery.matches) {
        if (!lastFrame) draw(now / 1000, 0)
        return
      }
      draw(now / 1000, dt)
    }

    const scheduleResize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        resize()
      })
    }

    const handleVisibility = () => {
      visible = !document.hidden
      lastTime = performance.now()
    }

    const handleMotionChange = () => {
      cancelAnimationFrame(frame)
      lastFrame = 0
      resize()
      if (!motionQuery.matches) frame = requestAnimationFrame(tick)
      else draw(performance.now() / 1000, 0)
    }

    resize()
    window.addEventListener('resize', scheduleResize)
    window.addEventListener('orientationchange', scheduleResize)
    document.addEventListener('visibilitychange', handleVisibility)
    motionQuery.addEventListener?.('change', handleMotionChange)
    if (motionQuery.matches) {
      draw(performance.now() / 1000, 0)
    } else {
      frame = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', scheduleResize)
      window.removeEventListener('orientationchange', scheduleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      motionQuery.removeEventListener?.('change', handleMotionChange)
    }
  }, [accent])

  return <canvas ref={canvasRef} className="atmosphere" aria-hidden="true" />
}
