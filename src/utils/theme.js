import { readItem, removeItem, writeItem } from '@/utils/storage'

const DARK_STORAGE_KEY = 'dark'

export const getPreferredDarkMode = () => {
  const mode = readItem(DARK_STORAGE_KEY)
  return mode === null ? 'auto' : !!mode
}

export const setPreferredDarkMode = (value) => {
  if (value !== 'auto') writeItem(DARK_STORAGE_KEY, !!value)
  else removeItem(DARK_STORAGE_KEY)
}
