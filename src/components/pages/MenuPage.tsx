import React, { useState } from 'react';
import { DrinkItem, Track, PageTab } from '../../types';
import { DRINKS } from '../../data/drinks';
import { Sparkles, Play, Pause, Disc3, Volume2, ArrowRight } from 'lucide-react';

interface MenuPageProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayDrinkTrack: (trackId: string) => void;
  onNavigate: (tab: PageTab) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  currentTrack,
  isPlaying,
  onPlayDrinkTrack,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDrinkModal, setActiveDrinkModal] = useState<DrinkItem | null>(null);

  const categories = [
    { id: 'all', label: 'ALL FREQUENCIES', jp: 'すべて' },
    { id: 'signature', label: 'SIGNATURE ROASTS', jp: '特製珈琲' },
    { id: 'espresso', label: 'ESPRESSO & DRIP', jp: 'ドリップ' },
    { id: 'ceremonial', label: 'CEREMONIAL MATCHA', jp: '桜抹茶' },
    { id: 'cold-brew', label: '24HR COLD BREW', jp: '水出し' },
    { id: 'cocktail', label: 'NIGHT COCKTAILS', jp: 'カクテル' },
  ];

  const filteredDrinks = selectedCategory === 'all'
    ? DRINKS
    : DRINKS.filter((d) => d.category === selectedCategory);

  const isDrinkTrackPlaying = (trackId: string) => {
    return isPlaying && currentTrack.id === trackId;
  };

  return (
    <div className="relative min-h-screen pt-28 pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#ebb2ff]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
              TASTING NOTES • 音響調合
            </span>
            <span className="font-mono text-xs text-white/40">AHMEDABAD AUDIO ROASTERY</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Synesthesia Coffee & Spirits
          </h1>
          <p className="max-w-2xl font-sans text-base text-white/70 leading-relaxed font-light">
            Every pour is scientifically paired to specific acoustic frequencies and vinyl genres.
            Click <span className="text-[#00fbfb] font-mono font-medium">"Listen"</span> on any drink to experience its sonic pairing in real time.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/10 mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-menu-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] text-black font-bold shadow-[0_0_15px_rgba(235,178,255,0.35)]'
                    : 'glass-panel text-white/70 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-60 font-normal">{cat.jp}</span>
              </button>
            );
          })}
        </div>

        {/* Drinks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrinks.map((drink) => {
            const trackActive = isDrinkTrackPlaying(drink.linkedTrackId);

            return (
              <div
                key={drink.id}
                id={`drink-card-${drink.id}`}
                className={`glass-card rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${
                  trackActive ? 'border-[#00fbfb] shadow-[0_0_30px_rgba(0,251,251,0.2)]' : ''
                }`}
              >
                {/* Active Playing Ribbon */}
                {trackActive && (
                  <div className="absolute top-0 right-0 bg-[#00fbfb] text-black font-mono text-[9px] font-bold px-3 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-md">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    <span>AUDIO PAIRED</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Photo Container */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-[#121414]">
                    <img
                      src={drink.imageUrl}
                      alt={drink.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge Overlays */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#ebb2ff] border border-white/10 backdrop-blur-sm">
                        {drink.genre}
                      </span>
                      <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/80 border border-white/10 backdrop-blur-sm">
                        {drink.temperature}
                      </span>
                    </div>
                  </div>

                  {/* Header Title & INR Price */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold text-white group-hover:text-[#ebb2ff] transition-colors">
                          {drink.name}
                        </h3>
                        <p className="font-mono text-xs text-white/40">{drink.japaneseName}</p>
                      </div>
                      <span className="font-mono text-base font-bold text-[#00fbfb]">
                        ₹{drink.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-xs text-white/70 mt-2.5 leading-relaxed">
                      {drink.description}
                    </p>
                  </div>

                  {/* Tasting Notes */}
                  <div className="space-y-1.5 pt-1">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block">
                      Tasting Notes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {drink.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/80 border border-white/10"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  {/* Play Paired Frequency Button */}
                  <button
                    id={`play-flavor-${drink.id}`}
                    onClick={() => onPlayDrinkTrack(drink.linkedTrackId)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition-all ${
                      trackActive
                        ? 'bg-[#00fbfb] text-black shadow-[0_0_15px_rgba(0,251,251,0.4)]'
                        : 'border border-[#ebb2ff]/30 bg-[#ebb2ff]/10 text-[#ebb2ff] hover:bg-[#ebb2ff] hover:text-black'
                    }`}
                  >
                    {trackActive ? (
                      <>
                        <Pause className="h-3.5 w-3.5 fill-current" />
                        <span>Playing Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Listen to Flavor</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveDrinkModal(drink)}
                    className="font-mono text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Details & Pairing →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Synesthesia Audio-Taste Science Callout Banner */}
        <div className="mt-16 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-[#ebb2ff] font-mono text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>The Science of Psychoacoustic Roasting</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                How High & Low Frequencies Alter Gustatory Receptors
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                Studies in auditory synesthesia demonstrate that higher acoustic frequencies enhance the
                perception of citrus sweetness and bright acidity, while warm sub-bass analog frequencies
                deepen bitterness and body. At Tokyo Frequency, our baristas pull espresso at specific
                extraction curves calibrated to our current vinyl rotation.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                id="menu-reserve-table-btn"
                onClick={() => onNavigate('reserve')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] px-6 py-3.5 font-display text-xs font-bold text-black uppercase tracking-wider shadow-[0_0_20px_rgba(235,178,255,0.3)] hover:scale-[1.02] transition-all"
              >
                <span>Reserve a Tasting Session</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="menu-to-turntable-btn"
                onClick={() => onNavigate('music')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-mono text-xs text-white hover:bg-white/10 transition-all"
              >
                <Disc3 className="h-4 w-4 text-[#00fbfb]" />
                <span>View Full Vinyl Archive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal for In-depth Drink Details */}
        {activeDrinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveDrinkModal(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-sm p-2"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="relative h-48 w-full rounded-xl overflow-hidden">
                  <img
                    src={activeDrinkModal.imageUrl}
                    alt={activeDrinkModal.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="font-mono text-xs text-[#00fbfb] bg-black/70 px-2 py-1 rounded">
                      ACOUSTIC MATCH: {activeDrinkModal.genre}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold text-white">{activeDrinkModal.name}</h3>
                    <span className="font-mono text-xl font-bold text-[#ebb2ff]">₹{activeDrinkModal.price}</span>
                  </div>
                  <p className="font-mono text-xs text-white/40">{activeDrinkModal.japaneseName}</p>
                </div>

                <p className="font-sans text-sm text-white/80 leading-relaxed">
                  {activeDrinkModal.description}
                </p>

                <div className="border-t border-white/10 pt-3 space-y-2">
                  <span className="font-mono text-xs text-white/50 uppercase">Extracted Tasting Profile</span>
                  <div className="flex flex-wrap gap-2">
                    {activeDrinkModal.tastingNotes.map((note, i) => (
                      <span key={i} className="rounded-lg bg-white/10 px-3 py-1 font-mono text-xs text-white">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      onPlayDrinkTrack(activeDrinkModal.linkedTrackId);
                      setActiveDrinkModal(null);
                    }}
                    className="flex-1 rounded-xl bg-[#ebb2ff] py-3 text-center font-display text-xs font-bold text-black uppercase tracking-wider shadow-[0_0_15px_rgba(235,178,255,0.4)]"
                  >
                    Play Paired Frequency
                  </button>
                  <button
                    onClick={() => {
                      setActiveDrinkModal(null);
                      onNavigate('reserve');
                    }}
                    className="rounded-xl border border-white/20 px-4 py-3 font-mono text-xs text-white hover:bg-white/10"
                  >
                    Reserve Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
