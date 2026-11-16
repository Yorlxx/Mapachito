import { useEffect, useRef, useState } from 'react'
import { Disc3, Headphones, Pause, Play } from 'lucide-react'

const FALLBACK_DURATION = 224
const WAVE_HEIGHTS = [38, 66, 24, 82, 46, 92, 34, 70, 52, 88, 30, 60, 44, 78, 26, 68, 40, 84, 32, 58]

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const safe = Math.floor(seconds)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  )
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02Zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.18.54.78.24 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3Z" />
    </svg>
  )
}

export default function Soundtrack({ song, artist, detail, src, youtube, spotify }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const syncTime = () => setTime(audio.currentTime || 0)
    const syncDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration)
    }
    const handlePlay = () => {
      setPlaying(true)
      setError('')
    }
    const handlePause = () => setPlaying(false)
    const handleEnded = () => {
      setPlaying(false)
      setTime(0)
    }
    const handleError = () => {
      setPlaying(false)
      setError(
        'No pudimos cargar el audio aquí. Ábrela en YouTube o Spotify y sigue sonando igual de bonito.',
      )
    }

    syncDuration()
    audio.addEventListener('timeupdate', syncTime)
    audio.addEventListener('loadedmetadata', syncDuration)
    audio.addEventListener('durationchange', syncDuration)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', syncTime)
      audio.removeEventListener('loadedmetadata', syncDuration)
      audio.removeEventListener('durationchange', syncDuration)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setPlaying(false)
        setError('El navegador no dejó sonar el audio. Toca play otra vez o ábrela en YouTube.')
      }
    } else {
      audio.pause()
    }
  }

  const seek = (event) => {
    const audio = audioRef.current
    const next = Number(event.target.value)
    if (!Number.isFinite(next)) return
    setTime(next)
    if (audio) audio.currentTime = next
  }

  const total = duration || FALLBACK_DURATION
  const progress = total > 0 ? Math.min(100, (time / total) * 100) : 0
  const searchTerm = encodeURIComponent(`${song} ${artist || ''}`.trim())
  const youtubeUrl = youtube || `https://www.youtube.com/results?search_query=${searchTerm}`
  const spotifyUrl = spotify || `https://open.spotify.com/search/${searchTerm}`

  return (
    <article className={`music-card ${playing ? 'is-playing' : ''}`}>
      <div className="music-glow" aria-hidden="true" />

      <div className="vinyl-wrap">
        <div className="vinyl" aria-hidden="true">
          <div className="vinyl-sheen" />
          <div className="vinyl-label">
            <span>M</span>
            <small>33 ⅓</small>
            <i />
          </div>
        </div>
        <div className="tonearm" aria-hidden="true" />
        <span className="vinyl-tag" aria-hidden="true">
          {playing ? 'sonando ahora' : 'side A · nosotros'}
        </span>
      </div>

      <div className="music-info">
        <p className="music-eyebrow">
          <Disc3 size={13} aria-hidden="true" /> Tu canción
        </p>
        <h3 className="music-title">“{song}”</h3>
        <p className="music-sub">
          {artist ? `${artist} · ` : ''}
          {detail || 'La que suena cuando el mundo baja el volumen.'}
        </p>

        <div className={`waveform ${playing ? 'is-live' : ''}`} aria-hidden="true">
          {WAVE_HEIGHTS.map((height, index) => (
            <span
              key={index}
              style={{
                height: `${height}%`,
                animationDelay: `-${(index % 7) * 0.11}s`,
                animationDuration: `${0.62 + (index % 5) * 0.07}s`,
              }}
            />
          ))}
        </div>

        <div className="music-progress">
          <input
            type="range"
            className="progress-seek"
            min="0"
            max={total}
            step="0.1"
            value={Math.min(time, total)}
            onChange={seek}
            aria-label="Posición de la canción"
            aria-valuetext={`${formatTime(time)} de ${formatTime(total)}`}
            style={{ '--seek': `${progress}%` }}
          />
          <div className="progress-times">
            <span>{formatTime(time)}</span>
            <span>{formatTime(total)}</span>
          </div>
        </div>

        <div className="music-actions">
          <button
            type="button"
            className="music-btn music-btn--play"
            onClick={toggle}
            aria-pressed={playing}
            aria-label={playing ? `Pausar ${song}` : `Reproducir ${song}`}
          >
            {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            {playing ? 'Pausa' : 'Play'}
          </button>
          <a
            className="music-btn"
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Escuchar ${song} en YouTube`}
          >
            <YouTubeIcon /> YouTube
          </a>
          <a
            className="music-btn"
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Escuchar ${song} en Spotify`}
          >
            <SpotifyIcon /> Spotify
          </a>
        </div>

        {error ? (
          <p className="music-error" role="status">
            {error}
          </p>
        ) : (
          <p className="music-note">
            <Headphones size={12} aria-hidden="true" />
            Suena aquí mismo: dale play, sube el volumen y quédate un rato.
          </p>
        )}

        <audio ref={audioRef} src={src} preload="metadata" playsInline />
      </div>
    </article>
  )
}
