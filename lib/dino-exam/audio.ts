// Procedural Web Audio API sound generator for Dino Exam Runner
// Zero external audio files, zero bundle overhead, 100% browser autoplay policy compliant

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private isBgmPlaying: boolean = false;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  // --- Sound Effects (SFX) ---

  // Jump sound: cheerful ascending chirp
  public playJump() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Duck sound: quick swoosh slide
  public playDuck() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Straight action sound: portal whoosh / turbo dash
  public playStraight() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.1);
      osc.frequency.linearRampToValueAtTime(330, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  // Correct answer chime: 3-note ascending arpeggio (C5 -> E5 -> G5)
  public playCorrect() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const now = this.ctx!.currentTime + i * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 0.22);
      });
    } catch {}
  }

  // Hit / Collision / Game Over sound: 8-bit impact crunch
  public playHit() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // Low frequency crunch
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  // Victory fanfare: celebratory 8-bit melody
  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.35 }, // C6
      ];

      let elapsed = 0;
      melody.forEach((note) => {
        const now = this.ctx!.currentTime + elapsed;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + note.d);
        elapsed += note.d + 0.04;
      });
    } catch {}
  }

  // --- Chiptune Background Music (BGM) ---
  public startBgm() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ];

    let chordIdx = 0;
    let stepIdx = 0;

    const playNextStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      if (!this.isMuted) {
        const chord = chords[chordIdx];
        const freq = chord[stepIdx % 3];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.04, now);
        noteGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.18);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.19);
      }

      stepIdx++;
      if (stepIdx >= 4) {
        stepIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.bgmTimer = window.setTimeout(playNextStep, 200);
    };

    playNextStep();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public dispose() {
    this.stopBgm();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const soundManager = new SoundManager();
