class SoundEffects {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.muted = false;
        this.volume = 0.3; // Default 30% volume
        this.sirenInterval = null;
        this.sirenOsc = null;
        this.sirenGain = null;
        this.isSirenPlaying = false;
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        } catch (e) {
            console.error('Web Audio API not supported in this browser', e);
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain && this.ctx && !this.muted) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    // A helper to create an oscillator with default properties
    createOscillator(type, frequency, duration) {
        this.init();
        if (!this.ctx || this.ctx.state === 'suspended') return null;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        return { osc, gainNode };
    }

    playWaka() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        const { osc, gainNode } = this.createOscillator('triangle', 330, 0.08) || {};
        if (!osc) return;

        // Pitch envelope: sweep from 330Hz up to 550Hz then down to 300Hz
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        // Volume envelope: fade out quickly
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playDeath() {
        this.init();
        if (!this.ctx || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        const duration = 1.2;
        
        // Disable siren if playing
        this.stopSiren();

        // 1. Synthesize dissolving retro pulse sweep
        const { osc, gainNode } = this.createOscillator('sawtooth', 800, duration) || {};
        if (!osc) return;

        osc.frequency.setValueAtTime(800, now);
        // Descending arpeggiated sweep
        for (let i = 0; i < 12; i++) {
            const time = now + (i * 0.08);
            const freq = 800 - (i * 60);
            osc.frequency.setValueAtTime(freq, time);
        }
        osc.frequency.exponentialRampToValueAtTime(60, now + duration);

        gainNode.gain.setValueAtTime(0.6, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + duration);

        // Filter to make it sound "muffled/dissolving"
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + duration);

        // Reconnect through filter
        osc.disconnect();
        osc.connect(filter);
        filter.connect(gainNode);

        osc.start(now);
        osc.stop(now + duration);
    }

    playGhostEat() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        const { osc, gainNode } = this.createOscillator('sine', 200, 0.3) || {};
        if (!osc) return;

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);

        gainNode.gain.setValueAtTime(0.8, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playHackPickup() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Futuristic cyber arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
        notes.forEach((freq, index) => {
            const noteTime = now + (index * 0.05);
            const { osc, gainNode } = this.createOscillator('square', freq, 0.15) || {};
            if (!osc) return;

            gainNode.gain.setValueAtTime(0.2, noteTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

            // Filter for retro-synth texture
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'peaking';
            filter.Q.value = 10;
            filter.frequency.value = freq * 1.5;
            osc.disconnect();
            osc.connect(filter);
            filter.connect(gainNode);

            osc.start(noteTime);
            osc.stop(noteTime + 0.15);
        });
    }

    playStart() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Classic arcade melody
        // Notes: C4 (0.1s), C5 (0.1s), G4 (0.1s), E4 (0.1s), C5 (0.1s), G4 (0.1s), E4 (0.2s)
        const melody = [
            { note: 261.63, duration: 0.1 },  // C4
            { note: 523.25, duration: 0.1 },  // C5
            { note: 392.00, duration: 0.1 },  // G4
            { note: 329.63, duration: 0.1 },  // E4
            { note: 523.25, duration: 0.1 },  // C5
            { note: 392.00, duration: 0.1 },  // G4
            { note: 329.63, duration: 0.2 },  // E4
            { note: 349.23, duration: 0.1 },  // F4
            { note: 440.00, duration: 0.1 },  // A4
            { note: 587.33, duration: 0.1 },  // D5
            { note: 659.25, duration: 0.2 },  // E5
            { note: 783.99, duration: 0.4 }   // G5
        ];

        let accumulatedTime = 0;
        melody.forEach((item) => {
            const noteTime = now + accumulatedTime;
            const { osc, gainNode } = this.createOscillator('triangle', item.note, item.duration) || {};
            if (osc) {
                gainNode.gain.setValueAtTime(0.3, noteTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, noteTime + item.duration);
                osc.start(noteTime);
                osc.stop(noteTime + item.duration);
            }
            accumulatedTime += item.duration + 0.02; // Small gap between notes
        });
    }

    playWin() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Retro win sound: fast upwards trill
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        notes.forEach((freq, index) => {
            const noteTime = now + (index * 0.08);
            const { osc, gainNode } = this.createOscillator('sine', freq, 0.12) || {};
            if (osc) {
                gainNode.gain.setValueAtTime(0.4, noteTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.12);
                osc.start(noteTime);
                osc.stop(noteTime + 0.12);
            }
        });
    }

    startSiren() {
        this.init();
        if (!this.ctx || this.muted || this.ctx.state === 'suspended' || this.isSirenPlaying) return;

        const now = this.ctx.currentTime;
        this.sirenOsc = this.ctx.createOscillator();
        this.sirenGain = this.ctx.createGain();

        this.sirenOsc.type = 'triangle';
        this.sirenOsc.frequency.setValueAtTime(220, now);
        
        // Create an LFO to modulate the frequency (pulsating siren)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        
        lfo.frequency.value = 2.5; // Pulsate 2.5 times per second
        lfoGain.gain.value = 40;   // Modulate pitch by +/- 40Hz
        
        lfo.connect(lfoGain);
        lfoGain.connect(this.sirenOsc.frequency);
        
        this.sirenOsc.connect(this.sirenGain);
        this.sirenGain.connect(this.masterGain);
        
        this.sirenGain.gain.setValueAtTime(0.12, now); // Low background siren

        lfo.start(now);
        this.sirenOsc.start(now);
        this.isSirenPlaying = true;
    }

    stopSiren() {
        if (this.sirenOsc && this.isSirenPlaying) {
            try {
                this.sirenOsc.stop();
            } catch(e) {}
            this.sirenOsc = null;
            this.sirenGain = null;
            this.isSirenPlaying = false;
        }
    }
}

export const sound = new SoundEffects();
