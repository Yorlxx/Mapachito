const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const SHORT_MONTHS = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
]

function parseDate(raw) {
  if (!raw) return null
  const [datePart] = String(raw).split(' ')
  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day) return null
  return { year, month, day }
}

export function formatDateLong(raw) {
  const parsed = parseDate(raw)
  if (!parsed) return ''
  return `${parsed.day} de ${MONTHS[parsed.month - 1]} de ${parsed.year}`
}

export function formatDateShort(raw) {
  const parsed = parseDate(raw)
  if (!parsed) return ''
  return `${String(parsed.day).padStart(2, '0')} · ${SHORT_MONTHS[parsed.month - 1]} · ${parsed.year}`
}

export function formatTimeShort(raw) {
  if (!raw) return ''
  const [, time] = String(raw).split(' ')
  return time ? time.slice(0, 5) : ''
}

export function hexToRgb(hex) {
  const clean = String(hex || '').replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean
  if (!/^[0-9a-f]{6}$/i.test(full)) return { r: 168, g: 85, b: 247 }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}
