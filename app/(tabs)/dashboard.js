import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Modal, FlatList, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { useAssessment } from "../../context/AssessmentContext";
import CourseCard from "../../components/CourseCard";

// ── RIASEC info ──────────────────────────────────────────
const riasecInfo = {
  R:{ label:"Realistic",     emoji:"🔧", color:"#e0f2fe", accent:"#0284c7", desc:"You prefer hands-on work, practical tasks, and working with tools, machines, or nature." },
  I:{ label:"Investigative", emoji:"🔬", color:"#f0fdf4", accent:"#16a34a", desc:"You enjoy exploring ideas, solving problems analytically, and working independently." },
  A:{ label:"Artistic",      emoji:"🎨", color:"#fdf4ff", accent:"#9333ea", desc:"You are creative and expressive, thriving in art, design, writing, and performance." },
  S:{ label:"Social",        emoji:"🤝", color:"#fff7ed", accent:"#ea580c", desc:"You enjoy helping, teaching, and working closely with other people." },
  E:{ label:"Enterprising",  emoji:"🚀", color:"#fefce8", accent:"#ca8a04", desc:"You are persuasive, energetic, and enjoy leading or managing others." },
  C:{ label:"Conventional",  emoji:"📋", color:"#f0fdf4", accent:"#15803d", desc:"You prefer structured, orderly work with clear rules and data management." },
};

const mbtiDescriptions = {
  INTJ:"Strategic mastermind. Independent, driven, and long-term focused.",
  INTP:"Logical innovator. Loves theories and abstract thinking.",
  ENTJ:"Commanding leader. Decisive and driven to organize people toward goals.",
  ENTP:"Inventive debater. Challenges norms and generates new ideas.",
  INFJ:"Insightful idealist. Empathetic and committed to meaningful causes.",
  INFP:"Compassionate dreamer. Guided by strong inner values and creativity.",
  ENFJ:"Inspiring mentor. Warm and charismatic, brings out the best in people.",
  ENFP:"Enthusiastic connector. Creative and people-oriented.",
  ISTJ:"Reliable executor. Methodical, detail-oriented, and precise.",
  ISFJ:"Devoted protector. Warm, conscientious, and responsible.",
  ESTJ:"Efficient organizer. Practical, assertive, and results-driven.",
  ESFJ:"Caring host. Warm, sociable, and harmony-oriented.",
  ISTP:"Tactical problem-solver. Cool, observant, and hands-on.",
  ISFP:"Gentle creator. Expresses through aesthetics and action.",
  ESTP:"Bold opportunist. Energetic and excels at improvisation.",
  ESFP:"Vivid entertainer. Spontaneous and connects naturally with others.",
};

const riasecQuestionTypes = {
  q1:"R",q2:"I",q3:"A",q4:"S",q5:"E",q6:"C",
  q7:"R",q8:"I",q9:"A",q10:"S",q11:"E",q12:"C",
};

// ── Calendar ─────────────────────────────────────────────
function CalendarWidget() {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();
  const year  = current.getFullYear();
  const month = current.getMonth();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels  = ["M","T","W","T","F","S","S"];
  const firstDay   = new Date(year,month,1).getDay();
  const offset     = firstDay===0?6:firstDay-1;
  const daysInMonth= new Date(year,month+1,0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const isToday = d => d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();

  return (
    <View style={styles.calWidget}>
      <View style={styles.calHeader}>
        <Text style={styles.calMonth}>{monthNames[month]} {year}</Text>
        <View style={styles.calNav}>
          <TouchableOpacity onPress={()=>setCurrent(new Date(year,month-1,1))} style={styles.calNavBtn}>
            <Text style={styles.calNavText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setCurrent(new Date(year,month+1,1))} style={styles.calNavBtn}>
            <Text style={styles.calNavText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.calGrid}>
        {dayLabels.map((d,i)=>(
          <Text key={i} style={styles.calDayLabel}>{d}</Text>
        ))}
        {cells.map((d,i)=>(
          <View key={i} style={[styles.calCell, isToday(d)&&styles.calToday]}>
            {d!==null&&<Text style={[styles.calCellText, isToday(d)&&styles.calTodayText]}>{d}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Personality Panel ────────────────────────────────────
function PersonalityPanel({ assessmentAnswers }) {
  const [expanded, setExpanded] = useState(null);

  if (!assessmentAnswers) {
    return (
      <View style={styles.panelCard}>
        <Text style={styles.panelTitle}>Your Personality Profile</Text>
        <Text style={styles.panelEmpty}>Complete the assessment to see your RIASEC and MBTI results.</Text>
      </View>
    );
  }

  const { riasecAnswers, mbtiAnswers } = assessmentAnswers;
  const riasecScores = {R:0,I:0,A:0,S:0,E:0,C:0};
  Object.entries(riasecAnswers||{}).forEach(([qid,rating])=>{
    const t = riasecQuestionTypes[qid];
    if(t) riasecScores[t]+=rating;
  });
  const topRIASEC = Object.entries(riasecScores)
    .sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>t);

  const dims = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  Object.values(mbtiAnswers||{}).forEach(v=>{ if(v&&dims[v]!==undefined) dims[v]++; });
  const mbtiType = `${dims.E>=dims.I?"E":"I"}${dims.S>=dims.N?"S":"N"}${dims.T>=dims.F?"T":"F"}${dims.J>=dims.P?"J":"P"}`;

  return (
    <View style={styles.panelCard}>
      <Text style={styles.panelTitle}>Your Personality Profile</Text>

      {/* MBTI */}
      <Text style={styles.panelSectionLabel}>MBTI TYPE</Text>
      <TouchableOpacity
        style={[styles.mbtiBadgeBtn, expanded==="mbti"&&styles.mbtiBadgeBtnActive]}
        onPress={()=>setExpanded(expanded==="mbti"?null:"mbti")}
      >
        <Text style={styles.mbtiTypeText}>{mbtiType}</Text>
        <Text style={styles.chevron}>{expanded==="mbti"?"▲":"▼"}</Text>
      </TouchableOpacity>
      {expanded==="mbti"&&(
        <View style={styles.expandedDesc}>
          <Text style={styles.expandedDescText}>
            <Text style={{fontWeight:"700"}}>{mbtiType}</Text> — {mbtiDescriptions[mbtiType]||"A unique personality type with distinctive strengths."}
          </Text>
        </View>
      )}

      {/* RIASEC */}
      <Text style={[styles.panelSectionLabel,{marginTop:14}]}>TOP RIASEC TYPES</Text>
      {topRIASEC.map(type=>{
        const info = riasecInfo[type];
        return (
          <View key={type}>
            <TouchableOpacity
              style={[styles.riasecChip,{backgroundColor:info.color, borderColor:info.accent}, expanded===type&&{opacity:0.85}]}
              onPress={()=>setExpanded(expanded===type?null:type)}
            >
              <Text style={styles.riasecEmoji}>{info.emoji}</Text>
              <Text style={[styles.riasecChipLabel,{color:info.accent}]}>{type} — {info.label}</Text>
              <Text style={[styles.chevron,{color:info.accent}]}>{expanded===type?"▲":"▼"}</Text>
            </TouchableOpacity>
            {expanded===type&&(
              <View style={styles.expandedDesc}>
                <Text style={styles.expandedDescText}>{info.desc}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── History Modal ────────────────────────────────────────
function HistoryModal({ visible, onClose }) {
  const history = (() => {
    try { return JSON.parse(global.localStorage?.getItem?.("coursify_history")||"[]"); }
    catch { return []; }
  })();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.historyPanel}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Assessment History</Text>
            <TouchableOpacity onPress={onClose} style={styles.historyCloseBtn}>
              <Text style={styles.historyCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          {history.length===0?(
            <View style={styles.historyEmpty}>
              <Text style={styles.historyEmptyIcon}>📭</Text>
              <Text style={styles.historyEmptyText}>No previous assessments yet.</Text>
              <Text style={styles.historyEmptySub}>Each time you retake, results are saved here.</Text>
            </View>
          ):(
            <FlatList
              data={history}
              keyExtractor={(_,i)=>i.toString()}
              contentContainerStyle={{padding:16,gap:12}}
              renderItem={({item})=>(
                <View style={styles.historyEntry}>
                  <View style={styles.historyEntryHeader}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <View style={styles.historyStrandBadge}>
                      <Text style={styles.historyStrandText}>{item.strand}</Text>
                    </View>
                  </View>
                  {(item.recommendations||[]).slice(0,3).map((r,j)=>(
                    <View key={j} style={styles.historyCourseRow}>
                      <Text style={styles.historyCourseName}>{r.course}</Text>
                      <Text style={styles.historyCourseScore}>{r.matchScore}%</Text>
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

// ── Main Dashboard ───────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const { recommendations, assessmentAnswers } = useAssessment();
  const hasResults = recommendations && recommendations.length > 0;
  const [historyVisible, setHistoryVisible] = useState(false);
  const userName = "User 1";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {userName}! 👋</Text>
          <Text style={styles.headerSub}>Welcome back to Coursify</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={()=>setHistoryVisible(true)}
            accessibilityLabel="View history"
          >
            <Text style={styles.historyBtnText}>🕐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={()=>router.replace("/")}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Recommended Courses</Text>
        <Text style={styles.pageSub}>
          {hasResults
            ? `Based on your assessment · Strand: ${assessmentAnswers?.strand||""}`
            : "Complete the assessment to get personalized recommendations."}
        </Text>

        {/* Course Cards */}
        {hasResults ? (
          <>
            {recommendations.map(item=>(
              <CourseCard
                key={item.id}
                id={item.id}
                course={item.course}
                matchScore={item.matchScore}
                reason={item.reason}
                careerPaths={item.careerPaths}
              />
            ))}
            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={()=>router.push("/(tabs)/assessment")}
            >
              <Text style={styles.retakeBtnText}>Retake Assessment</Text>
            </TouchableOpacity>
          </>
        ):(
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No recommendations yet</Text>
            <Text style={styles.emptySub}>Take the assessment to get your personalized course recommendations.</Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={()=>router.push("/(tabs)/assessment")}
            >
              <Text style={styles.startBtnText}>Start Assessment →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Calendar */}
        <CalendarWidget />

        {/* Personality Profile */}
        <PersonalityPanel assessmentAnswers={assessmentAnswers} />

        <View style={{height:20}} />
      </ScrollView>

      <HistoryModal visible={historyVisible} onClose={()=>setHistoryVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex:1, backgroundColor:"#FFFCF3" },

  // Header
  header:        { backgroundColor:"#4da3f5", paddingHorizontal:20, paddingVertical:20, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  greeting:      { fontSize:17, fontWeight:"700", color:"white", marginTop:20 },
  headerSub:     { fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2 },
  headerRight:   { flexDirection:"row", alignItems:"center", gap:8 },
  historyBtn:    { backgroundColor:"rgba(255,255,255,0.2)", width:36, height:36, borderRadius:10, justifyContent:"center", alignItems:"center", marginTop:20 },
  historyBtnText:{ fontSize:18 },
  logoutBtn:     { backgroundColor:"#ff4d4d", paddingHorizontal:12, paddingVertical:7, borderRadius:8, marginTop:20},
  logoutText:    { color:"white", fontSize:12, fontWeight:"700" },

  // Scroll
  scroll:        { flex:1 },
  scrollContent: { padding:20, paddingBottom:40 },

  // Titles
  pageTitle:     { fontSize:22, fontWeight:"700", color:"#1e293b", marginBottom:4 },
  pageSub:       { fontSize:12, color:"#94a3b8", marginBottom:20, lineHeight:18 },

  // Empty
  emptyState:    { backgroundColor:"white", borderRadius:18, padding:36, alignItems:"center", marginBottom:20, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:2 },
  emptyIcon:     { fontSize:44, marginBottom:12 },
  emptyTitle:    { fontSize:17, fontWeight:"700", color:"#1e293b", marginBottom:6 },
  emptySub:      { fontSize:12, color:"#94a3b8", textAlign:"center", lineHeight:18, marginBottom:20 },
  startBtn:      { backgroundColor:"#FBB217", paddingHorizontal:24, paddingVertical:12, borderRadius:10 },
  startBtnText:  { color:"white", fontWeight:"700", fontSize:14 },

  // Retake
  retakeBtn:     { alignItems:"center", paddingVertical:14, marginBottom:8 },
  retakeBtnText: { color:"#4da3f5", fontSize:13, fontWeight:"600" },

  // Calendar
  calWidget:     { backgroundColor:"white", borderRadius:18, padding:18, marginBottom:16, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:2 },
  calHeader:     { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:12 },
  calMonth:      { fontSize:14, fontWeight:"700", color:"#1e293b" },
  calNav:        { flexDirection:"row", gap:4 },
  calNavBtn:     { width:28, height:28, backgroundColor:"#f1f5f9", borderRadius:8, justifyContent:"center", alignItems:"center" },
  calNavText:    { fontSize:16, color:"#64748b" },
  calGrid:       { flexDirection:"row", flexWrap:"wrap" },
  calDayLabel:   { width:"14.28%", textAlign:"center", fontSize:12, fontWeight:"700", color:"#94a3b8", paddingVertical:4 },
  calCell:       { width:"14.28%", justifyContent:"center", alignItems:"center", borderRadius:8 },
  calCellText:   { fontSize:13, color:"#475569", paddingVertical:4 },
  calToday:      { backgroundColor:"#4da3f5" },
  calTodayText:  { color:"white", fontWeight:"800" },

  // Personality Panel
  panelCard:      { backgroundColor:"white", borderRadius:18, padding:18, marginBottom:16, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:2 },
  panelTitle:     { fontSize:14, fontWeight:"700", color:"#1e293b", marginBottom:14 },
  panelEmpty:     { fontSize:12, color:"#94a3b8", lineHeight:18 },
  panelSectionLabel:{ fontSize:10, fontWeight:"700", color:"#94a3b8", letterSpacing:0.8, marginBottom:8 },

  mbtiBadgeBtn:       { flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:"#eff6ff", borderWidth:1.5, borderColor:"#bae6fd", borderRadius:10, padding:12, marginBottom:6 },
  mbtiBadgeBtnActive: { backgroundColor:"#dbeafe", borderColor:"#4da3f5" },
  mbtiTypeText:       { fontSize:20, fontWeight:"800", color:"#0284c7" },
  chevron:            { fontSize:10, color:"#4da3f5" },

  riasecChip:      { flexDirection:"row", alignItems:"center", borderWidth:1.5, borderRadius:10, padding:10, marginBottom:6, gap:8 },
  riasecEmoji:     { fontSize:16 },
  riasecChipLabel: { flex:1, fontSize:12, fontWeight:"700" },

  expandedDesc:    { backgroundColor:"#f8fafc", borderRadius:8, padding:12, marginBottom:6, borderWidth:1, borderColor:"#e2e8f0", marginTop:-4 },
  expandedDescText:{ fontSize:12, color:"#475569", lineHeight:18 },

  // History Modal
  modalOverlay:   { flex:1, backgroundColor:"rgba(15,23,42,0.5)", justifyContent:"flex-end" },
  historyPanel:   { backgroundColor:"white", borderTopLeftRadius:24, borderTopRightRadius:24, maxHeight:"75%", minHeight:300 },
  historyHeader:  { flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:20, borderBottomWidth:1, borderBottomColor:"#f1f5f9" },
  historyTitle:   { fontSize:17, fontWeight:"700", color:"#1e293b" },
  historyCloseBtn:{ backgroundColor:"#f1f5f9", width:32, height:32, borderRadius:8, justifyContent:"center", alignItems:"center" },
  historyCloseText:{ fontSize:14, color:"#64748b" },
  historyEmpty:   { flex:1, alignItems:"center", justifyContent:"center", padding:40 },
  historyEmptyIcon:{ fontSize:44, marginBottom:12 },
  historyEmptyText:{ fontSize:15, fontWeight:"600", color:"#1e293b", marginBottom:6 },
  historyEmptySub: { fontSize:12, color:"#94a3b8", textAlign:"center" },
  historyEntry:   { backgroundColor:"#f8fafc", borderRadius:14, padding:14, borderWidth:1.5, borderColor:"#e2e8f0" },
  historyEntryHeader:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  historyDate:    { fontSize:11, color:"#94a3b8" },
  historyStrandBadge:{ backgroundColor:"#4da3f5", borderRadius:999, paddingHorizontal:10, paddingVertical:3 },
  historyStrandText:{ fontSize:10, fontWeight:"700", color:"white" },
  historyCourseRow:{ flexDirection:"row", justifyContent:"space-between", paddingVertical:4, borderBottomWidth:1, borderBottomColor:"#e2e8f0" },
  historyCourseName:{ fontSize:12, color:"#475569", flex:1 },
  historyCourseScore:{ fontSize:11, fontWeight:"700", color:"#4da3f5" },
});