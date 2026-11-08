import { useState } from 'react'

const STORAGE_KEY = 'theme'
const THEME_COLOR = { dark: '#0b0b0b', light: '#ffffff' }

function persist(dark: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch {
    return
  }
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? THEME_COLOR.dark : THEME_COLOR.light)
    persist(next)
    setDark(next)
  }

  return { dark, toggle }
}
