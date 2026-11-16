export default function EmojiRain({ items, onDone }) {
  return (
    <div className="emoji-rain" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="rain-emoji"
          style={{
            left: `${item.left}%`,
            '--fall-duration': `${item.duration}s`,
            '--fall-delay': `${item.delay}s`,
            '--emoji-size': `${item.size}px`,
            '--drift': `${item.drift}px`,
            '--spin': `${item.spin}deg`,
          }}
          onAnimationEnd={(event) => {
            if (event.animationName === 'emojiFall') onDone(item.id)
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}
