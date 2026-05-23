import React from "react";
import { motion } from "motion/react";
import { BabyProfile, SleepRecord, RoutineItem, MilestoneMemory, ClothingItem } from "../types";
import { Sparkles, Calendar, Scale, Ruler, CloudSun, AlertCircle, CheckCircle2, ChevronRight, ShoppingBag, Moon, ShieldAlert, Heart, FileDown } from "lucide-react";
import { generatePediatricSummaryPDF } from "../utils/pdfGenerator";

interface DashboardProps {
  profile: BabyProfile;
  sleepRecords: SleepRecord[];
  routine: RoutineItem[];
  milestones: MilestoneMemory[];
  wardrobe: ClothingItem[];
  onToggleRoutine: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({
  profile,
  sleepRecords,
  routine,
  milestones,
  wardrobe,
  onToggleRoutine,
  onNavigate,
}: DashboardProps) {
  // Calculate baby age dynamically
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
    return `${months} Month${months > 1 ? "s" : ""}, ${remainingDays} Day${remainingDays > 1 ? "s" : ""} Old`;
  };

  const getBabyAgeMonths = (birthDateStr: string) => {
    const today = new Date("2026-05-23");
    const birth = new Date(birthDateStr);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    return diffTime / (1000 * 60 * 60 * 24 * 30.4);
  };

  const ageString = getBabyAgeString(profile.birthDate);
  const ageMonths = getBabyAgeMonths(profile.birthDate);

  // Weather-based parenting suggest
  const getWeatherSuggestion = (temp: number) => {
    if (temp < 18) {
      return {
        label: "Chilly Ambient",
        outfit: "Fleece Outerwear & Swell Beanie",
        tip: "Layering is key today. Dress baby in 2.5 TOG sleepwear for overnight warmth.",
        bg: "bg-blue-50/75 border-blue-100",
        text: "text-blue-800"
      };
    } else if (temp > 24) {
      return {
        label: "Warm Sun",
        outfit: "Breathable Organic Romper",
        tip: "Humidity causes swift perspiration. Opt for loose organic knit clothes with high air-ventilation.",
        bg: "bg-peach-50/75 border-peach-100",
        text: "text-peach-800"
      };
    } else {
      return {
        label: "Mild Breeze",
        outfit: "Ribbed Sleepsuit & Soft Socks",
        tip: "Lovely day! Single-layer long sleeve fine cotton will protect skin barrier beautifully.",
        bg: "bg-emerald-50/75 border-emerald-100",
        text: "text-emerald-800"
      };
    }
  };

  const weatherAdvice = getWeatherSuggestion(profile.roomTemp);

  // Size Forecasting alert
  const getSizeForecast = (months: number, customW: number) => {
    if (months < 1) {
      return { current: "NB", next: "0-3M", daysLeft: 20, weightTarget: 4.5 };
    } else if (months < 3.2) {
      return { current: "0-3M", next: "3-6M", daysLeft: 12, weightTarget: 6.2 };
    } else if (months < 6.5) {
      return { current: "3-6M", next: "6-12M", daysLeft: 18, weightTarget: 8.5 };
    } else {
      return { current: "6-12M", next: "12M+", daysLeft: 25, weightTarget: 11.2 };
    }
  };

  const sizeForecast = getSizeForecast(ageMonths, profile.weight);

  // Wardrobe gap analysis
  const getWardrobeGapAlerts = () => {
    const sizeCategory = sizeForecast.next;
    const matchingItemsInNextSize = wardrobe.filter(item => item.size === sizeCategory).length;
    
    if (matchingItemsInNextSize === 0) {
      return {
        hasGap: true,
        desc: `No outfits found in the upcoming growth size (${sizeCategory}).`,
        suggest: `Grab a 'Nest Bundle' in next size (${sizeCategory}) ahead of time!`
      };
    } else if (matchingItemsInNextSize < 3) {
      return {
        hasGap: true,
        desc: `Only ${matchingItemsInNextSize} wardrobe items in ${sizeCategory}.`,
        suggest: `Add essential warm pajamas and ribbed shirts in ${sizeCategory}.`
      };
    }
    return { hasGap: false, desc: "", suggest: "" };
  };

  const gapAlert = getWardrobeGapAlerts();

  // Short calculation metrics
  const totalSleepTime = sleepRecords
    .filter(r => r.date === "2026-05-22")
    .reduce((sum, r) => sum + r.durationMinutes, 0);
  const totalSleepStr = totalSleepTime > 0 
    ? `${Math.floor(totalSleepTime / 60)}h ${totalSleepTime % 60}m` 
    : "11h 15m";

  const completedRoutinesCount = routine.filter(r => r.status === "completed").length;
  const totalRoutinesCount = routine.length;

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* 1. Hero Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FCF8F2] via-[#F8ECE0]/50 to-[#FCF8F2] border border-[#EFE5D9] p-6 rounded-3xl" id="dashboard-hero">
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <Sparkles size={180} className="text-[#845F34]" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFF2EB] border-2 border-[#FBD8C2] rounded-full flex items-center justify-center text-3xl shadow-sm">
              {profile.gender === "boy" ? "👶🏼" : profile.gender === "girl" ? "👶🏻" : "🐣"}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#9A7D69]/80 block">Welcome, Parent</span>
              <h2 className="text-2xl font-serif font-semibold text-[#3D2D20]">{profile.name || "Tiny Baby"}'s Space</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-[#7D6B5D] flex items-center gap-1 font-medium bg-[#FFF8F2]/60 border border-[#EDDFD0] px-2.5 py-1 rounded-xl">
                  <Calendar size={13} className="text-[#CFA185]" />
                  {ageString} ({new Date(profile.birthDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})})
                </span>
                <button
                  onClick={() => generatePediatricSummaryPDF(profile, sleepRecords, routine, milestones)}
                  className="bg-[#D88A58] hover:bg-[#C17C4F] text-white text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer hover:scale-[1.02] active:scale-100"
                  title="Export pediatrician summary PDF for doctor checkups"
                >
                  <FileDown size={14} /> Export Doctor PDF
                </button>
              </div>
            </div>
          </div>

          {/* Sparkly Tip */}
          <div className="bg-white/80 backdrop-blur-xs border border-[#F2ECE4] p-4 rounded-2xl max-w-sm shadow-2xs">
            <span className="text-xs font-bold text-[#E29A6E] flex items-center gap-1 mb-1">
              <Sparkles size={14} /> AI Daily Tip
            </span>
            <p className="text-xs text-[#5C4F44] leading-relaxed">
              At {Math.floor(ageMonths) || 1} months, sensory focus is paramount. Display contrast patterns and dress {profile.name || "baby"} in premium, combed organic knit loops to foster touch perception.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Core Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-stats">
        {/* Metric Weight */}
        <div className="bg-white border border-[#F3EDE4] p-4 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF1EC] text-[#D88A58] rounded-xl flex items-center justify-center">
            <Scale size={20} />
          </div>
          <div>
            <span className="text-xs text-[#95887E] font-medium block">Weight</span>
            <span className="text-lg font-bold text-[#3D2D20]">{profile.weight} kg</span>
            <span className="text-[10px] text-green-600 font-bold block">+350g this month</span>
          </div>
        </div>

        {/* Metric Height */}
        <div className="bg-white border border-[#F3EDE4] p-4 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EEF2FA] text-[#6384C6] rounded-xl flex items-center justify-center">
            <Ruler size={20} />
          </div>
          <div>
            <span className="text-xs text-[#95887E] font-medium block">Height</span>
            <span className="text-lg font-bold text-[#3D2D20]">{profile.height} cm</span>
            <span className="text-[10px] text-green-600 font-bold block">52nd Percentile</span>
          </div>
        </div>

        {/* Metric Sleep */}
        <div className="bg-white border border-[#F3EDE4] p-4 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF0FA] text-[#A67FC2] rounded-xl flex items-center justify-center">
            <Moon size={20} />
          </div>
          <div>
            <span className="text-xs text-[#95887E] font-medium block">Sleep Today</span>
            <span className="text-lg font-bold text-[#3D2D20]">{totalSleepStr}</span>
            <span className="text-[10px] text-[#A67FC2] font-semibold block">3 logged sessions</span>
          </div>
        </div>

        {/* Routine Metric */}
        <div className="bg-white border border-[#F3EDE4] p-4 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F1FAF4] text-[#55AC76] rounded-xl flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-xs text-[#95887E] font-medium block">Routine Progress</span>
            <span className="text-lg font-bold text-[#3D2D20]">{completedRoutinesCount}/{totalRoutinesCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">
              {Math.round((completedRoutinesCount / totalRoutinesCount) * 100)}% completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Divided in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-grid">
        {/* Left Hand: Weather Care & Growth Predict */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 2. Weathercare recommendation widget */}
          <div className={`p-5 rounded-2xl border ${weatherAdvice.bg} shadow-2xs`} id="weather-integration">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                  ⛅
                </div>
                <div>
                  <h3 className="font-bold text-[#3D2D20] flex items-center gap-2">
                    {profile.location} Weather Integrated
                    <span className="text-[11px] font-semibold bg-white/70 px-2 py-0.5 rounded-full text-amber-700">Live Suggestions</span>
                  </h3>
                  <p className="text-xs text-[#6B5A4E] mt-0.5">
                    Temperature is <span className="font-bold">{profile.roomTemp}°C</span> (Indoors: <span className="font-semibold">{profile.roomTemp - 1}°C</span>) • Sensitivity: <span className="font-semibold">{profile.skinSensitivity}</span>
                  </p>
                </div>
              </div>
              <CloudSun className="text-amber-500 shrink-0" size={28} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#EDE5D9]/40">
              <div className="p-3 bg-white/60 rounded-xl">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7D6B5D]/80 block">Recommended Outfit Combo</span>
                <span className="text-xs font-bold text-[#4A3D34] block mt-0.5">{weatherAdvice.outfit}</span>
                <span className="text-[10px] text-gray-500 block">We recommend fine GOTS combed yarns.</span>
              </div>
              <div className="p-3 bg-white/60 rounded-xl">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7D6B5D]/80 block">Nurturing Guideline</span>
                <p className="text-xs text-[#4A3D34] leading-normal font-medium mt-0.5">{weatherAdvice.tip}</p>
              </div>
            </div>
          </div>

          {/* 3. Size Growth Forecaster */}
          <div className="bg-white border border-[#F3EDE4] p-5 rounded-2xl shadow-2xs" id="growth-forecaster">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3D2D20] flex items-center gap-2">
                  Smart Size Forecaster
                </h3>
                <p className="text-xs text-[#807064]">Predict fitting spans based on pediatric growth velocity charts</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generatePediatricSummaryPDF(profile, sleepRecords, routine, milestones)}
                  className="bg-white hover:bg-[#FAF6F0] text-[#3D2D20] border border-[#E2CCA8]/60 text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer hover:scale-[1.02] active:scale-100"
                  title="Export pediatric visit summary PDF for physician checkups"
                >
                  <FileDown size={14} className="text-[#D88A58]" /> Export Visit PDF
                </button>
                <span className="hidden sm:flex bg-[#FFF2EB] text-[#E29A6E] text-xs font-bold px-3 py-1 rounded-full items-center gap-1">
                  <Sparkles size={12} /> Predictive Engine
                </span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#F2EDE4] p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 justify-between mb-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 block font-semibold">Predicted Change Velocity</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-extrabold text-[#E29A6E]">{sizeForecast.current}</span>
                  <span className="text-xs text-gray-400">to</span>
                  <span className="font-serif text-3xl font-extrabold text-[#95C2E2]">{sizeForecast.next}</span>
                </div>
              </div>

              <div className="flex-1 max-w-xs w-full">
                <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Size Forecast Interval</span>
                  <span className="text-[#E29A6E] font-bold">{sizeForecast.daysLeft} days left</span>
                </div>
                {/* Visual Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#E29A6E] to-[#95C2E2] h-full rounded-full" 
                    style={{ width: `${Math.max(10, 100 - (sizeForecast.daysLeft * 3.5))}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1 hover:underline">
                  Forecast based on weight velocity to hit {sizeForecast.weightTarget} kg
                </span>
              </div>

              <button 
                onClick={() => onNavigate("boutique")}
                className="bg-[#3D2D20] text-[#FCFBF7] text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-[#523E2E] transition-all flex items-center gap-1"
              >
                Stock Next Size <ChevronRight size={14} />
              </button>
            </div>

            {/* Smart Size alert warning if wardrobe gaps are detected */}
            {gapAlert.hasGap && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200/50 rounded-xl">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-950 block">Upcoming Nesting Gap Detected!</span>
                  <p className="text-amber-900/90 leading-tight mt-0.5">{gapAlert.desc} {gapAlert.suggest}</p>
                </div>
              </div>
            )}

            {/* Simple Graphic SVG Chart showing Height & Weight Predictions */}
            <div className="mt-5 pt-4 border-t border-[#F2EDE4] space-y-3">
              <span className="text-xs font-bold text-[#3D2D20] block">Estimated Growth Curve (0 - 12 Months)</span>
              
              <div className="h-44 relative bg-[#FAF9F6] border border-[#F3EDE4] rounded-xl p-3 flex flex-col justify-between">
                {/* Grid guidelines */}
                <div className="absolute inset-0 grid grid-rows-3 p-3 pointer-events-none">
                  <div className="border-b border-gray-100 w-full opacity-60"></div>
                  <div className="border-b border-gray-100 w-full opacity-60"></div>
                  <div className="border-b border-gray-100 w-full opacity-60"></div>
                </div>

                {/* SVG Graph */}
                <svg className="w-full h-full absolute inset-0 p-3 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Standard Curve Guideline */}
                  <path 
                    d="M 5,90 Q 25,60 50,45 T 95,15" 
                    fill="none" 
                    stroke="#E2CCA8" 
                    strokeWidth="1.5" 
                    strokeDasharray="3,3" 
                  />
                  {/* Personal Baby growth */}
                  <motion.path 
                    d={`M 5,90 Q 25,${90 - (ageMonths * 8)} 50,${90 - (ageMonths * 13)}`} 
                    fill="none" 
                    stroke="#D88A58" 
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    id="baby-height-path"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                  
                  {/* Target Node indicator */}
                  <motion.circle 
                    cx={`50`} 
                    cy={`${90 - (ageMonths * 13)}`} 
                    r="4.5" 
                    fill="#3D2D20" 
                    stroke="#FFF" 
                    strokeWidth="1.5" 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 120, damping: 10 }}
                  />
                </svg>

                {/* Legend for the graph */}
                <div className="relative z-10 flex justify-between items-end h-full">
                  <div className="text-[9px] text-gray-400 font-medium">Brt</div>
                  <div className="text-[10px] text-[#D88A58] font-extrabold bg-white/95 px-2 py-0.5 rounded-md border border-slate-100 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D88A58]"></span> Now (Age {Math.round(ageMonths * 10) / 10}M)
                  </div>
                  <div className="text-[9px] text-gray-400 font-medium">12M</div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-medium px-1">
                <span>Weight Velocity Trajectory (solid line indicates measured metrics)</span>
                <span>Average Growth Band (dotted)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Hand: Today's Interactive Routines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Nesting Card */}
          <div className="bg-[#FAF5EC] border-2 border-[#EFE2D2] p-5 rounded-2xl flex flex-col justify-between shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 opacity-10 pointer-events-none select-none">
              <ShoppingBag size={120} className="text-[#3D2D20]" />
            </div>
            
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] uppercase font-bold text-[#A48261] tracking-wider block">Cozy Shopping Gift</span>
              <h4 className="font-serif font-bold text-base text-[#3E2D20]">Boutique Subscription Box</h4>
              <p className="text-xs text-[#7A6B5F] leading-snug">
                Receive organic pieces adjusted each month as {profile.name || "baby"} sizes up. Cancel or pause anytime with single tap.
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between relative z-10 pt-3 border-t border-[#EFE2D2]">
              <span className="text-xs font-extrabold text-[#3E2D20]">$39.00 <span className="text-[10px] text-[#A48261] font-normal">/ month</span></span>
              <button 
                onClick={() => onNavigate("boutique")}
                className="bg-[#3D2D20] text-[#FAF5EC] text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-[#523E2E] transition-colors"
              >
                Join Nest Club
              </button>
            </div>
          </div>

          {/* Today's interactive Routine Checkbox */}
          <div className="bg-white border border-[#F3EDE4] p-5 rounded-2xl shadow-2xs" id="routine-planner-panel">
            <div className="flex items-center justify-between mb-3 border-b border-[#FAF9F6] pb-2">
              <h4 className="font-serif font-semibold text-base text-[#3E2D20]">Daily Cozy Routine</h4>
              <span className="text-xs font-extrabold text-[#7D6B5D] bg-[#FDFBF7] border px-2 py-0.5 rounded-full">
                {completedRoutinesCount}/{totalRoutinesCount}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mb-4 leading-normal">
              Gentle schedules adapt naturally. Uncheck or check tasks to track comfortable milestones.
            </p>

            <div className="space-y-3">
              {routine.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onToggleRoutine(item.id)}
                  className={`p-3 rounded-xl border ${
                    item.status === "completed" 
                      ? "bg-[#FAF8F5]/80 border-slate-100 opacity-60" 
                      : "bg-white border-[#F3EDE4] hover:bg-[#FAF8F5] cursor-pointer"
                  } transition-all flex items-start gap-2.5`}
                >
                  <button 
                    className={`shrink-0 w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                      item.status === "completed" 
                        ? "bg-slate-800 border-slate-800 text-white" 
                        : "border-[#C9BEB2]"
                    }`}
                  >
                    {item.status === "completed" && <span className="text-[9px]">✓</span>}
                  </button>
                  
                  <div className="text-xs flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`font-bold ${item.status === "completed" ? "line-through text-gray-400" : "text-[#4A3D34]"}`}>
                        {item.activity}
                      </span>
                      <span className="text-[10px] text-[#A6998C] font-semibold font-mono">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.guidance}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2EDE4]/65">
              <p className="text-[10px] italic text-[#95887E] text-center">
                “Perfect baby growth is a series of wonderful soft moments, not checklists.”
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
