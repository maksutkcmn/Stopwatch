import { Timer } from './timer.js'
import type { TimerSettings, TimerState } from './types.js'
import { loadSettings, saveSettings } from './storage.js'
import { requestNotificationPermission } from './notification.js'

export class App {
  private timer: Timer
  private elements: {
    timer: HTMLDivElement
    timeLabel: HTMLDivElement
    stateLabel: HTMLDivElement
    startBtn: HTMLButtonElement
    settingsModal: HTMLDivElement
    workMinutesInput: HTMLInputElement
    breakMinutesInput: HTMLInputElement
    cancelBtn: HTMLButtonElement
    saveBtn: HTMLButtonElement
  }

  constructor() {
    const settings = loadSettings()
    this.timer = new Timer(settings)

    this.elements = {
      timer: document.querySelector('#timer')!,
      timeLabel: document.querySelector('#timeLabel')!,
      stateLabel: document.querySelector('#stateLabel')!,
      startBtn: document.querySelector('#startBtn')!,
      settingsModal: document.querySelector('#settingsModal')!,
      workMinutesInput: document.querySelector('#workMinutesInput')!,
      breakMinutesInput: document.querySelector('#breakMinutesInput')!,
      cancelBtn: document.querySelector('#cancelBtn')!,
      saveBtn: document.querySelector('#saveBtn')!
    }

    this.setupEventListeners()
    this.setupTimerCallbacks()
    this.updateDisplay()
  }

  private setupEventListeners(): void {
    // Buton events
    this.elements.startBtn.addEventListener('click', () => this.toggleTimer())
    this.elements.timer.addEventListener('click', () => this.openSettings())
    this.elements.timeLabel.addEventListener('click', () => this.openSettings())
    this.elements.cancelBtn.addEventListener('click', () => this.closeSettings())
    this.elements.saveBtn.addEventListener('click', () => this.saveSettings())

    // Modal events
    this.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.settingsModal) {
        this.closeSettings()
      }
    })

    // Keyboard events
    this.elements.workMinutesInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSettings()
    })
    this.elements.breakMinutesInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSettings()
    })

    // Hover effects
    this.setupHoverEffects()
  }

  private setupHoverEffects(): void {
    this.elements.timer.addEventListener('mouseenter', () => {
      this.elements.timer.style.transform = 'scale(1.05)'
    })
    this.elements.timer.addEventListener('mouseleave', () => {
      this.elements.timer.style.transform = 'scale(1)'
    })

    this.elements.timeLabel.addEventListener('mouseenter', () => {
      this.elements.timeLabel.style.color = '#9ca3af'
    })
    this.elements.timeLabel.addEventListener('mouseleave', () => {
      this.elements.timeLabel.style.color = '#6b7280'
    })

    this.elements.startBtn.addEventListener('mouseenter', () => {
      this.elements.startBtn.style.transform = 'translateY(-2px)'
      this.elements.startBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)'
    })
    this.elements.startBtn.addEventListener('mouseleave', () => {
      this.elements.startBtn.style.transform = 'translateY(0)'
      this.elements.startBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
    })

    this.elements.workMinutesInput.addEventListener('focus', () => {
      this.elements.workMinutesInput.style.borderColor = '#6b7280'
    })
    this.elements.workMinutesInput.addEventListener('blur', () => {
      this.elements.workMinutesInput.style.borderColor = '#333'
    })

    this.elements.breakMinutesInput.addEventListener('focus', () => {
      this.elements.breakMinutesInput.style.borderColor = '#6b7280'
    })
    this.elements.breakMinutesInput.addEventListener('blur', () => {
      this.elements.breakMinutesInput.style.borderColor = '#333'
    })

    this.elements.cancelBtn.addEventListener('mouseenter', () => {
      this.elements.cancelBtn.style.background = '#1a1a1a'
      this.elements.cancelBtn.style.borderColor = '#6b7280'
      this.elements.cancelBtn.style.color = '#9ca3af'
    })
    this.elements.cancelBtn.addEventListener('mouseleave', () => {
      this.elements.cancelBtn.style.background = 'transparent'
      this.elements.cancelBtn.style.borderColor = '#333'
      this.elements.cancelBtn.style.color = '#888'
    })

    this.elements.saveBtn.addEventListener('mouseenter', () => {
      this.elements.saveBtn.style.transform = 'translateY(-2px)'
    })
    this.elements.saveBtn.addEventListener('mouseleave', () => {
      this.elements.saveBtn.style.transform = 'translateY(0)'
    })
  }

  private setupTimerCallbacks(): void {
    this.timer.onUpdate(() => {
      this.updateDisplay()
    })

    this.timer.onStateChange((state) => {
      this.updateStateLabel(state)
      if (state === 'stopped') {
        this.elements.startBtn.textContent = 'Başlat'
      }
    })
  }

  private updateDisplay(): void {
    const { minutes, seconds } = this.timer.getCurrentTime()
    const newText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    if (this.elements.timer.textContent !== newText) {
      // Sayı düşme animasyonu
      this.elements.timer.style.transform = 'translateY(-10px)'
      this.elements.timer.style.opacity = '0.5'

      setTimeout(() => {
        this.elements.timer.textContent = newText
        this.elements.timer.style.transform = 'translateY(0)'
        this.elements.timer.style.opacity = '1'
      }, 150)
    }
  }

  private updateStateLabel(state: TimerState): void {
    if (state === 'work') {
      this.elements.stateLabel.textContent = 'Çalışma Süresi'
      this.elements.stateLabel.style.color = '#9ca3af'
    } else if (state === 'break') {
      this.elements.stateLabel.textContent = 'Mola Süresi'
      this.elements.stateLabel.style.color = '#4ade80'
    } else {
      this.elements.stateLabel.textContent = 'Çalışma Süresi'
      this.elements.stateLabel.style.color = '#9ca3af'
    }
  }

  private async toggleTimer(): Promise<void> {
    if (this.timer.isRunning()) {
      this.timer.stop()
      this.elements.startBtn.textContent = 'Başlat'
    } else {
      await requestNotificationPermission()
      this.timer.start()
      this.elements.startBtn.textContent = 'Durdur'
    }
  }

  private openSettings(): void {
    if (this.timer.isRunning()) {
      alert('Lütfen önce kronometreyi durdurun!')
      return
    }

    const settings = this.timer.getSettings()
    this.elements.workMinutesInput.value = String(settings.workMinutes)
    this.elements.breakMinutesInput.value = String(settings.breakMinutes)
    this.elements.settingsModal.style.display = 'flex'
    this.elements.workMinutesInput.focus()
  }

  private closeSettings(): void {
    this.elements.settingsModal.style.display = 'none'
  }

  private saveSettings(): void {
    const workMinutes = parseInt(this.elements.workMinutesInput.value)
    const breakMinutes = parseInt(this.elements.breakMinutesInput.value)

    if (isNaN(workMinutes) || workMinutes < 1) {
      alert('Lütfen geçerli bir çalışma süresi girin!')
      return
    }

    if (isNaN(breakMinutes) || breakMinutes < 1) {
      alert('Lütfen geçerli bir mola süresi girin!')
      return
    }

    const settings: TimerSettings = { workMinutes, breakMinutes }
    saveSettings(settings)
    this.timer.setSettings(settings)
    this.updateDisplay()
    this.closeSettings()
  }
}
