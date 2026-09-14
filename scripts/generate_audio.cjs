const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate 44.1kHz 16-bit stereo WAV file
function createWavBuffer(durationSeconds, sampleGenerator) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // PCM audio format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const [leftSample, rightSample] = sampleGenerator(t, i, sampleRate, durationSeconds);

    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const intL = Math.floor(clamp(leftSample) * 32767);
    const intR = Math.floor(clamp(rightSample) * 32767);

    buffer.writeInt16LE(intL, offset);
    offset += 2;
    buffer.writeInt16LE(intR, offset);
    offset += 2;
  }

  return buffer;
}

// 1. Neon Espresso (Synthwave - driving synth, bass pulse, neon arpeggio, BPM 120)
function generateNeonEspresso() {
  const bpm = 120;
  const beatDuration = 60 / bpm; // 0.5s per beat
  const chordProgression = [
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [196.00, 246.94, 293.66, 392.00]  // G
  ];
  const bassNotes = [110.00, 87.31, 130.81, 98.00];

  const duration = 45; // 45 seconds seamless loop

  return createWavBuffer(duration, (t) => {
    const chordIndex = Math.floor((t / (beatDuration * 4)) % chordProgression.length);
    const chord = chordProgression[chordIndex];
    const bassFreq = bassNotes[chordIndex];
    const beatPos = (t % beatDuration) / beatDuration;
    const barPos = (t % (beatDuration * 4)) / (beatDuration * 4);

    // Arpeggio note
    const arpNotes = [chord[0], chord[1], chord[2], chord[3], chord[2], chord[1], chord[3], chord[2] * 1.5];
    const arpStep = Math.floor((t / (beatDuration / 2)) % arpNotes.length);
    const arpFreq = arpNotes[arpStep];
    const arpEnv = Math.exp(-((t % (beatDuration / 2)) * 6));
    const arpVal = (Math.sin(2 * Math.PI * arpFreq * t) + 0.3 * Math.sin(4 * Math.PI * arpFreq * t)) * arpEnv * 0.18;

    // Bass Synth (16th note pumping)
    const sixteenth = (t % (beatDuration / 4)) / (beatDuration / 4);
    const bassEnv = Math.exp(-sixteenth * 5);
    const bassVal = (Math.sin(2 * Math.PI * bassFreq * t) + 0.4 * Math.sin(2 * Math.PI * (bassFreq * 2) * t)) * bassEnv * 0.28;

    // Lush Pad Chords
    let padVal = 0;
    for (let c = 0; c < chord.length; c++) {
      const f = chord[c];
      const detune = 1.002;
      padVal += (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * detune * t)) * 0.04;
    }

    // Gentle kick drum pulse on every beat
    const kickEnv = Math.exp(-beatPos * 14);
    const kickFreq = 120 * Math.exp(-beatPos * 18) + 45;
    const kickVal = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.35;

    // Hi-hat noise on off-beats
    const offbeat = ((t + beatDuration / 2) % beatDuration) / beatDuration;
    const hatEnv = Math.exp(-offbeat * 25);
    const hatVal = (Math.random() * 2 - 1) * hatEnv * 0.05;

    // Vinyl texture
    const vinyl = (Math.random() > 0.998 ? (Math.random() * 2 - 1) * 0.15 : 0) + (Math.random() * 2 - 1) * 0.005;

    const left = (padVal * 0.8 + arpVal * 1.2 + bassVal * 0.9 + kickVal + hatVal * 0.6 + vinyl) * 0.75;
    const right = (padVal * 0.8 + arpVal * 0.8 + bassVal * 0.9 + kickVal + hatVal * 1.2 + vinyl) * 0.75;

    return [left, right];
  });
}

// 2. Sakura Rain (Ambient / Rain / Koto Meditation, BPM 75)
function generateSakuraRain() {
  const duration = 48; // 48 seconds seamless ambient soundscape
  const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C D E G A C D E

  return createWavBuffer(duration, (t) => {
    // Ethereal drone base (C and G drone)
    const drone1 = Math.sin(2 * Math.PI * 130.81 * t) * 0.12;
    const drone2 = Math.sin(2 * Math.PI * 196.00 * (t * 1.001)) * 0.09;
    const drone3 = Math.sin(2 * Math.PI * 261.63 * t) * 0.07;
    const subDrone = Math.sin(2 * Math.PI * 65.41 * t) * 0.14;

    // Intermittent delicate Koto plucks
    let kotoL = 0;
    let kotoR = 0;
    const pluckInterval = 2.4;
    const pluckIndex = Math.floor(t / pluckInterval);
    const pluckTime = t % pluckInterval;
    const noteFreq = pentatonicScale[(pluckIndex * 3 + 1) % pentatonicScale.length];
    const kotoEnv = Math.exp(-pluckTime * 3.2);

    if (pluckTime < 2.0) {
      const harmonic1 = Math.sin(2 * Math.PI * noteFreq * t);
      const harmonic2 = 0.5 * Math.sin(2 * Math.PI * noteFreq * 2 * t);
      const harmonic3 = 0.25 * Math.sin(2 * Math.PI * noteFreq * 3 * t);
      const pluckVal = (harmonic1 + harmonic2 + harmonic3) * kotoEnv * 0.22;
      const pan = Math.sin(pluckIndex);
      kotoL = pluckVal * (0.5 - pan * 0.3);
      kotoR = pluckVal * (0.5 + pan * 0.3);
    }

    // Soft warm rain noise filter
    const rainNoise = (Math.random() * 2 - 1) * 0.035;

    // Gentle wave modulation (swell)
    const swell = (Math.sin(t * 0.3) * 0.5 + 0.5);

    const basePad = (drone1 + drone2 + drone3) * (0.7 + 0.3 * swell) + subDrone;
    const left = (basePad + kotoL + rainNoise) * 0.7;
    const right = (basePad + kotoR + rainNoise) * 0.7;

    return [left, right];
  });
}

// 3. Midnight Tokyo (Lo-Fi House / Jazz, BPM 115)
function generateMidnightTokyo() {
  const bpm = 115;
  const beatDuration = 60 / bpm;
  const duration = 50; // 50 seconds

  // Dm9 -> G13 -> Cmaj9 -> Am9
  const chords = [
    [146.83, 220.00, 261.63, 329.63], // Dm9
    [196.00, 246.94, 329.63, 392.00], // G13
    [130.81, 196.00, 246.94, 293.66], // Cmaj9
    [220.00, 261.63, 329.63, 392.00]  // Am9
  ];
  const bassline = [73.42, 98.00, 65.41, 110.00];

  return createWavBuffer(duration, (t) => {
    const chordIndex = Math.floor((t / (beatDuration * 4)) % chords.length);
    const chord = chords[chordIndex];
    const bassFreq = bassline[chordIndex];
    const beatPos = (t % beatDuration) / beatDuration;

    // Rhodes piano warmth
    let rhodesVal = 0;
    const strum = (t % (beatDuration * 2)) / (beatDuration * 2);
    const rhodesEnv = Math.exp(-strum * 2.2);
    for (let c = 0; c < chord.length; c++) {
      const f = chord[c];
      rhodesVal += (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t) + 0.1 * Math.sin(6 * Math.PI * f * t)) * 0.06;
    }
    rhodesVal *= rhodesEnv;

    // Deep warm lo-fi bass
    const bassEnv = Math.exp(-beatPos * 2.5);
    const bassVal = (Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(2 * Math.PI * bassFreq * 2 * t)) * bassEnv * 0.3;

    // Lo-Fi Kick (subby)
    const kickEnv = Math.exp(-beatPos * 16);
    const kickFreq = 100 * Math.exp(-beatPos * 20) + 40;
    const kickVal = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.32;

    // Snare / Rim on beat 2 and 4
    const isSnareBeat = (Math.floor(t / beatDuration) % 2 === 1);
    const snareEnv = isSnareBeat ? Math.exp(-beatPos * 18) : 0;
    const snareVal = (Math.random() * 2 - 1) * snareEnv * 0.12;

    // Vinyl crackle and groove noise
    const crackle = (Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.18 : 0) + (Math.random() * 2 - 1) * 0.008;

    const left = (rhodesVal * 1.1 + bassVal + kickVal + snareVal * 0.8 + crackle) * 0.72;
    const right = (rhodesVal * 0.9 + bassVal + kickVal + snareVal * 1.2 + crackle) * 0.72;

    return [left, right];
  });
}

console.log('Generating /audio/neon-espresso.mp3...');
fs.writeFileSync(path.join(outputDir, 'neon-espresso.mp3'), generateNeonEspresso());

console.log('Generating /audio/sakura-rain.mp3...');
fs.writeFileSync(path.join(outputDir, 'sakura-rain.mp3'), generateSakuraRain());

console.log('Generating /audio/midnight-tokyo.mp3...');
fs.writeFileSync(path.join(outputDir, 'midnight-tokyo.mp3'), generateMidnightTokyo());

console.log('Audio files generated successfully in public/audio!');
