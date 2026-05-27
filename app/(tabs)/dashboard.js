import { useState, useEffect } from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Modal, FlatList, ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../config/api";

// ── Constants ─────────────────────────────────────────────
const RIASEC_META = {
  realistic:     { label: "Realistic",     code: "R", emoji: "🔧", color: "#dbeafe", accent: "#2563eb" },
  investigative: { label: "Investigative", code: "I", emoji: "🔬", color: "#dcfce7", accent: "#16a34a" },
  artistic:      { label: "Artistic",      code: "A", emoji: "🎨", color: "#f3e8ff", accent: "#9333ea" },
  social:        { label: "Social",        code: "S", emoji: "🤝", color: "#ffedd5", accent: "#ea580c" },
  enterprising:  { label: "Enterprising",  code: "E", emoji: "🚀", color: "#fef9c3", accent: "#ca8a04" },
  conventional:  { label: "Conventional",  code: "C", emoji: "📋", color: "#dcfce7", accent: "#15803d" },
};

const RIASEC_DESC = {
  realistic:     "You prefer hands-on, practical work with tools, machines, or nature.",
  investigative: "You enjoy analytical problem-solving and intellectual exploration.",
  artistic:      "You are imaginative and expressive, thriving in creative environments.",
  social:        "You enjoy helping and teaching others. Empathetic and service-oriented.",
  enterprising:  "You are persuasive and energetic, drawn to leadership and business.",
  conventional:  "You excel in structured, orderly work — data management and administration.",
};

const BIGFIVE_META = {
  openness:          { label: "Openness",          abbr: "O", low: "Practical & conventional",  high: "Curious & imaginative"   },
  conscientiousness: { label: "Conscientiousness", abbr: "C", low: "Flexible & spontaneous",    high: "Organized & disciplined" },
  extraversion:      { label: "Extraversion",      abbr: "E", low: "Reflective & reserved",     high: "Energetic & sociable"    },
  agreeableness:     { label: "Agreeableness",     abbr: "A", low: "Direct & competitive",      high: "Cooperative & empathetic"},
  neuroticism:       { label: "Neuroticism",        abbr: "N", low: "Calm & resilient",          high: "Sensitive & reactive"    },
};

const APTITUDE_META = {
  math:     { label: "Math",     emoji: "🔢", accent: "#2563eb" },
  english:  { label: "English",  emoji: "📖", accent: "#9333ea" },
  science:  { label: "Science",  emoji: "⚗️", accent: "#16a34a" },
  abstract: { label: "Abstract", emoji: "🧩", accent: "#ca8a04" },
};

const MEDAL = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

// ── Helpers ───────────────────────────────────────────────
function traitLevel(mean) {
  if (mean >= 4.0) return "High";
  if (mean >= 2.5) return "Medium";
  return "Low";
}
function traitColor(level) {
  return level === "High" ? "#16a34a" : level === "Medium" ? "#ca8a04" : "#94a3b8";
}
function traitBg(level) {
  return level === "High" ? "#dcfce7" : level === "Medium" ? "#fef9c3" : "#f1f5f9";
}

// ── Calendar ──────────────────────────────────────────────
function CalendarWidget() {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();
  const year  = current.getFullYear();
  const month = current.getMonth();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels  = ["M","T","W","T","F","S","S"];
  const firstDay   = new Date(year, month, 1).getDay();
  const offset     = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <View style={s.calWidget}>
      <View style={s.calHeader}>
        <Text style={s.calMonth}>{monthNames[month]} {year}</Text>
        <View style={s.calNav}>
          <TouchableOpacity onPress={() => setCurrent(new Date(year, month - 1, 1))} style={s.calNavBtn}>
            <Text style={s.calNavText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrent(new Date(year, month + 1, 1))} style={s.calNavBtn}>
            <Text style={s.calNavText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.calGrid}>
        {dayLabels.map((d, i) => (
          <Text key={i} style={s.calDayLabel}>{d}</Text>
        ))}
        {cells.map((d, i) => (
          <View key={i} style={[s.calCell, isToday(d) && s.calToday]}>
            {d !== null && (
              <Text style={[s.calCellText, isToday(d) && s.calTodayText]}>{d}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ── RIASEC Section ────────────────────────────────────────
function RIASECSection({ riasec_raw }) {
  const [expanded, setExpanded] = useState(null);
  const sorted  = Object.entries(riasec_raw).sort((a, b) => b[1] - a[1]);
  const topKeys = sorted.slice(0, 3).map(([k]) => k);

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <Text style={s.panelIcon}>🧭</Text>
        <Text style={s.panelTitle}>RIASEC Interest Profile</Text>
        <View style={s.panelBadge}>
          <Text style={s.panelBadgeText}>
            Top 3: {topKeys.map(k => RIASEC_META[k]?.code).join("")}
          </Text>
        </View>
      </View>

      {sorted.map(([key, raw]) => {
        const meta  = RIASEC_META[key];
        const pct   = Math.round((raw / 30) * 100);
        const isTop = topKeys.includes(key);
        const open  = expanded === key;

        return (
          <View key={key}>
            <View style={[s.riasecRow, isTop && s.riasecRowTop]}>
              <Text style={s.riasecEmoji}>{meta.emoji}</Text>
              <View style={s.riasecLabelCol}>
                <Text style={[s.riasecCode, { color: isTop ? meta.accent : "#94a3b8" }]}>
                  {meta.code} — {meta.label}
                </Text>
                <View style={s.riasecBarTrack}>
                  <View style={[s.riasecBarFill, {
                    width: `${pct}%`,
                    backgroundColor: isTop ? meta.accent : "#e2e8f0",
                  }]} />
                </View>
              </View>
              <Text style={[s.riasecScore, { color: isTop ? meta.accent : "#94a3b8" }]}>
                {raw}<Text style={s.riasecMax}>/30</Text>
              </Text>
              <TouchableOpacity onPress={() => setExpanded(open ? null : key)} style={s.chevronBtn}>
                <Text style={s.chevronText}>{open ? "▲" : "▼"}</Text>
              </TouchableOpacity>
            </View>
            {open && (
              <View style={[s.expandedDesc, { borderLeftColor: meta.accent, backgroundColor: meta.color }]}>
                <Text style={s.expandedDescText}>{RIASEC_DESC[key]}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── Big Five Section ──────────────────────────────────────
function BigFiveSection({ bigfive_raw }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <Text style={s.panelIcon}>🧠</Text>
        <Text style={s.panelTitle}>Big Five Personality</Text>
      </View>
      <View style={s.bfGrid}>
        {Object.entries(bigfive_raw).map(([trait, mean]) => {
          const meta  = BIGFIVE_META[trait];
          const level = traitLevel(mean);
          const pct   = Math.round(((mean - 1) / 4) * 100);
          const open  = expanded === trait;

          return (
            <View key={trait} style={[s.bfCard, open && s.bfCardOpen]}>
              <View style={s.bfCardTop}>
                <View style={s.bfLabelRow}>
                  <View style={[s.bfAbbr, { backgroundColor: traitBg(level) }]}>
                    <Text style={[s.bfAbbrText, { color: traitColor(level) }]}>{meta.abbr}</Text>
                  </View>
                  <Text style={s.bfName}>{meta.label}</Text>
                </View>
                <View style={[s.bfLevelBadge, { backgroundColor: traitBg(level) }]}>
                  <Text style={[s.bfLevelText, { color: traitColor(level) }]}>{level}</Text>
                </View>
              </View>
              <View style={s.bfBarTrack}>
                <View style={[s.bfBarFill, { width: `${pct}%`, backgroundColor: traitColor(level) }]} />
              </View>
              <TouchableOpacity onPress={() => setExpanded(open ? null : trait)} style={s.bfExpandBtn}>
                <Text style={s.bfExpandText}>{open ? "Hide details ▲" : "What this means ▼"}</Text>
              </TouchableOpacity>
              {open && (
                <View style={s.bfDetail}>
                  <Text style={s.bfSpectrumLow}>{meta.low}</Text>
                  <Text style={s.bfSpectrumArrow}> ↔ </Text>
                  <Text style={s.bfSpectrumHigh}>{meta.high}</Text>
                  <Text style={s.bfInterpretation}>
                    {level === "High"
                      ? `Your ${meta.label.toLowerCase()} is high — ${meta.high.toLowerCase()}.`
                      : level === "Low"
                      ? `Your ${meta.label.toLowerCase()} is low — ${meta.low.toLowerCase()}.`
                      : `You score in the middle range for ${meta.label.toLowerCase()}.`}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Aptitude Section ──────────────────────────────────────
function AptitudeSection({ aptitude_pct }) {
  const sorted = Object.entries(aptitude_pct).sort((a, b) => b[1] - a[1]);

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <Text style={s.panelIcon}>📚</Text>
        <Text style={s.panelTitle}>Aptitude Scores</Text>
        <View style={s.panelBadge}>
          <Text style={s.panelBadgeText}>12 questions per subject</Text>
        </View>
      </View>
      <View style={s.aptGrid}>
        {sorted.map(([subj, pct]) => {
          const meta    = APTITUDE_META[subj];
          const correct = Math.round((pct / 100) * 12);
          return (
            <View key={subj} style={s.aptCard}>
              <Text style={s.aptEmoji}>{meta.emoji}</Text>
              <Text style={s.aptLabel}>{meta.label}</Text>
              <Text style={[s.aptScore, { color: meta.accent }]}>
                {correct}<Text style={s.aptMax}>/12</Text>
              </Text>
              <View style={s.aptBarTrack}>
                <View style={[s.aptBarFill, { width: `${pct}%`, backgroundColor: meta.accent }]} />
              </View>
              <Text style={[s.aptPct, { color: meta.accent }]}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Course Section ────────────────────────────────────────
function CourseSection({ recommendations }) {
  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <Text style={s.panelIcon}>🎯</Text>
        <Text style={s.panelTitle}>Top Recommended Courses</Text>
        <View style={s.panelBadge}>
          <Text style={s.panelBadgeText}>ML-ranked by fit</Text>
        </View>
      </View>
      {recommendations.map((item, i) => {
        const conf  = item.confidence;
        const color = conf >= 30 ? "#16a34a" : conf >= 15 ? "#ca8a04" : "#94a3b8";
        const bg    = conf >= 30 ? "#dcfce7" : conf >= 15 ? "#fef9c3" : "#f1f5f9";

        return (
          <View key={i} style={[s.courseRow, i === 0 && s.courseRowTop]}>
            <Text style={s.courseMedal}>{MEDAL[i] || `${i + 1}.`}</Text>
            <Text style={s.courseName}>{item.course}</Text>
            <View style={[s.confBadge, { backgroundColor: bg }]}>
              <Text style={[s.confBadgeText, { color }]}>{conf}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Quick Stats Card ──────────────────────────────────────
function QuickStats({ result }) {
  const topRIASEC = Object.entries(result.scores.riasec_raw)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => RIASEC_META[k]?.code)
    .join("");
  const bestSubject = APTITUDE_META[
    Object.entries(result.scores.aptitude_pct).sort((a, b) => b[1] - a[1])[0]?.[0]
  ]?.label;
  const topCourse = result.recommendations[0]?.course?.replace(/^BS /, "");
  const topConf   = result.recommendations[0]?.confidence;

  return (
    <View style={s.quickStats}>
      <Text style={s.quickStatsTitle}>Quick Stats</Text>
      {[
        { label: "Top RIASEC",   value: topRIASEC },
        { label: "Best Subject", value: bestSubject },
        { label: "Top Course",   value: topCourse },
        { label: "Confidence",   value: `${topConf}%` },
      ].map(({ label, value }) => (
        <View key={label} style={s.qsRow}>
          <Text style={s.qsLabel}>{label}</Text>
          <Text style={s.qsValue} numberOfLines={1}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

// ── History Modal ─────────────────────────────────────────
function HistoryModal({ visible, onClose, token }) {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!visible || !token) return;
    setLoading(true);
    fetch(`${API}/api/assessment/results/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [visible, token]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.historyPanel}>
          <View style={s.historyHeader}>
            <Text style={s.historyTitle}>Assessment History</Text>
            <TouchableOpacity onPress={onClose} style={s.historyCloseBtn}>
              <Text style={s.historyCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={s.historyEmpty}>
              <ActivityIndicator color="#4da3f5" />
              <Text style={s.historyEmptyText}>Loading history…</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={s.historyEmpty}>
              <Text style={s.historyEmptyIcon}>📭</Text>
              <Text style={s.historyEmptyText}>No previous assessments yet.</Text>
              <Text style={s.historyEmptySub}>Each time you submit, results are saved here.</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              renderItem={({ item }) => (
                <View style={s.historyEntry}>
                  <View style={s.historyEntryHeader}>
                    <Text style={s.historyDate}>
                      {new Date(item.submittedAt).toLocaleDateString("en-PH", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </Text>
                    <View style={s.historyStrandBadge}>
                      <Text style={s.historyStrandText}>{item.strand}</Text>
                    </View>
                  </View>
                  {(item.recommendations || []).slice(0, 3).map((r, j) => (
                    <View key={j} style={s.historyCourseRow}>
                      <Text style={s.historyCourseName}>{r.course}</Text>
                      <Text style={s.historyCourseScore}>{r.confidence}%</Text>
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [result,          setResult]          = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [historyVisible,  setHistoryVisible]  = useState(false);
  const [token,           setToken]           = useState(null);
  const [userName,        setUserName]        = useState("Student");

  useEffect(() => {
    (async () => {
      const t    = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      if (!t) { router.replace("/"); return; }
      setToken(t);
      if (user) {
        try { setUserName(JSON.parse(user)?.username || "Student"); } catch {}
      }

      try {
        const res = await fetch(`${API}/api/assessment/results/latest`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.status === 404) { setResult(null); return; }
        if (!res.ok) throw new Error("Failed to load results.");
        const data = await res.json();
        setResult(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const hasResults = !!result;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hi, {userName}! 👋</Text>
          <Text style={s.headerSub}>Welcome back to Coursify</Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.historyBtn} onPress={() => setHistoryVisible(true)}>
            <Text style={s.historyBtnText}>🕐</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Top bar info */}
        <Text style={s.pageTitle}>Dashboard</Text>
        <Text style={s.pageSub}>
          {hasResults
            ? `Last assessment · Strand: ${result.strand} · ${new Date(result.submittedAt).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}`
            : "Complete the assessment to unlock your full profile."}
        </Text>

        {/* Loading */}
        {loading && (
          <View style={s.loadingBox}>
            <ActivityIndicator color="#4da3f5" size="large" />
            <Text style={s.loadingText}>Loading your profile…</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && !error && !hasResults && (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>📋</Text>
            <Text style={s.emptyTitle}>No assessment results yet</Text>
            <Text style={s.emptySub}>
              Take the assessment so we can build your full profile — RIASEC, Big Five, aptitude scores, and personalized course recommendations.
            </Text>
            <TouchableOpacity style={s.startBtn} onPress={() => router.push("/(tabs)/assessment")}>
              <Text style={s.startBtnText}>Start Assessment →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Full profile */}
        {!loading && !error && hasResults && (() => {
          const { scores, recommendations } = result;
          return (
            <>
              <QuickStats result={result} />
              <RIASECSection   riasec_raw   ={scores.riasec_raw}   />
              <BigFiveSection  bigfive_raw  ={scores.bigfive_raw}  />
              <AptitudeSection aptitude_pct ={scores.aptitude_pct} />
              <CourseSection   recommendations={recommendations}   />
              <TouchableOpacity style={s.retakeBtn} onPress={() => router.push("/(tabs)/assessment")}>
                <Text style={s.retakeBtnText}>Retake Assessment</Text>
              </TouchableOpacity>
            </>
          );
        })()}

        {/* Calendar always visible */}
        <CalendarWidget />

        <View style={{ height: 20 }} />
      </ScrollView>

      <HistoryModal visible={historyVisible} onClose={() => setHistoryVisible(false)} token={token} />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: "#FFFCF3" },

  // Header
  header: { backgroundColor: "#4da3f5", paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting:      { fontSize: 17, fontWeight: "700", color: "white"},
  headerSub:     { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 8 },
  historyBtn:    { backgroundColor: "rgba(255,255,255,0.2)", width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center"},
  historyBtnText:{ fontSize: 18 },


  scroll:        { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  pageTitle:     { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  pageSub:       { fontSize: 12, color: "#94a3b8", marginBottom: 20, lineHeight: 18 },

  // Loading / error
  loadingBox:    { alignItems: "center", paddingVertical: 40, gap: 12 },
  loadingText:   { fontSize: 13, color: "#94a3b8" },
  errorBox:      { backgroundColor: "#fff1f2", borderRadius: 12, padding: 16, marginBottom: 16 },
  errorText:     { fontSize: 13, color: "#be123c" },

  // Empty
  emptyState:    { backgroundColor: "white", borderRadius: 18, padding: 36, alignItems: "center", marginBottom: 20, elevation: 2 },
  emptyIcon:     { fontSize: 44, marginBottom: 12 },
  emptyTitle:    { fontSize: 17, fontWeight: "700", color: "#1e293b", marginBottom: 6 },
  emptySub:      { fontSize: 12, color: "#94a3b8", textAlign: "center", lineHeight: 18, marginBottom: 20 },
  startBtn:      { backgroundColor: "#FBB217", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  startBtnText:  { color: "white", fontWeight: "700", fontSize: 14 },
  retakeBtn:     { alignItems: "center", paddingVertical: 14, marginBottom: 8 },
  retakeBtnText: { color: "#4da3f5", fontSize: 13, fontWeight: "600" },

  // Panel (shared card wrapper)
  panel:         { backgroundColor: "white", borderRadius: 18, padding: 18, marginBottom: 16, elevation: 2 },
  panelHeader:   { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  panelIcon:     { fontSize: 18 },
  panelTitle:    { fontSize: 14, fontWeight: "700", color: "#1e293b", flex: 1 },
  panelBadge:    { backgroundColor: "#f1f5f9", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  panelBadgeText:{ fontSize: 10, color: "#64748b", fontWeight: "600" },

  // RIASEC
  riasecRow:     { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  riasecRowTop:  { },
  riasecEmoji:   { fontSize: 16, width: 24 },
  riasecLabelCol:{ flex: 1 },
  riasecCode:    { fontSize: 11, fontWeight: "700", marginBottom: 4 },
  riasecBarTrack:{ height: 6, backgroundColor: "#f1f5f9", borderRadius: 3, overflow: "hidden" },
  riasecBarFill: { height: "100%", borderRadius: 3 },
  riasecScore:   { fontSize: 13, fontWeight: "700", minWidth: 36, textAlign: "right" },
  riasecMax:     { fontSize: 10, fontWeight: "400", color: "#94a3b8" },
  chevronBtn:    { padding: 4 },
  chevronText:   { fontSize: 10, color: "#94a3b8" },
  expandedDesc:  { borderLeftWidth: 3, borderRadius: 8, padding: 12, marginBottom: 6, marginLeft: 32 },
  expandedDescText:{ fontSize: 12, color: "#475569", lineHeight: 18 },

  // Big Five
  bfGrid:        { gap: 10 },
  bfCard:        { backgroundColor: "#f8fafc", borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: "#e2e8f0" },
  bfCardOpen:    { borderColor: "#4da3f5" },
  bfCardTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  bfLabelRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
  bfAbbr:        { width: 28, height: 28, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  bfAbbrText:    { fontSize: 12, fontWeight: "700" },
  bfName:        { fontSize: 13, fontWeight: "600", color: "#1e293b" },
  bfLevelBadge:  { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  bfLevelText:   { fontSize: 11, fontWeight: "700" },
  bfBarTrack:    { height: 5, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden", marginBottom: 10 },
  bfBarFill:     { height: "100%", borderRadius: 3 },
  bfExpandBtn:   { alignSelf: "flex-start" },
  bfExpandText:  { fontSize: 12, color: "#4da3f5", fontWeight: "600" },
  bfDetail:      { marginTop: 10, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 2 },
  bfSpectrumLow: { fontSize: 11, color: "#94a3b8" },
  bfSpectrumArrow:{ fontSize: 11, color: "#94a3b8" },
  bfSpectrumHigh:{ fontSize: 11, color: "#94a3b8" },
  bfInterpretation:{ fontSize: 12, color: "#475569", lineHeight: 18, marginTop: 6, width: "100%" },

  // Aptitude
  aptGrid:       { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  aptCard:       { backgroundColor: "#f8fafc", borderRadius: 12, padding: 14, alignItems: "center", width: "47%", borderWidth: 1.5, borderColor: "#e2e8f0" },
  aptEmoji:      { fontSize: 22, marginBottom: 4 },
  aptLabel:      { fontSize: 12, fontWeight: "700", color: "#1e293b", marginBottom: 6 },
  aptScore:      { fontSize: 20, fontWeight: "800" },
  aptMax:        { fontSize: 12, fontWeight: "400", color: "#94a3b8" },
  aptBarTrack:   { height: 5, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden", width: "100%", marginVertical: 6 },
  aptBarFill:    { height: "100%", borderRadius: 3 },
  aptPct:        { fontSize: 11, fontWeight: "700" },

  // Courses
  courseRow:     { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f1f5f9", gap: 8 },
  courseRowTop:  { },
  courseMedal:   { fontSize: 18, width: 28 },
  courseName:    { flex: 1, fontSize: 13, color: "#1e293b", fontWeight: "600" },
  confBadge:     { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  confBadgeText: { fontSize: 11, fontWeight: "700" },

  // Quick stats
  quickStats:    { backgroundColor: "white", borderRadius: 18, padding: 18, marginBottom: 16, elevation: 2 },
  quickStatsTitle:{ fontSize: 13, fontWeight: "700", color: "#1e293b", marginBottom: 12 },
  qsRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  qsLabel:       { fontSize: 12, color: "#94a3b8" },
  qsValue:       { fontSize: 12, fontWeight: "700", color: "#1e293b", maxWidth: "60%" },

  // Calendar
  calWidget:     { backgroundColor: "white", borderRadius: 18, padding: 18, marginBottom: 16, elevation: 2 },
  calHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  calMonth:      { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  calNav:        { flexDirection: "row", gap: 4 },
  calNavBtn:     { width: 28, height: 28, backgroundColor: "#f1f5f9", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  calNavText:    { fontSize: 16, color: "#64748b" },
  calGrid:       { flexDirection: "row", flexWrap: "wrap" },
  calDayLabel:   { width: "14.28%", textAlign: "center", fontSize: 12, fontWeight: "700", color: "#94a3b8", paddingVertical: 4 },
  calCell:       { width: "14.28%", justifyContent: "center", alignItems: "center", borderRadius: 8 },
  calCellText:   { fontSize: 13, color: "#475569", paddingVertical: 4 },
  calToday:      { backgroundColor: "#4da3f5" },
  calTodayText:  { color: "white", fontWeight: "800" },

  // History modal
  modalOverlay:  { flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "flex-end" },
  historyPanel:  { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "75%", minHeight: 300 },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  historyTitle:  { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  historyCloseBtn:{ backgroundColor: "#f1f5f9", width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  historyCloseText:{ fontSize: 14, color: "#64748b" },
  historyEmpty:  { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 8 },
  historyEmptyIcon:{ fontSize: 44 },
  historyEmptyText:{ fontSize: 15, fontWeight: "600", color: "#1e293b" },
  historyEmptySub: { fontSize: 12, color: "#94a3b8", textAlign: "center" },
  historyEntry:  { backgroundColor: "#f8fafc", borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: "#e2e8f0" },
  historyEntryHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  historyDate:   { fontSize: 11, color: "#94a3b8" },
  historyStrandBadge:{ backgroundColor: "#4da3f5", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  historyStrandText:{ fontSize: 10, fontWeight: "700", color: "white" },
  historyCourseRow:{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  historyCourseName:{ fontSize: 12, color: "#475569", flex: 1 },
  historyCourseScore:{ fontSize: 11, fontWeight: "700", color: "#4da3f5" },
});