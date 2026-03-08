import {View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar} from "react-native";
import { useRouter } from "expo-router";
import { useAssessment } from "../../context/AssessmentContext";
import CourseCard from "../../components/CourseCard";

export default function Dashboard() {
  const router = useRouter();
  const { recommendations, assessmentAnswers } = useAssessment();
  const hasResults = recommendations && recommendations.length > 0;
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
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/")}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Recommended Courses</Text>
          <Text style={styles.pageSub}>
            {hasResults
              ? `Based on your assessment — Strand: ${assessmentAnswers?.strand || ""}`
              : "Complete the assessment to get your personalized recommendations."}
          </Text>
        </View>

        {hasResults ? (
          <View>
            {recommendations.map((item) => (
              <CourseCard
                key={item.id}
                id={item.id}
                course={item.course}
                matchScore={item.matchScore}
                reason={item.reason}
                careerPaths={item.careerPaths}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No recommendations yet</Text>
            <Text style={styles.emptySub}>
              Take the assessment so we can tailor course recommendations to your profile.
            </Text>
            <TouchableOpacity
              style={styles.assessBtn}
              onPress={() => router.push("/(tabs)/assessment")}
              accessibilityRole="button"
            >
              <Text style={styles.assessBtnText}>Start Assessment →</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasResults && (
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => router.push("/(tabs)/assessment")}
          >
            <Text style={styles.retakeBtnText}>Retake Assessment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFCF3",
  },
  header: {
    backgroundColor: "#4da3f5",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: { marginBottom: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  assessBtn: {
    backgroundColor: "#FBB217",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
  },
  assessBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  retakeBtn: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 12,
  },
  retakeBtnText: {
    color: "#4da3f5",
    fontSize: 14,
    fontWeight: "600",
  },
});