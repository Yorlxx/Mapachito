import { useRef } from 'react'
import {
  CakeSlice,
  Crown,
  Heart,
  HeartHandshake,
  Palette,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react'

export default function CharacterCard({ data, happiness, message, onSend }) {
  const cardRef = useRef(null)
  const animal = data.personaje_animal.replace(/[^\p{L}\s]/gu, '').trim()
  const food = data.comida.trim()
  const filledSegments = Math.round(happiness / 10)

  const setTilt = (event) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
    card.style.setProperty('--ry', `${(x - 0.5) * 7}deg`)
    card.style.setProperty('--rx', `${(y - 0.5) * -7}deg`)
  }

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return
    setTilt(event)
  }

  const handlePointerDown = (event) => {
    setTilt(event)
    cardRef.current?.classList.add('is-shining')
  }

  const resetCard = () => {
    const card = cardRef.current
    if (!card) return
    card.classList.remove('is-shining')
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  return (
    <article
      ref={cardRef}
      className="character-card"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={resetCard}
      onPointerCancel={resetCard}
      onPointerLeave={resetCard}
    >
      <div className="card-holo" aria-hidden="true" />
      <div className="card-shine" aria-hidden="true" />

      <div className="card-inner">
        <div className="card-top">
          <span className="rarity">
            <Sparkles size={11} aria-hidden="true" /> Edición única
          </span>
          <span className="card-number">Nº 001</span>
        </div>

        <div className="char-identity">
          <div className="char-sigil" aria-hidden="true">
            <span>M</span>
            <Crown className="sigil-crown" size={13} />
          </div>
          <div>
            <h3 className="char-name">{data.apodo}</h3>
            <p className="char-type">
              <Heart size={11} aria-hidden="true" />
              {animal} de confianza · caos encantador
            </p>
          </div>
        </div>

        <div className="power">
          <div className="power-head">
            <span className="power-label">
              <Zap size={12} aria-hidden="true" /> Superpoder
            </span>
            <span className="power-value">
              100<span>%</span>
            </span>
          </div>
          <p className="power-name">{data.superpoder}</p>
          <div className="power-bar" aria-hidden="true">
            <span className="power-fill" />
          </div>
          <p className="power-caption">Nivel máximo. Sin discusión.</p>
        </div>

        <dl className="traits">
          <div className="trait">
            <dt>Vibra</dt>
            <dd>
              <Sparkles size={11} aria-hidden="true" /> {data.estilo}
            </dd>
          </div>
          <div className="trait">
            <dt>Ambiente</dt>
            <dd>
              <Palette size={11} aria-hidden="true" /> {data.ambiente}
            </dd>
          </div>
          <div className="trait">
            <dt>Color</dt>
            <dd>
              <i className="trait-swatch" style={{ background: data.color_hex }} aria-hidden="true" />
              {data.color_nombre}
            </dd>
          </div>
          <div className="trait">
            <dt>Compañía</dt>
            <dd>
              <HeartHandshake size={11} aria-hidden="true" /> {animal}
            </dd>
          </div>
        </dl>

        <div className="antojo">
          <div className="happiness-head">
            <span>
              <Heart size={12} aria-hidden="true" /> Felicidad de {data.apodo}
            </span>
            <strong>{happiness}%</strong>
          </div>
          <div
            className="happiness-track"
            role="progressbar"
            aria-label={`Felicidad de ${data.apodo}`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={happiness}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className={`happiness-segment ${index < filledSegments ? 'is-on' : ''}`}
              />
            ))}
          </div>

          <button type="button" className="antojo-button" onClick={onSend}>
            <span className="antojo-icon" aria-hidden="true">
              <CakeSlice size={21} />
            </span>
            <span className="antojo-text">
              <strong>Enviar antojo</strong>
              <small>{food}</small>
            </span>
            <span className="antojo-send" aria-hidden="true">
              <Send size={16} />
            </span>
          </button>

          <p className="antojo-message" key={message.id} aria-live="polite">
            {message.text}
          </p>
        </div>

        <p className="card-foot">✦ No se vende. Solo se presume.</p>
      </div>
    </article>
  )
}
