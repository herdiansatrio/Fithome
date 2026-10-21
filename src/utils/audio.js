// audio.js — Sintesis efek suara menggunakan Web Audio API murni (tanpa file eksternal)

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, duration = 0.12, type = 'sine', volume = 0.12) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore if autoplay is blocked
    }
  }

  playCountdownTick() {
    this.playBeep(520, 0.08, 'sine', 0.1);
  }

  playRestDone() {
    this.playBeep(880, 0.25, 'triangle', 0.18);
  }

  playSessionComplete() {
    if (!this.enabled) return;
    try {
      this.init();
      const notes = [
        { f: 523.25, d: 0.12, delay: 0 },    // C5
        { f: 659.25, d: 0.12, delay: 120 },  // E5
        { f: 783.99, d: 0.15, delay: 240 },  // G5
        { f: 1046.5, d: 0.35, delay: 380 },  // C6
      ];
      notes.forEach(({ f, d, delay }) => {
        setTimeout(() => this.playBeep(f, d, 'triangle', 0.18), delay);
      });
    } catch {
      // Ignore
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const sound = new SoundEffects();
