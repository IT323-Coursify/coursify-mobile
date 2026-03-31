import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, AsyncStorage
} from "react-native";
import { useRouter } from "expo-router";
import { useAssessment } from "../../context/AssessmentContext";
import { computeRecommendations } from "../../utils/recommendationEngine";

// ── Storage key ──────────────────────────────────────────
const STORAGE_KEY = "coursify_assessment_progress";

// ── Data ─────────────────────────────────────────────────
const strandOptions = [
  { value: "STEM", desc: "Science, Technology, Engineering & Mathematics" },
  { value: "ABM", desc: "Accountancy, Business & Management" },
  { value: "HUMSS", desc: "Humanities & Social Sciences" },
  { value: "TVL", desc: "Technical-Vocational-Livelihood" },
  { value: "GAS", desc: "General Academic Strand" },
];

const riasecQuestions = [
  { id: "q1", text: "Building or fixing things with my hands." },
  { id: "q2", text: "Solving complex mathematical or scientific problems." },
  { id: "q3", text: "Drawing, designing, or creating art and music." },
  { id: "q4", text: "Helping, teaching, or counseling other people." },
  { id: "q5", text: "Leading groups and persuading or convincing others." },
  { id: "q6", text: "Organizing data, files, and following clear procedures." },
  { id: "q7", text: "Working with tools, machines, or outdoor activities." },
  { id: "q8", text: "Researching, analyzing, and investigating topics deeply." },
  { id: "q9", text: "Expressing myself through writing, performance, or design." },
  { id: "q10", text: "Volunteering, social work, or community service." },
  { id: "q11", text: "Negotiating, selling, or starting new ventures." },
  { id: "q12", text: "Working on structured tasks with clear rules and expectations." },
];

// 8 MBTI questions — no dimension labels shown
const mbtiQuestions = [
  {
    dimension: "EI", question: "Which feels more natural to you?", options: [
      { label: "I feel more energized after spending time with a group of people.", value: "E" },
      { label: "I feel more refreshed after spending time alone or in a quiet setting.", value: "I" },
    ]
  },
  {
    dimension: "EI", question: "When you have a problem to work through, you usually...", options: [
      { label: "Talk it out with someone — saying it aloud helps me think.", value: "E" },
      { label: "Reflect on it quietly by myself before sharing anything.", value: "I" },
    ]
  },
  {
    dimension: "SN", question: "When you learn something new, you prefer...", options: [
      { label: "Step-by-step instructions with concrete, real-world examples.", value: "S" },
      { label: "Understanding the big picture and the 'why' behind it first.", value: "N" },
    ]
  },
  {
    dimension: "SN", question: "Which statement fits you more?", options: [
      { label: "I trust what I can see, touch, or experience directly.", value: "S" },
      { label: "I often think about possibilities and what could be, not just what is.", value: "N" },
    ]
  },
  {
    dimension: "TF", question: "When making an important decision, you tend to...", options: [
      { label: "Focus on the facts and what makes the most logical sense.", value: "T" },
      { label: "Consider how the decision will affect the people involved.", value: "F" },
    ]
  },
  {
    dimension: "TF", question: "If a friend made a mistake, you would most likely...", options: [
      { label: "Point out what went wrong and how they can fix it practically.", value: "T" },
      { label: "Focus on how they are feeling and offer emotional support first.", value: "F" },
    ]
  },
  {
    dimension: "JP", question: "Which describes your ideal way of handling tasks?", options: [
      { label: "I like to plan ahead, set deadlines, and finish things early.", value: "J" },
      { label: "I prefer keeping things flexible and adapting as I go.", value: "P" },
    ]
  },
  {
    dimension: "JP", question: "How do you feel when plans suddenly change?", options: [
      { label: "It bothers me — I prefer knowing what to expect in advance.", value: "J" },
      { label: "I am fine with it — I actually enjoy a bit of spontaneity.", value: "P" },
    ]
  },
];

const academicQuestions = {
  Math: [
    { id: "m1", type: "likert", text: "I understand how to solve linear equations." },
    { id: "m2", type: "mcq", text: "What is the value of x in: 2x + 6 = 14?", options: ["x = 3", "x = 4", "x = 5", "x = 10"] },
    { id: "m3", type: "likert", text: "I can apply the Pythagorean theorem to solve problems." },
    { id: "m4", type: "mcq", text: "What is 15% of 200?", options: ["25", "30", "35", "40"] },
    { id: "m5", type: "likert", text: "I am comfortable working with fractions and decimals." },
    { id: "m6", type: "mcq", text: "Simplify: (x² + 5x + 6) ÷ (x + 2)", options: ["x + 3", "x + 2", "x − 3", "x − 2"] },
    { id: "m7", type: "likert", text: "I can interpret graphs and data charts accurately." },
    { id: "m8", type: "mcq", text: "What is the area of a triangle with base 8 and height 5?", options: ["20", "40", "13", "80"] },
    { id: "m9", type: "likert", text: "I find it easy to follow mathematical proofs." },
    { id: "m10", type: "mcq", text: "If a square has a perimeter of 36, what is its area?", options: ["81", "72", "64", "36"] },
  ],
  Science: [
    { id: "s1", type: "likert", text: "I understand the basic laws of motion (Newton's Laws)." },
    { id: "s2", type: "mcq", text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"] },
    { id: "s3", type: "likert", text: "I can explain how photosynthesis works." },
    { id: "s4", type: "mcq", text: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"] },
    { id: "s5", type: "likert", text: "I understand the difference between physical and chemical changes." },
    { id: "s6", type: "mcq", text: "What is the atomic number of Carbon?", options: ["6", "12", "8", "14"] },
    { id: "s7", type: "likert", text: "I am confident reading and interpreting scientific data." },
    { id: "s8", type: "mcq", text: "What type of rock is formed from cooled lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"] },
    { id: "s9", type: "likert", text: "I understand how ecosystems and food chains work." },
    { id: "s10", type: "mcq", text: "Which planet is closest to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"] },
  ],
  English: [
    { id: "e1", type: "likert", text: "I can write a clear and organized paragraph." },
    { id: "e2", type: "mcq", text: "Which sentence is grammatically correct?", options: ["She don't know.", "She doesn't knows.", "She doesn't know.", "She not know."] },
    { id: "e3", type: "likert", text: "I understand literary devices like metaphors and similes." },
    { id: "e4", type: "mcq", text: "What is the synonym of 'benevolent'?", options: ["Cruel", "Kind", "Angry", "Strict"] },
    { id: "e5", type: "likert", text: "I can identify the main idea of a reading passage." },
    { id: "e6", type: "mcq", text: "Which is an example of a compound sentence?", options: ["The dog ran.", "I was tired, but I finished.", "Running fast.", "Because it rained."] },
    { id: "e7", type: "likert", text: "I am comfortable doing oral presentations in English." },
    { id: "e8", type: "mcq", text: "What does the word 'ambiguous' mean?", options: ["Very clear", "Open to multiple interpretations", "Very loud", "Absolutely certain"] },
    { id: "e9", type: "likert", text: "I can write persuasive essays effectively." },
    { id: "e10", type: "mcq", text: "Which of these is a proper noun?", options: ["city", "teacher", "Manila", "building"] },
  ],
  Computer: [
    { id: "c1", type: "likert", text: "I am comfortable using spreadsheet software (Excel/Sheets)." },
    { id: "c2", type: "mcq", text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Power Unit", "Core Processing Upgrade", "Central Power Upgrade"] },
    { id: "c3", type: "likert", text: "I understand basic programming concepts like loops and conditions." },
    { id: "c4", type: "mcq", text: "Which of these is NOT a programming language?", options: ["Python", "HTML", "Photoshop", "JavaScript"] },
    { id: "c5", type: "likert", text: "I can troubleshoot basic computer hardware problems." },
    { id: "c6", type: "mcq", text: "What does 'RAM' stand for?", options: ["Random Access Memory", "Read And Memorize", "Rapid Application Module", "Runtime Array Memory"] },
    { id: "c7", type: "likert", text: "I understand how the internet and networks work." },
    { id: "c8", type: "mcq", text: "Which file format is used for images?", options: [".mp3", ".exe", ".png", ".docx"] },
    { id: "c9", type: "likert", text: "I can create and format basic documents and presentations." },
    { id: "c10", type: "mcq", text: "What is the function of an operating system?", options: ["Browse internet", "Manage hardware and software", "Edit photos", "Store files only"] },
  ],
  Filipino: [
    { id: "f1", type: "likert", text: "Nakakasulat ako ng malinaw na talata sa Filipino." },
    { id: "f2", type: "mcq", text: "Alin sa mga sumusunod ang tamang baybay?", options: ["Palengke", "Palingke", "Palenkge", "Palengque"] },
    { id: "f3", type: "likert", text: "Naiintindihan ko ang mga akdang pampanitikan sa Filipino." },
    { id: "f4", type: "mcq", text: "Ano ang kahulugan ng salitang 'maunawain'?", options: ["Mapagmataas", "Magalang", "Mapagpasensya", "Mapagbigay"] },
    { id: "f5", type: "likert", text: "Kaya kong tukuyin ang paksa ng isang pahayag." },
    { id: "f6", type: "mcq", text: "Aling pangungusap ang may tamang bantas?", options: ["Kumain ka na ba", "Kumain ka na ba?", "Kumain ka na ba!", "Kumain ka na ba,"] },
    { id: "f7", type: "likert", text: "Komportable akong magsalita sa harap ng klase sa Filipino." },
    { id: "f8", type: "mcq", text: "Ano ang uri ng pangungusap na nagpapahayag ng utos?", options: ["Pasalaysay", "Patanong", "Padamdam", "Pautos"] },
    { id: "f9", type: "likert", text: "Naiisulat ko ang aking mga nararamdaman sa pamamagitan ng tula." },
    { id: "f10", type: "mcq", text: "Sino ang itinuturing na 'Ama ng Wikang Pambansa'?", options: ["Jose Rizal", "Lope K. Santos", "Manuel Quezon", "Andres Bonifacio"] },
  ],
  Humanities: [
    { id: "h1", type: "likert", text: "I understand the major events of Philippine history." },
    { id: "h2", type: "mcq", text: "What document ended Spanish rule in the Philippines?", options: ["Treaty of Paris", "Malolos Constitution", "Proclamation of Independence", "KKK Manifesto"] },
    { id: "h3", type: "likert", text: "I can analyze how historical events affect present society." },
    { id: "h4", type: "mcq", text: "Who wrote the Noli Me Tangere?", options: ["Andres Bonifacio", "Emilio Aguinaldo", "Jose Rizal", "Marcelo del Pilar"] },
    { id: "h5", type: "likert", text: "I understand basic concepts in economics and government." },
    { id: "h6", type: "mcq", text: "What type of government does the Philippines follow?", options: ["Monarchy", "Federal Republic", "Unitary Presidential Republic", "Parliamentary"] },
    { id: "h7", type: "likert", text: "I can distinguish between different cultural and social perspectives." },
    { id: "h8", type: "mcq", text: "What does 'GDP' stand for?", options: ["General Daily Production", "Gross Domestic Product", "Government Development Plan", "Global Demand Price"] },
    { id: "h9", type: "likert", text: "I enjoy reading about social issues and current events." },
    { id: "h10", type: "mcq", text: "Which branch makes the laws in the Philippines?", options: ["Executive", "Judicial", "Legislative", "Military"] },
  ],
};

const SUBJECTS = Object.keys(academicQuestions);
const LIKERT_OPTIONS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const SECTIONS = ["strand", "riasec", "mbti", "academic"];

const sectionInfo = {
  strand: { title: "SHS Strand", icon: "🎓", desc: "Select your academic track" },
  riasec: { title: "RIASEC Interests", icon: "🧭", desc: "Holland Interest Inventory — 12 items" },
  mbti: { title: "Personality Indicator", icon: "🧠", desc: "8 situational questions" },
  academic: { title: "Academic Assessment", icon: "📚", desc: "10 questions × 6 subjects" },
};

function sectionComplete(section, data) {
  if (section === "strand") return !!data.strand;
  if (section === "riasec") return Object.keys(data.riasecAnswers || {}).length === 12;
  if (section === "mbti") return Object.keys(data.mbtiAnswers || {}).length === 8;
  if (section === "academic") return SUBJECTS.every(s => Object.keys((data.academicAnswers || {})[s] || {}).length === 10);
  return false;
}

// ── Star Rating ──────────────────────────────────────────
function StarRating({ value, onChange }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(val => (
        <TouchableOpacity key={val} onPress={() => onChange(val)} style={styles.starBtn}>
          <Text style={[styles.star, value >= val && styles.starActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────
export default function Assessment() {
  const router = useRouter();
  const { setAssessmentAnswers, setRecommendations } = useAssessment();

  const [openSection, setOpenSection] = useState(null);
  const [strand, setStrand] = useState(null);
  const [riasecAnswers, setRiasecAnswers] = useState({});
  const [mbtiAnswers, setMbtiAnswers] = useState({});
  const [academicAnswers, setAcademicAnswers] = useState({});
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0]);
  const [submitted, setSubmitted] = useState(false);

  const currentData = { strand, riasecAnswers, mbtiAnswers, academicAnswers };
  const completedCount = SECTIONS.filter(s => sectionComplete(s, currentData)).length;
  const progress = completedCount / SECTIONS.length;
  const allComplete = completedCount === SECTIONS.length;

  const setAcademicAnswer = (subject, qid, value) => {
    setAcademicAnswers(prev => ({ ...prev, [subject]: { ...(prev[subject] || {}), [qid]: value } }));
  };

  const handleSubmit = () => {
    const answers = { strand, riasecAnswers, mbtiAnswers, academicAnswers };
    const results = computeRecommendations(answers);
    setAssessmentAnswers(answers);
    setRecommendations(results);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneIcon}>🎓</Text>
          <Text style={styles.doneTitle}>Assessment Complete!</Text>
          <Text style={styles.doneSub}>Your personalized recommendations are ready.</Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace("/(tabs)/dashboard")}
          >
            <Text style={styles.doneBtnText}>View My Recommendations →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/dashboard")} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{completedCount}/{SECTIONS.length} sections complete</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {SECTIONS.map(section => {
          const done = sectionComplete(section, currentData);
          const isOpen = openSection === section;
          const info = sectionInfo[section];

          return (
            <View key={section} style={[styles.sectionCard, done && styles.sectionCardDone, isOpen && styles.sectionCardOpen]}>

              {/* Section Header */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setOpenSection(isOpen ? null : section)}
              >
                <View style={styles.sectionLeft}>
                  <View style={styles.sectionIconBox}>
                    <Text style={styles.sectionIconText}>{info.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionTitle}>{info.title}</Text>
                    <Text style={styles.sectionDesc}>{info.desc}</Text>
                  </View>
                </View>
                <View style={styles.sectionRight}>
                  <View style={done ? styles.doneBadge : styles.pendingBadge}>
                    <Text style={done ? styles.doneBadgeText : styles.pendingBadgeText}>
                      {done ? "✓ Done" : "Pending"}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
                </View>
              </TouchableOpacity>

              {/* Section Body */}
              {isOpen && (
                <View style={styles.sectionBody}>

                  {/* ── STRAND ── */}
                  {section === "strand" && (
                    <View>
                      <Text style={styles.sectionSubtitle}>Select your Senior High School strand.</Text>
                      {strandOptions.map(s => (
                        <TouchableOpacity key={s.value}
                          style={[styles.strandBtn, strand === s.value && styles.strandBtnSelected]}
                          onPress={() => setStrand(s.value)}
                        >
                          <Text style={[styles.strandName, strand === s.value && styles.strandNameSelected]}>{s.value}</Text>
                          <Text style={[styles.strandDesc, strand === s.value && styles.strandDescSelected]}>{s.desc}</Text>
                        </TouchableOpacity>
                      ))}
                      {strand && <TouchableOpacity style={styles.saveSectionBtn} onPress={() => setOpenSection(null)}>
                        <Text style={styles.saveSectionBtnText}>Save & Close ✓</Text>
                      </TouchableOpacity>}
                    </View>
                  )}

                  {/* ── RIASEC ── */}
                  {section === "riasec" && (
                    <View>
                      <Text style={styles.sectionSubtitle}>Rate how much each activity interests you — 1 (not at all) to 5 (very much).</Text>
                      {riasecQuestions.map((q, i) => (
                        <View key={q.id} style={styles.riasecRow}>
                          <View style={styles.riasecTop}>
                            <Text style={styles.riasecNum}>{i + 1}</Text>
                            <Text style={styles.riasecText}>{q.text}</Text>
                          </View>
                          <StarRating
                            value={riasecAnswers[q.id] || 0}
                            onChange={val => setRiasecAnswers({ ...riasecAnswers, [q.id]: val })}
                          />
                        </View>
                      ))}
                      {sectionComplete("riasec", currentData) && (
                        <TouchableOpacity style={styles.saveSectionBtn} onPress={() => setOpenSection(null)}>
                          <Text style={styles.saveSectionBtnText}>Save & Close ✓</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* ── MBTI ── */}
                  {section === "mbti" && (
                    <View>
                      <Text style={styles.sectionSubtitle}>Choose the option that feels most like you for each situation.</Text>
                      {mbtiQuestions.map((q, i) => (
                        <View key={i} style={styles.mbtiBlock}>
                          <Text style={styles.mbtiQuestion}>{q.question}</Text>
                          {q.options.map(opt => (
                            <TouchableOpacity key={opt.value}
                              style={[styles.mbtiOpt, mbtiAnswers[i] === opt.value && styles.mbtiOptSelected]}
                              onPress={() => setMbtiAnswers({ ...mbtiAnswers, [i]: opt.value })}
                            >
                              <Text style={[styles.mbtiLabel, mbtiAnswers[i] === opt.value && styles.mbtiLabelSelected]}>
                                {opt.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                      {sectionComplete("mbti", currentData) && (
                        <TouchableOpacity style={styles.saveSectionBtn} onPress={() => setOpenSection(null)}>
                          <Text style={styles.saveSectionBtnText}>Save & Close ✓</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* ── ACADEMIC ── */}
                  {section === "academic" && (
                    <View>
                      <Text style={styles.sectionSubtitle}>Answer 10 questions per subject. Tap a subject to switch.</Text>

                      {/* Subject Tabs */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectTabsScroll}>
                        {SUBJECTS.map(sub => {
                          const answered = Object.keys((academicAnswers[sub] || {})).length;
                          const subDone = answered === 10;
                          return (
                            <TouchableOpacity key={sub}
                              style={[styles.subjectTab, activeSubject === sub && styles.subjectTabActive, subDone && styles.subjectTabDone]}
                              onPress={() => setActiveSubject(sub)}
                            >
                              <Text style={[styles.subjectTabText, activeSubject === sub && styles.subjectTabTextActive, subDone && styles.subjectTabTextDone]}>
                                {subDone ? "✓ " : ""}{sub}
                              </Text>
                              <Text style={[styles.subjectTabCount, subDone && { color: "#15803d" }]}>{answered}/10</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                      {/* Questions */}
                      {academicQuestions[activeSubject].map((q, i) => {
                        const answered = (academicAnswers[activeSubject] || {})[q.id];
                        return (
                          <View key={q.id} style={[styles.academicQ, answered !== undefined && styles.academicQAnswered]}>
                            <Text style={styles.academicQText}>
                              <Text style={styles.academicQNum}>{i + 1}. </Text>{q.text}
                            </Text>

                            {q.type === "mcq" && (
                              <View style={styles.mcqOptions}>
                                {q.options.map(opt => (
                                  <TouchableOpacity key={opt}
                                    style={[styles.mcqOpt, answered === opt && styles.mcqOptSelected]}
                                    onPress={() => setAcademicAnswer(activeSubject, q.id, opt)}
                                  >
                                    <Text style={[styles.mcqOptText, answered === opt && styles.mcqOptTextSelected]}>{opt}</Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}

                            {q.type === "likert" && (
                              <View style={styles.mcqOptions}>
                                {LIKERT_OPTIONS.map((opt, li) => (
                                  <TouchableOpacity
                                  
                                    key={li}
                                    style={[styles.mcqOpt, answered === opt && styles.mcqOptSelected]}
                                    onPress={() => setAcademicAnswer(activeSubject, q.id, opt)}
                                  >
                                    <Text style={[styles.mcqOptText, answered === opt && styles.mcqOptTextSelected]}>
                                      {opt}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </View>
                        );
                      })}

                      {sectionComplete("academic", currentData) && (
                        <TouchableOpacity style={styles.saveSectionBtn} onPress={() => setOpenSection(null)}>
                          <Text style={styles.saveSectionBtnText}>Save & Close ✓</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Submit */}
        <View style={styles.submitArea}>
          {allComplete ? (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>🎯 Generate My Recommendations</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.submitHint}>Complete all 4 sections to generate recommendations.</Text>
          )}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFCF3" },

  // Header
  header: { backgroundColor: "#4da3f5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 27 },
  backBtn: { width: 90 },
  backBtnText: { color: "white", fontSize: 13, fontWeight: "600", marginTop: 20 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700", marginTop: 20 },

  // Progress
  progressBar: { height: 5, backgroundColor: "#e2e8f0", marginHorizontal: 0 },
  progressFill: { height: "100%", backgroundColor: "#2bbbad" },
  progressLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600", textAlign: "right", paddingHorizontal: 16, paddingVertical: 6 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Section Cards
  sectionCard: { backgroundColor: "white", borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: "#e2e8f0", overflow: "hidden" },
  sectionCardDone: { borderColor: "#86efac" },
  sectionCardOpen: { borderColor: "#4da3f5" },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  sectionIconBox: { width: 40, height: 40, backgroundColor: "#f1f5f9", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  sectionIconText: { fontSize: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  sectionDesc: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  sectionRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  doneBadge: { backgroundColor: "#d4edda", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  doneBadgeText: { fontSize: 11, fontWeight: "700", color: "#155724" },
  pendingBadge: { backgroundColor: "#f1f5f9", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pendingBadgeText: { fontSize: 11, fontWeight: "600", color: "#94a3b8" },
  chevron: { fontSize: 10, color: "#94a3b8" },

  sectionBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  sectionSubtitle: { fontSize: 12, color: "#64748b", marginTop: 14, marginBottom: 16, lineHeight: 18 },

  // Strand
  strandBtn: { borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 12, padding: 14, marginBottom: 8, backgroundColor: "white" },
  strandBtnSelected: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  strandName: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 2 },
  strandNameSelected: { color: "#1a7a74" },
  strandDesc: { fontSize: 11, color: "#94a3b8" },
  strandDescSelected: { color: "#2bbbad" },

  // RIASEC
  riasecRow: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 12, marginBottom: 8 },
  riasecTop: { flexDirection: "row", gap: 8, marginBottom: 10 },
  riasecNum: { fontSize: 10, fontWeight: "700", color: "#94a3b8", minWidth: 18, marginTop: 2 },
  riasecText: { flex: 1, fontSize: 12, color: "#374151", lineHeight: 18 },
  starRow: { flexDirection: "row", gap: 4 },
  starBtn: { padding: 2 },
  star: { fontSize: 22, color: "#d1d5db" },
  starActive: { color: "#FBB217" },

  // MBTI — no letter badges
  mbtiBlock: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 14, marginBottom: 12 },
  mbtiQuestion: { fontSize: 13, fontWeight: "600", color: "#1e293b", marginBottom: 10, lineHeight: 18 },
  mbtiOpt: { borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: "white" },
  mbtiOptSelected: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  mbtiLabel: { fontSize: 12, color: "#374151", lineHeight: 18 },
  mbtiLabelSelected: { color: "#1a7a74", fontWeight: "600" },

  // Academic
  subjectTabsScroll: { marginBottom: 16 },
  subjectTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 2, borderColor: "#e2e8f0", marginRight: 8, backgroundColor: "white", alignItems: "center" },
  subjectTabActive: { borderColor: "#4da3f5", backgroundColor: "#eff6ff" },
  subjectTabDone: { borderColor: "#86efac", backgroundColor: "#f0fdf4" },
  subjectTabText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  subjectTabTextActive: { color: "#4da3f5" },
  subjectTabTextDone: { color: "#15803d" },
  subjectTabCount: { fontSize: 9, fontWeight: "700", color: "#94a3b8", marginTop: 2 },

  academicQ: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: "transparent" },
  academicQAnswered: { borderColor: "#86efac" },
  academicQText: { fontSize: 13, color: "#374151", marginBottom: 12, lineHeight: 18 },
  academicQNum: { fontWeight: "700", color: "#94a3b8" },

  mcqOptions: { gap: 8 },
  mcqOpt: { borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 10, padding: 10, backgroundColor: "white" },
  mcqOptSelected: { borderColor: "#4da3f5", backgroundColor: "#eff6ff" },
  mcqOptText: { fontSize: 12, color: "#374151" },
  mcqOptTextSelected: { color: "#1d4ed8", fontWeight: "700" },

  likertScroll: { marginTop: 0 },
  likertOpt: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 2, borderColor: "#e2e8f0", marginRight: 8, backgroundColor: "white" },
  likertOptSelected: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  likertOptText: { fontSize: 11, fontWeight: "600", color: "#64748b", whiteSpace: "nowrap" },
  likertOptTextSelected: { color: "#1a7a74" },

  // Save section button
  saveSectionBtn: { marginTop: 16, backgroundColor: "#4da3f5", borderRadius: 10, padding: 13, alignItems: "center" },
  saveSectionBtnText: { color: "white", fontSize: 14, fontWeight: "700" },

  // Submit
  submitArea: { paddingVertical: 20, alignItems: "center" },
  submitBtn: { backgroundColor: "#FBB217", borderRadius: 12, paddingHorizontal: 32, paddingVertical: 15, shadowColor: "#FBB217", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  submitHint: { fontSize: 12, color: "#94a3b8", textAlign: "center" },

  // Done screen
  doneContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  doneIcon: { fontSize: 60, marginBottom: 16 },
  doneTitle: { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 10, textAlign: "center" },
  doneSub: { fontSize: 14, color: "#64748b", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  doneBtn: { backgroundColor: "#FBB217", paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  doneBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
});