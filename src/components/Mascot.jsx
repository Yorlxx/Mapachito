import { useRef, useState } from 'react'

const EMBERS = ['🖤', '💜', '✨', '💫', '⭐', '🤍', '🍰']

function MascotArt() {
  return (
    <svg
      className="mascot-svg"
      viewBox="0 0 260 282"
      role="img"
      aria-label="Kuromi, una conejita traviesa con capucha de bufón negra y un corazón morado"
    >
      <defs>
        <linearGradient id="kuromi-hood" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#2c1a40" />
          <stop offset="0.5" stopColor="#170d24" />
          <stop offset="1" stopColor="#090510" />
        </linearGradient>
        <linearGradient id="kuromi-face" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#f8edff" />
          <stop offset="0.55" stopColor="#ead7fa" />
          <stop offset="1" stopColor="#ceb4e8" />
        </linearGradient>
        <linearGradient id="kuromi-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8b4fe" stopOpacity="0.7" />
          <stop offset="0.55" stopColor="#a855f7" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kuromi-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0abfc" />
          <stop offset="0.6" stopColor="#d946ef" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id="kuromi-blush" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9dbb" stopOpacity="0.65" />
          <stop offset="1" stopColor="#ff9dbb" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="mascot-tail">
        <path
          d="M173 219c25 19 53 12 56-9 2-15-11-24-23-17"
          fill="none"
          stroke="url(#kuromi-hood)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="M207 194l-15-9 4 20z" fill="#1a0e29" />
      </g>

      <g>
        <path
          d="M87 177c-19 2-35 14-35 28 3 11 20 12 33 0 6-5 9-16 8-23z"
          fill="url(#kuromi-hood)"
          stroke="url(#kuromi-rim)"
          strokeWidth="1.2"
        />
        <circle cx="58" cy="207" r="10" fill="url(#kuromi-face)" />
        <path
          d="M173 177c19 2 35 14 35 28-3 11-20 12-33 0-6-5-9-16-8-23z"
          fill="url(#kuromi-hood)"
          stroke="url(#kuromi-rim)"
          strokeWidth="1.2"
        />
        <circle cx="202" cy="207" r="10" fill="url(#kuromi-face)" />
      </g>

      <ellipse cx="102" cy="245" rx="22" ry="12" fill="url(#kuromi-face)" />
      <ellipse cx="158" cy="245" rx="22" ry="12" fill="url(#kuromi-face)" />
      <path
        d="M90 242q11 8 23 0M147 242q11 8 23 0"
        fill="none"
        stroke="#b795d4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M84 165c-18 21-19 49-3 67 13 14 30 18 49 18s36-4 49-18c16-18 15-46-3-67z"
        fill="url(#kuromi-hood)"
        stroke="url(#kuromi-rim)"
        strokeWidth="1.4"
      />
      <ellipse
        cx="130"
        cy="213"
        rx="35"
        ry="30"
        fill="rgba(240, 220, 255, 0.05)"
        stroke="rgba(240, 220, 255, 0.08)"
      />

      <path
        d="M130 228c-12-10-21-16-21-25 0-7 5-12 12-12 4 0 7 2 9 5 2-3 5-5 9-5 7 0 12 5 12 12 0 9-9 15-21 25z"
        fill="url(#kuromi-heart)"
      />
      <path
        d="M121 198c0-3 1-5 4-6"
        fill="none"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <g className="mascot-ears">
        <path
          d="M75 87C56 71 40 44 44 21c14-4 35 13 47 35 6 12 3 23-3 30z"
          fill="url(#kuromi-hood)"
          stroke="url(#kuromi-rim)"
          strokeWidth="1.5"
        />
        <path
          d="M72 70C60 56 53 39 55 29c10 5 22 20 28 33 3 7-3 10-5 12z"
          fill="#3b2155"
          stroke="rgba(216, 180, 254, 0.28)"
          strokeWidth="1"
        />
        <path
          d="M185 87c19-16 35-43 31-66-14-4-35 13-47 35-6 12-3 23 3 30z"
          fill="url(#kuromi-hood)"
          stroke="url(#kuromi-rim)"
          strokeWidth="1.5"
        />
        <path
          d="M188 70c12-14 19-31 17-41-10 5-22 20-28 33-3 7 3 10 5 12z"
          fill="#3b2155"
          stroke="rgba(216, 180, 254, 0.28)"
          strokeWidth="1"
        />
      </g>

      <path
        d="M56 118c-5-44 25-74 74-74s79 30 74 74c-4 37-30 60-74 60s-70-23-74-60z"
        fill="url(#kuromi-hood)"
        stroke="url(#kuromi-rim)"
        strokeWidth="1.8"
      />
      <path
        d="M72 101c-3-28 17-48 44-52"
        fill="none"
        stroke="rgba(240, 224, 255, 0.18)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <ellipse cx="130" cy="118" rx="55" ry="46" fill="url(#kuromi-face)" />
      <ellipse
        cx="130"
        cy="113"
        rx="51"
        ry="42"
        fill="none"
        stroke="rgba(74, 43, 95, 0.16)"
        strokeWidth="5"
      />

      <g transform="translate(130 65)">
        <ellipse cx="0" cy="1" rx="22" ry="20" fill="rgba(240, 171, 252, 0.12)" />
        <path
          d="M-14 4c0-12 7-19 14-19S14-8 14 4v4c0 3-2 5-5 5h-2l-1 6H2l-1-5H-1l-1 5h-4l-1-6h-2c-3 0-5-2-5-5z"
          fill="#f3a9c4"
          stroke="#4b1731"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <ellipse cx="-4.8" cy="-1" rx="3" ry="3.7" fill="#401229" />
        <ellipse cx="4.8" cy="-1" rx="3" ry="3.7" fill="#401229" />
        <path
          d="M-2.3 6Q0 8 2.3 6"
          fill="none"
          stroke="#401229"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M-5 10v2M-1.7 10v2M1.7 10v2M5 10v2"
          stroke="#401229"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      <g className="mascot-eye">
        <ellipse cx="107" cy="118" rx="10.5" ry="12.5" fill="#24102f" />
        <ellipse cx="103.5" cy="113" rx="3.3" ry="3.1" fill="rgba(255, 255, 255, 0.92)" />
        <circle cx="110" cy="123" r="1.6" fill="#c084fc" opacity="0.7" />
      </g>
      <g className="mascot-eye mascot-eye--right">
        <ellipse cx="153" cy="118" rx="10.5" ry="12.5" fill="#24102f" />
        <ellipse cx="149.5" cy="113" rx="3.3" ry="3.1" fill="rgba(255, 255, 255, 0.92)" />
        <circle cx="156" cy="123" r="1.6" fill="#c084fc" opacity="0.7" />
      </g>

      <ellipse cx="90" cy="136" rx="11" ry="6" fill="url(#kuromi-blush)" />
      <ellipse cx="170" cy="136" rx="11" ry="6" fill="url(#kuromi-blush)" />

      <path
        d="M122 139c5 6 15 6 21-1"
        fill="none"
        stroke="#2a0e33"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M139 143l3 5 3-6z" fill="#fffafd" opacity="0.92" />

      <g className="mascot-collar">
        <path
          d="M84 162c11 10 81 10 92 0l2 10c-18 13-78 13-96 0z"
          fill="#22122f"
          stroke="rgba(192, 132, 252, 0.5)"
          strokeWidth="1.2"
        />
        <ellipse cx="100" cy="169" rx="14" ry="9" fill="#ead7fa" stroke="#7c3aed" strokeWidth="1.1" />
        <ellipse cx="130" cy="173" rx="14" ry="9" fill="#dcc5f3" stroke="#7c3aed" strokeWidth="1.1" />
        <ellipse cx="160" cy="169" rx="14" ry="9" fill="#ead7fa" stroke="#7c3aed" strokeWidth="1.1" />
      </g>

      <g className="mascot-sparkles" aria-hidden="true">
        <path d="M45 150l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#e9d5ff" opacity="0.75" />
        <path d="M219 127l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#f0abfc" opacity="0.7" />
      </g>
    </svg>
  )
}

export default function Mascot({ apodo, animal, food }) {
  const cleanAnimal = animal.replace(/[^\p{L}\s]/gu, '').trim() || 'Kuromi'
  const foodName = food.charAt(0).toLowerCase() + food.slice(1)
  const lines = [
    `Hola, ${apodo}. Llegaste justo a la hora del atardecer ✨`,
    `Mi superpoder es reírme en momentos serios. El tuyo podría ser aparecer y mejorar el plan.`,
    `Tienes cara de necesitar ${foodName}. Yo solo digo 🍰`,
    `Modo misterioso: activado. Modo ternura: también 🖤`,
    `Si sigues tocándome, voy a pensar que te caigo. Y no me estaría equivocando.`,
    `Advertencia: este rincón contiene cero presión y una cantidad sospechosa de morado.`,
    `No sé mucho de constelaciones, pero contigo hay buena órbita ✨`,
    `¿Sabías que el lila le queda bien a la gente interesante? Fuente: yo.`,
    `Tócame otra vez. Es gratis y me encanta el drama 🎭`,
    `Tienes un no-sé-qué que me saca una sonrisa. No se lo digas a nadie.`,
  ]

  const [line, setLine] = useState(0)
  const [taps, setTaps] = useState(0)
  const [jumpKey, setJumpKey] = useState(0)
  const [particles, setParticles] = useState([])
  const particleId = useRef(0)

  const handleTap = () => {
    setTaps((count) => count + 1)
    setLine((current) => (current + 1) % lines.length)
    setJumpKey((key) => key + 1)

    const batch = Array.from({ length: 11 }, () => ({
      id: (particleId.current += 1),
      emoji: EMBERS[Math.floor(Math.random() * EMBERS.length)],
      x: Math.random() * 120 - 60,
      y: -(40 + Math.random() * 110),
      rotation: Math.random() * 360 - 180,
      size: 13 + Math.random() * 14,
    }))
    setParticles((current) => [...current, ...batch].slice(-48))
  }

  const removeParticle = (id) => {
    setParticles((current) => current.filter((particle) => particle.id !== id))
  }

  return (
    <div className="mascot-scene">
      <div className="mascot-bubble" aria-live="polite" aria-atomic="true">
        <span className="bubble-label">
          <i aria-hidden="true" /> {cleanAnimal} dice
        </span>
        <p key={line}>{lines[line]}</p>
      </div>

      <div className="mascot-stage">
        <span className="drift drift-1" aria-hidden="true">🖤</span>
        <span className="drift drift-2" aria-hidden="true">✨</span>
        <span className="drift drift-3" aria-hidden="true">🌙</span>

        <button
          type="button"
          className="mascot-button"
          onClick={handleTap}
          aria-label={`Toca a ${cleanAnimal} para ver una frase y lanzar corazones`}
        >
          <span className="mascot-halo" aria-hidden="true" />
          <span className="mascot-float" aria-hidden="true">
            <span key={jumpKey} className={jumpKey ? 'mascot-jump is-jumping' : 'mascot-jump'}>
              <MascotArt />
            </span>
          </span>
          <span className="mascot-shadow" aria-hidden="true" />
          <span className="tap-hint">
            {taps === 0
              ? 'tócame ✦'
              : `${taps} ${taps === 1 ? 'caricia' : 'caricias'} · otra vez`}
          </span>
        </button>

        <div className="mascot-particles" aria-hidden="true">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="burst-particle"
              style={{
                '--tx': `${particle.x}px`,
                '--ty': `${particle.y}px`,
                '--rot': `${particle.rotation}deg`,
                '--size': `${particle.size}px`,
              }}
              onAnimationEnd={() => removeParticle(particle.id)}
            >
              {particle.emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
