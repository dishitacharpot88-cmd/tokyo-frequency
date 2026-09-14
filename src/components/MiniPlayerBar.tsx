import React, { useEffect, useState, useRef } from 'react';
import { Track, PageTab } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Radio } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface MiniPlayerBarProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onOpenFullPlayer: () => void;
  currentTab: PageTab;
}

export const MiniPlayerBar: React.FC<MiniPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onOpenFullPlayer,
  currentTab,
}) => {
  const [volume, setVolume] = useState(audioEngine.getVolume());
  const [eqHeights, setEqHeights] = useState<number[]>(new Array(16).fill(2));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.duration || 45);
  const isSeeking = useRef(false);

  // Frequency Equalizer Animator
  useEffect(() => {
    let animId: number;
    const freqArray = new Uint8Array(16);

    const updateEq = () => {
      if (isPlaying) {
        audioEngine.getFrequencyData(freqArray);
        const heights = Array.from(freqArray).map((val) => {
          return Math.max(6, Math.min(100, Math.floor((val / 255) * 100)));
        });
        setEqHeights(heights);
      } else {
        // Stop equalizer when paused
        setEqHeights(new Array(16).fill(2));
      }
      animId = requestAnimationFrame(updateEq);
    };

    updateEq();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

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

  const formatTime = (secs: number) => {
    const safeSecs = Math.max(0, Math.floor(secs || 0));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    isSeeking.current = true;
    setCurrentTime(val);
  };

  const handleScrubCommit = () => {
    isSeeking.current = false;
    audioEngine.seek(currentTime);
  };

  // If we are currently on the full music page on desktop, we show a clean compact version
  const isMusicTab = currentTab === 'music';

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside aria-label="Audio player" className="fixed bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-40 mx-auto max-w-5xl">
      <div className="glass-panel relative overflow-hidden rounded-2xl p-2.5 sm:p-4 shadow-2xl border border-white/10 transition-all">
        {/* Glowing top line gradient indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${currentTrack.accentColor} 50%, transparent 100%)`,
            opacity: isPlaying ? 0.9 : 0.2,
          }}
        />

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Spinning Vinyl Thumbnail & Track Info */}
          <div
            id="mini-player-track-info"
            onClick={onOpenFullPlayer}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer group"
          >
            {/* Spinning Vinyl Album Disc */}
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-black p-0.5 shadow-md border border-white/10">
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className={`h-full w-full rounded-full object-cover shadow-inner transition-transform duration-700 ${
                  isPlaying ? 'vinyl-spinning' : 'vinyl-paused'
                }`}
              />
              <div className="absolute inset-0 m-auto h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-white/20 bg-[#050505]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="truncate font-display text-xs sm:text-sm font-semibold text-white group-hover:text-[#ebb2ff] transition-colors">
                  {currentTrack.title}
                </span>
                <span
                  className="hidden sm:inline rounded px-1.5 py-0.2 text-[9px] font-mono font-medium tracking-wider uppercase"
                  style={{
                    backgroundColor: `${currentTrack.accentColor}20`,
                    color: currentTrack.accentColor,
                    border: `1px solid ${currentTrack.accentColor}40`,
                  }}
                >
                  {currentTrack.genreTag}
                </span>
              </div>
              <p className="truncate font-mono text-[11px] sm:text-xs text-white/50">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Center: Core Audio Controls & Synchronized Progress Bar */}
          <div className="flex flex-col items-center justify-center gap-1 flex-1 max-w-md mx-1 sm:mx-2">
            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                id="mini-player-prev-btn"
                onClick={onPrevTrack}
                className="text-white/60 hover:text-white transition-colors p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Previous Track"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                id="mini-player-play-btn"
                onClick={onTogglePlay}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#bc13fe] to-[#ebb2ff] text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(235,178,255,0.4)] min-w-[36px] min-h-[36px]"
                aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                id="mini-player-next-btn"
                onClick={onNextTrack}
                className="text-white/60 hover:text-white transition-colors p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Next Track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Synchronized Progress Bar with Scrubbing */}
            <div className="w-full flex items-center gap-2">
              <span className="hidden sm:inline font-mono text-[10px] text-white/40">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 flex items-center h-3">
                <input
                  id="mini-player-scrubber"
                  type="range"
                  min="0"
                  max={duration > 0 ? duration : 45}
                  step="0.1"
                  value={currentTime}
                  onChange={handleScrubChange}
                  onMouseUp={handleScrubCommit}
                  onTouchEnd={handleScrubCommit}
                  className="w-full h-1 bg-white/10 rounded-lg accent-[#ebb2ff] cursor-pointer"
                  aria-label="Seek track position"
                />
              </div>
              <span className="hidden sm:inline font-mono text-[10px] text-white/40">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Live mini frequency visualizer & expand button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Equalizer Bars: Animates while playing, stops when paused */}
            <div className="hidden md:flex h-6 items-end gap-0.5 px-1.5">
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-t transition-all duration-75"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i % 2 === 0 ? currentTrack.accentColor : '#00fbfb',
                    opacity: isPlaying ? 0.9 : 0.2,
                  }}
                />
              ))}
            </div>

            {/* Volume Control */}
            <div className="hidden lg:flex items-center gap-1.5 border-l border-white/10 pl-2.5">
              <button
                id="mini-player-mute-btn"
                onClick={handleToggleMute}
                className="text-white/60 hover:text-white p-1"
                aria-label={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-white/40" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white/60" />
                )}
              </button>
              <input
                id="mini-player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 w-16 accent-[#ebb2ff] cursor-pointer bg-white/20 rounded-lg"
                aria-label="Adjust Volume"
              />
            </div>

            {/* View Full Turntable Lounge */}
            {!isMusicTab && (
              <button
                id="open-turntable-lounge-btn"
                onClick={onOpenFullPlayer}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] sm:text-[11px] font-mono text-white/80 hover:bg-white/10 hover:text-white transition-all"
                title="Expand to Full Turntable Lounge"
                aria-label="Open Full Turntable Lounge"
              >
                <Radio className="h-3.5 w-3.5 text-[#ebb2ff]" />
                <span className="hidden sm:inline">Turntable</span>
                <Maximize2 className="h-3 w-3 opacity-60" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
