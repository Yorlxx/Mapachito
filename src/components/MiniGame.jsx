import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  CakeSlice,
  LockKeyhole,
  LockOpen,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  Trophy,
} from 'lucide-react'

const DURATION = 15
const TARGET = 10
const TYPES = [
  { key: 'cake', emoji: '🍰', points: 1, label: 'torta de tres leches' },
  { key: 'heart', emoji: '🖤', points: 1, label: 'corazón de Kuromi' },
  { key: 'star', emoji: '✨', points: 2, label: 'estrella doble' },
]

const rand = (min, max) => min + Math.random() * (max - min)

function readBest() {
  try {
    const value = Number(window.localStorage.getItem('mapachito-best'))
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export default function MiniGame({ unlocked, onUnlock, onSeeCapsule }) {
  const [status, setStatus] = useState('idle')
  const [items, setItems] = useState([])
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [pops, setPops] = useState([])
  const [best, setBest] = useState(readBest)
  const [lockTaps, setLockTaps] = useState(0)
  const [lockHint, setLockHint] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const rafRef = useRef(0)
  const startRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const lastTimeRef = useRef(0)
  const statusRef = useRef('idle')
  const scoreRef = useRef(0)
  const idRef = useRef(0)
  const bestRef = useRef(best)
  const onUnlockRef = useRef(onUnlock)

  useEffect(() => {
    onUnlockRef.current = onUnlock
  }, [onUnlock])

  const makeItem = (elapsed) => {
    const roll = Math.random() * 12
    const type = roll < 6 ? TYPES[0] : roll < 10 ? TYPES[1] : TYPES[2]
    return {
      id: (idRef.current += 1),
      type,
      x: rand(10, 90),
      y: rand(-13, -5),
      vy: rand(29, 42) + elapsed * 0.95,
      rotation: rand(-15, 15),
    }
  }

  const finish = useCallback((won) => {
    if (statusRef.current !== 'playing') return
    statusRef.current = won ? 'won' : 'over'
    cancelAnimationFrame(rafRef.current)
    setStatus(won ? 'won' : 'over')
    setItems([])
    setFinalScore(scoreRef.current)

    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current
      setBest(scoreRef.current)
      try {
        window.localStorage.setItem('mapachito-best', String(scoreRef.current))
      } catch {
        // El navegador podría bloquear el almacenamiento; el juego sigue funcionando.
      }
    }

    if (won) onUnlockRef.current?.()
  }, [])

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    scoreRef.current = 0
    statusRef.current = 'playing'
    setScore(0)
    setFinalScore(0)
    setItems([])
    setPops([])
    setTimeLeft(DURATION)
    setStatus('playing')

    const now = performance.now()
    startRef.current = now
    lastSpawnRef.current = now - 420
    lastTimeRef.current = now
  }, [])

  useEffect(() => {
    if (status !== 'playing') return undefined

    const step = (now) => {
      if (statusRef.current !== 'playing') return
      const dt = Math.min(0.06, Math.max(0, (now - lastTimeRef.current) / 1000))
      lastTimeRef.current = now
      const elapsed = (now - startRef.current) / 1000
      const remaining = Math.max(0, DURATION - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        finish(false)
        return
      }

      const spawnEvery = 610 - Math.min(170, elapsed * 10)
      if (now - lastSpawnRef.current >= spawnEvery) {
        lastSpawnRef.current = now
        setItems((current) => [...current, makeItem(elapsed)])
      }

      setItems((current) =>
        current
          .map((item) => ({ ...item, y: item.y + item.vy * dt }))
          .filter((item) => item.y < 112),
      )

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [status, finish])

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  const catchItem = (event, item) => {
    event.stopPropagation()
    if (statusRef.current !== 'playing') return
    setItems((current) => current.filter((existing) => existing.id !== item.id))
    scoreRef.current += item.type.points
    setScore(scoreRef.current)
    setPops((current) =>
      [
        ...current,
        {
          id: (idRef.current += 1),
          x: item.x,
          y: item.y,
          label: `+${item.type.points}`,
          emoji: item.type.emoji,
        },
      ].slice(-8),
    )
    if (scoreRef.current >= TARGET) finish(true)
  }

  const handleLockTap = () => {
    if (unlocked) return
    const next = Math.min(3, lockTaps + 1)
    setLockTaps(next)
    setShakeKey((key) => key + 1)
    if (next >= 3) {
      setLockHint('El candado se rindió. Cápsula desbloqueada.')
      onUnlockRef.current?.()
    } else if (next === 1) {
      setLockHint('Mmm, el candado es tímido. Insiste.')
    } else {
      setLockHint('Un toque más y se rinde.')
    }
  }

  const seconds = Math.ceil(timeLeft)
  const urgent = status === 'playing' && timeLeft <= 5

  return (
    <div className="game-wrap">
      <article className="game-card">
        <div className="game-hud">
          <span className="score-chip" aria-live="polite">
            <CakeSlice size={15} aria-hidden="true" />
            <strong>{score}</strong>
            <span>/ {TARGET}</span>
          </span>
          <span className={`time-chip ${urgent ? 'is-urgent' : ''}`}>
            <Timer size={14} aria-hidden="true" />
            {seconds}s
          </span>
        </div>

        <div className="game-meter" aria-hidden="true">
          <span style={{ width: `${(timeLeft / DURATION) * 100}%` }} />
        </div>

        <div className="game-stage" aria-label="Mini juego: atrapa los antojos que caen">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`game-item game-item--${item.type.key}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                '--rotation': `${item.rotation}deg`,
              }}
              onPointerDown={(event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) return
                catchItem(event, item)
              }}
              onClick={(event) => {
                if (event.detail === 0) catchItem(event, item)
              }}
              aria-label={`Atrapar ${item.type.label}`}
            >
              <span aria-hidden="true">{item.type.emoji}</span>
            </button>
          ))}

          {pops.map((pop) => (
            <span
              key={pop.id}
              className="game-pop"
              style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
              aria-hidden="true"
              onAnimationEnd={() =>
                setPops((current) => current.filter((entry) => entry.id !== pop.id))
              }
            >
              {pop.label}
            </span>
          ))}

          {status === 'idle' ? (
            <div className="game-overlay">
              <span className="overlay-icon" aria-hidden="true">
                <CakeSlice size={25} />
              </span>
              <h3>15 segundos de antojo</h3>
              <p>
                Atrapa 10 puntos entre tortas 🍰, corazones 🖤 y estrellas ✨. Las estrellas
                valen doble.
              </p>
              <button type="button" className="overlay-btn" onClick={startGame}>
                <Play size={16} aria-hidden="true" /> Empezar
              </button>
            </div>
          ) : null}

          {status === 'won' ? (
            <div className="game-overlay game-overlay--win">
              <span className="overlay-icon" aria-hidden="true">
                <Trophy size={25} />
              </span>
              <h3>¡Cápsula desbloqueada!</h3>
              <p>
                {finalScore} puntos. El candado de abajo acaba de rendirse sin pelear.
              </p>
              <button type="button" className="overlay-btn" onClick={onSeeCapsule}>
                Leer la cápsula <ArrowDown size={16} aria-hidden="true" />
              </button>
              <button type="button" className="overlay-link" onClick={startGame}>
                <RotateCcw size={13} aria-hidden="true" /> Otra ronda
              </button>
            </div>
          ) : null}

          {status === 'over' ? (
            <div className="game-overlay">
              <span className="overlay-icon" aria-hidden="true">
                <Timer size={25} />
              </span>
              <h3>Se acabó el tiempo</h3>
              <p>
                {finalScore} puntos. {unlocked
                  ? 'La cápsula ya está abierta; esto ahora es solo por el récord.'
                  : 'La cápsula sigue esperando: el candado acepta tres toques de soborno.'}
              </p>
              <button type="button" className="overlay-btn" onClick={startGame}>
                <RotateCcw size={16} aria-hidden="true" /> Reintentar
              </button>
              <button type="button" className="overlay-link" onClick={onSeeCapsule}>
                Ver la cápsula <ArrowDown size={13} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="game-foot">
          <span>
            <Star size={11} aria-hidden="true" /> Las estrellas valen 2
          </span>
          <span>Récord: {best}</span>
        </div>
      </article>

      <div className="lock-box">
        <button
          type="button"
          className={`lock-button ${unlocked ? 'is-unlocked' : ''}`}
          onClick={handleLockTap}
          disabled={unlocked}
          aria-label={
            unlocked
              ? 'Cápsula secreta ya desbloqueada'
              : `Candado especial. ${lockTaps} de 3 toques.`
          }
        >
          <span key={shakeKey} className={`lock-medallion ${shakeKey ? 'is-shaking' : ''}`}>
            {unlocked ? (
              <LockOpen size={19} aria-hidden="true" />
            ) : (
              <LockKeyhole size={19} aria-hidden="true" />
            )}
          </span>
          <span className="lock-copy">
            <strong>{unlocked ? 'Cápsula desbloqueada' : 'Candado especial'}</strong>
            <small>
              {unlocked
                ? 'Ya está abierta. Baja a leerla cuando quieras.'
                : 'Sin 10 puntos, aquí también hay una salida.'}
            </small>
          </span>
          {!unlocked ? (
            <span className="lock-dots" aria-hidden="true">
              {Array.from({ length: 3 }, (_, index) => (
                <i key={index} className={index < lockTaps ? 'is-on' : ''} />
              ))}
            </span>
          ) : (
            <Sparkles className="lock-sparkle" size={16} aria-hidden="true" />
          )}
        </button>
        <p className="lock-hint" aria-live="polite">
          {unlocked
            ? 'El candado guardó el secreto lo suficiente.'
            : lockHint
              ? lockHint
              : 'Tres toques al candado y también se abre. No diremos nada.'}
        </p>

        {unlocked ? (
          <button type="button" className="see-capsule" onClick={onSeeCapsule}>
            Leer la cápsula <ArrowDown size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
