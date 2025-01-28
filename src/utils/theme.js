const DARK_STORAGE_KEY = 'dark'

export const getPreferredDarkMode = () => {
  const mode = JSON.parse(localStorage.getItem(DARK_STORAGE_KEY))
  return mode === null ? 'auto' : !!mode
}

export const setPreferredDarkMode = (value) => {
  if (value !== 'auto') localStorage.setItem(DARK_STORAGE_KEY, JSON.stringify(!!value))
  else localStorage.removeItem(DARK_STORAGE_KEY)
}
