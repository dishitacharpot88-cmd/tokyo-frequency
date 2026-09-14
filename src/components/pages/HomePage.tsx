import React from 'react';
import { PageTab, Track, DrinkItem } from '../../types';
import { Play, Pause, ArrowRight, Disc3, Sparkles, Coffee, Radio, MapPin, Clock } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: PageTab) => void;
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  featuredDrink: DrinkItem;
  onSelectDrinkTrack: (trackId: string) => void;
  rainEnabled?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  currentTrack,
  isPlaying,
  onTogglePlay,
  featuredDrink,
  onSelectDrinkTrack,
  rainEnabled = true,
}) => {
  return (
    <div className="relative min-h-screen pt-24 pb-32">
      {/* Background Ambient Glows */}
      <div className="glow-primary -top-20 -left-20" />
      <div className="glow-secondary top-1/2 -right-20" />

      {/* Hero Atmosphere */}
      <div className="relative overflow-hidden py-12 md:py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ebb2ff]/30 bg-[#ebb2ff]/10 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(235,178,255,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00fbfb] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00fbfb]"></span>
                </span>
                <span className="font-mono text-xs font-medium tracking-wider text-[#ebb2ff] uppercase">
                  AHMEDABAD AUDIO SANCTUARY • 108.4 MHz BROADCAST
                </span>
              </div>

              {/* Brand & Main Headline Hierarchy */}
              <div className="space-y-4">
                <div>
                  <h1 className="font-hero-brand text-5xl sm:text-7xl lg:text-8xl font-black tracking-[0.14em] sm:tracking-[0.18em] text-white uppercase leading-[1.05] drop-shadow-[0_0_40px_rgba(235,178,255,0.25)]">
                    TOKYO FREQUENCY
                  </h1>
                  <p className="font-mono text-xs sm:text-sm text-[#ebb2ff]/75 tracking-[0.22em] uppercase mt-2.5">
                    東京周波数 — 深夜の音楽喫茶 • AHMEDABAD
                  </p>
                </div>

                {/* Secondary Tagline */}
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ebb2ff] via-white to-[#00fbfb] uppercase">
                  Rain Outside. Music Inside.
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-2xl font-sans text-base sm:text-lg text-white/80 leading-relaxed font-light">
                A subterranean Japanese-inspired listening café in Ahmedabad where single-origin pourovers, warm vacuum-tube
                amplification, and rare vinyl pressings merge with the soothing rhythm of rain.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-explore-menu-btn"
                  onClick={() => onNavigate('menu')}
                  className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] px-7 py-4 font-display text-sm font-bold text-black uppercase tracking-wider shadow-[0_0_25px_rgba(235,178,255,0.35)] hover:shadow-[0_0_35px_rgba(235,178,255,0.6)] transition-all hover:scale-[1.02]"
                >
                  <Coffee className="h-4 w-4" />
                  <span>ENTER THE CAFE</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  id="hero-enter-turntable-btn"
                  onClick={() => onNavigate('music')}
                  className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-mono text-sm font-medium text-white hover:border-[#00fbfb]/50 hover:bg-white/10 hover:text-[#00fbfb] transition-all backdrop-blur-md"
                >
                  <Disc3 className={`h-4 w-4 ${isPlaying ? 'animate-spin' : ''}`} />
                  <span>Audiophile Lounge</span>
                </button>

                <button
                  id="hero-reserve-seat-btn"
                  onClick={() => onNavigate('reserve')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-5 py-3.5 font-mono text-xs text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <span>Reserve Table (予約)</span>
                </button>
              </div>
            </div>

            {/* Right Hero Column: Vertical Kanji & Mini Atmospheric Tile */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col items-center justify-center lg:items-end gap-6">
              {/* Vertical Japanese Typography Pillar */}
              <div className="glass-panel relative flex items-center justify-between rounded-2xl p-6 border border-white/10 w-full max-w-sm">
                <div className="writing-vertical font-display text-2xl font-bold tracking-widest text-[#ebb2ff] opacity-80 select-none py-2">
                  純喫茶 • 音響空間
                </div>

                <div className="space-y-4 text-right">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase block">
                      Atmosphere Report
                    </span>
                    <p className="font-display text-lg font-semibold text-white">Atmosphere: 24°C</p>
                    <p className="font-mono text-xs text-[#00fbfb]">
                      {rainEnabled ? 'Precipitation 92% • Active Rain' : 'Precipitation 0% • Rain Off'}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-1">
                    <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase block">
                      Turntable Speed
                    </span>
                    <p className="font-mono text-sm text-[#ebb2ff]">33 ⅓ RPM • Analogue Pure</p>
                  </div>

                  <div className="pt-2">
                    <button
                      id="hero-quick-play-btn"
                      onClick={onTogglePlay}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-mono text-white hover:bg-white/20 transition-all"
                    >
                      {isPlaying ? <Pause className="h-3 w-3 fill-white" /> : <Play className="h-3 w-3 fill-white" />}
                      <span>{isPlaying ? 'Mute Atmosphere' : 'Tune Into Live Room'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Feature Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs font-medium tracking-widest text-[#ebb2ff] uppercase">
              Curated Frequencies
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Sanctuary Experiences
            </h2>
          </div>
          <span className="font-mono text-xs text-white/40">AHMEDABAD SANCTUARY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento Card 1: Now Spinning Vinyl Card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#ebb2ff]/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
                  NOW SPINNING
                </span>
                <span className="font-mono text-xs text-white/40">{currentTrack.bpm} BPM</span>
              </div>

              {/* Large Vinyl Visual with interactive spinning */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="relative h-44 w-44 rounded-full bg-gradient-to-tr from-black via-[#121414] to-black p-2 shadow-2xl border border-white/10">
                  {/* Vinyl Grooves concentric rings */}
                  <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-6 rounded-full border border-white/[0.06]" />
                  <div className="absolute inset-10 rounded-full border border-white/[0.04]" />

                  {/* Rotating Album Artwork Center */}
                  <div className="relative h-full w-full rounded-full overflow-hidden">
                    <img
                      src={currentTrack.artworkUrl}
                      alt={currentTrack.title}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover rounded-full ${
                        isPlaying ? 'vinyl-spinning' : 'vinyl-paused'
                      }`}
                    />
                    <div className="absolute inset-0 m-auto h-8 w-8 rounded-full border-2 border-black bg-[#0d0e0f] shadow-inner" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-[#ebb2ff] transition-colors">
                  {currentTrack.title}
                </h3>
                <p className="font-mono text-xs text-white/50">{currentTrack.artist} • {currentTrack.album}</p>
                <p className="font-sans text-xs text-white/70 mt-2 line-clamp-2">{currentTrack.description}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <button
                id="bento-spin-play-btn"
                onClick={onTogglePlay}
                className="flex items-center gap-2 rounded-xl bg-[#ebb2ff] px-4 py-2 font-display text-xs font-bold text-black transition-all hover:bg-white"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause Vinyl' : 'Play Vinyl'}</span>
              </button>

              <button
                onClick={() => onNavigate('music')}
                className="font-mono text-xs text-white/60 hover:text-[#00fbfb] transition-colors"
              >
                Full Turntable →
              </button>
            </div>
          </div>

          {/* Bento Card 2: Synesthesia Drink Tasting Preview */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#00fbfb]/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#00fbfb] border border-[#00fbfb]/20">
                  SYNESTHESIA COFFEE
                </span>
                <span className="font-mono text-xs font-semibold text-white">₹{featuredDrink.price}</span>
              </div>

              {/* Drink Image with subtle zoom */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden border border-white/10">
                <img
                  src={featuredDrink.imageUrl}
                  alt={featuredDrink.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#00fbfb] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    PAIRED TO: {featuredDrink.genre}
                  </span>
                  <span className="font-mono text-[10px] text-white/60">{featuredDrink.temperature}</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#00fbfb] transition-colors">
                    {featuredDrink.name}
                  </h3>
                  <span className="font-mono text-xs text-white/40">{featuredDrink.japaneseName}</span>
                </div>
                <p className="font-sans text-xs text-white/70 mt-2 line-clamp-2">{featuredDrink.description}</p>

                {/* Tasting Notes Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featuredDrink.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/70 border border-white/10"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <button
                id="bento-drink-listen-btn"
                onClick={() => {
                  onSelectDrinkTrack(featuredDrink.linkedTrackId);
                  onNavigate('menu');
                }}
                className="flex items-center gap-2 rounded-xl border border-[#00fbfb]/30 bg-[#00fbfb]/10 px-4 py-2 font-mono text-xs font-semibold text-[#00fbfb] hover:bg-[#00fbfb]/20 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Hear Flavor Audio</span>
              </button>

              <button
                onClick={() => onNavigate('menu')}
                className="font-mono text-xs text-white/60 hover:text-white transition-colors"
              >
                Full Menu →
              </button>
            </div>
          </div>

          {/* Bento Card 3: The Sanctuary Philosophy & Space */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-white/80 border border-white/15">
                  THE RITUAL OF SLOWNESS
                </span>
                <span className="font-mono text-xs text-[#ebb2ff]">AHMEDABAD, GUJARAT</span>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-display text-xl font-bold text-white">
                  Sound and Roast in Unhurried Harmony
                </h3>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  In a vibrant metropolis, Tokyo Frequency operates as a subterranean temporal oasis in Ahmedabad.
                  Every pour-over takes four deliberate minutes. Every record side is played in its
                  entirety through custom vacuum-tube preamplifiers and Japanese horn speakers.
                </p>
              </div>

              {/* Location and specs highlights */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/60">
                  <MapPin className="h-3.5 w-3.5 text-[#ebb2ff]" />
                  <span>B1F, Sindhu Bhavan Road, Ahmedabad, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/60">
                  <Clock className="h-3.5 w-3.5 text-[#00fbfb]" />
                  <span>Nocturnal Hours: 17:00 – 03:00 (Wed – Sun)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono text-white/60">
                  <Radio className="h-3.5 w-3.5 text-white/80" />
                  <span>Acoustics: Low-noise isolation & rain-view booths</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <button
                id="bento-book-table-btn"
                onClick={() => onNavigate('reserve')}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-display text-xs font-semibold text-white hover:bg-[#ebb2ff] hover:text-black transition-all"
              >
                <span>Reserve Booth</span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="font-mono text-xs text-white/60 hover:text-white transition-colors"
              >
                Read Story →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
