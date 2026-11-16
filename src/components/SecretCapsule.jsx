import { CakeSlice, Heart, LockKeyhole, Sparkles, Star } from 'lucide-react'

export default function SecretCapsule({ data, unlocked }) {
  return (
    <article id="capsula" className={`capsule ${unlocked ? 'is-open' : ''}`}>
      <div className="capsule-glow" aria-hidden="true" />

      {!unlocked ? (
        <div className="capsule-locked">
          <div className="capsule-docket">
            <span>Cápsula Nº 001</span>
            <span className="docket-state">Sellada</span>
          </div>

          <div className="capsule-lock" aria-hidden="true">
            <span className="capsule-ring capsule-ring--one" />
            <span className="capsule-ring capsule-ring--two" />
            <LockKeyhole size={26} />
          </div>

          <h3>Hay algo aquí para ti</h3>
          <p>
            Consigue 10 puntos en el juego o insiste con el candado de arriba. Las buenas cosas
            también aceptan sobornos.
          </p>

          <div className="capsule-redacted" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className="capsule-hint">
            <CakeSlice size={13} aria-hidden="true" /> Pista: huele a torta de tres leches.
          </p>
        </div>
      ) : (
        <div className="capsule-open">
          <div className="capsule-docket">
            <span>Cápsula Nº 001</span>
            <span className="docket-state is-open">
              <Sparkles size={10} aria-hidden="true" /> Abierta
            </span>
          </div>

          <p className="capsule-label">
            <Heart size={12} aria-hidden="true" /> Lo que escribiste
          </p>

          <blockquote className="capsule-quote">
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            {data.extra}
            <span className="quote-mark quote-mark--close" aria-hidden="true">
              ”
            </span>
          </blockquote>

          <p className="capsule-copy">
            Y eso, {data.apodo}, es de las cosas más bonitas que se pueden ser.
          </p>

          <div className="capsule-divider" aria-hidden="true">
            <i />
            <Star size={11} />
            <i />
          </div>

          <div className="capsule-note">
            <Sparkles size={16} aria-hidden="true" />
            <p>{data.nota_final}</p>
          </div>

          <p className="capsule-sign">{data.firma}</p>
        </div>
      )}
    </article>
  )
}
