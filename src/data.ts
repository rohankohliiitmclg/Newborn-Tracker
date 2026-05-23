import { Product, ClothingItem, SleepRecord, RoutineItem, MilestoneMemory, CommunityPost } from "./types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Cloud-Soft Ribbed Sleepsuit",
    price: 36,
    category: "sleepsuit",
    sizeRange: "NB, 0-3M, 3-6M, 6-12M",
    description: "Crafted from 100% fine organic ribbed cotton. Built-in flip mittens protect against small scratches, and diagonal zipper makes diaper changes a breeze.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&q=80&w=400",
    tags: ["breathable", "self-mittens", "bestseller"]
  },
  {
    id: "prod-2",
    name: "Organic Kimono Bodysuit Bundle",
    price: 48,
    category: "bodysuit",
    sizeRange: "NB, 0-3M, 3-6M",
    description: "Set of three wrap-style bodysuits designed with flatlocks to prevent skin-rubbing. Snap-side openings are stress-free for direct newborn dressing.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
    tags: ["sensitive-skin", "newborn-essential", "organic-cotton"]
  },
  {
    id: "prod-3",
    name: "Lullaby Sleep Bag 1.0 TOG",
    price: 52,
    category: "sleepbag",
    sizeRange: "0-3M, 3-6M, 6-12M",
    description: "Double-layered buttery soft bamboo fiber bag with adjustable snug shoulders, promoting temperature regulation for comfortable sleeping hours.",
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=400",
    tags: ["sleepwear", "safe-sleep", "bamboo-silk"]
  },
  {
    id: "prod-4",
    name: "Peach Whisper Cotton Romper",
    price: 29,
    category: "romper",
    sizeRange: "3-6M, 6-12M, 12M+",
    description: "Delightful organic waffle-stitch design with elastic thigh cuffs. Highly breathable and elastic, perfect for initial crawlers.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?auto=format&fit=crop&q=80&w=400",
    tags: ["active-wear", "summer-care", "elastic"]
  },
  {
    id: "prod-5",
    name: "Newborn Nest Gift Set",
    price: 85,
    category: "giftset",
    sizeRange: "NB, 0-3M",
    description: "Luxuriously Boxed set of essential layers: 1 Swaddle blanket, 1 Snap sleepsuit, 1 Knotted beanie, and 2 Scratch-mittens. The ultimate neutral welcome package.",
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400",
    tags: ["gift", "gift-box", "neutral-cream"]
  }
];

export const DEFAULT_WARDROBE: ClothingItem[] = [
  {
    id: "ward-1",
    name: "Dreamy Cream sleepsuit",
    category: "sleepsuit",
    size: "NB",
    fabric: "100% Organic Cotton",
    fitStatus: "tight",
    season: "All",
    color: "Warm Cream",
    imageUrl: "https://images.unsplash.com/photo-1515488042459-e938f32f482d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ward-2",
    name: "Sage Hug Kimono Romper",
    category: "romper",
    size: "0-3M",
    fabric: "Organic Bamboo Rib",
    fitStatus: "perfect",
    season: "Spring/Autumn",
    color: "Sage Green",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ward-3",
    name: "Petal Soft Bodysuit",
    category: "bodysuit",
    size: "0-3M",
    fabric: "95% Cotton, 5% Elasthane",
    fitStatus: "perfect",
    season: "Summer",
    color: "Light Peach",
    imageUrl: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "ward-4",
    name: "Cozy Bear Fleece Suit",
    category: "outerwear",
    size: "3-6M",
    fabric: "Organic Cotton Fleece",
    fitStatus: "loose",
    season: "Winter",
    color: "Toasty Oats",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?auto=format&fit=crop&q=80&w=200"
  }
];

export const DEV_ACTIVITIES = [
  {
    id: "act-1",
    title: "Contrast Visual Track",
    ageGroup: "0-3M",
    duration: "5 mins",
    benefits: "Strengthens visual pathways, focuses tracking speed.",
    safetyTip: "Hold the high-contrast cards exactly 20-30cm from their eyes.",
    difficulty: "Easy",
    emoji: "👁️"
  },
  {
    id: "act-2",
    title: "Supported Tummy Time",
    ageGroup: "0-3M",
    duration: "3-10 mins",
    benefits: "Builds core neck, shoulder, and spinal muscle stability.",
    safetyTip: "Roll a small washcloth under baby's chest; always stay supervised.",
    difficulty: "Medium",
    emoji: "👶"
  },
  {
    id: "act-3",
    title: "Gentle Mirror Discovery",
    ageGroup: "3-6M",
    duration: "10 mins",
    benefits: "Fosters self-identity and supports social-emotional progress.",
    safetyTip: "Ensure the mirror is shatterproof and securely anchored.",
    difficulty: "Easy",
    emoji: "🪞"
  },
  {
    id: "act-4",
    title: "Textured Grab & Shake",
    ageGroup: "3-6M",
    duration: "15 mins",
    benefits: "Promotes fine sensory grasp and cause-and-effect thinking.",
    safetyTip: "Clean rubber and soft wood rings before playtime.",
    difficulty: "Easy",
    emoji: "🧶"
  },
  {
    id: "act-5",
    title: "Tunnel Crawler",
    ageGroup: "6-12M",
    duration: "15 mins",
    benefits: "Builds bilateral coordination and spatial awareness.",
    safetyTip: "Keep the crawlway clear of direct obstacles.",
    difficulty: "Medium",
    emoji: "🪵"
  },
  {
    id: "act-6",
    title: "Interactive Peek-a-boo",
    ageGroup: "6-12M",
    duration: "10 mins",
    benefits: "Reinforces object permanence and develops social vocal reactions.",
    safetyTip: "Celebrate and laugh warmly during each reveal.",
    difficulty: "Easy",
    emoji: "🙈"
  }
];

export const DEV_TOYS = [
  {
    id: "toy-1",
    name: "High-Contrast Wooden Rings",
    ageGroup: "0-3M",
    category: "Sensory Progression",
    description: "Sanded beechwood rings wrapped with high-quality contrasts of black and white organic threads.",
    milestone: "Fine grasp reflex & visual tracking"
  },
  {
    id: "toy-2",
    name: "Organic Swivel Rattler",
    ageGroup: "3-6M",
    category: "Motor Skills",
    description: "Easy-to-grip curved wood piece with rattle pebbles, supporting two-handed exploration.",
    milestone: "Bimanual coordination"
  },
  {
    id: "toy-3",
    name: "Sensory Stacking Cups",
    ageGroup: "6-12M",
    category: "Montessori Math",
    description: "Nesting cream-and-peach silicone cups with tactile geometric bottoms to test sand or water flow.",
    milestone: "Spatial nesting & cause-effect"
  },
  {
    id: "toy-4",
    name: "Silicone Teething Keys",
    ageGroup: "6-12M",
    category: "Oral Calmness",
    description: "Cool textured keys crafted from food-grade medical silicone to massage teething gums safely.",
    milestone: "Tactile relief & thumb placement"
  }
];

export const LEARNING_HUB_CARDS = [
  {
    id: "art-1",
    title: "The Golden Rules of Safe Baby Sleep",
    category: "Sleep Safety",
    readTime: "3 mins",
    icon: "🛏️",
    content: "Sleep scientists agree on the ABCs: baby should sleep **A**lone, on their **B**ack, in a **C**rib or clean bassinet. Remove all blankets, bumpers, stuffed toys, or loose sleepwear. Use a safe organic sleeping bag with suitable TOG rating instead of bulky linen."
  },
  {
    id: "art-2",
    title: "Dressing for Room Temp: The TOG Blueprint",
    category: "Clothing Safety",
    readTime: "4 mins",
    icon: "🌡️",
    content: "TOG (Thermal Overall Grade) measures warmth. At 20-22°C (68-72°F), use a 1.0 TOG sleeping bag with a cotton bodysuit. Under 18°C (64°F), shift to a 2.5 TOG sleepsack over a warm ribbed footie. Over 24°C (75°F), a light-layered cotton romper is all that is needed."
  },
  {
    id: "art-3",
    title: "Recognizing Sensitive Skin Aggravators",
    category: "Weather Care",
    readTime: "5 mins",
    icon: "🌸",
    content: "Infant epidermis is up to 30% thinner than ours. Synthetics like polyester trap sweat and create friction, triggering heat rashes. Stick to GOTS-certified organic cotton, seamless necklines, and formaldehyde-free botanical dyes to preserve correct skin hydration."
  },
  {
    id: "art-4",
    title: "How Tummy Time Unlocks Core Crawling",
    category: "Sensory Development",
    readTime: "3 mins",
    icon: "🦒",
    content: "Starting tummy time from day one helps strengthen their head control. It also prevents positional plagiocephaly (flat head) and initiates weight-bearing pressure on the forearms, preparing visual links for lateral crawling milestones."
  }
];

export const DEFAULT_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Elena G.",
    avatarColor: "bg-peach-100 text-peach-600",
    babyAge: "3 Months old",
    content: "Our sweet baby girl fell asleep without nursing for the very first time tonight! We stayed committed to the bath-book-snuggle routine from Lullaby planner. To parents struggling with nap resistence, there is real light at the end of the tunnel! ❤️",
    likes: 24,
    hasLiked: false,
    repliesCount: 4,
    timestamp: "2 hours ago"
  },
  {
    id: "post-2",
    author: "Liam M.",
    avatarColor: "bg-blue-100 text-blue-600",
    babyAge: "6 Months old",
    content: "Has anyone transitioned their crawler into the Peach Romper? Our boy is crawling all over the hard timber floors now. Need to know if the waffle fabric is comfortable enough for knee protectors, or should I buy the footies?",
    likes: 12,
    hasLiked: false,
    repliesCount: 8,
    timestamp: "5 hours ago"
  },
  {
    id: "post-3",
    author: "Sophie K.",
    avatarColor: "bg-lavender-100 text-lavender-600",
    babyAge: "9 Days old",
    content: "Overwhelmed with emotion. Staring at his tiny sleeping chest in the organic neutral gift set bundle. He feels so comfortable and snuggly. So grateful to find clothing with zero label scratchiness.",
    likes: 45,
    hasLiked: true,
    repliesCount: 11,
    timestamp: "1 day ago"
  }
];

export const DEFAULT_SLEEP_RECORDS: SleepRecord[] = [
  {
    id: "sleep-1",
    startTime: "20:00",
    endTime: "06:30",
    date: "2026-05-22",
    durationMinutes: 630,
    quality: "excellent",
    roomTemp: 21,
    fanOrAc: true
  },
  {
    id: "sleep-2",
    startTime: "10:30",
    endTime: "12:00",
    date: "2026-05-22",
    durationMinutes: 90,
    quality: "good",
    roomTemp: 23,
    fanOrAc: true
  },
  {
    id: "sleep-3",
    startTime: "14:15",
    endTime: "15:00",
    date: "2026-05-22",
    durationMinutes: 45,
    quality: "poor",
    roomTemp: 24,
    fanOrAc: false
  },
  {
    id: "sleep-4",
    startTime: "19:45",
    endTime: "07:00",
    date: "2026-05-21",
    durationMinutes: 675,
    quality: "excellent",
    roomTemp: 22,
    fanOrAc: true
  }
];

export const DEFAULT_ROUTINE: RoutineItem[] = [
  {
    id: "rout-1",
    time: "07:00 AM",
    activity: "Morning Feed & Cuddles",
    category: "feeding",
    status: "completed",
    guidance: "20-30 mins soft organic nursing or bottle feed. Perfect time to look into baby's eyes."
  },
  {
    id: "rout-2",
    time: "08:30 AM",
    activity: "High-Contrast Visual Play",
    category: "play",
    status: "completed",
    guidance: "Tummy time for 5 minutes with contrast cards. Boosts track rate and holds attention."
  },
  {
    id: "rout-3",
    time: "09:30 AM",
    activity: "Morning Quiet Nap",
    category: "sleep",
    status: "pending",
    guidance: "Place them down drowsy but awake. Keep room temp around 21°C for comforting deep sleep."
  },
  {
    id: "rout-4",
    time: "12:30 PM",
    activity: "Fresh Air Stroller Walk",
    category: "outdoor",
    status: "pending",
    guidance: "Dress them in an extra breathable layer. Excellent ventilation is beneficial for mood."
  },
  {
    id: "rout-5",
    time: "18:00 PM",
    activity: "Warm Bedtime Ritual",
    category: "bedtime",
    status: "pending",
    guidance: "Relaxing warm water wash followed by the Snug Ribbed Sleepsuit to signal quiet night hours."
  }
];

export const DEFAULT_MILESTONES: MilestoneMemory[] = [
  {
    id: "mile-1",
    title: "First Magical Smile",
    category: "first-smile",
    date: "2026-04-18",
    description: "Looked right at Mama while snuggling in the organic kimono bodysuit and flashed a full, wide gummy smile. Everyone melted completely!",
    emoji: "😊",
    photoUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "mile-2",
    title: "1-Month Milestones Card",
    category: "monthly-growth",
    date: "2026-04-20",
    description: "One month old! Weighing 4.2 kg and measuring 54 cm now. Loves listening to lullabies and following the high-contrast wooden toy with his eyes.",
    emoji: "🍼",
    photoUrl: "https://images.unsplash.com/photo-1544233527-b192daee1f5b?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "mile-3",
    title: "First Steady Hand Grip",
    category: "first-smile",
    date: "2026-05-10",
    description: "Reached out intentionally and held onto Papa's ring finger for almost two whole minutes. Grasping strong!",
    emoji: "✊",
    photoUrl: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=300"
  }
];
