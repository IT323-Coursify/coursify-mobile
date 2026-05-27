import { useState, useEffect, useCallback } from "react";
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAssessment } from "../../context/AssessmentContext";
import API from "../../config/api";

// ── Constants ─────────────────────────────────────────────
const STORAGE_KEY = "coursify_assessment_progress";

const STRAND_OPTIONS = [
  { value: "STEM",  desc: "Science, Technology, Engineering & Mathematics" },
  { value: "ABM",   desc: "Accountancy, Business & Management" },
  { value: "HUMSS", desc: "Humanities & Social Sciences" },
  { value: "TVL",   desc: "Technical-Vocational-Livelihood" },
  { value: "GAS",   desc: "General Academic Strand" },
];

const LIKERT_LABELS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

const SECTIONS = [
  { key: "strand",   title: "SHS Strand",          icon: "🎓", desc: "Your academic track" },
  { key: "riasec",   title: "RIASEC Interests",     icon: "🧭", desc: "Holland Interest Inventory" },
  { key: "bigfive",  title: "Big Five Personality", icon: "🧠", desc: "OCEAN Personality Model" },
  { key: "math",     title: "Math Aptitude",         icon: "📐", desc: "12 questions" },
  { key: "science",  title: "Science Aptitude",      icon: "🔬", desc: "12 questions" },
  { key: "english",  title: "English Aptitude",      icon: "📖", desc: "12 questions" },
  { key: "abstract", title: "Abstract Reasoning",    icon: "🔷", desc: "12 questions" },
];

// ── Helpers ───────────────────────────────────────────────
function getCurrentUserId(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? payload.id ?? null;
  } catch {
    return null;
  }
}

async function loadSaved(currentUserId) {
  try {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (!s) return {};
    const parsed = JSON.parse(s);
    if (parsed.userId && parsed.userId !== currentUserId) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function isSectionComplete(key, questions, answers) {
  if (key === "strand") return !!answers.strand;
  if (key === "riasec") {
    return questions?.riasec &&
      Object.keys(answers.riasecAnswers || {}).length === questions.riasec.length;
  }
  if (key === "bigfive") {
    return questions?.bigfive &&
      Object.keys(answers.bigfiveAnswers || {}).length === questions.bigfive.length;
  }
  if (["math", "science", "english", "abstract"].includes(key)) {
    const qs = questions?.aptitude?.[key];
    return qs &&
      Object.keys((answers.aptitudeAnswers || {})[key] || {}).length === qs.length;
  }
  return false;
}

// ── Section Progress Bar ──────────────────────────────────
function SectionProgress({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <View style={s.sectionProgressRow}>
      <View style={s.sectionProgressTrack}>
        <View style={[s.sectionProgressFill, { width: `${pct}%` }]} />
      </View>
      <Text style={s.sectionProgressLabel}>{current}/{total}</Text>
    </View>
  );
}

// ── Strand Section ────────────────────────────────────────
function StrandSection({ strand, setStrand, onDone }) {
  return (
    <View>
      <Text style={s.stepSubtitle}>Select your Senior High School strand.</Text>
      {STRAND_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[s.strandBtn, strand === opt.value && s.strandBtnSelected]}
          onPress={() => setStrand(opt.value)}
        >
          <Text style={[s.strandName, strand === opt.value && s.strandNameSelected]}>
            {opt.value}
          </Text>
          <Text style={[s.strandDesc, strand === opt.value && s.strandDescSelected]}>
            {opt.desc}
          </Text>
        </TouchableOpacity>
      ))}
      {strand && (
        <TouchableOpacity style={s.saveSectionBtn} onPress={onDone}>
          <Text style={s.saveSectionBtnText}>Save & Close ✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Likert Section (RIASEC + Big Five) ───────────────────
function LikertSection({ questions, answers, setAnswers, subtitle, onDone, done }) {
  const answered = Object.keys(answers).length;
  const total    = questions.length;

  return (
    <View>
      <Text style={s.stepSubtitle}>{subtitle}</Text>

      {/* Legend */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.likertLegendScroll}>
        {LIKERT_LABELS.map((label, i) => (
          <View key={i} style={s.likertLegendItem}>
            <Text style={s.likertLegendNum}>{i + 1}</Text>
            <Text style={s.likertLegendLabel}>{label}</Text>
          </View>
        ))}
      </ScrollView>

      <SectionProgress current={answered} total={total} />

      {questions.map((q, i) => {
        const current = answers[q._id] || 0;
        return (
          <View key={q._id} style={[s.likertRow, current > 0 && s.likertRowAnswered]}>
            <Text style={s.likertNum}>{i + 1}</Text>
            <Text style={s.likertText}>{q.text}</Text>
            <View style={s.likertScale}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[s.likertBtn, current === val && s.likertBtnActive]}
                  onPress={() => setAnswers(prev => ({ ...prev, [q._id]: val }))}
                >
                  <Text style={[s.likertBtnText, current === val && s.likertBtnTextActive]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {current > 0 && (
              <Text style={s.likertSelectedLabel}>{LIKERT_LABELS[current - 1]}</Text>
            )}
          </View>
        );
      })}

      {done && (
        <TouchableOpacity style={s.saveSectionBtn} onPress={onDone}>
          <Text style={s.saveSectionBtnText}>Save & Close ✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Aptitude Section ──────────────────────────────────────
function AptitudeSection({ subject, questions, answers, setAnswer, onDone, done }) {
  const answered = Object.keys(answers).length;
  const total    = questions.length;

  return (
    <View>
      <Text style={s.stepSubtitle}>Choose the best answer for each question.</Text>
      <SectionProgress current={answered} total={total} />

      {questions.map((q, i) => {
        const selected = answers[q._id];
        return (
          <View key={q._id} style={[s.academicQ, selected && s.academicQAnswered]}>
            <Text style={s.academicQText}>
              <Text style={s.academicQNum}>{i + 1}. </Text>{q.text}
            </Text>
            <View style={s.mcqOptions}>
              {(q.options || []).map((opt) => {
                const isSelected = selected === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[s.mcqOpt, isSelected && s.mcqOptSelected]}
                    onPress={() => setAnswer(q._id, opt.label)}
                  >
                    <Text style={[s.mcqLabel, isSelected && s.mcqLabelSelected]}>
                      {opt.label}.
                    </Text>
                    <Text style={[s.mcqValue, isSelected && s.mcqValueSelected]}>
                      {opt.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      {done && (
        <TouchableOpacity style={s.saveSectionBtn} onPress={onDone}>
          <Text style={s.saveSectionBtnText}>Save & Close ✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Assessment Screen ────────────────────────────────
export default function Assessment() {
  const router = useRouter();
  const {
    questions, setQuestions,
    questionsLoading, setQuestionsLoading,
    questionsError,   setQuestionsError,
    setAssessmentAnswers, setResultId,
  } = useAssessment();

  const [token,           setToken]           = useState(null);
  const [currentUserId,   setCurrentUserId]   = useState(null);
  const [strand,          setStrand]          = useState(null);
  const [riasecAnswers,   setRiasecAnswers]   = useState({});
  const [bigfiveAnswers,  setBigfiveAnswers]  = useState({});
  const [aptitudeAnswers, setAptitudeAnswers] = useState({});
  const [openSection,     setOpenSection]     = useState(null);
  const [submitted,       setSubmitted]       = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [submitError,     setSubmitError]     = useState(null);

  // Load token and saved draft
  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("token");
      if (!t) { router.replace("/"); return; }
      setToken(t);

      const uid = getCurrentUserId(t);
      setCurrentUserId(uid);

      const saved = await loadSaved(uid);
      if (saved.strand)          setStrand(saved.strand);
      if (saved.riasecAnswers)   setRiasecAnswers(saved.riasecAnswers);
      if (saved.bigfiveAnswers)  setBigfiveAnswers(saved.bigfiveAnswers);
      if (saved.aptitudeAnswers) setAptitudeAnswers(saved.aptitudeAnswers);
    })();
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (!currentUserId) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      userId: currentUserId,
      strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers,
    }));
  }, [currentUserId, strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers]);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    const t = await AsyncStorage.getItem("token");
    if (!t) return;
    try {
      setQuestionsLoading(true);
      setQuestionsError(null);
      const res  = await fetch(`${API}/api/assessment/questions`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to load questions.");
      setQuestions(data);

      // Scrub stale answer keys
      const freshRiasecIds  = new Set(data.riasec.map(q => q._id));
      const freshBigfiveIds = new Set(data.bigfive.map(q => q._id));
      const freshAptIds = {
        math:     new Set(data.aptitude.math.map(q => q._id)),
        science:  new Set(data.aptitude.science.map(q => q._id)),
        english:  new Set(data.aptitude.english.map(q => q._id)),
        abstract: new Set(data.aptitude.abstract.map(q => q._id)),
      };
      setRiasecAnswers(prev =>
        Object.fromEntries(Object.entries(prev).filter(([id]) => freshRiasecIds.has(id)))
      );
      setBigfiveAnswers(prev =>
        Object.fromEntries(Object.entries(prev).filter(([id]) => freshBigfiveIds.has(id)))
      );
      setAptitudeAnswers(prev => {
        const cleaned = {};
        for (const subj of ["math", "science", "english", "abstract"]) {
          cleaned[subj] = Object.fromEntries(
            Object.entries(prev[subj] || {}).filter(([id]) => freshAptIds[subj].has(id))
          );
        }
        return cleaned;
      });
    } catch (err) {
      setQuestionsError(err.message);
    } finally {
      setQuestionsLoading(false);
    }
  }, [setQuestions, setQuestionsLoading, setQuestionsError]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Progress
  const answersObj = { strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers };
  const completedCount = SECTIONS.filter(sec => isSectionComplete(sec.key, questions, answersObj)).length;
  const overallPct     = Math.round((completedCount / SECTIONS.length) * 100);
  const allComplete    = completedCount === SECTIONS.length;

  const setAptitudeAnswer = (subject, qid, value) => {
    setAptitudeAnswers(prev => ({
      ...prev,
      [subject]: { ...(prev[subject] || {}), [qid]: value },
    }));
  };

  // Submit
  const handleSubmit = async () => {
    const t = await AsyncStorage.getItem("token");
    setSubmitting(true);
    setSubmitError(null);
    try {
      const flatAptitudeAnswers = Object.values(aptitudeAnswers).reduce(
        (acc, subjectAnswers) => ({ ...acc, ...subjectAnswers }), {}
      );
      const res = await fetch(`${API}/api/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({
          strand,
          riasec_answers:   riasecAnswers,
          bigfive_answers:  bigfiveAnswers,
          aptitude_answers: flatAptitudeAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed.");
      setAssessmentAnswers({ strand, riasecAnswers, bigfiveAnswers, aptitudeAnswers });
      setResultId(data.result_id);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submitted screen ──
  if (submitted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.doneContainer}>
          <Text style={s.doneIcon}>🎓</Text>
          <Text style={s.doneTitle}>Assessment Complete!</Text>
          <Text style={s.doneSub}>
            Your answers have been saved. Course recommendations will be generated soon.
          </Text>
          <TouchableOpacity style={s.doneBtn} onPress={() => router.replace("/(tabs)/dashboard")}>
            <Text style={s.doneBtnText}>Back to Dashboard →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Loading questions ──
  if (questionsLoading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centeredBox}>
          <ActivityIndicator color="#4da3f5" size="large" />
          <Text style={s.loadingText}>Loading your assessment questions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error loading questions ──
  if (questionsError) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centeredBox}>
          <Text style={s.errorText}>⚠️ {questionsError}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchQuestions}>
            <Text style={s.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ──
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/dashboard")} style={s.backBtn}>
          <Text style={s.backBtnText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Assessment</Text>
        <View style={{ width: 90 }} />
      </View>

      {/* Overall progress */}
      <View style={s.overallProgressBar}>
        <View style={[s.overallProgressFill, { width: `${overallPct}%` }]} />
      </View>
      <Text style={s.overallProgressLabel}>{completedCount}/{SECTIONS.length} sections complete</Text>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {SECTIONS.map((section) => {
          const done   = isSectionComplete(section.key, questions, answersObj);
          const isOpen = openSection === section.key;

          return (
            <View
              key={section.key}
              style={[s.sectionCard, done && s.sectionCardDone, isOpen && s.sectionCardOpen]}
            >
              {/* Section header */}
              <TouchableOpacity
                style={s.sectionHeader}
                onPress={() => setOpenSection(isOpen ? null : section.key)}
              >
                <View style={s.sectionLeft}>
                  <View style={s.sectionIconBox}>
                    <Text style={s.sectionIconText}>{section.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.sectionTitle}>{section.title}</Text>
                    <Text style={s.sectionDesc}>{section.desc}</Text>
                  </View>
                </View>
                <View style={s.sectionRight}>
                  <View style={done ? s.doneBadge : s.pendingBadge}>
                    <Text style={done ? s.doneBadgeText : s.pendingBadgeText}>
                      {done ? "✓ Done" : "Pending"}
                    </Text>
                  </View>
                  <Text style={s.chevron}>{isOpen ? "▲" : "▼"}</Text>
                </View>
              </TouchableOpacity>

              {/* Section body */}
              {isOpen && (
                <View style={s.sectionBody}>

                  {section.key === "strand" && (
                    <StrandSection
                      strand={strand}
                      setStrand={setStrand}
                      onDone={() => setOpenSection(null)}
                    />
                  )}

                  {section.key === "riasec" && questions?.riasec && (
                    <LikertSection
                      questions={questions.riasec}
                      answers={riasecAnswers}
                      setAnswers={setRiasecAnswers}
                      subtitle="Rate how much each activity interests you."
                      onDone={() => setOpenSection(null)}
                      done={done}
                    />
                  )}

                  {section.key === "bigfive" && questions?.bigfive && (
                    <LikertSection
                      questions={questions.bigfive}
                      answers={bigfiveAnswers}
                      setAnswers={setBigfiveAnswers}
                      subtitle="Rate how accurately each statement describes you."
                      onDone={() => setOpenSection(null)}
                      done={done}
                    />
                  )}

                  {["math", "science", "english", "abstract"].includes(section.key) &&
                    questions?.aptitude?.[section.key] && (
                    <AptitudeSection
                      subject={section.key}
                      questions={questions.aptitude[section.key]}
                      answers={(aptitudeAnswers[section.key] || {})}
                      setAnswer={(qid, val) => setAptitudeAnswer(section.key, qid, val)}
                      onDone={() => setOpenSection(null)}
                      done={done}
                    />
                  )}

                </View>
              )}
            </View>
          );
        })}

        {/* Submit area */}
        <View style={s.submitArea}>
          {submitError && <Text style={s.submitError}>⚠️ {submitError}</Text>}
          {allComplete ? (
            <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={s.submitBtnText}>
                {submitting ? "Submitting…" : "🎯 Submit Assessment"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={s.submitHint}>
              Complete all {SECTIONS.length} sections above to submit.
            </Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: "#FFFCF3" },

  // Header
  header: { backgroundColor: "#4da3f5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14 },
  backBtn:     { width: 90 },
  backBtnText: { color: "white", fontSize: 13, fontWeight: "600"},
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700"},

  // Overall progress
  overallProgressBar:   { height: 5, backgroundColor: "#e2e8f0" },
  overallProgressFill:  { height: "100%", backgroundColor: "#2bbbad" },
  overallProgressLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600", textAlign: "right", paddingHorizontal: 16, paddingVertical: 6 },

  // Loading / error / centered
  centeredBox:  { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, padding: 40 },
  loadingText:  { fontSize: 13, color: "#94a3b8", textAlign: "center" },
  errorText:    { fontSize: 13, color: "#be123c", textAlign: "center" },
  retryBtn:     { backgroundColor: "#4da3f5", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryBtnText: { color: "white", fontWeight: "700", fontSize: 14 },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { padding: 16 },

  // Section cards
  sectionCard:     { backgroundColor: "white", borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: "#e2e8f0", overflow: "hidden" },
  sectionCardDone: { borderColor: "#86efac" },
  sectionCardOpen: { borderColor: "#4da3f5" },
  sectionHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  sectionLeft:     { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  sectionIconBox:  { width: 40, height: 40, backgroundColor: "#f1f5f9", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionIconText: { fontSize: 20 },
  sectionTitle:    { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  sectionDesc:     { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  sectionRight:    { flexDirection: "row", alignItems: "center", gap: 8 },
  doneBadge:       { backgroundColor: "#d4edda", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  doneBadgeText:   { fontSize: 11, fontWeight: "700", color: "#155724" },
  pendingBadge:    { backgroundColor: "#f1f5f9", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pendingBadgeText:{ fontSize: 11, fontWeight: "600", color: "#94a3b8" },
  chevron:         { fontSize: 10, color: "#94a3b8" },
  sectionBody:     { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },

  // Step subtitle
  stepSubtitle: { fontSize: 12, color: "#64748b", marginTop: 14, marginBottom: 16, lineHeight: 18 },

  // Strand
  strandBtn:          { borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 12, padding: 14, marginBottom: 8, backgroundColor: "white" },
  strandBtnSelected:  { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  strandName:         { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 2 },
  strandNameSelected: { color: "#1a7a74" },
  strandDesc:         { fontSize: 11, color: "#94a3b8" },
  strandDescSelected: { color: "#2bbbad" },

  // Likert legend
  likertLegendScroll: { marginBottom: 12 },
  likertLegendItem:   { alignItems: "center", marginRight: 16 },
  likertLegendNum:    { fontSize: 13, fontWeight: "700", color: "#4da3f5", marginBottom: 2 },
  likertLegendLabel:  { fontSize: 10, color: "#94a3b8" },

  // Section progress
  sectionProgressRow:   { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionProgressTrack: { flex: 1, height: 5, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden" },
  sectionProgressFill:  { height: "100%", backgroundColor: "#2bbbad" },
  sectionProgressLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },

  // Likert rows
  likertRow:         { backgroundColor: "#f8fafc", borderRadius: 12, padding: 12, marginBottom: 8 },
  likertRowAnswered: { borderWidth: 1.5, borderColor: "#86efac" },
  likertNum:         { fontSize: 10, fontWeight: "700", color: "#94a3b8", marginBottom: 4 },
  likertText:        { fontSize: 12, color: "#374151", lineHeight: 18, marginBottom: 10 },
  likertScale:       { flexDirection: "row", gap: 6 },
  likertBtn:         { width: 36, height: 36, borderRadius: 8, backgroundColor: "white", borderWidth: 1.5, borderColor: "#e2e8f0", justifyContent: "center", alignItems: "center" },
  likertBtnActive:   { backgroundColor: "#4da3f5", borderColor: "#4da3f5" },
  likertBtnText:     { fontSize: 13, fontWeight: "700", color: "#94a3b8" },
  likertBtnTextActive:{ color: "white" },
  likertSelectedLabel:{ fontSize: 10, color: "#2bbbad", fontWeight: "600", marginTop: 6 },

  // Academic / aptitude
  academicQ:        { backgroundColor: "#f8fafc", borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: "transparent" },
  academicQAnswered:{ borderColor: "#86efac" },
  academicQText:    { fontSize: 13, color: "#374151", marginBottom: 12, lineHeight: 18 },
  academicQNum:     { fontWeight: "700", color: "#94a3b8" },
  mcqOptions:       { gap: 8 },
  mcqOpt:           { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 10, padding: 10, backgroundColor: "white" },
  mcqOptSelected:   { borderColor: "#4da3f5", backgroundColor: "#eff6ff" },
  mcqLabel:         { fontSize: 12, fontWeight: "700", color: "#94a3b8", minWidth: 16 },
  mcqLabelSelected: { color: "#1d4ed8" },
  mcqValue:         { fontSize: 12, color: "#374151", flex: 1 },
  mcqValueSelected: { color: "#1d4ed8", fontWeight: "600" },

  // Save section button
  saveSectionBtn:     { marginTop: 16, backgroundColor: "#4da3f5", borderRadius: 10, padding: 13, alignItems: "center" },
  saveSectionBtnText: { color: "white", fontSize: 14, fontWeight: "700" },

  // Submit
  submitArea:   { paddingVertical: 20, alignItems: "center" },
  submitBtn:    { backgroundColor: "#FBB217", borderRadius: 12, paddingHorizontal: 32, paddingVertical: 15, elevation: 4 },
  submitBtnText:{ color: "white", fontSize: 15, fontWeight: "700" },
  submitHint:   { fontSize: 12, color: "#94a3b8", textAlign: "center" },
  submitError:  { fontSize: 13, color: "#be123c", marginBottom: 12, textAlign: "center" },

  // Done screen
  doneContainer:{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  doneIcon:     { fontSize: 60, marginBottom: 16 },
  doneTitle:    { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 10, textAlign: "center" },
  doneSub:      { fontSize: 14, color: "#64748b", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  doneBtn:      { backgroundColor: "#FBB217", paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  doneBtnText:  { color: "white", fontSize: 15, fontWeight: "700" },
});