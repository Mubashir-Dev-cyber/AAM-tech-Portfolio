import { useCallback, useEffect, useState } from 'react'

// 'light' | 'dark' | 'system' — system follows the device setting.
// New visitors start in dark; only a choice made with the switch is saved.
const KEY = 'aam-theme-choice'
const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: light)') : null

export function readChoice() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(choice) {
  const theme = choice === 'system' ? (query?.matches ? 'light' : 'dark') : choice
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f8fc' : '#070b14')
}

export default function useTheme() {
  const [choice, setChoiceState] = useState(readChoice)

  useEffect(() => {
    applyTheme(choice)
  }, [choice])

  // Remember the visitor's pick
  const setChoice = useCallback((next) => {
    setChoiceState(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Private windows can block storage — the choice then lasts for this visit only
    }
  }, [])

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
