import type { TimerSettings, TimerState } from './types.js'
import { showNotification } from './notification.js'

export class Timer {
  private settings: TimerSettings
  private state: TimerState = 'stopped'
  private totalSeconds: number = 0
  private intervalId: number | null = null
  private onUpdateCallback: ((minutes: number, seconds: number) => void) | null = null
  private onStateChangeCallback: ((state: TimerState) => void) | null = null

  constructor(settings: TimerSettings) {
    this.settings = settings
    this.totalSeconds = settings.workMinutes * 60
  }

  public setSettings(settings: TimerSettings): void {
    this.settings = settings
    if (this.state === 'stopped') {
      this.totalSeconds = settings.workMinutes * 60
      this.notifyUpdate()
    }
  }

  public getSettings(): TimerSettings {
    return this.settings
  }

  public isRunning(): boolean {
    return this.state !== 'stopped'
  }

  public getState(): TimerState {
    return this.state
  }

  public onUpdate(callback: (minutes: number, seconds: number) => void): void {
    this.onUpdateCallback = callback
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.onStateChangeCallback = callback
  }

  public start(): void {
    if (this.state === 'stopped') {
      this.state = 'work'
      this.totalSeconds = this.settings.workMinutes * 60
      this.notifyStateChange()
    }

    this.intervalId = setInterval(() => {
      this.tick()
    }, 1000)
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state = 'stopped'
    this.totalSeconds = this.settings.workMinutes * 60
    this.notifyUpdate()
    this.notifyStateChange()
  }

  private tick(): void {
    if (this.totalSeconds > 0) {
      this.totalSeconds--
      this.notifyUpdate()
    } else {
      this.handleTimerComplete()
    }
  }

  private handleTimerComplete(): void {
    if (this.state === 'work') {
      showNotification('Çalışma Süresi Bitti!', 'Mola zamanı! İyi dinlenmeler 🎉')
      this.state = 'break'
      this.totalSeconds = this.settings.breakMinutes * 60
    } else if (this.state === 'break') {
      showNotification('Mola Bitti!', 'Çalışma zamanı! Başarılar 💪')
      this.state = 'work'
      this.totalSeconds = this.settings.workMinutes * 60
    }
    this.notifyUpdate()
    this.notifyStateChange()
  }

  private notifyUpdate(): void {
    if (this.onUpdateCallback) {
      const minutes = Math.floor(this.totalSeconds / 60)
      const seconds = this.totalSeconds % 60
      this.onUpdateCallback(minutes, seconds)
    }
  }

  private notifyStateChange(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.state)
    }
  }

  public getCurrentTime(): { minutes: number; seconds: number } {
    return {
      minutes: Math.floor(this.totalSeconds / 60),
      seconds: this.totalSeconds % 60
    }
  }
}
