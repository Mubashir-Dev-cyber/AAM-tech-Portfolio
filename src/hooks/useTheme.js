import { useEffect, useState } from 'react'

// 'light' | 'dark' | 'system' — system follows the device setting
const KEY = 'aam-theme'
const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: light)') : null

export function readChoice() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
  } catch {
    return 'system'
  }
}

function applyTheme(choice) {
  const theme = choice === 'system' ? (query?.matches ? 'light' : 'dark') : choice
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f6fb' : '#0b0d17')
}

export default function useTheme() {
  const [choice, setChoice] = useState(readChoice)

  useEffect(() => {
    applyTheme(choice)
    try {
      localStorage.setItem(KEY, choice)
    } catch {
      // Private windows can block storage — the choice then lasts for this visit only
    }
  }, [choice])

  // While "System" is selected, follow the device switching light/dark
  useEffect(() => {
    const onChange = () => {
      if (readChoice() === 'system') applyTheme('system')
    }
    query?.addEventListener('change', onChange)
    return () => query?.removeEventListener('change', onChange)
  }, [])

  return [choice, setChoice]
}
