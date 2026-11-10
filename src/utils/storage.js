// Local storage may be unavailable (blocked by privacy settings, full quota) or hold
// a damaged value, neither should keep the app from starting or lose the current state

export const readItem = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export const writeItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Nothing to do, the value stays in memory until the page is closed
  }
}

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Same as above
  }
}
