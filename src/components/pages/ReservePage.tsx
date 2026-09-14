import React, { useState } from 'react';
import { ReservationData, PageTab } from '../../types';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, Disc3, MapPin, ArrowRight, Share2 } from 'lucide-react';

interface ReservePageProps {
  onNavigate: (tab: PageTab) => void;
}

export const ReservePage: React.FC<ReservePageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ReservationData>({
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '20:00',
    guests: 2,
    seatingZone: 'listening-bar',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [confirmedReservation, setConfirmedReservation] = useState<ReservationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seatingZones = [
    {
      id: 'listening-bar',
      name: 'Listening Bar',
      jp: 'リスニングバー',
      desc: 'Front-row wooden bar facing our Technics turntables and Marantz tube amplifier rack.',
      accent: '#ebb2ff',
    },
    {
      id: 'rainy-window',
      name: 'Rainy Window',
      jp: '雨の窓辺',
      desc: 'Floor-to-ceiling glass gazing out into rainfall and passing neon reflections.',
      accent: '#00fbfb',
    },
    {
      id: 'vinyl-corner',
      name: 'Vinyl Archive Corner',
      jp: 'レコード棚',
      desc: 'Surrounded by our 3,000+ curated 12" vinyl collection. Browse records during your stay.',
      accent: '#ffabf3',
    },
    {
      id: 'private-booth',
      name: 'Acoustic Booth',
      jp: '遮音ブース',
      desc: 'Deep cedar wood acoustic isolation booth tuned for immersive headphone or nearfield listening.',
      accent: '#ffffff',
    },
  ];

  const timeSlots = ['17:00', '18:30', '20:00', '21:30', '23:00', '00:30', '02:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please enter your name and contact email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = `TF-${Math.floor(1000 + Math.random() * 9000)}-${formData.seatingZone.toUpperCase().slice(0, 3)}`;
      setConfirmedReservation({
        ...formData,
        confirmationCode: code,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="rounded-md bg-[#ebb2ff]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ebb2ff] border border-[#ebb2ff]/20">
              TABLE SANCTUARY • 座席予約
            </span>
            <span className="font-mono text-xs text-white/40">AHMEDABAD AUDIO ROASTERY</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Reserve Your Listening Seat
          </h1>
          <p className="max-w-2xl font-sans text-base text-white/70 leading-relaxed font-light">
            Due to intimate acoustic spacing, seating is limited to preserve quiet contemplation and
            uncompressed soundstage clarity.
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Holographic Ticket State */
          <div className="glass-panel relative rounded-3xl p-6 sm:p-10 border border-[#ebb2ff]/40 shadow-[0_0_50px_rgba(235,178,255,0.15)] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00fbfb]/10 text-[#00fbfb] border border-[#00fbfb]/30 shadow-[0_0_20px_rgba(0,251,251,0.2)]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Reservation Confirmed
                  </h2>
                  <p className="font-mono text-xs text-[#ebb2ff]">
                    Pass Code: {confirmedReservation.confirmationCode}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-white/50">
                <span>東京周波数 • AHMEDABAD SANCTUARY</span>
              </div>
            </div>

            {/* Ticket Card Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/40 block">Guest Name</span>
                <p className="font-display text-base font-bold text-white mt-0.5">{confirmedReservation.name}</p>
                <span className="font-mono text-xs text-white/50">{confirmedReservation.email}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-white/40 block">Date & Time</span>
                <p className="font-display text-base font-bold text-[#00fbfb] mt-0.5">
                  {confirmedReservation.date}
                </p>
                <span className="font-mono text-xs text-white/70">{confirmedReservation.time} Session</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-white/40 block">Party Size</span>
                <p className="font-display text-base font-bold text-white mt-0.5">
                  {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                </p>
                <span className="font-mono text-xs text-white/50">Includes Welcome Pour</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-white/40 block">Seating Zone</span>
                <p className="font-display text-base font-bold text-[#ebb2ff] mt-0.5 uppercase">
                  {confirmedReservation.seatingZone.replace('-', ' ')}
                </p>
                <span className="font-mono text-xs text-white/50">Subterranean Room B1</span>
              </div>
            </div>

            {confirmedReservation.specialRequests && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[10px] uppercase text-white/40 block mb-1">
                  Vinyl & Drink Requests
                </span>
                <p className="font-sans text-xs text-white/80">{confirmedReservation.specialRequests}</p>
              </div>
            )}

            {/* Ticket Footer Instructions */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                <MapPin className="h-4 w-4 text-[#ebb2ff]" />
                <span>Present this confirmation code at B1 entrance 5 minutes before your session.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmedReservation(null)}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-xs text-white hover:bg-white/10"
                >
                  Make Another Booking
                </button>
                <button
                  onClick={() => onNavigate('menu')}
                  className="rounded-xl bg-[#ebb2ff] px-5 py-2.5 font-display text-xs font-bold text-black uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(235,178,255,0.4)]"
                >
                  View Menu Pairings →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Interactive Reservation Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Seating Zone Selection */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#ebb2ff] uppercase tracking-wider">
                  01. Choose Seating Zone (座席選択)
                </span>
                <span className="font-mono text-xs text-white/40">Select preference</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seatingZones.map((zone) => {
                  const isSelected = formData.seatingZone === zone.id;
                  return (
                    <div
                      key={zone.id}
                      id={`zone-select-${zone.id}`}
                      onClick={() => setFormData({ ...formData, seatingZone: zone.id as any })}
                      className={`glass-card p-5 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-[#ebb2ff] bg-[#ebb2ff]/10 shadow-[0_0_20px_rgba(235,178,255,0.2)]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-base font-bold text-white">{zone.name}</h3>
                        <span className="font-mono text-xs text-white/40">{zone.jp}</span>
                      </div>
                      <p className="font-sans text-xs text-white/70 leading-relaxed">{zone.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date, Time & Party Size */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="font-mono text-xs font-semibold text-[#00fbfb] uppercase tracking-wider block">
                02. Date, Time & Number of Guests (日時・人数)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 block flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#ebb2ff]" />
                    <span>Select Date</span>
                  </label>
                  <input
                    id="reserve-date-input"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-sm text-white focus:border-[#ebb2ff] focus:outline-none"
                    required
                  />
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 block flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#00fbfb]" />
                    <span>Session Time</span>
                  </label>
                  <select
                    id="reserve-time-select"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-[#121414] px-4 py-3 font-mono text-sm text-white focus:border-[#00fbfb] focus:outline-none"
                  >
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="bg-[#121414] text-white">
                        {t} Session
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/60 block flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#ffabf3]" />
                    <span>Party Size</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFormData({ ...formData, guests: n })}
                        className={`rounded-xl py-3 font-mono text-xs font-bold transition-all ${
                          formData.guests === n
                            ? 'bg-[#ebb2ff] text-black shadow-[0_0_12px_rgba(235,178,255,0.4)]'
                            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {n}P
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Music Preferences */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
              <span className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider block">
                03. Contact Details & Requests (お客様情報)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-white/60">Full Name</label>
                  <input
                    id="reserve-name-input"
                    type="text"
                    placeholder="e.g. Kenji Takahashi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:border-[#ebb2ff] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-white/60">Email Address</label>
                  <input
                    id="reserve-email-input"
                    type="email"
                    placeholder="kenji@tokyo.frequency"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/20 focus:border-[#ebb2ff] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-white/60">
                  Vinyl Requests or Dietary Notes (Optional)
                </label>
                <textarea
                  id="reserve-requests-input"
                  rows={2}
                  placeholder="e.g. We love 1980s Japanese City Pop vinyl or oat milk preferences..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:border-[#ebb2ff] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                id="submit-reservation-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#bc13fe] to-[#ebb2ff] px-8 py-4 font-display text-sm font-bold text-black uppercase tracking-wider shadow-[0_0_30px_rgba(235,178,255,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Disc3 className="h-5 w-5 animate-spin" />
                    <span>Engraving Sanctuary Reservation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Confirm Sanctuary Booking (予約確定)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
