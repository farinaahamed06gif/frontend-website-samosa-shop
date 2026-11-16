// Web Audio API procedural acoustic crunch synthesizer
// Models the frequency envelope of a 72-layer ghee pastry crust shattering at 64dB

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
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

  playCrunch() {
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Multi-stage micro-crackle: 5 rapid micro-fractures in succession
    const bursts = [0, 0.04, 0.09, 0.13, 0.18];

    bursts.forEach((offset, idx) => {
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/white noise with sharp attack
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter centered at acoustic pastry snap frequencies (1800Hz - 4200Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200 + Math.random() * 1400, now + offset);
      filter.Q.setValueAtTime(3.5, now + offset);

      // Highpass for crisp edge snap
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1200, now + offset);

      const gain = ctx.createGain();
      const peakGain = 0.28 * Math.pow(0.75, idx);
      gain.gain.setValueAtTime(peakGain, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

      noise.connect(filter);
      filter.connect(highpass);
      highpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now + offset);
      noise.stop(now + offset + 0.08);
    });

    // Sub-harmonic resonant thump (interior steaming potato resonance)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }
}

export const acousticSynthesizer = new AudioSynthesizer();

