export interface BabyProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: "boy" | "girl" | "surprise";
  weight: number; // kg
  height: number; // cm
  skinSensitivity: "normal" | "sensitive" | "dry";
  sleepHabits: "good" | "restless" | "frequent-wakes";
  location: string;
  roomTemp: number; // °C
}

export type BabyAgeGroup = "0-3M" | "3-6M" | "6-12M";

export interface ClothingItem {
  id: string;
  name: string;
  category: "bodysuit" | "sleepsuit" | "romper" | "pajamas" | "outerwear" | "accessory";
  size: "NB" | "0-3M" | "3-6M" | "6-12M" | "12M+";
  fabric: string;
  fitStatus: "tight" | "perfect" | "loose";
  color: string;
  season: "All" | "Summer" | "Winter" | "Spring/Autumn";
  imageUrl: string;
}

export interface SleepRecord {
  id: string;
  startTime: string; // HH:MM or ISO
  endTime: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  quality: "poor" | "fair" | "good" | "excellent";
  roomTemp: number;
  fanOrAc: boolean;
}

export interface RoutineItem {
  id: string;
  time: string; // e.g., "08:00 AM"
  activity: string;
  category: "feeding" | "sleep" | "play" | "outdoor" | "milestone" | "bedtime";
  status: "pending" | "completed";
  guidance: string;
}

export interface MilestoneMemory {
  id: string;
  title: string;
  category: "first-smile" | "first-crawl" | "first-step" | "first-word" | "first-festival" | "monthly-growth";
  date: string;
  description: string;
  emoji: string;
  photoUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "bodysuit" | "sleepsuit" | "romper" | "sleepbag" | "giftset";
  sizeRange: string;
  description: string;
  rating: number;
  imageUrl: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatarColor: string;
  babyAge: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  repliesCount: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}
