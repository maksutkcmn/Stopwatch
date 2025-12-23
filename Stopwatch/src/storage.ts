import type { TimerSettings } from './types.js'

const STORAGE_KEY = 'timerSettings'

export function loadSettings(): TimerSettings {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    workMinutes: 50,
    breakMinutes: 10
  }
}

export function saveSettings(settings: TimerSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
