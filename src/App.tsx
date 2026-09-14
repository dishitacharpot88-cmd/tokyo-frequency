import React, { useState, useEffect, useCallback } from 'react';
import { PageTab, Track } from './types';
import { TRACKS } from './data/tracks';
import { DRINKS } from './data/drinks';
import { audioEngine } from './utils/audioEngine';
import { Navbar } from './components/Navbar';
import { MiniPlayerBar } from './components/MiniPlayerBar';
import { CustomCursor } from './components/CustomCursor';
import { RainCanvas } from './components/RainCanvas';
import { HomePage } from './components/pages/HomePage';
import { MenuPage } from './components/pages/MenuPage';
import { MusicPage } from './components/pages/MusicPage';
import { AboutPage } from './components/pages/AboutPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ReservePage } from './components/pages/ReservePage';
import { Disc3, MapPin } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rainEnabled, setRainEnabled] = useState<boolean>(true);

  // Synchronize audio engine state with React component state
  useEffect(() => {
    const unsubState = audioEngine.onStateChange((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      unsubState();
    };
  }, []);

  const handleSelectTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    audioEngine.playTrack(track);
  }, []);

  const handleNextTrack = useCallback(() => {
    setCurrentTrack((prev) => {
      const currentIndex = TRACKS.findIndex((t) => t.id === prev.id);
      const nextIndex = (currentIndex + 1) % TRACKS.length;
      const nextTrack = TRACKS[nextIndex];
      audioEngine.playTrack(nextTrack);
      return nextTrack;
    });
  }, []);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrack((prev) => {
      const currentIndex = TRACKS.findIndex((t) => t.id === prev.id);
      const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
      const prevTrack = TRACKS[prevIndex];
      audioEngine.playTrack(prevTrack);
      return prevTrack;
    });
  }, []);

  // Set up auto next track when a song finishes
  useEffect(() => {
    const unsubEnd = audioEngine.onTrackEnd(() => {
      handleNextTrack();
    });

    return () => {
      unsubEnd();
    };
  }, [handleNextTrack]);

  // Play / Pause toggle
  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.playTrack(currentTrack);
    }
  };

  const handlePlayDrinkTrack = (trackId: string) => {
    const matchedTrack = TRACKS.find((t) => t.id === trackId) || TRACKS[0];
    handleSelectTrack(matchedTrack);
  };

  const handleToggleRain = () => {
    const newState = audioEngine.toggleRain();
    setRainEnabled(newState);
  };

  // Scroll to top on tab navigation
  const handleNavigate = (tab: PageTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e2e2e2] selection:bg-[#ebb2ff]/30 selection:text-[#ebb2ff]">
      {/* Custom Neon Follower Cursor */}
      <CustomCursor />

      {/* Global Persistent Rain Atmosphere */}
      <RainCanvas enabled={rainEnabled} opacity={0.5} speedMultiplier={1} />

      {/* Floating Glass Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        rainEnabled={rainEnabled}
        onToggleRain={handleToggleRain}
        isPlaying={isPlaying}
      />

      {/* Active Page View */}
      <main className="relative z-10">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            featuredDrink={DRINKS[0]}
            onSelectDrinkTrack={handlePlayDrinkTrack}
            rainEnabled={rainEnabled}
          />
        )}

        {currentTab === 'menu' && (
          <MenuPage
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayDrinkTrack={handlePlayDrinkTrack}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'music' && (
          <MusicPage
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onSelectTrack={handleSelectTrack}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            rainEnabled={rainEnabled}
            onToggleRain={handleToggleRain}
          />
        )}

        {currentTab === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentTab === 'gallery' && <GalleryPage />}

        {currentTab === 'reserve' && <ReservePage onNavigate={handleNavigate} />}
      </main>

      {/* Global Persistent Mini Audiophile Player */}
      <MiniPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onOpenFullPlayer={() => handleNavigate('music')}
        currentTab={currentTab}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0d0e0f]/80 backdrop-blur-md pt-12 pb-24 md:pb-20 text-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Disc3 className="h-5 w-5 text-[#ebb2ff]" />
                <span className="font-display font-bold text-white text-base tracking-wider">
                  TOKYO FREQUENCY
                </span>
              </div>
              <p className="font-mono text-xs text-white/50">東京周波数 • 108.4 MHz</p>
              <p className="font-sans text-xs text-white/70">
                Subterranean vinyl listening sanctuary and artisanal coffee house in Ahmedabad, Gujarat, India.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-semibold mb-3">Sanctuary Views</h4>
              <ul className="space-y-2 font-mono text-xs">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-[#ebb2ff]">
                    Home (ホーム)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('menu')} className="hover:text-[#ebb2ff]">
                    Tasting Menu (メニュー)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('music')} className="hover:text-[#ebb2ff]">
                    Turntable Lounge (音響)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('gallery')} className="hover:text-[#ebb2ff]">
                    Visual Gallery (写真)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('reserve')} className="hover:text-[#ebb2ff]">
                    Table Reservation (予約)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-semibold mb-3">Location & Hours</h4>
              <div className="space-y-2 font-mono text-xs text-white/70">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#ebb2ff]" />
                  <span>B1F, Sindhu Bhavan Road, Ahmedabad, Gujarat, India</span>
                </p>
                <p>Wed – Sun: 17:00 – 03:00</p>
                <p className="text-[#00fbfb]">Rain Precipitation Mode: {rainEnabled ? 'Active' : 'Off'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase text-white font-semibold mb-3">Broadcast Frequencies</h4>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/60">Live Stream:</span>
                  <span className="text-[#ebb2ff]">108.4 MHz FM</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/60">Audio Engine:</span>
                  <span className="text-[#00fbfb]">HTML5 + Web Audio</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white/60">Speed:</span>
                  <span className="text-white">33 ⅓ RPM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-3">
            <p>© {new Date().getFullYear()} TOKYO FREQUENCY (東京周波数). All rights reserved.</p>
            <p className="flex items-center gap-1">
              Rain outside. Music inside.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
