import { useEffect, useState } from "react";
import {View, Text, ScrollView, TouchableOpacity, TextInput,StyleSheet, StatusBar, ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../config/api";

// ── Constants ─────────────────────────────────────────────────────────────────

const RIASEC_META = {
  realistic:     { code: "R", label: "Realistic",     emoji: "🔧", color: "#3b82f6" },
  investigative: { code: "I", label: "Investigative", emoji: "🔬", color: "#10b981" },
  artistic:      { code: "A", label: "Artistic",      emoji: "🎨", color: "#8b5cf6" },
  social:        { code: "S", label: "Social",        emoji: "🤝", color: "#f59e0b" },
  enterprising:  { code: "E", label: "Enterprising",  emoji: "🚀", color: "#ef4444" },
  conventional:  { code: "C", label: "Conventional",  emoji: "📋", color: "#14b8a6" },
};

const BIGFIVE_META = {
  openness:          { label: "Openness",          abbr: "O", color: "#8b5cf6" },
  conscientiousness: { label: "Conscientiousness", abbr: "C", color: "#3b82f6" },
  extraversion:      { label: "Extraversion",      abbr: "E", color: "#f59e0b" },
  agreeableness:     { label: "Agreeableness",     abbr: "A", color: "#10b981" },
  neuroticism:       { label: "Neuroticism",       abbr: "N", color: "#ef4444" },
};

const APTITUDE_META = {
  math:     { label: "Math",     emoji: "🔢", color: "#3b82f6" },
  english:  { label: "English",  emoji: "📖", color: "#8b5cf6" },
  science:  { label: "Science",  emoji: "⚗️", color: "#10b981" },
  abstract: { label: "Abstract", emoji: "🧩", color: "#f59e0b" },
};

const MEDAL = ["🥇", "🥈", "🥉"];
const TABS = [
  { key: "courses",  label: "🎯 Courses" },
  { key: "riasec",   label: "🧭 RIASEC" },
  { key: "bigfive",  label: "🧠 Big Five" },
  { key: "aptitude", label: "📚 Aptitude" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function traitLevel(mean) {
  if (mean >= 4.0) return "High";
  if (mean >= 2.5) return "Medium";
  return "Low";
}

function levelColor(level) {
  if (level === "High")   return { text: "#16a34a", bg: "#dcfce7" };
  if (level === "Medium") return { text: "#ca8a04", bg: "#fef9c3" };
  return                         { text: "#64748b", bg: "#f1f5f9" };
}

// ── ScoreTabs ─────────────────────────────────────────────────────────────────

function ScoreTabs({ entry }) {
  const [tab, setTab] = useState("courses");

  return (
    <View>
      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={hs.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[hs.tabBtn, tab === t.key && hs.tabBtnActive]}
          >
            <Text style={[hs.tabBtnText, tab === t.key && hs.tabBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Courses */}
      {tab === "courses" && (
        <View style={hs.panel}>
          {(entry.recommendations || []).map((r, i) => (
            <View key={i} style={[hs.courseRow, i === 0 && hs.courseRowTop]}>
              <Text style={hs.medal}>{MEDAL[i] || `${i + 1}.`}</Text>
              <Text style={hs.courseName} numberOfLines={2}>{r.course}</Text>
              <View style={hs.barWrap}>
                <View style={hs.barTrack}>
                  <View style={[hs.barFill, { width: `${Math.min(r.confidence * 2, 100)}%`, backgroundColor: "#4da3f5" }]} />
                </View>
                <Text style={hs.barPct}>{r.confidence}%</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* RIASEC */}
      {tab === "riasec" && (
        <View style={hs.panel}>
          <Text style={hs.panelNote}>Scores out of 30 · Top 3 highlighted</Text>
          {Object.entries(entry.scores?.riasec_raw || {})
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) => {
              const meta = RIASEC_META[key];
              const pct  = Math.round((val / 30) * 100);
              const isTop = i < 3;
              return (
                <View key={key} style={[hs.riasecRow, isTop && hs.riasecRowTop]}>
                  <View style={hs.riasecLabel}>
                    <Text style={hs.riasecEmoji}>{meta.emoji}</Text>
                    <Text style={[hs.riasecCode, { color: isTop ? meta.color : "#94a3b8" }]}>{meta.code}</Text>
                    <Text style={hs.riasecName}>{meta.label}</Text>
                    {i === 0 && <View style={hs.topBadge}><Text style={hs.topBadgeText}>Top</Text></View>}
                  </View>
                  <View style={hs.riasecBarWrap}>
                    <View style={hs.barTrack}>
                      <View style={[hs.barFill, { width: `${pct}%`, backgroundColor: isTop ? meta.color : "#e2e8f0" }]} />
                    </View>
                    <Text style={[hs.riasecScore, { color: isTop ? meta.color : "#94a3b8" }]}>
                      {val}<Text style={hs.riasecMax}>/30</Text>
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      )}

      {/* Big Five */}
      {tab === "bigfive" && (
        <View style={hs.panel}>
          <Text style={hs.panelNote}>Trait means on a 1–5 scale</Text>
          {Object.entries(entry.scores?.bigfive_raw || {}).map(([trait, mean]) => {
            const meta  = BIGFIVE_META[trait];
            const level = traitLevel(mean);
            const lc    = levelColor(level);
            const pct   = Math.round(((mean - 1) / 4) * 100);
            return (
              <View key={trait} style={hs.bfCard}>
                <View style={hs.bfCardTop}>
                  <View style={[hs.bfAbbr, { backgroundColor: lc.bg }]}>
                    <Text style={[hs.bfAbbrText, { color: lc.text }]}>{meta.abbr}</Text>
                  </View>
                  <Text style={hs.bfTraitName}>{meta.label}</Text>
                  <View style={[hs.bfLevel, { backgroundColor: lc.bg }]}>
                    <Text style={[hs.bfLevelText, { color: lc.text }]}>{level}</Text>
                  </View>
                </View>
                <View style={hs.barTrack}>
                  <View style={[hs.barFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                </View>
                <Text style={hs.bfMean}>{mean.toFixed(2)} / 5.00</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Aptitude */}
      {tab === "aptitude" && (
        <View style={hs.panel}>
          <Text style={hs.panelNote}>12 questions per subject</Text>
          <View style={hs.aptGrid}>
            {Object.entries(entry.scores?.aptitude_pct || {})
              .sort((a, b) => b[1] - a[1])
              .map(([subj, pct]) => {
                const meta    = APTITUDE_META[subj];
                const correct = Math.round((pct / 100) * 12);
                const bgColor = pct >= 75 ? "#dcfce7" : pct >= 50 ? "#fef9c3" : "#fee2e2";
                const txtColor = pct >= 75 ? "#16a34a" : pct >= 50 ? "#ca8a04" : "#dc2626";
                return (
                  <View key={subj} style={[hs.aptCard, { backgroundColor: bgColor }]}>
                    <Text style={hs.aptEmoji}>{meta.emoji}</Text>
                    <Text style={hs.aptLabel}>{meta.label}</Text>
                    <Text style={[hs.aptScore, { color: meta.color }]}>
                      {correct}<Text style={hs.aptMax}>/12</Text>
                    </Text>
                    <View style={hs.barTrack}>
                      <View style={[hs.barFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                    </View>
                    <Text style={[hs.aptPct, { color: txtColor }]}>{pct}%</Text>
                  </View>
                );
              })}
          </View>
        </View>
      )}
    </View>
  );
}

// ── HistoryEntry ──────────────────────────────────────────────────────────────

function HistoryEntry({ entry, index }) {
  const [open, setOpen] = useState(false);

  const topCodes = Object.entries(entry.scores?.riasec_raw || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => RIASEC_META[k]?.code || k[0].toUpperCase())
    .join("");

  const topCourse = entry.recommendations?.[0]?.course || "—";
  const topConf   = entry.recommendations?.[0]?.confidence;

  return (
    <View style={hs.entry}>
      <TouchableOpacity style={hs.entryHeader} onPress={() => setOpen(!open)} activeOpacity={0.7}>
        <View style={hs.entryLeft}>
          <Text style={hs.entryIndex}>#{index + 1}</Text>
          <View style={hs.entryMeta}>
            <View style={hs.entryBadges}>
              <View style={hs.strandBadge}>
                <Text style={hs.strandBadgeText}>{entry.strand}</Text>
              </View>
              {topCodes ? (
                <View style={hs.riasecBadge}>
                  <Text style={hs.riasecBadgeText}>{topCodes}</Text>
                </View>
              ) : null}
            </View>
            <Text style={hs.entryDate}>{formatDate(entry.submittedAt)}</Text>
          </View>
        </View>
        <View style={hs.entryRight}>
          <View style={hs.topCourseWrap}>
            <Text style={hs.topLabel}>Top pick</Text>
            <Text style={hs.topCourse} numberOfLines={1}>{topCourse}</Text>
            {topConf ? <Text style={hs.topConf}>{topConf}%</Text> : null}
          </View>
          <Text style={hs.chevron}>{open ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={hs.entryBody}>
          {entry.scores
            ? <ScoreTabs entry={entry} />
            : <Text style={hs.noScores}>Full scores not available for this attempt.</Text>}
        </View>
      )}
    </View>
  );
}

// ── Main Profile ──────────────────────────────────────────────────────────────

export default function Profile() {
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [histLoading,    setHistLoading]    = useState(true);
  const [isEditing,      setIsEditing]      = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [error,          setError]          = useState("");
  const [history,        setHistory]        = useState([]);

  const [profile, setProfile] = useState({ name: "", email: "", gradeLevel: "", strand: "" });
  const [draft,   setDraft]   = useState({ ...profile });

  // Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res   = await fetch(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const p = {
            name: data.username || "", email: data.email || "",
            gradeLevel: data.gradeLevel || "", strand: data.strand || "",
          };
          setProfile(p); setDraft(p);
        } else {
          setError("Failed to load profile.");
        }
      } catch {
        setError("Cannot connect to server.");
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  // Fetch history
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res   = await fetch(`${API}/api/assessment/results/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed.");
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch {
        setHistory([]);
      } finally {
        setHistLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res   = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          username: draft.name, email: draft.email,
          gradeLevel: draft.gradeLevel, strand: draft.strand,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const p = {
          name: data.user.username, email: data.user.email,
          gradeLevel: data.user.gradeLevel, strand: data.user.strand,
        };
        setProfile(p); setDraft(p);
        const stored = JSON.parse(await AsyncStorage.getItem("user") || "{}");
        await AsyncStorage.setItem("user", JSON.stringify({ ...stored, username: p.name, email: p.email }));
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || "Failed to save.");
      }
    } catch {
      setError("Cannot connect to server.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) setDraft({ ...profile });
    setIsEditing(!isEditing);
    setSaved(false);
    setError("");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4da3f5" />
        <Text style={{ marginTop: 12, color: "#94a3b8" }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/dashboard")} style={s.backBtn}>
          <Text style={s.backBtnText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Profile</Text>
        <View style={{ width: 90 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={s.avatarName}>{profile.name || "No name"}</Text>
          <Text style={s.avatarRole}>
            SHS Student{profile.strand ? ` · ${profile.strand}` : ""}
          </Text>
        </View>

        {/* Toasts */}
        {saved && (
          <View style={s.toast}>
            <Text style={s.toastText}>✓ Profile saved successfully!</Text>
          </View>
        )}
        {!!error && (
          <View style={[s.toast, { backgroundColor: "#fde8e8" }]}>
            <Text style={[s.toastText, { color: "#c0392b" }]}>{error}</Text>
          </View>
        )}

        {/* Personal Info */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Personal Information</Text>
            <TouchableOpacity style={s.editBtn} onPress={handleEditToggle}>
              <Text style={s.editBtnText}>{isEditing ? "Cancel" : "✏️ Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.infoGrid}>
            <View style={s.infoField}>
              <Text style={s.infoLabel}>FULL NAME</Text>
              {isEditing
                ? <TextInput style={s.input} value={draft.name} onChangeText={v => setDraft({ ...draft, name: v })} placeholder="Full Name" />
                : <Text style={s.infoValue}>{profile.name || "—"}</Text>}
            </View>
            <View style={s.infoField}>
              <Text style={s.infoLabel}>EMAIL</Text>
              {isEditing
                ? <TextInput style={s.input} value={draft.email} onChangeText={v => setDraft({ ...draft, email: v })} keyboardType="email-address" autoCapitalize="none" placeholder="Email" />
                : <Text style={s.infoValue}>{profile.email || "—"}</Text>}
            </View>
            <View style={s.infoField}>
              <Text style={s.infoLabel}>GRADE LEVEL</Text>
              {isEditing ? (
                <View style={s.selectRow}>
                  {["Grade 11", "Grade 12"].map(g => (
                    <TouchableOpacity key={g}
                      style={[s.selectOpt, draft.gradeLevel === g && s.selectOptActive]}
                      onPress={() => setDraft({ ...draft, gradeLevel: g })}>
                      <Text style={[s.selectOptText, draft.gradeLevel === g && s.selectOptTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : <Text style={s.infoValue}>{profile.gradeLevel || "—"}</Text>}
            </View>
            <View style={s.infoField}>
              <Text style={s.infoLabel}>STRAND</Text>
              {isEditing ? (
                <View style={s.selectRow}>
                  {["STEM", "ABM", "HUMSS", "TVL", "GAS"].map(st => (
                    <TouchableOpacity key={st}
                      style={[s.selectOpt, draft.strand === st && s.selectOptActive]}
                      onPress={() => setDraft({ ...draft, strand: st })}>
                      <Text style={[s.selectOptText, draft.strand === st && s.selectOptTextActive]}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : <Text style={s.infoValue}>{profile.strand || "—"}</Text>}
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Text style={s.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Assessment History */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Assessment History</Text>
            <View style={hs.countBadge}>
              <Text style={hs.countBadgeText}>
                {history.length} attempt{history.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {histLoading ? (
            <ActivityIndicator size="small" color="#4da3f5" style={{ marginVertical: 20 }} />
          ) : history.length === 0 ? (
            <View style={hs.emptyState}>
              <Text style={hs.emptyIcon}>📋</Text>
              <Text style={hs.emptyText}>No assessments taken yet.</Text>
              <Text style={hs.emptySub}>Complete the assessment to see your results here.</Text>
            </View>
          ) : (
            <View style={hs.list}>
              {history.map((entry, i) => (
                <HistoryEntry key={entry.result_id} entry={entry} index={i} />
              ))}
            </View>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutCard} onPress={handleLogout}>
          <Text style={s.logoutText}>⎋  Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Profile styles ────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6fb" },
  header: { backgroundColor: "#4da3f5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 90 },
  backBtnText: { color: "white", fontSize: 13, fontWeight: "600" },
  headerTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#4da3f5", justifyContent: "center", alignItems: "center", marginBottom: 10, elevation: 4 },
  avatarText: { fontSize: 30, fontWeight: "800", color: "white" },
  avatarName: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 3 },
  avatarRole: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },
  toast: { backgroundColor: "#d4edda", borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 16 },
  toastText: { color: "#155724", fontSize: 13, fontWeight: "700" },
  card: { backgroundColor: "white", borderRadius: 18, padding: 20, marginBottom: 16, elevation: 2, borderWidth: 1.5, borderColor: "#f1f5f9" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1.5, borderBottomColor: "#f1f5f9" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: "#e2e8f0" },
  editBtnText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  infoGrid: { gap: 16, marginBottom: 4 },
  infoField: { gap: 5 },
  infoLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.8 },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  input: { borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 10, padding: 10, fontSize: 14, color: "#1e293b", backgroundColor: "#f8fafc" },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  selectOpt: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#f8fafc" },
  selectOptActive: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  selectOptText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  selectOptTextActive: { color: "#1a7a74" },
  saveBtn: { backgroundColor: "#FBB217", borderRadius: 10, padding: 13, alignItems: "center", marginTop: 16 },
  saveBtnText: { color: "white", fontSize: 14, fontWeight: "700" },
  logoutCard: { backgroundColor: "white", borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1.5, borderColor: "#fecaca", marginBottom: 8 },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
});

// ── History styles ────────────────────────────────────────────────────────────

const hs = StyleSheet.create({
  list: { gap: 12 },
  emptyState: { alignItems: "center", paddingVertical: 24 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 4 },
  emptySub: { fontSize: 12, color: "#94a3b8", textAlign: "center" },
  countBadge: { backgroundColor: "#f1f5f9", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  countBadgeText: { fontSize: 11, fontWeight: "700", color: "#64748b" },

  // Entry
  entry: { borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 14, overflow: "hidden", backgroundColor: "#fafafa" },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  entryLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  entryIndex: { fontSize: 13, fontWeight: "800", color: "#94a3b8" },
  entryMeta: { gap: 4, flex: 1 },
  entryBadges: { flexDirection: "row", gap: 6 },
  strandBadge: { backgroundColor: "#eff6ff", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  strandBadgeText: { fontSize: 11, fontWeight: "700", color: "#3b82f6" },
  riasecBadge: { backgroundColor: "#f0fdf4", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  riasecBadgeText: { fontSize: 11, fontWeight: "700", color: "#16a34a" },
  entryDate: { fontSize: 11, color: "#94a3b8" },
  entryRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  topCourseWrap: { alignItems: "flex-end" },
  topLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "600" },
  topCourse: { fontSize: 12, fontWeight: "700", color: "#1e293b", maxWidth: 120 },
  topConf: { fontSize: 11, color: "#4da3f5", fontWeight: "700" },
  chevron: { fontSize: 11, color: "#94a3b8" },
  entryBody: { borderTopWidth: 1.5, borderTopColor: "#e2e8f0", padding: 14 },
  noScores: { fontSize: 13, color: "#94a3b8", textAlign: "center", paddingVertical: 8 },

  // Tabs
  tabBar: { marginBottom: 14 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginRight: 8, backgroundColor: "#f1f5f9" },
  tabBtnActive: { backgroundColor: "#4da3f5" },
  tabBtnText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  tabBtnTextActive: { color: "white" },
  panel: { gap: 10 },
  panelNote: { fontSize: 11, color: "#94a3b8", marginBottom: 4 },

  // Shared bar
  barTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: "#e2e8f0", overflow: "hidden" },
  barFill: { height: 6, borderRadius: 3 },
  barWrap: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  barPct: { fontSize: 12, fontWeight: "700", color: "#4da3f5", minWidth: 36, textAlign: "right" },

  // Courses
  courseRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, backgroundColor: "#f8fafc" },
  courseRowTop: { backgroundColor: "#eff6ff", borderWidth: 1.5, borderColor: "#bfdbfe" },
  medal: { fontSize: 18 },
  courseName: { fontSize: 13, fontWeight: "600", color: "#1e293b", flex: 1 },

  // RIASEC
  riasecRow: { flexDirection: "column", gap: 6, padding: 10, borderRadius: 10, backgroundColor: "#f8fafc" },
  riasecRowTop: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0" },
  riasecLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  riasecEmoji: { fontSize: 16 },
  riasecCode: { fontSize: 13, fontWeight: "800", minWidth: 16 },
  riasecName: { fontSize: 13, fontWeight: "600", color: "#475569", flex: 1 },
  topBadge: { backgroundColor: "#fef9c3", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  topBadgeText: { fontSize: 10, fontWeight: "700", color: "#ca8a04" },
  riasecBarWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  riasecScore: { fontSize: 12, fontWeight: "700", minWidth: 40, textAlign: "right" },
  riasecMax: { fontSize: 10, color: "#94a3b8" },

  // Big Five
  bfCard: { padding: 12, borderRadius: 12, backgroundColor: "#f8fafc", gap: 6 },
  bfCardTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  bfAbbr: { width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  bfAbbrText: { fontSize: 13, fontWeight: "800" },
  bfTraitName: { flex: 1, fontSize: 13, fontWeight: "600", color: "#1e293b" },
  bfLevel: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  bfLevelText: { fontSize: 11, fontWeight: "700" },
  bfMean: { fontSize: 11, color: "#94a3b8", textAlign: "right" },

  // Aptitude
  aptGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  aptCard: { width: "47%", borderRadius: 12, padding: 12, alignItems: "center", gap: 4 },
  aptEmoji: { fontSize: 24 },
  aptLabel: { fontSize: 12, fontWeight: "700", color: "#1e293b" },
  aptScore: { fontSize: 20, fontWeight: "800" },
  aptMax: { fontSize: 12, color: "#94a3b8" },
  aptPct: { fontSize: 12, fontWeight: "700" },
});