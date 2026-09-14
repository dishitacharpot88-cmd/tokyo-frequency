import React, { useState } from 'react';
import { PageTab } from '../types';
import { CloudRain, Volume2, VolumeX, Menu, X, Disc3 } from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  rainEnabled: boolean;
  onToggleRain: () => void;
  isPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  rainEnabled,
  onToggleRain,
  isPlaying,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: PageTab; label: string; jp: string }> = [
    { id: 'home', label: 'HOME', jp: 'ホーム' },
    { id: 'menu', label: 'MENU', jp: 'メニュー' },
    { id: 'music', label: 'MUSIC', jp: '音楽' },
    { id: 'about', label: 'ABOUT', jp: '概要' },
    { id: 'gallery', label: 'GALLERY', jp: 'ギャラリー' },
  ];

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-panel flex items-center justify-between rounded-2xl px-5 py-3.5 shadow-2xl transition-all">
          {/* Logo & Brand */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#1e2020] to-[#0d0e0f] shadow-inner transition-transform duration-300 group-hover:scale-105">
              <Disc3
                className={`h-6 w-6 text-[#ebb2ff] transition-transform duration-700 ${
                  isPlaying ? 'animate-spin' : 'group-hover:rotate-45'
                }`}
                style={{ animationDuration: isPlaying ? '3s' : '0s' }}
              />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00fbfb] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00fbfb]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-nav-brand text-xs sm:text-[13px] font-semibold tracking-wider text-white/90 uppercase group-hover:text-[#ebb2ff] transition-colors">
                  Tokyo Frequency
                </span>
                <span className="rounded bg-[#ebb2ff]/10 px-1.5 py-0.5 text-[9px] font-mono font-medium tracking-tighter text-[#ebb2ff] border border-[#ebb2ff]/20">
                  AHMEDABAD
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-wider text-white/40 block">
                東京周波数 • 108.4 MHz
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-xs font-mono tracking-widest transition-all rounded-lg ${
                    isActive
                      ? 'text-[#ebb2ff] font-semibold bg-white/[0.04]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    <span className="text-[9px] opacity-40 font-normal">{item.jp}</span>
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#ebb2ff] to-transparent shadow-[0_0_8px_#ebb2ff]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Rain Sound Toggle */}
            <button
              id="rain-toggle-btn"
              onClick={onToggleRain}
              title={rainEnabled ? 'Mute Rain Ambience' : 'Enable Rain Ambience'}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-mono transition-all ${
                rainEnabled
                  ? 'border-[#00fbfb]/30 bg-[#00fbfb]/10 text-[#00fbfb] shadow-[0_0_12px_rgba(0,251,251,0.2)]'
                  : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              <CloudRain className={`h-3.5 w-3.5 ${rainEnabled ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
                {rainEnabled ? 'Rain ON' : 'Rain OFF'}
              </span>
              {rainEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </button>

            {/* Reserve CTA */}
            <button
              id="nav-reserve-btn"
              onClick={() => handleNavClick('reserve')}
              className={`hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-lg ${
                currentTab === 'reserve'
                  ? 'bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] text-black shadow-[0_0_20px_rgba(235,178,255,0.4)]'
                  : 'bg-[#ebb2ff] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(235,178,255,0.3)]'
              }`}
            >
              <span>Book Table</span>
              <span className="text-[10px] opacity-75 font-mono">予約</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-panel rounded-2xl p-4 shadow-2xl border border-white/15 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-left font-mono text-sm tracking-wider transition-colors ${
                    currentTab === item.id
                      ? 'bg-[#ebb2ff]/10 text-[#ebb2ff] font-semibold border border-[#ebb2ff]/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/40">{item.jp}</span>
                </button>
              ))}

              <div className="pt-2 border-t border-white/10">
                <button
                  id="mobile-nav-reserve"
                  onClick={() => handleNavClick('reserve')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] py-3 text-sm font-display font-bold text-black tracking-wider uppercase shadow-[0_0_20px_rgba(235,178,255,0.3)]"
                >
                  <span>Reserve a Sanctuary Table</span>
                  <span className="text-xs font-mono">予約</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
