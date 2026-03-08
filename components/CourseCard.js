import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

function getScoreStyle(score) {
  if (score >= 80) return styles.highScore;
  if (score >= 60) return styles.mediumScore;
  return styles.lowScore;
}

function getScoreTextStyle(score) {
  if (score >= 80) return styles.highScoreText;
  if (score >= 60) return styles.mediumScoreText;
  return styles.lowScoreText;
}

export default function CourseCard({ id, course, matchScore, reason, careerPaths }) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Text style={styles.courseTitle}>{course}</Text>
      <Text style={styles.reason}>{reason}</Text>

      <View style={styles.pillRow}>
        {(careerPaths || []).slice(0, 3).map((career, i) => (
          <View key={i} style={styles.pill}>
            <Text style={styles.pillText}>{career}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.scoreBadge, getScoreStyle(matchScore)]}>
          <Text style={[styles.scoreText, getScoreTextStyle(matchScore)]}>
            Match: {matchScore}%
          </Text>
        </View>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => router.push(`/(tabs)/course/${id}`)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${course}`}
        >
          <Text style={styles.detailsBtnText}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  reason: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 18,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  pill: {
    backgroundColor: "#f0f9ff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    color: "#4da3f5",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  scoreText: { fontSize: 12, fontWeight: "700" },
  highScore: { backgroundColor: "#d4edda" },
  highScoreText: { color: "#155724" },
  mediumScore: { backgroundColor: "#fff3cd" },
  mediumScoreText: { color: "#856404" },
  lowScore: { backgroundColor: "#f8d7da" },
  lowScoreText: { color: "#721c24" },
  detailsBtn: { padding: 4 },
  detailsBtnText: {
    fontSize: 13,
    color: "#4da3f5",
    fontWeight: "600",
  },
});