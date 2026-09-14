import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../../types';
import { TRACKS } from '../../data/tracks';
import { audioEngine } from '../../utils/audioEngine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  CloudRain,
  Disc3,
  Radio,
  Sparkles,
} from 'lucide-react';

interface MusicPageProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (track: Track) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  rainEnabled: boolean;
  onToggleRain: () => void;
}

export const MusicPage: React.FC<MusicPageProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
  rainEnabled,
  onToggleRain,
}) => {
  const [eqBars, setEqBars] = useState<number[]>(new Array(40).fill(2));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.duration || 45);
  const [favorites, setFavorites] = useState<string[]>(['neon-espresso', 'sakura-rain']);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(audioEngine.getVolume());
  const isSeeking = useRef(false);

  // Sync real HTML5 audio time and duration
  useEffect(() => {
    const unsub = audioEngine.onTimeUpdate((curr, dur) => {
      if (!isSeeking.current) {
        setCurrentTime(curr);
      }
      if (dur > 0 && isFinite(dur)) {
        setDuration(dur);
      }
    });

    setCurrentTime(audioEngine.getCurrentTime());
    setDuration(audioEngine.getDuration() || currentTrack.duration || 45);

    return () => {
      unsub();
    };
  }, [currentTrack]);

  // Frequency visualizer frame loop
  useEffect(() => {
    let animId: number;
    const freqArray = new Uint8Array(40);

    const updateVisualizer = () => {
      if (isPlaying) {
        audioEngine.getFrequencyData(freqArray);
        const heights = Array.from(freqArray).map((val) => {
          return Math.max(4, Math.min(100, Math.floor((val / 255) * 100)));
        });
        setEqBars(heights);
      } else {
        // Equalizer is stopped when paused
        setEqBars(new Array(40).fill(2));
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const formatSeconds = (secs: number) => {
    const safeSecs = Math.max(0, Math.floor(secs || 0));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    isSeeking.current = true;
    setCurrentTime(val);
  };

  const handleSeekCommit = () => {
    isSeeking.current = false;
    audioEngine.seek(currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      audioEngine.setVolume(0);
    } else {
      setVolume(0.8);
      audioEngine.setVolume(0.8);
    }
  };

  const handleNextWithShuffle = () => {
    if (isShuffle) {
      const remainingTracks = TRACKS.filter((t) => t.id !== currentTrack.id);
      const randomTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
      if (randomTrack) {
        onSelectTrack(randomTrack);
        return;
      }
    }
    onNextTrack();
  };

  return (
    <div className="relative min-h-screen pt-28 pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#ebb2ff]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
                AUDIOPHILE LOUNGE • 音響空間
              </span>
              <span className="font-mono text-xs text-[#00fbfb]">108.4 MHz DIRECT BROADCAST</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">
              The Turntable Archive
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="music-toggle-rain-btn"
              onClick={onToggleRain}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs transition-all ${
                rainEnabled
                  ? 'border-[#00fbfb]/30 bg-[#00fbfb]/10 text-[#00fbfb]'
                  : 'border-white/10 bg-white/5 text-white/50'
              }`}
            >
              <CloudRain className="h-3.5 w-3.5" />
              <span>Rain Sub-Layer {rainEnabled ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Turntable Platter Deck & Up Next Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Turntable Platter Main Stage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel relative rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl overflow-hidden">
              {/* Background ambient radial glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${currentTrack.accentColor} 0%, transparent 70%)`,
                }}
              />

              {/* Top Deck Info Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                  <Disc3 className={`h-4 w-4 ${isPlaying ? 'text-[#ebb2ff] animate-spin' : ''}`} />
                  <span>33 ⅓ RPM • TECHNICS SL-1200G</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-white/40">BPM:</span>
                  <span className="font-bold text-[#00fbfb]">{currentTrack.bpm}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[#ebb2ff] uppercase">{currentTrack.genreTag}</span>
                </div>
              </div>

              {/* Interactive Platter & Tonearm Stage */}
              <div className="relative flex items-center justify-center py-6 sm:py-10">
                {/* Turntable Base Platter */}
                <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-gradient-to-tr from-[#050505] via-[#121414] to-[#1e2020] p-3 shadow-[0_0_60px_rgba(0,0,0,0.9)] border-2 border-white/10">
                  {/* Outer Strobe Dots */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-white/15" />
                  {/* Grooves Rings */}
                  <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-8 rounded-full border border-white/[0.06]" />
                  <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.06]" />

                  {/* Spinning Center Record */}
                  <div className="relative h-full w-full rounded-full overflow-hidden shadow-2xl">
                    <img
                      src={currentTrack.artworkUrl}
                      alt={currentTrack.title}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover ${
                        isPlaying ? 'vinyl-spinning' : 'vinyl-paused'
                      }`}
                    />
                    {/* Vinyl Spindle Center */}
                    <div className="absolute inset-0 m-auto h-12 w-12 rounded-full border-4 border-black/80 bg-[#0d0e0f] shadow-inner flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>

                {/* Simulated Tonearm Over Platter */}
                <div
                  className="hidden sm:block absolute top-6 right-8 w-24 h-48 pointer-events-none transition-transform duration-700 origin-top-right"
                  style={{
                    transform: isPlaying ? 'rotate(18deg)' : 'rotate(0deg)',
                  }}
                >
                  {/* Pivot Base */}
                  <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-[#333535] border border-white/20 shadow-md" />
                  {/* Arm Shaft */}
                  <div className="absolute top-4 right-3.5 w-1.5 h-36 bg-gradient-to-b from-[#888] to-[#444] rounded-full shadow-lg" />
                  {/* Cartridge Head */}
                  <div className="absolute bottom-6 right-2 w-5 h-7 bg-[#bc13fe] rounded-sm border border-white/40 shadow-sm" />
                </div>
              </div>

              {/* Live 40-Bar Spectrum Equalizer */}
              <div className="mt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    Live Tube Output Spectrum (Analogue Warmth: 98.4%)
                  </span>
                  <span className="font-mono text-[10px] text-[#00fbfb]">
                    {isPlaying ? 'ACTIVE SPECTRUM' : 'EQUALIZER PAUSED'}
                  </span>
                </div>
                <div className="flex h-14 items-end justify-between gap-1 rounded-xl bg-black/40 p-2.5 border border-white/5">
                  {eqBars.map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-t transition-all duration-75"
                      style={{
                        height: `${height}%`,
                        backgroundColor:
                          idx % 3 === 0
                            ? currentTrack.accentColor
                            : idx % 3 === 1
                            ? '#00fbfb'
                            : '#ffffff',
                        opacity: isPlaying ? 0.9 : 0.2,
                        boxShadow: isPlaying ? `0 0 6px ${currentTrack.accentColor}40` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Track Title & Artist Metadata */}
              <div className="flex items-start justify-between gap-4 pt-2">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {currentTrack.title}
                  </h2>
                  <p className="font-mono text-sm text-white/60 mt-1">
                    {currentTrack.artist} — <span className="text-white/40">{currentTrack.album}</span>
                  </p>
                  <p className="font-sans text-xs text-white/70 mt-2 max-w-lg leading-relaxed">
                    {currentTrack.description}
                  </p>
                </div>

                <button
                  id="toggle-track-fav-btn"
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    favorites.includes(currentTrack.id)
                      ? 'border-[#ebb2ff]/50 bg-[#ebb2ff]/10 text-[#ebb2ff]'
                      : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                  }`}
                  aria-label="Bookmark Track"
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(currentTrack.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Scrubbing Timeline Slider */}
              <div className="space-y-1.5 mt-6">
                <input
                  id="music-track-scrubber"
                  type="range"
                  min="0"
                  max={duration > 0 ? duration : 45}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekCommit}
                  onTouchEnd={handleSeekCommit}
                  className="w-full h-2 rounded-lg bg-white/10 accent-[#ebb2ff] cursor-pointer"
                  aria-label="Audio Timeline Scrubber"
                />
                <div className="flex justify-between font-mono text-xs text-white/40">
                  <span className="text-white/70">{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Core Deck Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                <div className="flex items-center gap-2">
                  <button
                    id="deck-shuffle-btn"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 rounded-lg transition-colors ${
                      isShuffle ? 'text-[#00fbfb] bg-[#00fbfb]/10' : 'text-white/40 hover:text-white'
                    }`}
                    title="Shuffle Track List"
                    aria-label="Toggle Shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                  <button
                    id="deck-repeat-btn"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRepeat ? 'text-[#ebb2ff] bg-[#ebb2ff]/10' : 'text-white/40 hover:text-white'
                    }`}
                    title="Loop Track Play"
                    aria-label="Toggle Repeat"
                  >
                    <Repeat className="h-4 w-4" />
                  </button>
                </div>

                {/* Prev / Play / Next */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    id="deck-prev-track-btn"
                    onClick={onPrevTrack}
                    className="p-3 text-white/70 hover:text-white transition-colors"
                    aria-label="Previous Track"
                  >
                    <SkipBack className="h-6 w-6" />
                  </button>

                  <button
                    id="deck-main-play-btn"
                    onClick={onTogglePlay}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] text-black shadow-[0_0_25px_rgba(235,178,255,0.45)] hover:scale-105 transition-all"
                    aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 fill-current ml-1" />
                    )}
                  </button>

                  <button
                    id="deck-next-track-btn"
                    onClick={handleNextWithShuffle}
                    className="p-3 text-white/70 hover:text-white transition-colors"
                    aria-label="Next Track"
                  >
                    <SkipForward className="h-6 w-6" />
                  </button>
                </div>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    id="deck-mute-btn"
                    onClick={handleToggleMute}
                    className="text-white/60 hover:text-white p-1"
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? <VolumeX className="h-4 w-4 text-white/40" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input
                    id="deck-volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 sm:w-24 h-1.5 accent-[#ebb2ff] cursor-pointer bg-white/20 rounded-lg"
                    aria-label="Volume Control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Up Next Vinyl Playlist Crate */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#ebb2ff]" />
                  <h3 className="font-display text-lg font-bold text-white">Vinyl Crate Queue</h3>
                </div>
                <span className="font-mono text-xs text-white/40">{TRACKS.length} RECORDS</span>
              </div>

              {/* Tracks List */}
              <div className="space-y-2.5">
                {TRACKS.map((track, idx) => {
                  const isCurrent = track.id === currentTrack.id;
                  const isFav = favorites.includes(track.id);

                  return (
                    <div
                      key={track.id}
                      id={`playlist-item-${track.id}`}
                      onClick={() => onSelectTrack(track)}
                      className={`glass-card flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-[#ebb2ff] bg-[#ebb2ff]/10 shadow-[0_0_20px_rgba(235,178,255,0.15)]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number / Status Icon */}
                        <div className="w-6 text-center font-mono text-xs text-white/40 shrink-0">
                          {isCurrent && isPlaying ? (
                            <Disc3 className="h-4 w-4 text-[#ebb2ff] animate-spin inline" />
                          ) : (
                            `0${idx + 1}`
                          )}
                        </div>

                        {/* Thumbnail */}
                        <img
                          src={track.artworkUrl}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />

                        {/* Info */}
                        <div className="min-w-0">
                          <p
                            className={`truncate font-display text-sm font-semibold ${
                              isCurrent ? 'text-[#ebb2ff]' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </p>
                          <p className="truncate font-mono text-xs text-white/50">{track.artist}</p>
                        </div>
                      </div>

                      {/* Right metadata and favorite */}
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-white/60">
                          {track.genreTag}
                        </span>
                        <span className="font-mono text-xs text-white/40">{track.durationFormatted}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track.id);
                          }}
                          className="p-1 text-white/30 hover:text-[#ebb2ff]"
                          aria-label="Bookmark Track In Playlist"
                        >
                          <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-[#ebb2ff] text-[#ebb2ff]' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware Specs Note */}
              <div className="mt-6 rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00fbfb]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Sanctuary Audio Hardware Specifications</span>
                </div>
                <p className="font-sans text-xs text-white/60 leading-relaxed">
                  Analog output amplified through vintage 1978 Marantz Model 2270 Receiver, feeding
                  Tannoy Dual Concentric Monitor Gold 15" horn cabinets in solid Japanese cedar enclosures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
