export type PageTab = 'home' | 'menu' | 'music' | 'about' | 'gallery' | 'reserve';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  durationFormatted: string;
  artworkUrl: string;
  genreTag: string;
  accentColor: string;
  description: string;
  bpm: number;
  audioUrl: string;
}

export interface DrinkItem {
  id: string;
  name: string;
  japaneseName: string;
  category: 'signature' | 'espresso' | 'cold-brew' | 'ceremonial' | 'cocktail';
  genre: string;
  price: number;
  description: string;
  tastingNotes: string[];
  imageUrl: string;
  isSignature?: boolean;
  linkedTrackId: string;
  temperature?: 'Hot' | 'Iced' | 'Both';
}

export interface ReservationData {
  date: string;
  time: string;
  guests: number;
  seatingZone: 'listening-bar' | 'rainy-window' | 'vinyl-corner' | 'private-booth';
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  confirmationCode?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  japaneseTitle: string;
  category: string;
  description: string;
  imageUrl: string;
  span: 'large' | 'vertical' | 'square' | 'wide';
  specs: string;
}
