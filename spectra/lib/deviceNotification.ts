/**
 * Utilitas Notifikasi Sistem Perangkat (Laptop/PC/HP) & Alarm Audio
 * Menggunakan Web Notification API + Web Audio API Synthesizer (tanpa perlu aset file audio eksternal)
 */

class DeviceNotificationService {
  private audioCtx: AudioContext | null = null
  private permissionGranted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      if ('Notification' in window) {
        this.permissionGranted = Notification.permission === 'granted'
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      }
    }
  }

  /**
   * Minta izin notifikasi browser jika belum pernah diminta
   */
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      this.permissionGranted = permission === 'granted'
      return this.permissionGranted
    }

    return false
  }

  /**
   * Bunyikan alarm suara sintetis menggunakan Web Audio API
   */
  playAlertSound(type: 'warning' | 'danger') {
    try {
      if (typeof window === 'undefined') return

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return

      if (!this.audioCtx || this.audioCtx.state === 'suspended') {
        this.audioCtx = new AudioContextClass()
      }

      const ctx = this.audioCtx
      const now = ctx.currentTime

      if (type === 'danger') {
        // Nada Sirine Bahaya: Dua nada frekuensi tinggi bergantian tajam (880Hz & 1174Hz)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(1174, now + 0.15)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)
        osc.frequency.exponentialRampToValueAtTime(1174, now + 0.45)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.6)

        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.65)
      } else {
        // Nada Waspada: Dua ketukan halus peringatan (587Hz ke 784Hz)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(587, now)
        osc.frequency.exponentialRampToValueAtTime(784, now + 0.2)

        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.4)
      }
    } catch {
      // Abaikan jika browser memblokir audio sebelum interaksi user
    }
  }

  /**
   * Kirim notifikasi native ke OS perangkat (Windows banner, Android notification, macOS alert)
   */
  async notify(title: string, options?: { body: string; status?: 'warning' | 'danger'; panelId?: string }) {
    if (typeof window === 'undefined') return

    // 1. Bunyikan audio chime
    this.playAlertSound(options?.status || 'warning')

    // 2. Getar HP jika mendukung Vibration API
    if ('vibrate' in navigator) {
      try {
        if (options?.status === 'danger') {
          navigator.vibrate([300, 100, 300, 100, 400])
        } else {
          navigator.vibrate([200, 100, 200])
        }
      } catch {
        // ignore
      }
    }

    // 3. Tampilkan Banner Notifikasi Sistem (Mendukung Android System Notification drawer dari atas)
    if (!('Notification' in window)) return

    if (Notification.permission === 'granted') {
      try {
        // Coba via ServiceWorker terlebih dahulu (standar HP Android untuk slide-down drawer notification)
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration()
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body: options?.body || '',
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: options?.panelId ? `spectra-panel-${options.panelId}` : 'spectra-alert',
              requireInteraction: options?.status === 'danger',
            })
            return
          }
        }

        // Fallback native Notification object
        const notif = new Notification(title, {
          body: options?.body || '',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: options?.panelId ? `spectra-panel-${options.panelId}` : 'spectra-alert',
          requireInteraction: options?.status === 'danger',
        })

        notif.onclick = () => {
          window.focus()
          notif.close()
        }
      } catch {
        // fallback
      }
    } else if (Notification.permission !== 'denied') {
      const granted = await this.requestPermission()
      if (granted) {
        this.notify(title, options)
      }
    }
  }
}

export const deviceNotification = new DeviceNotificationService()
