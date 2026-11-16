import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  ArrowDown,
  Heart,
  MoonStar,
  Sparkles,
  Sunset,
} from 'lucide-react'
import Atmosphere from './components/Atmosphere'
import CharacterCard from './components/CharacterCard'
import EmojiRain from './components/EmojiRain'
import Mascot from './components/Mascot'
import MiniGame from './components/MiniGame'
import SecretCapsule from './components/SecretCapsule'
import SectionHeading from './components/SectionHeading'
import Soundtrack from './components/Soundtrack'
import data from './data/ella.json'
import { formatDateLong, formatDateShort, formatTimeShort } from './utils'

const RAIN_EMOJIS = ['🍰', '🍰', '🍰', '🥛', '🍮', '✨', '🖤', '💜', '🤍']
const ANTOJO_LINES = [
  'Antojo enviado. La felicidad sube y la torta ya va en camino (en espíritu).',
  'Pedido recibido: una rebanada extra, por si acaso.',
  'La cocina del universo confirmó tu tres leches. Tarda, pero llega.',
  'Le mandaste un antojo. Técnicamente ahora eres su persona favorita.',
  'Torta virtual, sonrisa real. El intercambio me parece justo.',
]

function celebrate(accent = '#a855f7') {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const colors = [accent, '#d8b4fe', '#f0abfc', '#ffb27d', '#fff7ed', '#ff8fb1']
  const common = {
    colors,
    disableForReducedMotion: true,
    zIndex: 300,
  }

  try {
    confetti({
      ...common,
      particleCount: 100,
      spread: 78,
      startVelocity: 43,
      origin: { x: 0.5, y: 0.62 },
      scalar: 0.9,
    })
    window.setTimeout(() => {
      confetti({
        ...common,
        particleCount: 55,
        angle: 60,
        spread: 62,
        origin: { x: 0, y: 0.72 },
      })
      confetti({
        ...common,
        particleCount: 55,
        angle: 120,
        spread: 62,
        origin: { x: 1, y: 0.72 },
      })
    }, 160)

    const heart = confetti.shapeFromText({ text: '💜', scalar: 1.9 })
    confetti({
      ...common,
      particleCount: 16,
      spread: 110,
      origin: { x: 0.5, y: 0.56 },
      scalar: 2,
      shapes: [heart],
      ticks: 220,
    })
  } catch {
    confetti({
      ...common,
      particleCount: 110,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
    })
  }
}

function readHappiness() {
  try {
    const stored = Number(window.localStorage.getItem('mapachito-happiness'))
    if (Number.isFinite(stored) && stored > 0) return Math.min(100, stored)
  } catch {
    // Sin almacenamiento, empezamos desde cero.
  }
  return 34
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [happiness, setHappiness] = useState(readHappiness)
  const [antojoMessage, setAntojoMessage] = useState({
    id: 0,
    text: 'Un botón, una torta y un medidor de felicidad. Casi ciencia.',
  })
  const [rain, setRain] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastKey, setToastKey] = useState(0)

  const unlockedRef = useRef(false)
  const happinessRef = useRef(happiness)
  const rainId = useRef(0)
  const messageId = useRef(0)
  const toastTimer = useRef(0)

  useEffect(() => {
    happinessRef.current = happiness
    try {
      window.localStorage.setItem('mapachito-happiness', String(happiness))
    } catch {
      // El medidor vive igual en memoria.
    }
  }, [happiness])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'))
    if (!elements.length) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const unlockCapsule = useCallback(() => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    setUnlocked(true)
    setToastKey((key) => key + 1)
    setShowToast(true)
    celebrate(data.color_hex)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setShowToast(false), 4400)
  }, [])

  const seeCapsule = useCallback(() => {
    const target = document.getElementById('capsula')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [])

  const removeRain = useCallback((id) => {
    setRain((current) => current.filter((item) => item.id !== id))
  }, [])

  const sendAntojo = () => {
    const batch = Array.from({ length: 22 }, () => ({
      id: (rainId.current += 1),
      emoji: RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)],
      left: Math.random() * 100,
      duration: 1.8 + Math.random() * 1.5,
      delay: Math.random() * 0.22,
      size: 20 + Math.random() * 22,
      drift: (Math.random() - 0.5) * 130,
      spin: (Math.random() - 0.5) * 760,
    }))
    setRain((current) => [...current, ...batch].slice(-70))

    const wasFull = happinessRef.current >= 100
    const gain = 6 + Math.floor(Math.random() * 6)
    const next = Math.min(100, happinessRef.current + gain)
    happinessRef.current = next
    setHappiness(next)

    let text
    if (wasFull) {
      text = 'Llueve torta. El medidor ya no da más, pero la sonrisa sí.'
    } else if (next >= 100) {
      text = 'Felicidad al 100%. Oficialmente bien consentido 🖤'
    } else {
      text = ANTOJO_LINES[Math.floor(Math.random() * ANTOJO_LINES.length)]
    }
    setAntojoMessage({ id: (messageId.current += 1), text })
  }

  const longDate = formatDateLong(data.fecha_respuesta)
  const shortDate = formatDateShort(data.fecha_respuesta)
  const shortTime = formatTimeShort(data.fecha_respuesta)
  const food = data.comida.trim()

  return (
    <div className="app" style={{ '--accent': data.color_hex }}>
      <Atmosphere accent={data.color_hex} />
      <div className="ambient-overlay" aria-hidden="true" />

      <main className="shell">
        <header className="hero">
          <div className="meta-row">
            <span className="brand-chip">
              <i aria-hidden="true" /> Hecho con atención
            </span>
            <span className="date-chip">{shortDate}</span>
          </div>

          <p className="hero-eyebrow">Un pequeño rincón hecho a la medida de</p>
          <h1 className="hero-title">
            <span className="hero-name">{data.apodo}</span>
            <span className="hero-spark" aria-hidden="true">
              ✦
            </span>
          </h1>
          <p className="hero-lede">
            Mitad misterio, mitad atardecer. <em>Todo tú.</em>
          </p>

          <div className="chips" aria-label="Sus gustos">
            <span className="chip">
              <MoonStar size={13} aria-hidden="true" /> {data.estilo}
            </span>
            <span className="chip">
              <Sunset size={13} aria-hidden="true" /> {data.ambiente}
            </span>
            <span className="chip chip--color">
              <i className="chip-swatch" style={{ background: data.color_hex }} aria-hidden="true" />
              {data.color_nombre}
            </span>
          </div>

          <Mascot apodo={data.apodo} animal={data.personaje_animal} food={food} />

          <p className="scroll-cue">
            hay más abajo <ArrowDown size={12} aria-hidden="true" />
          </p>
        </header>

        <section className="section reveal" aria-labelledby="ficha-title">
          <SectionHeading
            index="01"
            title="Ficha de personaje"
            subtitle="Rareza: persona real. Una sola unidad en existencia."
            id="ficha-title"
          />
          <CharacterCard
            data={data}
            happiness={happiness}
            message={antojoMessage}
            onSend={sendAntojo}
          />
        </section>

        <section className="section reveal" aria-labelledby="musica-title">
          <SectionHeading
            index="02"
            title="El soundtrack"
            subtitle="Para cuando el mundo baje el volumen."
            id="musica-title"
          />
          <Soundtrack
            song={data.cancion}
            artist={data.cancion_artista}
            detail={data.cancion_detalle}
            src={data.cancion_archivo}
            youtube={data.cancion_youtube}
            spotify={data.cancion_spotify}
          />
        </section>

        <section className="section reveal" aria-labelledby="juego-title">
          <SectionHeading
            index="03"
            title="Atrapa el antojo"
            subtitle="Quince segundos, diez puntos y una cápsula esperando."
            id="juego-title"
          />
          <MiniGame
            unlocked={unlocked}
            onUnlock={unlockCapsule}
            onSeeCapsule={seeCapsule}
          />
        </section>

        <section className="section section--capsule reveal" aria-labelledby="capsula-title">
          <SectionHeading
            index="04"
            title="Cápsula secreta"
            subtitle={
              unlocked
                ? 'Abierta. Guardada. Tuya.'
                : 'Sellada con morado y un poquito de misterio.'
            }
            id="capsula-title"
          />
          <SecretCapsule data={data} unlocked={unlocked} />
        </section>

        <footer className="footer">
          <span className="footer-orb" aria-hidden="true">
            <Heart size={14} />
          </span>
          <p>
            Hecho con atención para <strong>{data.apodo}</strong>.
            <br />
            Mitad misterio, mitad atardecer, cero presión.
          </p>
          <p className="footer-tiny">
            Sellado el {longDate} · {shortTime} · {data.color_nombre}
          </p>
        </footer>
      </main>

      <EmojiRain items={rain} onDone={removeRain} />

      {showToast ? (
        <div className="unlock-toast" role="status" key={toastKey}>
          <Sparkles size={15} aria-hidden="true" />
          Cápsula desbloqueada · está justo abajo
        </div>
      ) : null}
    </div>
  )
}
