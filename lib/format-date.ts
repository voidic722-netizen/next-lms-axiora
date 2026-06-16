const ID_LOCALE = 'id-ID'

/**
 * Format: "Senin, 01 Jan 2025"
 */
export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat(ID_LOCALE, {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/**
 * Format: "01 Jan 2025, 10:30"
 */
export function formatDateTime(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat(ID_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/**
 * Format: "Senin, 01 Jan" (no year — used for schedule cards)
 */
export function formatDay(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat(ID_LOCALE, {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/**
 * Format: "01 Jan 2025" (no time)
 */
export function formatDateShort(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat(ID_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/**
 * Returns true if the given date string is in the past.
 */
export function isPast(dateStr: string): boolean {
  try {
    return new Date(dateStr) < new Date()
  } catch {
    return false
  }
}

/**
 * Returns true if the given date string is in the future.
 */
export function isFuture(dateStr: string): boolean {
  try {
    return new Date(dateStr) > new Date()
  } catch {
    return false
  }
}
