import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar} from "react-native";
import { useRouter } from "expo-router";
import { useAssessment } from "../../context/AssessmentContext";
import { computeRecommendations } from "../../utils/recommendationEngine";

// ── Data ────────────────────────────────────────────────

const strandOptions = [
  { value: "STEM",  desc: "Science, Technology, Engineering & Mathematics" },
  { value: "ABM",   desc: "Accountancy, Business & Management" },
  { value: "HUMSS", desc: "Humanities & Social Sciences" },
  { value: "TVL",   desc: "Technical-Vocational-Livelihood" },
  { value: "GAS",   desc: "General Academic Strand" },
];

const riasecQuestions = [
  { id: "q1",  text: "Building or fixing things with my hands." },
  { id: "q2",  text: "Solving complex mathematical or scientific problems." },
  { id: "q3",  text: "Drawing, designing, or creating art and music." },
  { id: "q4",  text: "Helping, teaching, or counseling other people." },
  { id: "q5",  text: "Leading groups and persuading or convincing others." },
  { id: "q6",  text: "Organizing data, files, and following clear procedures." },
  { id: "q7",  text: "Working with tools, machines, or outdoor activities." },
  { id: "q8",  text: "Researching, analyzing, and investigating topics deeply." },
  { id: "q9",  text: "Expressing myself through writing, performance, or design." },
  { id: "q10", text: "Volunteering, social work, or community service." },
  { id: "q11", text: "Negotiating, selling, or starting new ventures." },
  { id: "q12", text: "Working on structured tasks with clear rules and expectations." },
];

const mbtiQuestions = [
  {
    dimension: "EI",
    question: "In social situations, you usually...",
    options: [
      { label: "Feel energized by being around many people.", value: "E" },
      { label: "Prefer smaller groups or alone time to recharge.", value: "I" },
    ],
  },
  {
    dimension: "SN",
    question: "When learning something new, you focus on...",
    options: [
      { label: "Practical details and real-world application.", value: "S" },
      { label: "The big picture and future possibilities.", value: "N" },
    ],
  },
  {
    dimension: "TF",
    question: "When making decisions, you rely on...",
    options: [
      { label: "Logic and objective analysis.", value: "T" },
      { label: "Your values and how it affects people.", value: "F" },
    ],
  },
  {
    dimension: "JP",
    question: "Your approach to tasks and deadlines is usually...",
    options: [
      { label: "Planned and organized — you like things settled.", value: "J" },
      { label: "Flexible and spontaneous — you keep options open.", value: "P" },
    ],
  },
];

const academicSubjects = ["Math", "Science", "Computer", "English", "Filipino", "History"];

const STEPS = ["strand", "riasec", "mbti", "academic", "done"];

// ── Star Rating ──────────────────────────────────────────
function StarRating({ value, onChange }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((val) => (
        <TouchableOpacity
          key={val}
          onPress={() => onChange(val)}
          accessibilityRole="button"
          accessibilityLabel={`${val} star`}
          style={starStyles.starBtn}
        >
          <Text style={[starStyles.star, value >= val && starStyles.starActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4 },
  starBtn: { padding: 2 },
  star: { fontSize: 24, color: "#d1d5db" },
  starActive: { color: "#FBB217" },
});

// ── Main Screen ──────────────────────────────────────────
export default function Assessment() {
  const router = useRouter();
  const { setAssessmentAnswers, setRecommendations } = useAssessment();

  const [stepIndex, setStepIndex] = useState(0);
  const [strand, setStrand] = useState(null);
  const [riasecAnswers, setRiasecAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [academicRatings, setAcademicRatings] = useState({});

  const currentStep = STEPS[stepIndex];
  const progress = stepIndex / (STEPS.length - 1);

  const canProceed = () => {
    if (currentStep === "strand") return !!strand;
    if (currentStep === "riasec") return Object.keys(riasecAnswers).length === riasecQuestions.length;
    if (currentStep === "mbti") return Object.keys(mbtiAnswers).length === mbtiQuestions.length;
    if (currentStep === "academic") return academicSubjects.every((s) => academicRatings[s]);
    return false;
  };

  const handleNext = () => {
    if (currentStep === "academic") {
      const answers = { strand, riasecAnswers, mbtiAnswers, academicRatings };
      const results = computeRecommendations(answers);
      setAssessmentAnswers(answers);
      setRecommendations(results);
    }
    setStepIndex(stepIndex + 1);
  };

  const handleBack = () => setStepIndex(stepIndex - 1);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={currentStep !== "done" && stepIndex > 0 ? handleBack : () => router.push("/(tabs)/dashboard")}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>
            {currentStep !== "done" && stepIndex > 0 ? "← Back" : "← Dashboard"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Progress Bar */}
      {currentStep !== "done" && (
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Step {stepIndex + 1} of {STEPS.length - 1}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── STEP 1: Strand ── */}
        {currentStep === "strand" && (
          <View>
            <Text style={styles.stepTitle}>What is your SHS strand?</Text>
            <Text style={styles.stepSub}>Your academic track helps us understand your preparation.</Text>
            {strandOptions.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.strandBtn, strand === s.value && styles.strandBtnSelected]}
                onPress={() => setStrand(s.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: strand === s.value }}
              >
                <Text style={[styles.strandName, strand === s.value && styles.strandNameSelected]}>
                  {s.value}
                </Text>
                <Text style={[styles.strandDesc, strand === s.value && styles.strandDescSelected]}>
                  {s.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── STEP 2: RIASEC ── */}
        {currentStep === "riasec" && (
          <View>
            <Text style={styles.stepTitle}>RIASEC Interest Inventory</Text>
            <Text style={styles.stepSub}>Rate how much each activity interests you — 1 (not at all) to 5 (very much).</Text>
            {riasecQuestions.map((q, i) => (
              <View key={q.id} style={styles.riasecRow}>
                <View style={styles.riasecTop}>
                  <Text style={styles.riasecNum}>{i + 1}</Text>
                  <Text style={styles.riasecText}>{q.text}</Text>
                </View>
                <StarRating
                  value={riasecAnswers[q.id] || 0}
                  onChange={(val) => setRiasecAnswers({ ...riasecAnswers, [q.id]: val })}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── STEP 3: MBTI ── */}
        {currentStep === "mbti" && (
          <View>
            <Text style={styles.stepTitle}>Personality Indicator (MBTI)</Text>
            <Text style={styles.stepSub}>Choose the option that best describes you for each pair.</Text>
            {mbtiQuestions.map((q) => (
              <View key={q.dimension} style={styles.mbtiBlock}>
                <Text style={styles.mbtiQuestion}>{q.question}</Text>
                {q.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.mbtiOpt,
                      mbtiAnswers[q.dimension] === opt.value && styles.mbtiOptSelected,
                    ]}
                    onPress={() => setMbtiAnswers({ ...mbtiAnswers, [q.dimension]: opt.value })}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: mbtiAnswers[q.dimension] === opt.value }}
                  >
                    <View style={[
                      styles.mbtiBadge,
                      mbtiAnswers[q.dimension] === opt.value && styles.mbtiBadgeSelected,
                    ]}>
                      <Text style={[
                        styles.mbtiBadgeText,
                        mbtiAnswers[q.dimension] === opt.value && styles.mbtiBadgeTextSelected,
                      ]}>
                        {opt.value}
                      </Text>
                    </View>
                    <Text style={[
                      styles.mbtiLabel,
                      mbtiAnswers[q.dimension] === opt.value && styles.mbtiLabelSelected,
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── STEP 4: Academic ── */}
        {currentStep === "academic" && (
          <View>
            <Text style={styles.stepTitle}>Academic Self-Assessment</Text>
            <Text style={styles.stepSub}>Rate your confidence in each subject (1 = low, 5 = high).</Text>
            {academicSubjects.map((subject) => (
              <View key={subject} style={styles.academicRow}>
                <Text style={styles.academicLabel}>{subject}</Text>
                <StarRating
                  value={academicRatings[subject] || 0}
                  onChange={(val) => setAcademicRatings({ ...academicRatings, [subject]: val })}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── DONE ── */}
        {currentStep === "done" && (
          <View style={styles.doneContainer}>
            <Text style={styles.doneIcon}>🎓</Text>
            <Text style={styles.doneTitle}>Assessment Complete!</Text>
            <Text style={styles.doneSub}>
              Your personalized course recommendations are ready based on your strand, personality, and academic profile.
            </Text>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => router.replace("/(tabs)/dashboard")}
              accessibilityRole="button"
            >
              <Text style={styles.doneBtnText}>View My Recommendations →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Next / Submit Button */}
        {currentStep !== "done" && (
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
            accessibilityRole="button"
          >
            <Text style={styles.nextBtnText}>
              {currentStep === "academic" ? "Submit ✓" : "Next →"}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFCF3" },

  header: {
    backgroundColor: "#4da3f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 80 },
  backBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
  headerTitle: { color: "white", fontSize: 17, fontWeight: "700" },

  progressSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  progressLabel: { fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: "500" },
  progressTrack: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4da3f5",
    borderRadius: 999,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  stepTitle: { fontSize: 20, fontWeight: "700", color: "#1f2937", marginBottom: 6 },
  stepSub: { fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 18 },

  strandBtn: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "white",
  },
  strandBtnSelected: {
    borderColor: "#2bbbad",
    backgroundColor: "#f0fdf4",
  },
  strandName: { fontSize: 16, fontWeight: "700", color: "#1f2937", marginBottom: 3 },
  strandNameSelected: { color: "#1a7a74" },
  strandDesc: { fontSize: 12, color: "#9ca3af" },
  strandDescSelected: { color: "#2bbbad" },

  riasecRow: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  riasecTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  riasecNum: { fontSize: 11, fontWeight: "700", color: "#9ca3af", minWidth: 18, marginTop: 1 },
  riasecText: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 18 },

  mbtiBlock: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  mbtiQuestion: { fontSize: 14, fontWeight: "600", color: "#1f2937", marginBottom: 12 },
  mbtiOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "white",
  },
  mbtiOptSelected: {
    borderColor: "#2bbbad",
    backgroundColor: "#f0fdf4",
  },
  mbtiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  mbtiBadgeSelected: { backgroundColor: "#2bbbad" },
  mbtiBadgeText: { fontSize: 13, fontWeight: "800", color: "#6b7280" },
  mbtiBadgeTextSelected: { color: "white" },
  mbtiLabel: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 18 },
  mbtiLabelSelected: { color: "#1a7a74" },

  academicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  academicLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },

  nextBtn: {
    backgroundColor: "#4da3f5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  nextBtnDisabled: { backgroundColor: "#d1d5db" },
  nextBtnText: { color: "white", fontSize: 16, fontWeight: "700" },

  doneContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  doneIcon: { fontSize: 64, marginBottom: 20 },
  doneTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  doneSub: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: "#FBB217",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  doneBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});