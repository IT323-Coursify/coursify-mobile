import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

function getScoreBg(score) {
  if (score >= 80) return "#d4edda";
  if (score >= 60) return "#fff3cd";
  return "#f8d7da";
}
function getScoreColor(score) {
  if (score >= 80) return "#155724";
  if (score >= 60) return "#856404";
  return "#721c24";
}

export default function CourseCard({ id, course, matchScore, reason, careerPaths }) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{course}</Text>
      <Text style={styles.reason}>{reason}</Text>
      <View style={styles.pills}>
        {(careerPaths||[]).slice(0,3).map((c,i) => (
          <View key={i} style={styles.pill}>
            <Text style={styles.pillText}>{c}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <View style={[styles.badge,{backgroundColor:getScoreBg(matchScore)}]}>
          <Text style={[styles.badgeText,{color:getScoreColor(matchScore)}]}>
            Match: {matchScore}%
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/(tabs)/course/${id}`)}>
          <Text style={styles.detailsBtn}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor:"#fff", borderRadius:16, padding:18, marginBottom:14, shadowColor:"#000", shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:10, elevation:3 },
  title:      { fontSize:15, fontWeight:"700", color:"#1e293b", marginBottom:5 },
  reason:     { fontSize:12, color:"#64748b", marginBottom:12, lineHeight:18 },
  pills:      { flexDirection:"row", flexWrap:"wrap", gap:6, marginBottom:12 },
  pill:       { backgroundColor:"#eff6ff", borderRadius:999, paddingHorizontal:10, paddingVertical:3 },
  pillText:   { fontSize:10, color:"#4da3f5", fontWeight:"600" },
  footer:     { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  badge:      { borderRadius:999, paddingHorizontal:10, paddingVertical:4 },
  badgeText:  { fontSize:11, fontWeight:"700" },
  detailsBtn: { fontSize:12, color:"#4da3f5", fontWeight:"700" },
});