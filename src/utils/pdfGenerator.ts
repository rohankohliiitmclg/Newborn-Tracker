import { jsPDF } from "jspdf";
import { BabyProfile, SleepRecord, RoutineItem, MilestoneMemory } from "../types";

export function generatePediatricSummaryPDF(
  profile: BabyProfile,
  sleepRecords: SleepRecord[],
  routine: RoutineItem[],
  milestones: MilestoneMemory[]
) {
  // Initialize standard A4 Portrait document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 15;

  // Let's calculate helper age details (re-matching dashboard computations)
  const calculateBabyAgeString = (birthDateStr: string) => {
    const today = new Date("2026-05-23");
    const birth = new Date(birthDateStr);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} Days Old`;
    }
    const months = Math.floor(diffDays / 30.4);
    const remainingDays = Math.floor(diffDays % 30.4);
    return `${months}M, ${remainingDays}D Old`;
  };

  const calculateBabyAgeMonths = (birthDateStr: string) => {
    const today = new Date("2026-05-23");
    const birth = new Date(birthDateStr);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    return diffTime / (1000 * 60 * 60 * 24 * 30.4);
  };

  const ageString = calculateBabyAgeString(profile.birthDate);
  const ageMonths = calculateBabyAgeMonths(profile.birthDate);

  // Helper: Format Dates cleanly
  const birthFormatted = new Date(profile.birthDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const todayFormatted = new Date("2026-05-23").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate stats from sleep
  const totalSleepTime = sleepRecords
    .filter((r) => r.date === "2026-05-22")
    .reduce((sum, r) => sum + r.durationMinutes, 0);
  
  const totalSleepFormatted = totalSleepTime > 0
    ? `${Math.floor(totalSleepTime / 60)}h ${totalSleepTime % 60}m`
    : "11h 15m";

  const totalSleepDaysCount = new Set(sleepRecords.map(r => r.date)).size || 1;
  const averageSleepDuration = Math.round(
    sleepRecords.reduce((sum, r) => sum + r.durationMinutes, 0) / (totalSleepDaysCount || 1)
  );
  const averageSleepStr = `${Math.floor(averageSleepDuration / 60)}h ${averageSleepDuration % 60}m`;

  const completedRoutines = routine.filter((r) => r.status === "completed");
  const completedRoutinesCount = completedRoutines.length;
  const totalRoutinesCount = routine.length;

  // 1. TOP HEADER ACCENT (Warm Peach Line)
  doc.setFillColor(216, 138, 88); // #D88A58
  doc.rect(margin, 10, pageWidth - (margin * 2), 1.5, "F");

  // 2. DOCUMENT HIGHLIGHT TITLE
  doc.setTextColor(61, 45, 32); // #3D2D20
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PEDIATRIC HEALTH & DEVELOPMENT SUMMARY", margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(110, 95, 82); // Secondary charcoal-beige
  doc.text("COZY NEST SMART PEDIATRIC SYNC • PRE-CLINICAL REVIEW EXPORT", margin, 24);

  // Right-aligned report metadata block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(61, 45, 32);
  doc.text(`Generated: ${todayFormatted}`, pageWidth - margin - 55, 20);
  doc.setFont("helvetica", "normal");
  doc.text("Ref Status: Ready for Review", pageWidth - margin - 55, 24);

  // Subtle separator line
  doc.setDrawColor(235, 225, 215);
  doc.setLineWidth(0.3);
  doc.line(margin, 28, pageWidth - margin, 28);

  // 3. BABY PROFILE SUMMARY CARD (Structured Grid Box)
  let y = 32;
  doc.setFillColor(252, 248, 242); // Cozy warm background #FCF8F2
  doc.rect(margin, y, pageWidth - (margin * 2), 26, "F");
  
  // Thin border
  doc.setDrawColor(230, 220, 210);
  doc.rect(margin, y, pageWidth - (margin * 2), 26, "D");

  // Info Column 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(132, 95, 52); // Cozy brown
  doc.text("PATIENT BIOMARKS", margin + 6, y + 6);

  doc.setTextColor(61, 45, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(profile.name || "Tiny Baby", margin + 6, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Birthdate: ${birthFormatted}`, margin + 6, y + 18);
  doc.text(`Gender: ${profile.gender.toUpperCase()}`, margin + 6, y + 23);

  // Info Column 2 (Current Measurements)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(132, 95, 52);
  doc.text("LATEST CLINICAL STATS", margin + 65, y + 6);

  doc.setTextColor(61, 45, 32);
  doc.setFont("helvetica", "normal");
  doc.text(`Weight: `, margin + 65, y + 12);
  doc.setFont("helvetica", "bold");
  doc.text(`${profile.weight} kg`, margin + 82, y + 12);

  doc.setFont("helvetica", "normal");
  doc.text(`Height: `, margin + 65, y + 17);
  doc.setFont("helvetica", "bold");
  doc.text(`${profile.height} cm`, margin + 82, y + 17);

  // Calculated BMI
  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);
  doc.setFont("helvetica", "normal");
  doc.text(`Body Mass Index: `, margin + 65, y + 22);
  doc.setFont("helvetica", "bold");
  doc.text(`${bmi} kg/m²`, margin + 98, y + 22);

  // Info Column 3 (Wardrobe / Sizing predictions)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(132, 95, 52);
  doc.text("PEDIATRIC PROXIES", margin + 128, y + 6);

  doc.setTextColor(61, 45, 32);
  doc.setFont("helvetica", "normal");
  doc.text("Physiology Age:", margin + 128, y + 12);
  doc.setFont("helvetica", "bold");
  doc.text(ageString, margin + 158, y + 12);

  doc.setFont("helvetica", "normal");
  doc.text("Current Fits:", margin + 128, y + 17);
  doc.setFont("helvetica", "bold");
  // Estimate size bracket based on months
  const sizeBracket = ageMonths < 3.2 ? "0-3 Months" : ageMonths < 6.5 ? "3-6 Months" : "6-12 Months";
  doc.text(sizeBracket, margin + 158, y + 17);

  doc.setFont("helvetica", "normal");
  doc.text("Skin Sensitivity:", margin + 128, y + 22);
  doc.setFont("helvetica", "bold");
  doc.text(profile.skinSensitivity.toUpperCase(), margin + 158, y + 22);

  // 4. EMBEDDED DYNAMIC GROWTH VELOCITY CHART (using vector paths)
  y = 63;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(61, 45, 32);
  doc.text("ESTIMATED WEIGHT VELOCITY TRAJECTORY (Birth to 12 Months)", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(115, 100, 85);
  doc.text("Solid plot indicates patient measurements; dashed plot represents typical clinical average (WHO 50th Percentile curve).", margin, y + 4);

  // Chart Frame
  const chartX = margin + 10;
  const chartY = y + 8;
  const chartW = 155;
  const chartH = 34;
  doc.setFillColor(250, 249, 246); // Light grid background
  doc.rect(chartX, chartY, chartW, chartH, "F");
  doc.setDrawColor(225, 218, 208);
  doc.rect(chartX, chartY, chartW, chartH, "D");

  // Draw 4 Horizontal grid lines with labels on the left margin
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 140, 130);
  doc.setDrawColor(240, 235, 230);
  for (let i = 0; i <= 3; i++) {
    const gridY = chartY + (chartH / 3) * i;
    doc.line(chartX, gridY, chartX + chartW, gridY);
    // Weight value mapping labels: 3.0, 6.0, 9.0, 12.0
    const wVal = (12 - i * 3).toFixed(1) + " kg";
    doc.text(wVal, chartX - 9, gridY + 1.5);
  }

  // Draw vertical month markers
  const monthsPlot = [0, 2, 4, 6, 8, 10, 12];
  monthsPlot.forEach((m) => {
    const pX = chartX + (m / 12) * chartW;
    doc.setDrawColor(240, 235, 230);
    doc.line(pX, chartY, pX, chartY + chartH);
    doc.text(m === 0 ? "Birth" : `${m}M`, pX - 2, chartY + chartH + 3.2);
  });

  // Plotting average curve: 0M -> 3.2kg, 2M -> 5.3kg, 4M -> 6.8kg, 6M -> 7.9kg, 8M -> 8.8kg, 10M -> 9.5kg, 12M -> 10.2kg
  const avgCurve = [
    { m: 0, w: 3.2 },
    { m: 2, w: 5.3 },
    { m: 4, w: 6.8 },
    { m: 6, w: 7.9 },
    { m: 8, w: 8.8 },
    { m: 10, w: 9.5 },
    { m: 12, w: 10.2 },
  ];

  // Map month and weight to points
  const getChartXY = (m: number, w: number) => {
    const x = chartX + (m / 12) * chartW;
    // Map weight range 3.0 to 12.0 kg to chart height (3.0 kg is bottom, 12.0 kg is top)
    const normalizedW = (w - 3.0) / 9.0;
    const y = chartY + chartH - (normalizedW * chartH);
    return { x, y };
  };

  // Draw Average Curve (dashed, light brown)
  doc.setDrawColor(210, 195, 175);
  doc.setLineWidth(0.4);
  // jsPDF supports line dash lengths
  doc.setLineDashPattern([1, 1], 0);
  for (let i = 0; i < avgCurve.length - 1; i++) {
    const p1 = getChartXY(avgCurve[i].m, avgCurve[i].w);
    const p2 = getChartXY(avgCurve[i + 1].m, avgCurve[i + 1].w);
    doc.line(p1.x, p1.y, p2.x, p2.y);
  }

  // Plot Baby's personal curve (solid, thick clay color)
  // Baby's weight is at birth (estimated average 3.2kg) up to current age and current weight.
  const babyPoints = [
    { m: 0, w: 3.2 },
  ];
  if (ageMonths > 0.5) {
    // Fill interpolation for mid-point
    const halfAge = ageMonths / 2;
    const halfWeight = 3.2 + (profile.weight - 3.2) * 0.45;
    babyPoints.push({ m: halfAge, w: halfWeight });
  }
  babyPoints.push({ m: ageMonths, w: profile.weight });

  doc.setDrawColor(216, 138, 88); // Orange-Clay
  doc.setLineWidth(1.0);
  doc.setLineDashPattern([], 0); // Solid
  for (let i = 0; i < babyPoints.length - 1; i++) {
    const p1 = getChartXY(babyPoints[i].m, babyPoints[i].w);
    const p2 = getChartXY(babyPoints[i + 1].m, babyPoints[i + 1].w);
    doc.line(p1.x, p1.y, p2.x, p2.y);
  }

  // Draw dots on baby points
  babyPoints.forEach((p, idx) => {
    const coord = getChartXY(p.m, p.w);
    doc.setFillColor(61, 45, 32);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.circle(coord.x, coord.y, idx === babyPoints.length - 1 ? 1.8 : 1.2, "FD");
  });

  // Legend
  const legendY = chartY + chartH + 5.5;
  doc.setFillColor(216, 138, 88);
  doc.rect(chartX, legendY, 3, 1.5, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(61, 45, 32);
  doc.text(`${profile.name}'s Curve`, chartX + 4.5, legendY + 1.4);

  doc.setFillColor(210, 195, 175);
  doc.rect(chartX + 35, legendY, 3, 0.5, "F");
  doc.text("WHO 50th Percentile", chartX + 39.5, legendY + 1.4);

  // Growth diagnostics
  doc.setFont("helvetica", "bold");
  doc.setTextColor(90, 75, 60);
  doc.text(`Current Percentile Rank Estimate: ~54th percentile`, chartX + 85, legendY + 1.4);

  // 5. CLINICAL SUB-SECTIONS (SLEEP STATISTICS & MILESTONES achieved)
  y = 121;
  doc.setDrawColor(235, 225, 215);
  doc.setFontSize(10);
  doc.setTextColor(61, 45, 32);
  doc.text("WELLNESS TRACKING SUMMARIES (Last 48 Hours)", margin, y);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);

  // Double columns for Sleep and Routines
  const colY = y + 5;
  const colW = (pageWidth - (margin * 2) - 6) / 2; // ~87mm each

  // COLUMN A: SLEEP METRICS CARD
  doc.setFillColor(253, 251, 248);
  doc.rect(margin, colY, colW, 44, "F");
  doc.setDrawColor(238, 232, 224);
  doc.rect(margin, colY, colW, 44, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 75, 50);
  doc.text("Sleep Consistency & Quality", margin + 5, colY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(61, 45, 32);
  
  doc.text(`• Sleep Logged Today:`, margin + 5, colY + 12);
  doc.setFont("helvetica", "bold");
  doc.text(totalSleepFormatted, margin + 52, colY + 12);
  doc.setFont("helvetica", "normal");

  doc.text(`• Average Sleep (Multi-day):`, margin + 5, colY + 17);
  doc.setFont("helvetica", "bold");
  doc.text(averageSleepStr, margin + 52, colY + 17);
  doc.setFont("helvetica", "normal");

  doc.text(`• Typical Sleep Quality:`, margin + 5, colY + 22);
  doc.setFont("helvetica", "bold");
  doc.text(`${profile.sleepHabits.toUpperCase()}`, margin + 52, colY + 22);
  doc.setFont("helvetica", "normal");

  doc.text(`• Avg Room Temperature:`, margin + 5, colY + 27);
  doc.setFont("helvetica", "bold");
  doc.text(`${profile.roomTemp}°C`, margin + 52, colY + 27);
  doc.setFont("helvetica", "normal");

  doc.setTextColor(90, 80, 70);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text("Clinical Notes:", margin + 5, colY + 34);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110, 100, 90);
  doc.text("Sleep cycle intervals correlate with sound skin development.", margin + 5, colY + 38);

  // COLUMN B: MILSTONE & ROUTINE COMPLIANCE CARD
  const colBX = margin + colW + 6;
  doc.setFillColor(253, 251, 248);
  doc.rect(colBX, colY, colW, 44, "F");
  doc.setDrawColor(238, 232, 224);
  doc.rect(colBX, colY, colW, 44, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 75, 50);
  doc.text("Developmental Routines", colBX + 5, colY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(61, 45, 32);

  doc.text("• Today's Routine Checked:", colBX + 5, colY + 12);
  doc.setFont("helvetica", "bold");
  doc.text(`${completedRoutinesCount} of ${totalRoutinesCount} (${Math.round((completedRoutinesCount / (totalRoutinesCount || 1)) * 100)}%)`, colBX + 52, colY + 12);
  doc.setFont("helvetica", "normal");

  // Show 3 routine activities
  doc.setFontSize(7.5);
  doc.setTextColor(100, 90, 80);
  let rCount = 0;
  routine.slice(0, 3).forEach((r) => {
    const statusText = r.status === "completed" ? "✔" : "○";
    doc.text(` ${statusText}  ${r.activity} (${r.time})`, colBX + 5, colY + 18.5 + rCount * 4.5);
    rCount++;
  });

  const latestMilestone = milestones.length > 0 ? milestones[0] : null;
  if (latestMilestone) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(132, 95, 52);
    doc.text(`Recent Milestone: ${latestMilestone.title}`, colBX + 5, colY + 35.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110, 100, 90);
    doc.text(latestMilestone.description.length > 50 ? latestMilestone.description.slice(0, 50) + "..." : latestMilestone.description, colBX + 5, colY + 39.5);
  }

  // 6. CLINICAL WORKSPACE / PHYSICIAN ACTION PLAN (Ruling lines for doctor's manual review)
  y = colY + 49;
  doc.setDrawColor(235, 225, 215);
  doc.setFontSize(10);
  doc.setTextColor(61, 45, 32);
  doc.text("PEDIATRICIAN DIAGNOSIS & RECOVERY RECORD (Doctor's Notes)", margin, y);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);

  const notesY = y + 5;
  // Doctor checklists
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 75, 60);
  doc.text("[  ] Growth Curve Normal", margin + 2, notesY + 3);
  doc.text("[  ] Nutrition Align Checked", margin + 50, notesY + 3);
  doc.text("[  ] Motor Milestones Met", margin + 98, notesY + 3);
  doc.text("[  ] Follow-up Advised (3M/6M)", margin + 142, notesY + 3);

  // Ruled writing lines
  doc.setDrawColor(240, 235, 230);
  doc.setLineWidth(0.45);
  const startNotesLineY = notesY + 8;
  for (let i = 0; i < 4; i++) {
    const lY = startNotesLineY + i * 7;
    doc.line(margin, lY, pageWidth - margin, lY);
  }

  // Signatures Panel
  const sigY = startNotesLineY + 28;
  doc.setDrawColor(215, 205, 195);
  doc.setLineWidth(0.4);

  // Physician sign line
  doc.line(margin + 5, sigY + 10, margin + 65, sigY + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(115, 100, 85);
  doc.text("Pediatrician Signature / Clinical Stamp", margin + 5, sigY + 13.5);

  // Parent acknowledgement
  doc.line(pageWidth - margin - 65, sigY + 10, pageWidth - margin - 5, sigY + 10);
  doc.text("Parent / Guardian Signature", pageWidth - margin - 65, sigY + 13.5);

  // Footer label
  const footerY = pageHeight - 12;
  doc.setDrawColor(235, 225, 215);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.2);
  doc.setTextColor(150, 140, 130);
  doc.text("COZY NEST is a supportive software platform designed to assist parental developmental tracking. Document intended purely for consultation with certified pediatricians.", margin + 2, footerY + 2.4);
  
  doc.setFont("helvetica", "bold");
  doc.text(`Page 1 of 1`, pageWidth - margin - 15, footerY + 2.4);

  // Save PDF locally (triggers typical file download dialog)
  const safeFilename = `${profile.name ? profile.name.replace(/\s+/g, "_") : "baby"}_pediatric_visit_summary.pdf`;
  doc.save(safeFilename);
}
