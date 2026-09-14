// HTML5 Audio Engine & Web Audio Visualizer
// Directly plays real local audio files (/audio/neon-espresso.mp3, /audio/sakura-rain.mp3, /audio/midnight-tokyo.mp3)
// Connected with Web Audio AnalyserNode for live spectrum equalization and seamless playback controls.

import { Track } from '../types';

type TimeUpdateCallback = (currentTime: number, duration: number) => void;
type StateChangeCallback = (isPlaying: boolean) => void;
type TrackEndCallback = () => void;

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private volume: number = 0.8;
  private rainEnabled: boolean = true;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  private timeUpdateListeners: Set<TimeUpdateCallback> = new Set();
  private stateChangeListeners: Set<StateChangeCallback> = new Set();
  private trackEndListeners: Set<TrackEndCallback> = new Set();

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;

    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = this.volume;

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio) return;
      const current = this.audio.currentTime || 0;
      const dur = this.audio.duration || this.currentTrack?.duration || 0;
      this.timeUpdateListeners.forEach((cb) => cb(current, dur));
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.stateChangeListeners.forEach((cb) => cb(true));
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.stateChangeListeners.forEach((cb) => cb(false));
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.stateChangeListeners.forEach((cb) => cb(false));
      this.trackEndListeners.forEach((cb) => cb());
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        const dur = this.audio.duration || this.currentTrack?.duration || 0;
        this.timeUpdateListeners.forEach((cb) => cb(this.audio?.currentTime || 0, dur));
      }
    });
  }

  private initWebAudio() {
    if (!this.ctx && typeof window !== 'undefined' && this.audio) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.8;

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        // Connect media element source if possible
        if (!this.sourceNode) {
          try {
            this.sourceNode = this.ctx.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
          } catch (e) {
            console.warn('MediaElementSource initialization notice:', e);
          }
        }

        // Initialize rain ambient sound generator
        this.setupRainAmbience();
      } catch (err) {
        console.warn('Web Audio initialization fallback:', err);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private setupRainAmbience() {
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.153852;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.025;
        b6 = white * 0.115926;
      }

      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = noiseBuffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.rainEnabled ? 0.05 : 0, this.ctx.currentTime);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainSource.start(0);
    } catch {
      // Rain buffer initialization silent guard
    }
  }

  public playTrack(track: Track) {
    this.initAudioElement();
    this.initWebAudio();

    if (!this.audio) return;

    const isDifferentTrack = !this.currentTrack || this.currentTrack.id !== track.id;
    this.currentTrack = track;

    if (isDifferentTrack) {
      this.audio.src = track.audioUrl;
      this.audio.currentTime = 0;
      this.audio.load();
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.stateChangeListeners.forEach((cb) => cb(true));
        })
        .catch((error) => {
          console.warn('Playback request prevented or interrupted:', error);
          this.isPlaying = false;
          this.stateChangeListeners.forEach((cb) => cb(false));
        });
    }
  }

  public togglePlay(track?: Track) {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (track) {
        this.playTrack(track);
      } else if (this.currentTrack) {
        this.playTrack(this.currentTrack);
      }
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.stateChangeListeners.forEach((cb) => cb(false));
  }

  public resume() {
    if (this.currentTrack) {
      this.playTrack(this.currentTrack);
    }
  }

  public seek(seconds: number) {
    if (this.audio && isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || seconds));
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleRain(enable?: boolean): boolean {
    this.rainEnabled = enable !== undefined ? enable : !this.rainEnabled;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.rainEnabled ? 0.05 : 0, this.ctx.currentTime);
    }
    return this.rainEnabled;
  }

  public getRainState(): boolean {
    return this.rainEnabled;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  public getDuration(): number {
    return this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0
      ? this.audio.duration
      : this.currentTrack?.duration || 0;
  }

  // Live FFT spectrum data. When paused, returns zero to stop equalizer animations immediately.
  public getFrequencyData(array: Uint8Array): void {
    if (!this.isPlaying) {
      // Stopped equalizer when paused
      array.fill(0);
      return;
    }

    if (this.analyser) {
      try {
        this.analyser.getByteFrequencyData(array);
        // Check if analyser has signal
        let hasSignal = false;
        for (let i = 0; i < array.length; i++) {
          if (array[i] > 0) {
            hasSignal = true;
            break;
          }
        }
        if (hasSignal) return;
      } catch {
        // fallthrough to dynamic audio simulation
      }
    }

    // Dynamic pulse simulation matched to audio playback time when playing
    const time = this.audio ? this.audio.currentTime : Date.now() / 1000;
    const bpm = this.currentTrack?.bpm || 115;
    const beat = (time * (bpm / 60)) % 4;

    for (let i = 0; i < array.length; i++) {
      const freqFactor = (i + 1) / array.length;
      const pulse = Math.sin(time * 6 + i * 0.4) * 0.4 + 0.6;
      const beatKick = Math.exp(-(beat % 1) * 4) * (1 - freqFactor * 0.7);
      const rawVal = (pulse * 0.6 + beatKick * 0.8) * (200 - i * 3);
      array[i] = Math.max(10, Math.min(255, Math.floor(rawVal)));
    }
  }

  public onTimeUpdate(callback: TimeUpdateCallback) {
    this.timeUpdateListeners.add(callback);
    return () => this.timeUpdateListeners.delete(callback);
  }

  public onStateChange(callback: StateChangeCallback) {
    this.stateChangeListeners.add(callback);
    return () => this.stateChangeListeners.delete(callback);
  }

  public onTrackEnd(callback: TrackEndCallback) {
    this.trackEndListeners.add(callback);
    return () => this.trackEndListeners.delete(callback);
  }
}

export const audioEngine = new AudioEngine();
