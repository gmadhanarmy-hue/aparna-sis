/**
 * Luxury Audio Engine for Aparna's Birthday Surprise
 * 1. Cake Cutting Song: assets/audio/cake-bgm.mp3 (Click 1 start, Click 3 stop)
 * 2. Aerial Diwali Fireworks Sound: assets/audio/fireworks.mp3 (Click 1 fireworks)
 * 3. Page 6 / Main BGM: assets/audio/bgm.mp3 (Invisible cinematic background layer)
 * Includes realistic Web Audio API fallback synthesizers for all 3 sounds.
 */

class BirthdayAudioManager {
  constructor() {
    this.cakeBgmAudio = null;
    this.fireworksAudio = null;
    this.bgmAudio = null;
    this.audioCtx = null;

    this.isCakeBgmPlaying = false;
    this.isBgmPlaying = false;
    this.synthCakeTimer = null;
    this.synthBgmTimer = null;
    this.synthCakeActive = false;
    this.synthBgmActive = false;

    // Pentatonic emotional Tamil cinema melody frequencies
    this.melodyNotes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99
    ];

    this.sequence = [
      { note: 2, dur: 1.2, bass: 0 },
      { note: 3, dur: 0.8, bass: null },
      { note: 4, dur: 1.6, bass: 2 },
      { note: 5, dur: 1.2, bass: null },
      { note: 4, dur: 0.8, bass: 3 },
      { note: 3, dur: 1.4, bass: null },
      { note: 2, dur: 1.8, bass: 0 },
      { note: 1, dur: 0.8, bass: null },
      { note: 2, dur: 1.4, bass: 1 },
      { note: 3, dur: 1.8, bass: null },
      { note: 4, dur: 1.2, bass: 2 },
      { note: 6, dur: 1.0, bass: null },
      { note: 5, dur: 1.5, bass: 3 },
      { note: 4, dur: 1.2, bass: null },
      { note: 3, dur: 1.6, bass: 0 },
      { note: 2, dur: 2.2, bass: null }
    ];

    this.initAudioElements();
  }

  initAudioElements() {
    // Cake cutting music
    let cakeBgm = document.getElementById('cake-bgm-audio');
    if (!cakeBgm) {
      cakeBgm = document.createElement('audio');
      cakeBgm.id = 'cake-bgm-audio';
      cakeBgm.src = 'assets/audio/cake-bgm.mp3';
      cakeBgm.preload = 'auto';
      cakeBgm.loop = true;
      document.body.appendChild(cakeBgm);
    }
    this.cakeBgmAudio = cakeBgm;

    // Fireworks aerial celebration sound
    let fireworks = document.getElementById('fireworks-audio');
    if (!fireworks) {
      fireworks = document.createElement('audio');
      fireworks.id = 'fireworks-audio';
      fireworks.src = 'assets/audio/fireworks.mp3';
      fireworks.preload = 'auto';
      document.body.appendChild(fireworks);
    }
    this.fireworksAudio = fireworks;

    // Main background song (Page 6 / journey)
    let bgm = document.getElementById('bgm-audio');
    if (!bgm) {
      bgm = document.createElement('audio');
      bgm.id = 'bgm-audio';
      bgm.src = 'assets/audio/bgm.mp3';
      bgm.preload = 'auto';
      bgm.loop = true;
      document.body.appendChild(bgm);
    }
    this.bgmAudio = bgm;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /* ========================================================
     1. DIWALI AERIAL FIREWORKS SOUND EFFECT
     ======================================================== */
  playFireworks() {
    this.initContext();

    if (this.fireworksAudio) {
      this.fireworksAudio.currentTime = 0;
      const playPromise = this.fireworksAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Real fireworks audio is playing
        }).catch(() => {
          // Fallback synthetic aerial fireworks bursts
          this.synthesizeAerialFireworks();
        });
      }
    } else {
      this.synthesizeAerialFireworks();
    }
  }

  stopFireworks() {
    if (this.fireworksAudio && !this.fireworksAudio.paused) {
      this.fireworksAudio.pause();
      this.fireworksAudio.currentTime = 0;
    }
  }

  synthesizeAerialFireworks() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Staggered aerial launches + high bursts over 4 seconds
    const bursts = [0, 400, 900, 1500, 2200, 3000];

    bursts.forEach(delay => {
      setTimeout(() => {
        if (!this.audioCtx) return;
        const now = ctx.currentTime;

        // 1. Whistle rocket rising
        const whistle = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        whistle.type = 'sine';
        whistle.frequency.setValueAtTime(450 + Math.random() * 200, now);
        whistle.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 400, now + 0.35);

        whistleGain.gain.setValueAtTime(0.08, now);
        whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        whistle.connect(whistleGain);
        whistleGain.connect(ctx.destination);
        whistle.start(now);
        whistle.stop(now + 0.4);

        // 2. Heavy aerial explosion boom
        setTimeout(() => {
          if (!this.audioCtx) return;
          const boomTime = ctx.currentTime;

          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(130 + Math.random() * 40, boomTime);
          osc.frequency.exponentialRampToValueAtTime(25, boomTime + 0.55);

          oscGain.gain.setValueAtTime(0.45, boomTime);
          oscGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.55);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(boomTime);
          osc.stop(boomTime + 0.6);

          // Crackle stars
          for (let s = 0; s < 8; s++) {
            setTimeout(() => {
              if (!this.audioCtx) return;
              const crackleTime = ctx.currentTime;
              const bufferSize = ctx.sampleRate * 0.05;
              const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
              }
              const noise = ctx.createBufferSource();
              noise.buffer = buffer;
              const gain = ctx.createGain();
              gain.gain.setValueAtTime(0.2, crackleTime);
              gain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.05);

              noise.connect(gain);
              gain.connect(ctx.destination);
              noise.start(crackleTime);
              noise.stop(crackleTime + 0.06);
            }, s * 55);
          }
        }, 360);
      }, delay);
    });
  }

  /* ========================================================
     2. CAKE-CUTTING BACKGROUND MUSIC (cake-bgm.mp3)
     ======================================================== */
  startCakeBgm() {
    if (this.isCakeBgmPlaying) return;
    this.initContext();

    if (this.cakeBgmAudio) {
      this.cakeBgmAudio.currentTime = 0;
      const playPromise = this.cakeBgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isCakeBgmPlaying = true;
        }).catch(() => {
          // Synthetic cheerful celebration melody fallback
          this.startSynthCakeBgm();
        });
      }
    } else {
      this.startSynthCakeBgm();
    }
  }

  stopCakeBgm() {
    if (this.cakeBgmAudio && !this.cakeBgmAudio.paused) {
      this.cakeBgmAudio.pause();
      this.cakeBgmAudio.currentTime = 0;
    }
    this.stopSynthCakeBgm();
    this.isCakeBgmPlaying = false;
  }

  startSynthCakeBgm() {
    if (this.synthCakeActive) return;
    this.synthCakeActive = true;
    this.isCakeBgmPlaying = true;
    this.scheduleCakeSynthNote(0);
  }

  stopSynthCakeBgm() {
    this.synthCakeActive = false;
    if (this.synthCakeTimer) {
      clearTimeout(this.synthCakeTimer);
      this.synthCakeTimer = null;
    }
  }

  scheduleCakeSynthNote(step) {
    if (!this.synthCakeActive || !this.audioCtx) return;

    // Joyful celebration chord progression: F4, A4, C5, E5, F5
    const joyNotes = [349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 698.46];
    const note = joyNotes[step % joyNotes.length];

    this.playTone(note, 0.6, 'triangle', 0.22);
    this.playTone(note * 0.5, 0.8, 'sine', 0.15);

    this.synthCakeTimer = setTimeout(() => {
      this.scheduleCakeSynthNote(step + 1);
    }, 450);
  }

  /* ========================================================
     3. MAIN INVISIBLE BGM (bgm.mp3) — FOR PAGE 6 / NEXT
     ======================================================== */
  startBgm() {
    // Ensure previous cake music is completely stopped
    this.stopCakeBgm();
    this.stopFireworks();

    if (this.isBgmPlaying) return; // Prevent duplicate audio streams
    this.initContext();

    if (this.bgmAudio) {
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isBgmPlaying = true;
        }).catch((err) => {
          console.log("BGM autoplay blocked or file empty, using emotional synth fallback:", err);
          this.startSynthBgm();
        });
      }
    } else {
      this.startSynthBgm();
    }
  }

  stopBgm() {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
    this.stopSynthBgm();
    this.isBgmPlaying = false;
  }

  startSynthBgm() {
    if (this.synthBgmActive) return;
    this.synthBgmActive = true;
    this.isBgmPlaying = true;
    this.scheduleBgmSynthNote(0);
  }

  stopSynthBgm() {
    this.synthBgmActive = false;
    if (this.synthBgmTimer) {
      clearTimeout(this.synthBgmTimer);
      this.synthBgmTimer = null;
    }
  }

  scheduleBgmSynthNote(step) {
    if (!this.synthBgmActive || !this.audioCtx) return;

    const item = this.sequence[step % this.sequence.length];
    const freq = this.melodyNotes[item.note];
    const dur = item.dur;

    this.playTone(freq, dur, 'sine', 0.3);

    if (item.bass !== null && item.bass !== undefined) {
      const bassFreq = this.melodyNotes[item.bass];
      this.playTone(bassFreq / 2, dur * 1.4, 'triangle', 0.16);
    }

    const nextInterval = dur * 950;
    this.synthBgmTimer = setTimeout(() => {
      this.scheduleBgmSynthNote(step + 1);
    }, nextInterval);
  }

  playTone(freq, duration, type, volume) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(volume * 0.6, now + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.6);
  }

  stopAllAudio() {
    this.stopBgm();
    this.stopCakeBgm();
    this.stopFireworks();
    if (this.audioCtx && this.audioCtx.state === 'running') {
      try {
        this.audioCtx.suspend();
      } catch (e) {}
    }
  }
}

// Global instance
window.birthdayAudio = new BirthdayAudioManager();
