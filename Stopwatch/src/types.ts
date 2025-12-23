export interface TimerSettings {
  workMinutes: number
  breakMinutes: number
}

export type TimerState = 'work' | 'break' | 'stopped'
