import React from 'react';
import { PageTab } from '../../types';
import { Disc3, Coffee, Sparkles, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: PageTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const principles = [
    {
      num: '01',
      title: 'Analog Primacy',
      jp: '真空管と純粋録音',
      desc: 'All recordings in our archive are preserved on 180g vinyl or quarter-inch master tape. Amplified strictly through custom Class-A triode vacuum tubes.',
    },
    {
      num: '02',
      title: 'The 4-Minute Extraction',
      jp: '緩やかな抽出',
      desc: 'We reject high-speed automation. Each pour-over utilizes precision Japanese kettles, mineralized soft water, and single-origin beans roasted in small 5kg batches.',
    },
    {
      num: '03',
      title: 'Acoustic Synesthesia',
      jp: '共感覚の調合',
      desc: 'Every drink recipe is formulated alongside sound frequency spectra. High acidity aligns with energetic synth arpeggios; smoky roasts pair with warm jazz sub-bass.',
    },
    {
      num: '04',
      title: 'Nocturnal Sanctuary',
      jp: '雨音と静寂',
      desc: 'Designed as a haven from metropolitan hyper-connectivity. Subdued amber and violet illumination, rainfall against glass, and deep acoustic absorption.',
    },
  ];

  const hardwareSpecs = [
    { label: 'Turntable System', value: 'Technics SL-1200G with Acrylic Platter & Hana Umami Red MC' },
    { label: 'Tube Amplification', value: 'McIntosh MC275 Vacuum Tube Power Amp & Marantz 2270 Preamp' },
    { label: 'Horn Speakers', value: 'Custom Japanese Cedar Horns w/ 15" Tannoy Monitor Gold' },
    { label: 'Espresso Bar', value: 'Custom Matte Black La Marzocco Linea PB (9-Bar profiling)' },
    { label: 'Water Mineralization', value: 'Multi-stage reverse osmosis remineralized to 45 PPM' },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#ebb2ff]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
              ORIGINS & PHILOSOPHY • 哲学
            </span>
            <span className="font-mono text-xs text-white/40">EST. AHMEDABAD, GUJARAT</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Ritual of Slowness
          </h1>
          <p className="max-w-2xl font-sans text-base text-white/70 leading-relaxed font-light">
            In an era of relentless algorithmic velocity, Tokyo Frequency exists as a deliberate counter-culture.
            A temple of physical records, warm vacuum tubes, and single-origin coffee.
          </p>
        </div>

        {/* Hero Visual Section with Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/10 glass-panel p-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYrZWZ9SsmtXrzVvF6TyJIAd0HcOUh_m9jhcGGgfzscyAZ1tXEXqRHuFwkIcxgvhpsMspBGWQMWl2Y3JEf4KAj-cctXohhHtcFfF7vyXFjzq811E8GRM1GAZCXKktFANPWew4zNi5fD5STPR-2ybJDs9_2uFdxvrOCooeB1yGpaAv_TMVf4_ENUBBZgSFZKgyLpc8ZPj36WXQDDyQaLUUSz7f7K4iS4OqxI9HIl3z_Ww1EPAMdtbyZ"
              alt="Tokyo Frequency Interior"
              referrerPolicy="no-referrer"
              className="rounded-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="font-mono text-xs text-[#00fbfb] bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md">
                地下1階 • SUBTERRANEAN LISTENING ROOM
              </span>
              <span className="font-mono text-xs text-white/70">AHMEDABAD SANCTUARY</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Born From Midnight Downpours
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed font-light">
                Tokyo Frequency was founded by two obsessive sound engineers and a championship barista in
                Ahmedabad. Inspired by the timeless kissaten listening bars of Japan and frustrated by the harsh compression
                of modern digital streaming, they built a subterranean sanctuary with acoustic wood treatment,
                isolated turntable plinths, and a hand-calibrated roasting setup.
              </p>
              <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed font-light">
                Here, sound is not background wallpaper—it is the central protagonist. Each vinyl record is played
                from start to finish without skipping, allowing listeners to experience albums as complete artistic
                journeys while steam rises into the soft violet twilight.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ebb2ff] px-5 py-3 font-display text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_20px_rgba(235,178,255,0.3)]"
              >
                <Coffee className="h-4 w-4" />
                <span>Explore Tasting Menu</span>
              </button>

              <button
                onClick={() => onNavigate('reserve')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs text-white hover:bg-white/10 transition-all"
              >
                <span>Reserve a Listening Booth</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-white mb-6">Our Four Pillars</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p) => (
              <div key={p.num} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#ebb2ff]">{p.num}</span>
                    <span className="font-mono text-xs text-white/40">{p.jp}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">{p.title}</h4>
                  <p className="font-sans text-xs text-white/70 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audiophile Hardware Specs Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-5 w-5 text-[#00fbfb]" />
            <h3 className="font-display text-2xl font-bold text-white">
              Acoustic System Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hardwareSpecs.map((spec, i) => (
              <div key={i} className="flex flex-col p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="font-mono text-xs text-[#ebb2ff] uppercase tracking-wider">{spec.label}</span>
                <span className="font-sans text-sm font-medium text-white mt-1">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sanctuary Etiquette & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#ebb2ff] font-mono text-xs uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Sanctuary Etiquette (マナー)</span>
            </div>
            <h4 className="font-display text-xl font-bold text-white">For The Purest Acoustic State</h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-[#00fbfb] font-mono">•</span>
                <span>We encourage whisper-tone conversation to allow records to breathe.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00fbfb] font-mono">•</span>
                <span>Please set all mobile devices to silent mode; no flash photography.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00fbfb] font-mono">•</span>
                <span>Vinyl record flipping takes place every 22 minutes. Feel free to request an album.</span>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#00fbfb] font-mono text-xs uppercase">
              <MapPin className="h-4 w-4" />
              <span>Location & Schedule</span>
            </div>
            <h4 className="font-display text-xl font-bold text-white">Subterranean Ahmedabad Sanctuary</h4>
            <div className="space-y-2 text-xs font-mono text-white/70">
              <p>📍 B1F, Sindhu Bhavan Road, Ahmedabad, Gujarat, India</p>
              <p>🕒 Wednesday – Sunday: 17:00 – 03:00 (Nocturnal Sessions)</p>
              <p>📴 Closed Monday & Tuesday for Vinyl Cataloguing & Roasting</p>
            </div>
            <button
              onClick={() => onNavigate('reserve')}
              className="mt-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#ebb2ff] hover:text-black text-white font-mono text-xs transition-all"
            >
              Book Table (予約) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
