import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../../data/gallery';
import { GalleryItem } from '../../types';
import { Camera, Maximize2, Sparkles, X } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'ALL VISUALS', jp: 'すべて' },
    { id: 'Espresso Alchemy', label: 'ESPRESSO CRAFT', jp: '抽出' },
    { id: 'Street Atmosphere', label: 'NEON RAIN', jp: '夜雨' },
    { id: 'Acoustic Equipment', label: 'ANALOG GEAR', jp: '音響' },
    { id: 'Interior Sanctuary', label: 'SANCTUARY', jp: '空間' },
  ];

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="relative min-h-screen pt-28 pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#ebb2ff]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
              VISUAL FRAGMENTS • 視覚記録
            </span>
            <span className="font-mono text-xs text-white/40">AHMEDABAD 35MM ARCHIVE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Atmospheric Gallery
          </h1>
          <p className="max-w-2xl font-sans text-base text-white/70 leading-relaxed font-light">
            Glimpses of nocturnal Tokyo, steam curling from espresso group-heads, rain streaking across
            panes of glass, and glowing vacuum-tube filaments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-white/10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs transition-all ${
                activeFilter === f.id
                  ? 'bg-[#ebb2ff] text-black font-bold shadow-[0_0_15px_rgba(235,178,255,0.4)]'
                  : 'glass-panel text-white/70 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[10px] opacity-60 font-normal">{f.jp}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="glass-card group relative overflow-hidden rounded-3xl p-3 border border-white/10 cursor-pointer transition-all duration-500 hover:border-[#ebb2ff]/50"
            >
              {/* Image Frame */}
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-[#121414]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Corner Expand Icon */}
                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-4 w-4" />
                </div>

                {/* Japanese Label Top-Left */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-lg bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold text-[#00fbfb] border border-white/10 backdrop-blur-md">
                    {item.japaneseTitle}
                  </span>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-[#ebb2ff] transition-colors">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-[#ebb2ff]">
                      {item.category}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-white/75 line-clamp-2">{item.description}</p>
                  <p className="font-mono text-[10px] text-white/40 pt-1">{item.specs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Zoom Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white hover:text-[#ebb2ff] border border-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 rounded-2xl overflow-hidden max-h-[500px] border border-white/10">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div>
                    <span className="font-mono text-xs text-[#00fbfb] block mb-1">
                      {selectedItem.japaneseTitle} • {selectedItem.category}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white">{selectedItem.title}</h2>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block">
                      Archival Specifications
                    </span>
                    <p className="font-mono text-xs text-[#ebb2ff]">{selectedItem.specs}</p>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#ebb2ff] hover:text-black text-white font-mono text-xs transition-all"
                  >
                    Close Preview
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
