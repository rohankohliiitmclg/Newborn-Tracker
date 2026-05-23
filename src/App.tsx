import React, { useState, useEffect, useRef } from "react";
import { 
  BabyProfile, 
  ClothingItem, 
  SleepRecord, 
  RoutineItem, 
  MilestoneMemory, 
  Product, 
  CartItem, 
  CommunityPost, 
  ChatMessage 
} from "./types";
import { 
  DEFAULT_PRODUCTS, 
  DEFAULT_WARDROBE, 
  DEV_ACTIVITIES, 
  DEV_TOYS, 
  LEARNING_HUB_CARDS, 
  DEFAULT_COMMUNITY_POSTS, 
  DEFAULT_SLEEP_RECORDS, 
  DEFAULT_ROUTINE, 
  DEFAULT_MILESTONES 
} from "./data";
import Dashboard from "./components/Dashboard";
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Moon, 
  Smile, 
  BookOpen, 
  Users, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  Check, 
  Clock, 
  Send, 
  MessageSquare, 
  Shirt, 
  Info, 
  Calendar, 
  ChevronDown, 
  CloudSun,
  PenTool,
  Compass,
  Baby,
  Activity,
  Award
} from "lucide-react";

// Web Audio API White Noise Generator Class
class SoftSynthEngine {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private waveNode: OscillatorNode | null = null;

  public start(type: "womb" | "rain" | "fairy" | "ocean", volume: number) {
    try {
      this.stop();
      
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.audioCtx = new AudioCtxClass();

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = volume;

      if (type === "womb") {
        // Heartbeat pulse + low rumbling filter
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.value = 120; // rumbling warm rhythm

        // Generate pink noise like rumble
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // rescue ears
          b6 = white * 0.115926;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Periodic heartbeat oscillator
        this.waveNode = this.audioCtx.createOscillator();
        this.waveNode.type = "sine";
        this.waveNode.frequency.value = 1.2; // pulse-rate 72bpm

        const heartGain = this.audioCtx.createGain();
        heartGain.gain.value = 0.6;

        whiteNoise.connect(this.filterNode);
        this.filterNode.connect(this.gainNode);
        
        // Also combine soft low pulse
        const pulseOsc = this.audioCtx.createOscillator();
        pulseOsc.type = "sine";
        pulseOsc.frequency.value = 55; // low cozy resonance
        const pulseGain = this.audioCtx.createGain();
        pulseGain.gain.value = 0.0;
        
        // Use an LFO of 1.2Hz to generate heartbeat pulse
        const lfo = this.audioCtx.createOscillator();
        lfo.type = "triangle";
        lfo.frequency.value = 1.2;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = 0.45;
        
        lfo.connect(lfoGain);
        lfoGain.connect(pulseGain.gain);
        pulseOsc.connect(pulseGain);
        pulseGain.connect(this.gainNode);

        whiteNoise.start(0);
        pulseOsc.start(0);
        lfo.start(0);

        this.noiseNode = whiteNoise as any;
      } else if (type === "rain") {
        // High bandpass for rustling light drops
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = "bandpass";
        this.filterNode.frequency.value = 1800;
        this.filterNode.Q.value = 1.2;

        const bufferSize = this.audioCtx.sampleRate * 2;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const rainSource = this.audioCtx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        // Modulate volume for storm feeling
        const rainLfo = this.audioCtx.createOscillator();
        rainLfo.type = "sine";
        rainLfo.frequency.value = 0.15; // slow gusts
        const rainLfoGain = this.audioCtx.createGain();
        rainLfoGain.gain.value = 0.15;

        rainLfo.connect(rainLfoGain).connect(this.gainNode.gain);
        rainSource.connect(this.filterNode).connect(this.gainNode);

        rainSource.start(0);
        rainLfo.start(0);
        this.noiseNode = rainSource as any;
      } else if (type === "ocean") {
        // Deep roll-off wave swell
        this.filterNode = this.audioCtx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.value = 450;

        const bufferSize = this.audioCtx.sampleRate * 4;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        // Pink noise filter approximation
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.15;
          b6 = white * 0.115926;
        }

        const waveSource = this.audioCtx.createBufferSource();
        waveSource.buffer = noiseBuffer;
        waveSource.loop = true;

        // Wave scale shape filter modulation
        const waveLfo = this.audioCtx.createOscillator();
        waveLfo.type = "sine";
        waveLfo.frequency.value = 0.08; // 12 seconds per wave swell
        
        const waveGainMod = this.audioCtx.createGain();
        waveGainMod.gain.value = 0.4;
        
        const gainBase = this.audioCtx.createGain();
        gainBase.gain.value = 0.15;

        waveLfo.connect(waveGainMod).connect(this.filterNode.frequency);
        waveSource.connect(this.filterNode).connect(this.gainNode);

        waveSource.start(0);
        waveLfo.start(0);
        this.noiseNode = waveSource as any;
      } else {
        // Fairy bell-tones chimes
        this.gainNode.gain.value = volume * 0.4;
        this.waveNode = this.audioCtx.createOscillator();
        this.waveNode.type = "triangle";
        this.waveNode.frequency.value = 240; // Soft lull tone base

        const vibrato = this.audioCtx.createOscillator();
        vibrato.frequency.value = 4; // soft wobble
        const vibratoGain = this.audioCtx.createGain();
        vibratoGain.gain.value = 3;

        vibrato.connect(vibratoGain).connect(this.waveNode.frequency);
        this.waveNode.connect(this.gainNode);

        vibrato.start(0);
        this.waveNode.start(0);
      }

      this.gainNode.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("Synth initialization interrupted or not supported by browser security:", e);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.value = volume;
    }
  }

  public stop() {
    try {
      if (this.noiseNode) {
        try { (this.noiseNode as any).stop(); } catch (e) {}
        this.noiseNode = null;
      }
      if (this.waveNode) {
        try { this.waveNode.stop(); } catch (e) {}
        this.waveNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (error) {}
  }
}

const synthEngine = new SoftSynthEngine();

export default function App() {
  // LocalStorage keys
  const PROFILE_KEY = "lullaby_baby_profile_v1";
  const WARDROBE_KEY = "lullaby_wardrobe_v1";
  const SLEEP_KEY = "lullaby_sleep_records_v1";
  const ROUTINE_KEY = "lullaby_routines_v1";
  const MILESTONE_KEY = "lullaby_milestones_v1";
  const CART_KEY = "lullaby_cart_v1";
  const CHAT_KEY = "lullaby_chat_v1";
  const POSTS_KEY = "lullaby_posts_v1";

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core App states with initializers from localStorage or default
  const [profile, setProfile] = useState<BabyProfile>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Leo Arthur",
      birthDate: "2026-01-10", // About ~4.5 months old on 2026-05-23
      gender: "boy",
      weight: 6.4,
      height: 62.0,
      skinSensitivity: "sensitive",
      sleepHabits: "restless",
      location: "San Francisco, US",
      roomTemp: 22,
    };
  });

  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem(WARDROBE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_WARDROBE;
  });

  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(() => {
    const saved = localStorage.getItem(SLEEP_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SLEEP_RECORDS;
  });

  const [routine, setRoutine] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem(ROUTINE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_ROUTINE;
  });

  const [milestones, setMilestones] = useState<MilestoneMemory[]>(() => {
    const saved = localStorage.getItem(MILESTONE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MILESTONES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(POSTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_COMMUNITY_POSTS;
  });

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(CHAT_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "msg-init",
        sender: "ai",
        text: "Hello! I am your Lullaby & Cotton organic advisory expert. Ask me about safe sleeping TOG layers, raw GOTS certification, custom sensory suggestions for age brackets, or current size forecast projections! Sweet comfort for your little one begins here."
      }
    ];
  });

  const [currentChatText, setCurrentChatText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // States for interactive forms
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [newWeight, setNewWeight] = useState(profile.weight);
  const [newHeight, setNewHeight] = useState(profile.height);
  const [newRoomTemp, setNewRoomTemp] = useState(profile.roomTemp);
  const [newName, setNewName] = useState(profile.name);
  const [newBirthDate, setNewBirthDate] = useState(profile.birthDate);
  const [newLocation, setNewLocation] = useState(profile.location);
  const [newSensitivity, setNewSensitivity] = useState(profile.skinSensitivity);
  const [newSleepHabit, setNewSleepHabit] = useState(profile.sleepHabits);

  // Wardrobe form
  const [newWardrobeName, setNewWardrobeName] = useState("");
  const [newWardrobeCategory, setNewWardrobeCategory] = useState<ClothingItem["category"]>("bodysuit");
  const [newWardrobeSize, setNewWardrobeSize] = useState<ClothingItem["size"]>("0-3M");
  const [newWardrobeFabric, setNewWardrobeFabric] = useState("Organic Cotton Rib");
  const [newWardrobeColor, setNewWardrobeColor] = useState("Warm Ivory");
  const [newWardrobeFit, setNewWardrobeFit] = useState<ClothingItem["fitStatus"]>("perfect");
  const [newWardrobeSeason, setNewWardrobeSeason] = useState<ClothingItem["season"]>("All");
  const [newWardrobeUrl, setNewWardrobeUrl] = useState("https://images.unsplash.com/photo-1515488042459-e938f32f482d?auto=format&fit=crop&q=80&w=200");

  // Sleep form
  const [sleepStart, setSleepStart] = useState("20:30");
  const [sleepEnd, setSleepEnd] = useState("06:45");
  const [sleepDate, setSleepDate] = useState("2026-05-23");
  const [sleepQuality, setSleepQuality] = useState<SleepRecord["quality"]>("good");
  const [sleepFanOrAc, setSleepFanOrAc] = useState(true);

  // Milestone form
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneCategory, setMilestoneCategory] = useState<MilestoneMemory["category"]>("first-smile");
  const [milestoneDate, setMilestoneDate] = useState("2026-05-23");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneEmoji, setMilestoneEmoji] = useState("✨");

  // Sandbox Community form
  const [communityText, setCommunityText] = useState("");

  // Product ecommerce filter states
  const [storeFilter, setStoreFilter] = useState<string>("all");

  // Sound machine states
  const [activeSoundType, setActiveSoundType] = useState<"womb" | "rain" | "fairy" | "ocean" | null>(null);
  const [soundVolume, setSoundVolume] = useState(0.5);

  // Cart visible drawer
  const [cartOpen, setCartOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem(SLEEP_KEY, JSON.stringify(sleepRecords));
  }, [sleepRecords]);

  useEffect(() => {
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem(MILESTONE_KEY, JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(communityPosts));
  }, [communityPosts]);

  // Clean-up synth on unmount
  useEffect(() => {
    return () => {
      synthEngine.stop();
    };
  }, []);

  // Update sound volumes
  useEffect(() => {
    if (activeSoundType) {
      synthEngine.setVolume(soundVolume);
    }
  }, [soundVolume, activeSoundType]);

  // Toggle routine status
  const handleToggleRoutine = (id: string) => {
    setRoutine(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === "completed" ? "pending" : "completed" };
      }
      return item;
    }));
  };

  // Add customized profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: newName,
      birthDate: newBirthDate,
      gender: profile.gender, // maintain or bind
      weight: parseFloat(newWeight.toString()) || 6.0,
      height: parseFloat(newHeight.toString()) || 60,
      skinSensitivity: newSensitivity,
      sleepHabits: newSleepHabit,
      location: newLocation,
      roomTemp: parseFloat(newRoomTemp.toString()) || 22,
    });
    setProfileEditMode(false);
  };

  // Pre-load edited values when opening form
  const openProfileEditor = () => {
    setNewName(profile.name);
    setNewBirthDate(profile.birthDate);
    setNewWeight(profile.weight);
    setNewHeight(profile.height);
    setNewRoomTemp(profile.roomTemp);
    setNewLocation(profile.location);
    setNewSensitivity(profile.skinSensitivity);
    setNewSleepHabit(profile.sleepHabits);
    setProfileEditMode(true);
  };

  // Interactive wardrobe methods
  const handleAddWardrobe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardrobeName.trim()) return;

    const newItem: ClothingItem = {
      id: "ward-" + Date.now(),
      name: newWardrobeName,
      category: newWardrobeCategory,
      size: newWardrobeSize,
      fabric: newWardrobeFabric,
      color: newWardrobeColor,
      fitStatus: newWardrobeFit,
      season: newWardrobeSeason,
      imageUrl: newWardrobeUrl,
    };

    setWardrobe(prev => [newItem, ...prev]);
    setNewWardrobeName("");
    // close drawer or show success
  };

  const handleUpdateFit = (itemId: string, newFit: ClothingItem["fitStatus"]) => {
    setWardrobe(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, fitStatus: newFit };
      }
      return item;
    }));
  };

  const handleDeleteWardrobe = (id: string) => {
    setWardrobe(prev => prev.filter(item => item.id !== id));
  };

  // Interactive sleep logs
  const handleAddSleepRecord = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate duration in minutes from start and end HH:MM
    const [startH, startM] = sleepStart.split(":").map(Number);
    const [endH, endM] = sleepEnd.split(":").map(Number);
    
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) {
      // Overnight sleep
      diffMins += 24 * 60;
    }

    const newRecord: SleepRecord = {
      id: "sleep-" + Date.now(),
      startTime: sleepStart,
      endTime: sleepEnd,
      date: sleepDate,
      durationMinutes: diffMins,
      quality: sleepQuality,
      roomTemp: profile.roomTemp,
      fanOrAc: sleepFanOrAc,
    };

    setSleepRecords(prev => [newRecord, ...prev]);
    // provide smart insight feedback as a chatbot message or alert!
  };

  const handleDeleteSleep = (id: string) => {
    setSleepRecords(prev => prev.filter(item => item.id !== id));
  };

  // Interactive Sound Machine Controller
  const toggleSound = (soundType: "womb" | "rain" | "fairy" | "ocean") => {
    if (activeSoundType === soundType) {
      synthEngine.stop();
      setActiveSoundType(null);
    } else {
      synthEngine.start(soundType, soundVolume);
      setActiveSoundType(soundType);
    }
  };

  // Milestone recording
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    const newMilestone: MilestoneMemory = {
      id: "mile-" + Date.now(),
      title: milestoneTitle,
      category: milestoneCategory,
      date: milestoneDate,
      description: milestoneDesc || "Captured an amazing memory in the baby scrapbook timeline.",
      emoji: milestoneEmoji,
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=300", // backup beautiful layout
    };

    setMilestones(prev => [newMilestone, ...prev]);
    setMilestoneTitle("");
    setMilestoneDesc("");
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(item => item.id !== id));
  };

  // Chatbot request dispatch
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatText.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: currentChatText,
    };

    setMessages(prev => [...prev, userMsg]);
    const requestedText = currentChatText;
    setCurrentChatText("");
    setChatLoading(true);

    try {
      // Call our server.ts backend proxy to contact Google GenAI
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: requestedText })
      });
      const data = await res.json();
      
      const aiResponse: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        sender: "ai",
        text: data.text || "I am processing your baby care context beautifully. Comfort rules organic fibers!"
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: "msg-err-" + Date.now(),
        sender: "ai",
        text: "I met with a tiny latency bump. Here is a comfort reminder: Prioritize 100% fine cotton loops and regular tummy time. Let me know how I can guide your naps better!"
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Community Sandbox Social
  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityText.trim()) return;

    const colors = [
      "bg-emerald-100 text-emerald-600",
      "bg-peach-100 text-peach-600",
      "bg-blue-100 text-blue-600",
      "bg-lavender-100 text-lavender-600"
    ];
    const randColor = colors[Math.floor(Math.random() * colors.length)];

    const newPost: CommunityPost = {
      id: "post-" + Date.now(),
      author: "Cozy Parent",
      avatarColor: randColor,
      babyAge: getBabyAgeString(profile.birthDate),
      content: communityText,
      likes: 1,
      hasLiked: true,
      repliesCount: 0,
      timestamp: "Just now",
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    setCommunityText("");
  };

  const handleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    alert(`💐 Thank you for choosing organic cotton baby comfort! Your virtual order of $${calculateTotal()} has been simulated with love support.`);
    setCart([]);
    setCartOpen(false);
  };

  // Convert baby date to pretty ages
  const getBabyAgeString = (birthDateStr: string) => {
    const today = new Date("2026-05-23");
    const birth = new Date(birthDateStr);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} Day${diffDays > 1 ? "s" : ""} Old`;
    }
    const months = Math.floor(diffDays / 30.4);
    const remainingDays = Math.floor(diffDays % 30.4);
    return `${months}M, ${remainingDays}D Old`;
  };

  const currentAgeLabel = getBabyAgeString(profile.birthDate);

  // Dynamic products filtered by store filters or recommended
  const filteredProducts = DEFAULT_PRODUCTS.filter(p => {
    if (storeFilter === "all") return true;
    return p.category === storeFilter;
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#4A4A4A] flex flex-col font-sans transition-all relative overflow-hidden">
      
      {/* Dynamic Watermark Clouds for Geometric Balance theme feeling */}
      <div className="absolute -z-10 top-24 right-10 opacity-30 animate-cozy-float select-none pointer-events-none">
        <svg width="220" height="110" viewBox="0 0 200 100" fill="#DCE9F2">
          <circle cx="50" cy="60" r="32" />
          <circle cx="95" cy="42" r="42" />
          <circle cx="140" cy="60" r="32" />
        </svg>
      </div>

      <div className="absolute -z-10 bottom-24 -left-10 opacity-20 select-none pointer-events-none">
        <svg width="280" height="140" viewBox="0 0 200 100" fill="#FDE8E0">
          <circle cx="60" cy="70" r="35" />
          <circle cx="110" cy="50" r="50" />
          <circle cx="160" cy="70" r="35" />
        </svg>
      </div>

      {/* HEADER SECTION - Beautiful theme matching Leo’s Mom mockup */}
      <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-[#EFEBE4] bg-white/70 backdrop-blur-md sticky top-0 z-30" id="brand-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-xs">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-brand-dark">
              Lullaby<span className="text-brand-sage font-sans">&amp;Cotton</span>
            </h1>
            <span className="text-[10px] uppercase font-extrabold text-[#9F9185] tracking-wide block -mt-1">Organic AI Boutique</span>
          </div>
        </div>

        {/* Global tab Switchers */}
        <nav className="hidden lg:flex items-center gap-7 text-[#5C524F] font-semibold text-sm">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`cursor-pointer transition-colors ${activeTab === "dashboard" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("boutique")} 
            className={`cursor-pointer transition-colors ${activeTab === "boutique" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Organic Shop
          </button>
          <button 
            onClick={() => setActiveTab("sleep")} 
            className={`cursor-pointer transition-colors ${activeTab === "sleep" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Sleep &amp; Synth
          </button>
          <button 
            onClick={() => setActiveTab("activities")} 
            className={`cursor-pointer transition-colors ${activeTab === "activities" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Cradle Play
          </button>
          <button 
            onClick={() => setActiveTab("scrapbook")} 
            className={`cursor-pointer transition-colors ${activeTab === "scrapbook" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Memories
          </button>
          <button 
            onClick={() => setActiveTab("community")} 
            className={`cursor-pointer transition-colors ${activeTab === "community" ? "text-brand-sage font-bold border-b-2 border-brand-sage pb-1" : "opacity-75 hover:opacity-100"}`}
          >
            Parent Hub
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {/* Shopping Cart Trigger */}
          <button 
            onClick={() => setCartOpen(true)}
            id="shopping-cart-button"
            className="p-2.5 bg-white rounded-full border border-[#EDE8E0] relative hover:bg-[#FAF9F6] transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag size={18} className="text-[#3D322E]" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-400 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Quick Profile display */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#EDE8E0] shadow-2xs">
            <div className="w-6.5 h-6.5 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-slate-700">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "LO"}
            </div>
            <span className="text-xs font-semibold hidden sm:inline text-brand-dark truncate max-w-[90px]">
              {profile.name || "Leo"}
            </span>
          </div>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <div className="lg:hidden flex items-center justify-around bg-white border-b border-[#EFEBE4] p-2 overflow-x-auto text-xs font-bold sticky top-20 z-20 shadow-2xs">
        <button 
          onClick={() => setActiveTab("dashboard")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "dashboard" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Cozy Space
        </button>
        <button 
          onClick={() => setActiveTab("boutique")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "boutique" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Organic Boutique
        </button>
        <button 
          onClick={() => setActiveTab("sleep")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "sleep" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Sleep &amp; Synth
        </button>
        <button 
          onClick={() => setActiveTab("activities")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "activities" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Cradle Play
        </button>
        <button 
          onClick={() => setActiveTab("scrapbook")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "scrapbook" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Memories
        </button>
        <button 
          onClick={() => setActiveTab("community")} 
          className={`px-3 py-1.5 rounded-full ${activeTab === "community" ? "bg-brand-sage text-white" : "text-brand-dark opacity-80"}`}
        >
          Community
        </button>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-12 gap-6 relative z-10">
        
        {/* SIDEBAR: Baby Stats (3 columns) */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-6" id="app-sidebar-column">
          
          {/* Baby Profile display Card with Geometric Rounded layout */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xs border border-[#F0EDEA] flex flex-col relative" id="baby-profile-card">
            
            {/* Quick Edit Trigger */}
            <button 
              onClick={() => {
                if (profileEditMode) {
                  setProfileEditMode(false);
                } else {
                  openProfileEditor();
                }
              }}
              className="absolute top-4 right-4 text-xs font-bold text-brand-dark opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer"
            >
              <PenTool size={11} /> {profileEditMode ? "Cancel" : "Edit Details"}
            </button>

            {!profileEditMode ? (
              <div className="flex flex-col items-center text-center">
                <div className="relative mt-2">
                  <div className="w-28 h-28 rounded-full border-4 border-brand-peach p-1 shadow-2xs">
                    <div className="w-full h-full bg-[#E6E3F0] rounded-full flex items-center justify-center text-5xl">
                      {profile.gender === "boy" ? "👶🏼" : profile.gender === "girl" ? "👶🏻" : "🦉"}
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-brand-sage text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {currentAgeLabel}
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-serif font-bold text-[#3D322E]">{profile.name || "Tiny Angel"}</h2>
                <span className="text-xs text-gray-400 font-semibold italic mt-0.5">
                  Natural Organic Dev Stage
                </span>

                <div className="w-full mt-6 grid grid-cols-2 gap-3" id="baby-vital-grid">
                  <div className="bg-brand-peach/40 p-3 rounded-2xl border border-brand-peach/20 text-center">
                    <p className="text-[10px] uppercase font-extrabold text-[#A8887D]">Weight</p>
                    <p className="text-lg font-bold text-brand-dark mt-0.5">{profile.weight} kg</p>
                  </div>
                  <div className="bg-brand-blue/40 p-3 rounded-2xl border border-brand-blue/20 text-center">
                    <p className="text-[10px] uppercase font-extrabold text-[#748C9E]">Height</p>
                    <p className="text-lg font-bold text-brand-dark mt-0.5">{profile.height} cm</p>
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2 border-t border-[#F5EFE6] pt-3 text-xs text-[#5C524F]">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Location:</span>
                    <span className="font-bold">{profile.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Room Temp:</span>
                    <span className="font-bold text-amber-900">{profile.roomTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Skin:</span>
                    <span className="font-bold bg-amber-50 px-2 py-0.2 rounded text-amber-700 capitalize">
                      {profile.skinSensitivity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Sleep:</span>
                    <span className="font-bold text-brand-dark capitalize">
                      {profile.sleepHabits.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 mt-4" id="profile-editor-form">
                <span className="text-xs uppercase font-extrabold text-brand-sage block mb-1">Adjust Baby Vitals</span>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Baby Name</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Birth Date</label>
                  <input 
                    type="date" 
                    value={newBirthDate} 
                    onChange={e => setNewBirthDate(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.05"
                      value={newWeight} 
                      onChange={e => setNewWeight(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={newHeight} 
                      onChange={e => setNewHeight(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Location</label>
                  <input 
                    type="text" 
                    value={newLocation} 
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Skin Type</label>
                    <select 
                      value={newSensitivity} 
                      onChange={e => setNewSensitivity(e.target.value as any)}
                      className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none text-slate-700"
                    >
                      <option value="normal">Normal</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="dry">Dry</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Room Temp (°C)</label>
                    <input 
                      type="number" 
                      value={newRoomTemp} 
                      onChange={e => setNewRoomTemp(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-xs rounded-xl bg-[#FAF9F6] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-sage/90 transition-all cursor-pointer shadow-xs"
                  >
                    Save Vitals
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Quick AI Parenting Chat Widget in Sidebar */}
          <div className="bg-brand-lavender/30 rounded-[2rem] p-5 shadow-xs border border-brand-lavender/50 flex flex-col justify-between" id="sidebar-chat-preview">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] bg-white text-purple-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block">Live Consultation</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              </div>
              <h4 className="font-serif font-bold text-[#4A3D34] text-sm">Ask about Baby Comfort</h4>
              <p className="text-[11px] text-gray-500 leading-normal mt-1">
                Have a developmental, sleep, or fabric sensitivity question? Chat with the Lullaby support assistant.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab("community")}
              className="mt-4 w-full py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare size={14} /> Talk to Assistant
            </button>
          </div>

          {/* Quick Learning hub card preview in Sidebar */}
          <div className="bg-white rounded-[2rem] p-5 shadow-xs border border-[#F0EDEA] space-y-3" id="quick-article-view">
            <span className="text-[10px] uppercase font-bold text-cyan-700 tracking-wider">Bite-Sized Guide</span>
            <div className="flex gap-2.5 items-start">
              <span className="text-2xl pt-1">🌸</span>
              <div>
                <h5 className="text-xs font-extrabold text-brand-dark">Preserving Infant Skin</h5>
                <p className="text-[10px] text-gray-500 leading-snug mt-0.5">
                  Infant skin absorbs friction 5x faster. Swap labels for screen-printed stamps, and avoid chemical bleach wash cycles.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab("scrapbook")} 
              className="text-[10px] font-bold text-brand-sage hover:underline flex items-center gap-1"
            >
              Browse Articles <ChevronRight size={10} />
            </button>
          </div>

        </section>

        {/* MAIN PANELS (9 columns) */}
        <section className="col-span-12 lg:col-span-9 flex flex-col gap-6" id="app-main-column">
          
          {/* TAB 1: Dashboard View */}
          {activeTab === "dashboard" && (
            <Dashboard 
              profile={profile}
              sleepRecords={sleepRecords}
              routine={routine}
              milestones={milestones}
              wardrobe={wardrobe}
              onToggleRoutine={handleToggleRoutine}
              onNavigate={setActiveTab}
            />
          )}

          {/* TAB 2: Intelligent Wardrobe & Boutique */}
          {activeTab === "boutique" && (
            <div className="space-y-6 animate-fade-in" id="boutique-panel">
              
              {/* Intelligent Wardrobe Banner */}
              <div className="bg-gradient-to-r from-brand-peach/30 to-brand-blue/30 border border-[#F0EDEA] p-6 rounded-3xl" id="wardrobe-overview-banner">
                <div className="flex items-center gap-3 mb-2">
                  <Shirt className="text-[#A48261]" />
                  <h3 className="font-serif text-lg font-bold text-[#3E2D20]">Digital Baby Wardrobe System</h3>
                </div>
                <p className="text-xs text-[#6B5A4E] leading-relaxed max-w-2xl">
                  Catalog owned items to inspect diaper-change access or sizing gaps. Our predictor matches clothing sizes with baby's height and weight forecast automatically.
                </p>

                {/* Wardrobe Metrics summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/80 p-3 rounded-2xl border border-white/40">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Owned Items</span>
                    <span className="text-lg font-bold text-brand-dark">{wardrobe.length}</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-white/40">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Snug Fit (Tight)</span>
                    <span className="text-lg font-bold text-amber-600">
                      {wardrobe.filter(w => w.fitStatus === "tight").length} active alert{wardrobe.filter(w => w.fitStatus === "tight").length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-white/40">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Good Size Span</span>
                    <span className="text-lg font-bold text-green-600">
                      {wardrobe.filter(w => w.fitStatus === "perfect").length} items
                    </span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-white/40">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Upcoming Size Gaps</span>
                    <span className="text-lg font-bold text-blue-600">
                      {wardrobe.filter(w => w.size === "3-6M").length < 3 ? "Action Required" : "Stocked Well"}
                    </span>
                  </div>
                </div>
              </div>

              {/* TWO SECTIONS: Part 1 - Add & Manage Clothes. Part 2 - Shop Recommendations */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left side: Your Wardrobe Clothes management */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Catalogued Infant Clothes</h4>
                      <span className="text-xs bg-brand-peach text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        Filter: 0-3 Months
                      </span>
                    </div>

                    {/* Catalogue loop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="wardrobe-items-grid">
                      {wardrobe.map(item => (
                        <div key={item.id} className="p-3 bg-brand-cream/40 border border-[#EFEDE6] rounded-xl flex gap-3 relative">
                          <button 
                            onClick={() => handleDeleteWardrobe(item.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
                            title="Remove catalogued piece"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="w-16 h-16 rounded-xl bg-white border overflow-hidden shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="text-xs flex-1 min-w-0">
                            <h5 className="font-bold text-[#3E2D20] truncate">{item.name}</h5>
                            <p className="text-[10px] text-gray-400 font-medium">Fabric: {item.fabric}</p>
                            
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="px-1.5 py-0.2 bg-zinc-100 border text-[9px] rounded font-bold">{item.size}</span>
                              
                              <select 
                                value={item.fitStatus}
                                onChange={(e) => handleUpdateFit(item.id, e.target.value as any)}
                                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border outline-none cursor-pointer ${
                                  item.fitStatus === "tight" 
                                    ? "bg-red-50 text-red-600 border-red-200" 
                                    : item.fitStatus === "perfect" 
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-blue-50 text-blue-600 border-blue-200"
                                }`}
                              >
                                <option value="loose">Loose Fitting</option>
                                <option value="perfect">Perfect Fit</option>
                                <option value="tight">Too Tight!</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Form to append owned item */}
                    <form onSubmit={handleAddWardrobe} className="mt-5 pt-4 border-t border-[#F2ECE4] space-y-3 bg-[#FCFAF7] p-3.5 rounded-xl">
                      <span className="text-xs font-bold text-gray-600 block">✓ Fast-Register a Wardrobe Piece</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Item Friendly Label</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Summer Sage Onesie" 
                            required
                            value={newWardrobeName}
                            onChange={e => setNewWardrobeName(e.target.value)}
                            className="w-full bg-white border p-1.5 text-xs rounded-lg outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Category Type</label>
                          <select 
                            value={newWardrobeCategory} 
                            onChange={e => setNewWardrobeCategory(e.target.value as any)}
                            className="w-full bg-white border p-1.5 text-xs rounded-lg outline-none text-slate-700"
                          >
                            <option value="bodysuit">Organic Bodysuit</option>
                            <option value="sleepsuit">Snub Sleepsuit</option>
                            <option value="romper">Knit Romper</option>
                            <option value="outerwear">Fleece Coats</option>
                            <option value="accessory">Mittens &amp; Beanies</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Assigned Size</label>
                          <select 
                            value={newWardrobeSize} 
                            onChange={e => setNewWardrobeSize(e.target.value as any)}
                            className="w-full bg-white border p-1.5 text-xs rounded-lg outline-none text-slate-700"
                          >
                            <option value="NB">Newborn (NB)</option>
                            <option value="0-3M">0-3 Months</option>
                            <option value="3-6M">3-6 Months</option>
                            <option value="6-12M">6-12 Months</option>
                            <option value="12M+">12 Months +</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Fit Check</label>
                          <select 
                            value={newWardrobeFit} 
                            onChange={e => setNewWardrobeFit(e.target.value as any)}
                            className="w-full bg-white border p-1.5 text-xs rounded-lg outline-none text-slate-700"
                          >
                            <option value="perfect">Perfect Spanning</option>
                            <option value="loose">Room to Grow (Loose)</option>
                            <option value="tight">Too Tight (Inches short)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Fabric</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Bamboo Rib" 
                            value={newWardrobeFabric}
                            onChange={e => setNewWardrobeFabric(e.target.value)}
                            className="w-full bg-white border p-1.5 text-xs rounded-lg outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-[#5C524F] text-white rounded-lg text-xs font-bold hover:bg-black transition-colors cursor-pointer text-center block"
                      >
                        Register to Wardrobe
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right side: Personalized Organic Products Shop (Ecommerce experience) */}
                <div className="xl:col-span-5 space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs space-y-4">
                    
                    {/* Header */}
                    <div className="border-b border-[#FAF9F6] pb-2">
                      <span className="text-[10px] uppercase font-bold text-[#A3B18A] tracking-wider block">AI Match Recommendation</span>
                      <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Predicted Shopping Boutique</h4>
                      <p className="text-[11px] text-gray-500 leading-normal mt-1">
                        Displaying customized bundles for <span className="font-bold underline">{profile.name}</span> matching location weather (<span className="font-semibold text-amber-800">{profile.roomTemp}°C</span>) and current weight ({profile.weight} kg).
                      </p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {["all", "sleeptight", "bodysuit", "sleepsuit", "romper", "sleepbag", "giftset"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setStoreFilter(cat)}
                          className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            storeFilter === cat 
                              ? "bg-brand-sage text-white border-brand-sage" 
                              : "bg-white border-[#EDE7DF] hover:bg-[#FAF9F6] text-gray-500 font-semibold"
                          }`}
                        >
                          {cat === "all" ? "All Collections" : cat === "sleeptight" ? "TOG Schlaf" : cat}
                        </button>
                      ))}
                    </div>

                    {/* Highly curated products list */}
                    <div className="space-y-4" id="boutique-products-list">
                      {filteredProducts.map(p => {
                        const predictedSize = wardrobe.filter(w => w.fitStatus === "tight").length > 0 ? "3-6M" : "0-3M";
                        
                        return (
                          <div key={p.id} className="p-3.5 bg-brand-cream/35 border rounded-2xl flex gap-3 shadow-2xs">
                            <div className="w-18 h-18 rounded-xl bg-white border overflow-hidden shrink-0">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 text-xs space-y-1">
                              <div className="flex justify-between items-start gap-1">
                                <h5 className="font-serif font-bold text-[#3E2D20] text-xs leading-tight">{p.name}</h5>
                                <span className="text-xs font-bold text-[#3D322E]">${p.price}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">{p.description}</p>
                              
                              <div className="flex items-center gap-1.5 pt-2">
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                                  <Sparkles size={8} /> GOTS Certified
                                </span>
                                <span className="text-[9px] text-[#A69E96]">Sizes {p.sizeRange}</span>
                              </div>

                              <div className="pt-2 flex justify-between items-center gap-2">
                                <span className="text-[10px] text-brand-sage font-extrabold">Size match: {predictedSize}</span>
                                <button 
                                  onClick={() => handleAddToCart(p, predictedSize)}
                                  className="bg-brand-dark hover:bg-black text-white text-[10px] font-bold py-1 px-3 rounded-lg transition-all cursor-pointer"
                                >
                                  Add Bag
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Subscription baby box bundle suggestion */}
                    <div className="p-4 bg-brand-peach/25 border border-brand-peach/40 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-700 block">🎁 Bundle Optimization Alert</span>
                      <p className="text-[11px] text-[#4A3D34] leading-relaxed">
                        Your baby’s current weight of {profile.weight} kg is nearing transition curve of 3-6M. Save 15% with their customized **Next-Size Spring Kit** bundle box.
                      </p>
                      <button 
                        onClick={() => {
                          const customBox: Product = {
                            id: "custom-bundle",
                            name: "Cozy Transition Box (3-6M)",
                            price: 64,
                            category: "giftset",
                            sizeRange: "3-6M",
                            description: "Includes organic sleepbag, warm romper, soft bibs tailored exactly for upcoming weeks.",
                            rating: 5.0,
                            imageUrl: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&q=80&w=400",
                            tags: []
                          };
                          handleAddToCart(customBox, "3-6M");
                        }}
                        className="bg-brand-dark text-white text-[10px] font-semibold tracking-wide w-full py-1.5 rounded-lg hover:bg-black transition-colors"
                      >
                        Claim Cozy Transition Kit ($64)
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Sleep Tracker, Sleep Assistant, White Noise Machine */}
          {activeTab === "sleep" && (
            <div className="space-y-6 animate-fade-in" id="sleep-panel">
              
              {/* White Noise Sound Machine Component */}
              <div className="bg-gradient-to-br from-[#413543] via-[#2F2531] to-[#3B2C3E] text-[#FFF9F2] p-6 rounded-3xl relative overflow-hidden shadow-md" id="white-noise-sound-machine">
                {/* Visual waves or celestial design items */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                </div>

                <div className="space-y-2 relative z-10">
                  <span className="text-[10px] bg-brand-peach/20 text-[#FFDAB9] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    🌌 Sleep Assistant Synth
                  </span>
                  <h3 className="font-serif font-bold text-xl">Lullaby sound &amp; Pink Noise Machine</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                    Calm over-exhausted infants naturally. Our Web Audio synthesizer generates authentic pink rumbles, slow sea waves, or soft rhythmic bells without high battery usage.
                  </p>
                </div>

                {/* Synth triggers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 relative z-10" id="sound-options-grid">
                  {[
                    { id: "womb", name: "Womb Resonance", description: "Warm heartbeat & low fluid rumble", emoji: "🤰" },
                    { id: "rain", name: "Rain on Cradle", description: "Steady water drop rustling LFO", emoji: "🌧️" },
                    { id: "ocean", name: "Ocean Tide Swell", description: "12-second tidal drift wave", emoji: "🌊" },
                    { id: "fairy", name: "Fairy Bell Wobble", description: "Slow soothing frequency chime", emoji: "🔮" }
                  ].map((sound) => {
                    const isActive = activeSoundType === sound.id;
                    return (
                      <button
                        key={sound.id}
                        onClick={() => toggleSound(sound.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                          isActive 
                            ? "bg-[#65526B] border-[#DCE9F2] shadow-sm transform scale-102" 
                            : "bg-[#251A27]/80 border-[#473B4D] hover:bg-[#322435]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-2xl">{sound.emoji}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-transparent"}`}></span>
                        </div>
                        <h4 className="font-bold text-xs mt-3 text-[#FFF5EA]">{sound.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{sound.description}</p>
                        
                        {isActive && (
                          <span className="absolute bottom-2 right-2 text-[9px] bg-emerald-500 text-white font-mono px-1 rounded">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Volume slider and stop control */}
                <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-5 border-t border-[#FFF9F2]/10 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300">Volume</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                      className="w-32 bg-slate-600 appearance-none h-1 rounded pointer-events-auto accent-brand-peach"
                    />
                    <span className="text-xs text-slate-400 font-mono">{Math.round(soundVolume * 100)}%</span>
                  </div>

                  {activeSoundType && (
                    <button 
                      onClick={() => {
                        synthEngine.stop();
                        setActiveSoundType(null);
                      }}
                      className="bg-red-400 hover:bg-red-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Square size={12} /> Quiet Sound Machine
                    </button>
                  )}
                </div>

              </div>

              {/* Log Naps & Insighter details */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left: Log Napping Sleep Form */}
                <div className="xl:col-span-4 space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="text-brand-sage" size={18} />
                      <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Log a Sleeping Hour</h4>
                    </div>

                    <form onSubmit={handleAddSleepRecord} className="space-y-3" id="sleep-recording-form">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">Date</label>
                        <input 
                          type="date" 
                          value={sleepDate}
                          onChange={e => setSleepDate(e.target.value)}
                          className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block mb-1">Fell Asleep</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 20:30" 
                            required
                            value={sleepStart}
                            onChange={e => setSleepStart(e.target.value)}
                            className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block mb-1">Wake-Up Hour</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 06:45" 
                            required
                            value={sleepEnd}
                            onChange={e => setSleepEnd(e.target.value)}
                            className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">Sleep Quality</label>
                        <select 
                          value={sleepQuality}
                          onChange={e => setSleepQuality(e.target.value as any)}
                          className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none text-slate-700"
                        >
                          <option value="excellent">Excellent Deep Sleep (Few stirs)</option>
                          <option value="good">Good Sleep (Typical wakes)</option>
                          <option value="fair">Fair (Tossy, gas pains)</option>
                          <option value="poor">Poor Sleep (Overtemperature alerts)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input 
                          type="checkbox" 
                          id="fan" 
                          checked={sleepFanOrAc}
                          onChange={e => setSleepFanOrAc(e.target.checked)}
                          className="accent-brand-sage w-4.5 h-4.5"
                        />
                        <label htmlFor="fan" className="text-xs text-gray-500 font-medium">Inside fan or AC was activated</label>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-sage/90 transition-all cursor-pointer"
                      >
                        Register Nap Log
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Sleeping analytics & Wake-window suggestions */}
                <div className="xl:col-span-8 space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs">
                    <h4 className="font-serif font-bold text-sm text-[#3E2D20] mb-4">Historical Sleep Quality &amp; Wake Windows</h4>

                    {/* Wake Window suggester visual box */}
                    <div className="p-4 bg-brand-blue/30 border border-brand-blue/50 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-700 uppercase block tracking-wider">AI Sleep Diagnostics</span>
                        <h5 className="text-xs font-bold text-brand-dark">Recommended Wake Window: 1.5 - 2 Hours</h5>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          For Leo (at {currentAgeLabel}), keeping wake intervals strictly under 110 minutes avoids cortisol rushes. Look for the "starry stare" sign or ear pulling to identify sleep readiness!
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 border shadow-2xs font-bold text-xs text-cyan-800">
                        90m
                      </div>
                    </div>

                    {/* Historical Sleep logs table */}
                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-100" id="sleep-historical-list">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF9F6] text-gray-400 font-extrabold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Interval</th>
                            <th className="p-3 text-right">Length</th>
                            <th className="p-3 text-center">Quality</th>
                            <th className="p-3">Conditions</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[#4A4A4A]">
                          {sleepRecords.map(rec => (
                            <tr key={rec.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold">{rec.date}</td>
                              <td className="p-3 font-mono">{rec.startTime} - {rec.endTime}</td>
                              <td className="p-3 text-right font-bold text-[#3E2D20]">
                                {Math.floor(rec.durationMinutes / 60)}h {rec.durationMinutes % 60}m
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                                  rec.quality === "excellent" 
                                    ? "bg-green-50 text-green-700 border border-green-200" 
                                    : rec.quality === "good" 
                                      ? "bg-emerald-50 text-emerald-800"
                                      : "bg-yellow-50 text-yellow-700"
                                }`}>
                                  {rec.quality}
                                </span>
                              </td>
                              <td className="p-3 text-gray-500">
                                {rec.roomTemp}°C • {rec.fanOrAc ? "AC Active" : "No Fan"}
                              </td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => handleDeleteSleep(rec.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete check"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Age-Based Play, sensory exploration activities, Montessori Toys */}
          {activeTab === "activities" && (
            <div className="space-y-6 animate-fade-in" id="activities-panel">
              
              {/* Activity Header Guidance */}
              <div className="bg-brand-sage text-white p-6 rounded-3xl" id="activity-learning-banner">
                <span className="text-[10px] bg-white/20 text-[#FFF] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  🧠 Developmental Gym
                </span>
                <h3 className="font-serif font-bold text-lg mt-2">Personalized Baby Activity Center</h3>
                <p className="text-xs text-emerald-50 leading-relaxed mt-1 max-w-2xl">
                  As Leo approaches {currentAgeLabel}, sensory integration dictates cognitive speeds. Focus on short interactive loops. Never prolong tummy stress; let baby set play durations.
                </p>
              </div>

              {/* Filter Tabs by age slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual grid of age bracket activities */}
                <div className="space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs">
                    <h4 className="font-serif font-bold text-sm text-[#3E2D20] mb-4">Milestone-Matched Activities</h4>
                    
                    <div className="space-y-4" id="development-activity-cards">
                      {DEV_ACTIVITIES.map(act => {
                        const isAgeAppropriate = (profile.weight < 5.5 && act.ageGroup === "0-3M") ||
                                                (profile.weight >= 5.5 && profile.weight < 8.0 && act.ageGroup === "3-6M") ||
                                                (profile.weight >= 8.0 && act.ageGroup === "6-12M");

                        return (
                          <div key={act.id} className={`p-4 border rounded-2xl transition-all relative ${
                            isAgeAppropriate 
                              ? "bg-brand-peach/20 border-brand-peach/60 shadow-2xs" 
                              : "bg-brand-cream/30 border-gray-100 opacity-75"
                          }`}>
                            <div className="flex items-start gap-3">
                              <span className="text-2xl pt-1">{act.emoji}</span>
                              <div className="flex-1 text-xs space-y-1">
                                <div className="flex justify-between items-center gap-1.5 flex-wrap">
                                  <h5 className="font-bold text-[#3E2D20]">{act.title}</h5>
                                  <span className="bg-white px-2 py-0.5 border text-[9px] rounded font-mono font-bold text-slate-500">
                                    {act.ageGroup} • {act.difficulty}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-normal">{act.benefits}</p>
                                
                                <div className="p-2.5 bg-white/90 border border-slate-100 rounded-lg text-[10px] text-slate-600 mt-2">
                                  <span className="font-bold text-amber-800 block">⚠️ Safety Advice:</span>
                                  {act.safetyTip}
                                </div>
                              </div>
                            </div>

                            {isAgeAppropriate && (
                              <span className="absolute top-2 right-2 text-[8px] bg-brand-sage text-white font-extrabold px-1.5 rounded">
                                MATCHED WITH LEO
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Smart Montessori Toys Guidance */}
                <div className="space-y-4">
                  <div className="bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs space-y-4">
                    <div>
                      <span className="text-[10px] text-[#A67FC2] font-extrabold uppercase tracking-wider block">Sensory &amp; Fine Gripping</span>
                      <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Pediatrically Approved Montessori Toys</h4>
                      <p className="text-xs text-gray-500 leading-normal mt-1">
                        Avoid highly colorful plastic buttons. Simple, solid high-contrast textures trigger targeted nerve myelinization better.
                      </p>
                    </div>

                    <div className="space-y-3" id="montessori-toys-grid">
                      {DEV_TOYS.map(toy => (
                        <div key={toy.id} className="p-3.5 bg-brand-cream/40 border border-slate-100 rounded-xl flex gap-3 text-xs">
                          <span className="text-xl">🪁</span>
                          <div className="space-y-1">
                            <h5 className="font-bold text-brand-dark">{toy.name}</h5>
                            <span className="text-[9px] uppercase font-mono font-extrabold tracking-wider bg-purple-50 text-purple-700 px-1.5 rounded-full block w-max">
                              {toy.category}
                            </span>
                            <p className="text-[10px] text-gray-500 leading-snug">{toy.description}</p>
                            <p className="text-[10px] text-brand-sage font-extrabold">Milestone target: {toy.milestone}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-brand-blue/35 rounded-xl border border-brand-blue/65">
                      <h5 className="text-xs font-bold text-[#4A3D34]">🧸 Bundle Advisory</h5>
                      <p className="text-[11px] text-[#5C524F] leading-normal mt-1">
                        Get the complete **Montessori Play Kit** for {currentAgeLabel} compiled by neonatal experts at Lullaby &amp; Cotton. Zero chemical finishes, organic linen fibers.
                      </p>
                      <button 
                        onClick={() => {
                          const toyBundle: Product = {
                            id: "toy-basket",
                            name: "Expert Montessori Play Basket (0-6M)",
                            price: 45,
                            category: "giftset",
                            sizeRange: "One Size",
                            description: "Beechwood rattle, high-contrast visual display stand, knit teething ring.",
                            rating: 5.0,
                            imageUrl: "https://images.unsplash.com/photo-1515488042459-e938f32f482d?auto=format&fit=crop&q=80&w=400",
                            tags: []
                          };
                          handleAddToCart(toyBundle, "One Size");
                        }}
                        className="mt-3 w-full py-2 bg-brand-dark hover:bg-black text-white text-[10px] font-bold rounded-lg transition-colors"
                      >
                        Add Play Basket ($45.00)
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Milestone Memory Scrapbook */}
          {activeTab === "scrapbook" && (
            <div className="space-y-6 animate-fade-in" id="scrapbook-panel">
              
              {/* Memories Scrapbook Banner */}
              <div className="bg-gradient-to-r from-brand-lavender/35 to-brand-peach/35 border border-[#F0EDEA] p-6 rounded-3xl" id="scrapbook-intro-header">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3E2D20]">Emotional Baby Milestone Scrapbook</h3>
                    <p className="text-xs text-slate-500">Document the magical transitions of your newborn baby’s fleeting infancy weeks.</p>
                  </div>
                </div>
              </div>

              {/* Form & Timeline layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Record achievement */}
                <div className="xl:col-span-4 bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs h-max">
                  <h4 className="font-serif font-bold text-sm text-[#3E2D20] mb-3">Record an Infant First</h4>
                  
                  <form onSubmit={handleAddMilestone} className="space-y-3" id="milestone-log-form">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Milestone Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rolled over on stomach!" 
                        required
                        value={milestoneTitle}
                        onChange={e => setMilestoneTitle(e.target.value)}
                        className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">Occurred Date</label>
                        <input 
                          type="date" 
                          value={milestoneDate}
                          onChange={e => setMilestoneDate(e.target.value)}
                          className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">Emoji Stamp</label>
                        <input 
                          type="text" 
                          value={milestoneEmoji}
                          onChange={e => setMilestoneEmoji(e.target.value)}
                          className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none text-center font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Category type</label>
                      <select 
                        value={milestoneCategory} 
                        onChange={e => setMilestoneCategory(e.target.value as any)}
                        className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none text-slate-700 font-medium"
                      >
                        <option value="first-smile">Fabulous Gummy Smile</option>
                        <option value="first-crawl">Lateral Crawling Loop</option>
                        <option value="first-step">First Tiny Steps</option>
                        <option value="first-word">Babbled First Words</option>
                        <option value="first-festival">Special Family Festival</option>
                        <option value="monthly-growth">Monthly Growth Moment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">heartwarming Story description</label>
                      <textarea 
                        rows={3}
                        placeholder="Detail the emotion, weather, what outfit baby was inside when it occurred..."
                        value={milestoneDesc}
                        onChange={e => setMilestoneDesc(e.target.value)}
                        className="w-full bg-[#FAF9F6] border p-2 text-xs rounded-xl outline-none resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                    >
                      Stamp Milestone
                    </button>
                  </form>
                </div>

                {/* Timeline loop list */}
                <div className="xl:col-span-8 bg-white border border-[#F0EDEA] rounded-2xl p-5 shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Infant Life Accomplishments Timeline</h4>

                  <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FAF6EE] before:z-0" id="scrapbook-timeline-loop">
                    
                    {milestones.map(mile => (
                      <div key={mile.id} className="flex gap-4 relative z-10 text-xs">
                        {/* Timeline Node Icon */}
                        <div className="w-10 h-10 rounded-full bg-[#FCFAF5] border-2 border-brand-peach flex items-center justify-center shrink-0 self-start shadow-xs text-lg">
                          {mile.emoji}
                        </div>

                        {/* Content Box */}
                        <div className="bg-brand-cream/25 border border-slate-100 rounded-2xl p-4 flex-1 space-y-2 relative">
                          <button 
                            onClick={() => handleDeleteMilestone(mile.id)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer"
                            title="Delete memory"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="flex justify-between items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">{mile.date}</span>
                            <span className="text-[9px] bg-brand-peach/40 text-amber-900 border font-extrabold px-2 py-0.2 rounded-full uppercase">
                              {mile.category.replace("-", " ")}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-[#3E2D20] text-sm">{mile.title}</h5>
                          <p className="text-[11px] text-[#5C524F] leading-relaxed font-medium">{mile.description}</p>
                          
                          {/* Aesthetic Polarid Container */}
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 w-44 bg-white p-1.5 shadow-3xs">
                            <img src={mile.photoUrl} alt="Infant snapshot" className="w-full h-24 object-cover rounded-lg" />
                            <p className="text-[8px] text-center text-gray-400 font-bold tracking-tight italic mt-1 bg-neutral-50 py-0.5 rounded">Happy {mile.title} Moment</p>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: Community & AI Assistant Parent Chat */}
          {activeTab === "community" && (
            <div className="space-y-6 animate-fade-in" id="community-tab-block">
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left hand: Interactive AI Parenting Chatbot (6 columns) */}
                <div className="xl:col-span-7 bg-white border border-[#F0EDEA] rounded-3xl p-5 shadow-xs flex flex-col h-[520px]">
                  
                  {/* Chat header */}
                  <div className="border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-sage text-white rounded-full flex items-center justify-center text-lg shadow-sm">
                        ✨
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Answering Infant Comfort Care</h4>
                        <span className="text-[10px] text-emerald-600 font-bold block -mt-0.5">● Gentle Organic Assistant Online</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-slate-50 text-gray-400 border font-bold px-2 py-0.5 rounded-full">Gemini Fast</span>
                  </div>

                  {/* Chat dialog logs */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-2" id="chat-messages-scroll">
                    {messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-2.5 max-w-[85%] text-xs ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 shadow-3xs text-xs font-bold ${
                          msg.sender === "user" ? "bg-brand-blue text-slate-700" : "bg-brand-桃 text-amber-800 bg-[#FDE8E0]"
                        }`}>
                          {msg.sender === "user" ? "ME" : "✨"}
                        </div>

                        {/* Text bubble */}
                        <div className={`p-3 rounded-2xl leading-normal space-y-1 font-medium ${
                          msg.sender === "user" 
                            ? "bg-brand-sage text-white rounded-tr-none shadow-xs" 
                            : "bg-[#FAF8F5] text-brand-dark border border-slate-100 rounded-tl-none whitespace-pre-wrap"
                        }`}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex gap-2.5 max-w-[80%] text-xs mr-auto">
                        <div className="w-7.5 h-7.5 rounded-full bg-brand-peach flex items-center justify-center text-xs font-bold">✨</div>
                        <div className="p-3 bg-[#FAF8F5] border rounded-2xl rounded-tl-none text-gray-400 flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          Consulting cotton advice databases...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message submit form */}
                  <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <input 
                      type="text"
                      placeholder="Ask sleep Tog charts, ribbed seams, tummy safety..."
                      required
                      value={currentChatText}
                      onChange={e => setCurrentChatText(e.target.value)}
                      className="flex-1 bg-[#FAF9F6] border border-gray-200 p-2.5 text-xs rounded-xl outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={chatLoading}
                      className="bg-[#5C524F] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Send size={12} /> Send Advice
                    </button>
                  </form>
                </div>

                {/* Right hand: Cozy Community Discussion board (5 columns) */}
                <div className="xl:col-span-5 bg-white border border-[#F0EDEA] rounded-3xl p-5 shadow-xs flex flex-col h-[520px]">
                  <h4 className="font-serif font-bold text-sm text-[#3E2D20]">Parental Encouragement Community</h4>
                  <p className="text-[11px] text-gray-500 mb-4 leading-normal">
                    Share sleeping victories, milestone photographs, or ask other mothers about correct bamboo wash routines.
                  </p>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4" id="community-posts-scroll">
                    {communityPosts.map(post => (
                      <div key={post.id} className="p-3 bg-brand-cream/30 border border-slate-100 rounded-2xl text-xs space-y-2">
                        {/* Author headers */}
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-6.5 h-6.5 rounded-full ${post.avatarColor} font-bold text-[10px] flex items-center justify-center`}>
                              {post.author.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-[#3E2D20] block">{post.author}</span>
                              <span className="text-[9px] text-gray-400 block -mt-0.5">{post.babyAge}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">{post.timestamp}</span>
                        </div>

                        {/* Message content */}
                        <p className="text-slate-600 leading-snug font-medium">{post.content}</p>

                        {/* Like & replies info action panel */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                          <button 
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1 cursor-pointer font-bold select-none ${
                              post.hasLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                            }`}
                          >
                            <Heart size={12} fill={post.hasLiked ? "currentColor" : "none"} /> {post.likes} Likes
                          </button>
                          
                          <span className="text-[10px] text-gray-400">{post.repliesCount} Direct replies</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form to publish sandbox story */}
                  <form onSubmit={handleNewPost} className="pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#95887E] tracking-wider block">Share your sleep victory or story</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Share baby's comfy moments snug inside cotton..."
                        required
                        value={communityText}
                        onChange={e => setCommunityText(e.target.value)}
                        className="flex-1 bg-brand-cream/40 border border-gray-100 p-2 text-xs rounded-xl outline-none"
                      />
                      <button 
                        type="submit"
                        className="bg-brand-sage hover:bg-brand-sage/90 text-white font-bold p-2 text-xs rounded-xl transition-colors shrink-0"
                      >
                        Publish
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: Articles Learning Hub */}
          <div className="bg-white border border-[#F0EDEA] rounded-2xl p-6 shadow-xs space-y-4" id="learning-hub-indexed">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7D6B5D]/85 block">The Lullaby Library</span>
                <h4 className="font-serif font-bold text-base text-brand-dark">Parenting Learning &amp; Safety Hub</h4>
              </div>
              <BookOpen size={20} className="text-brand-sage" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="learning-articles-grid">
              {LEARNING_HUB_CARDS.map(card => (
                <div key={card.id} className="p-4 bg-[#FAF9F6] border border-[#F2ECE4] rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {card.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{card.readTime} read</span>
                  </div>
                  <h5 className="font-serif font-bold text-[#3E2D20] text-xs flex items-center gap-1.5 mt-1">
                    <span>{card.icon}</span> {card.title}
                  </h5>
                  <p className="text-[11px] text-[#5C524F] leading-relaxed whitespace-pre-wrap">{card.content}</p>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* SHOPPING CART OVERLAY DRAMER (Drawer dialog) */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end" id="shopping-cart-drawer">
          <div className="w-full max-w-md bg-white h-full shadow-lg p-6 flex flex-col justify-between" id="drawer-inner">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-brand-sage" />
                  <h4 className="font-serif font-bold text-base text-[#3E2D20]">Organic Comfort Basket</h4>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full border text-xs font-bold bg-[#FAF9F6] hover:bg-[#FAF6EE] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Items loop */}
              <div className="space-y-4 mt-5 overflow-y-auto max-h-[420px]" id="basket-items-scroll">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400 space-y-2">
                    <span className="text-4xl block">🧺</span>
                    <p className="font-bold">Your basket lies empty.</p>
                    <p className="max-w-[190px] mx-auto text-[10px] text-gray-400">Add expert recommended GOTS fabrics matching Leo's sizing needs!</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={item.product.id + "-" + index} className="p-3 bg-brand-cream/35 border border-slate-100 rounded-xl flex gap-3 text-xs">
                      <div className="w-14 h-14 bg-white border rounded-lg overflow-hidden shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h5 className="font-bold text-[#3E2D20] line-clamp-1">{item.product.name}</h5>
                        <p className="text-[10px] text-gray-400 font-semibold">Size Ordered: {item.selectedSize}</p>
                        
                        <div className="flex justify-between items-center pt-1.5">
                          <span className="font-bold text-slate-800">${item.product.price} • qty {item.quantity}</span>
                          <button 
                            onClick={() => handleRemoveFromCart(index)}
                            className="text-red-500 font-bold hover:underline py-0.5 px-2 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total count checkout actions */}
            {cart.length > 0 && (
              <div className="border-t border-[#F2ECE4] pt-5 space-y-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Carbon-Neutral Sizing Bundle:</span>
                  <span>Calculated Automatically</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-slate-800">
                  <span>Cozy Total Summary:</span>
                  <span>${calculateTotal()}.00</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#5C524F] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Confirm simulated organic purchase (${calculateTotal()}.00)
                </button>
                <span className="text-[9px] uppercase font-bold text-gray-400 text-center tracking-wider block">
                  🛡️ 100% Cotton guarantee and free size replacement exchanges active
                </span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER COZY BRAND SYSTEM */}
      <footer className="bg-[#FAF6EE] border-t border-[#EFEDE6] py-10 px-4 mt-12 text-center text-xs text-[#8F8175] space-y-3 relative z-10" id="brand-cozy-footer">
        <p className="font-bold">Lullaby &amp; Cotton Co. Ltd • Powered by Pediatrics &amp; GOTS Combed Cotton Fibers</p>
        <p className="max-w-md mx-auto text-[10px] text-gray-400 leading-normal">
          Designed with comfort in mind. Our predictions represent estimates from WHO weight milestones. Always verify with actual care providers if you see persistent lethargy or unusual sweat responses.
        </p>
        <div className="flex justify-center gap-6 text-[10px] font-bold text-brand-sage mt-2">
          <a href="#" onClick={() => { setActiveTab("dashboard"); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:underline">Dashboard Overview</a>
          <a href="#" onClick={() => { setActiveTab("boutique"); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:underline">Explore Organic Wardrobes</a>
          <a href="#" onClick={() => { setActiveTab("sleep"); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:underline">Sleep Sound Synth</a>
        </div>
      </footer>

    </div>
  );
}
