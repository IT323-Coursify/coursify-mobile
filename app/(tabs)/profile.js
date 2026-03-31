import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Switch
} from "react-native";
import { useRouter } from "expo-router";

const allInterests = [
  "Technology & Coding", "Business & Entrepreneurship",
  "Healthcare & Medicine", "Arts & Design",
  "Teaching & Education", "Engineering",
  "Social Work", "Research & Science",
];

const workStyles = [
  "I enjoy working alone",
  "I prefer small teams",
  "I love large collaborative groups",
  "I like a mix of both",
];

const careerPriorities = [
  "High salary & financial stability",
  "Making a difference in society",
  "Creative freedom & expression",
  "Continuous learning & growth",
];

export default function Profile() {
  const router = useRouter();
  const userName = "User 1";

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: userName,
    email: "student1@coursify.com",
    gradeLevel: "Grade 12",
    strand: "STEM",
  });

  const [draft, setDraft] = useState({ ...profile });

  const [preferences, setPreferences] = useState({
    interestedIn: ["Technology & Coding", "Research & Science"],
    preferredWorkStyle: "I like a mix of both",
    careerPriority: "Continuous learning & growth",
  });

  const handleEditToggle = () => {
    if (isEditing) setDraft({ ...profile }); // cancel — revert
    setIsEditing(!isEditing);
    setSaved(false);
  };

  const handleSave = () => {
    setProfile({ ...draft });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleInterest = (interest) => {
    const current = preferences.interestedIn;
    setPreferences({
      ...preferences,
      interestedIn: current.includes(interest)
        ? current.filter(i => i !== interest)
        : [...current, interest],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/dashboard")} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 90 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.avatarName}>{profile.name}</Text>
          <Text style={styles.avatarRole}>SHS Student · {profile.strand}</Text>
        </View>

        {/* Save Toast */}
        {saved && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>✓ Profile saved successfully!</Text>
          </View>
        )}

        {/* ── Personal Information ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity style={styles.editBtn} onPress={handleEditToggle}>
              <Text style={styles.editBtnText}>{isEditing ? "Cancel" : "✏️ Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>FULL NAME</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={draft.name}
                  onChangeText={v => setDraft({ ...draft, name: v })}
                  placeholder="Full Name"
                />
              ) : <Text style={styles.infoValue}>{profile.name}</Text>}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>EMAIL</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={draft.email}
                  onChangeText={v => setDraft({ ...draft, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Email"
                />
              ) : <Text style={styles.infoValue}>{profile.email}</Text>}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>GRADE LEVEL</Text>
              {isEditing ? (
                <View style={styles.selectRow}>
                  {["Grade 11", "Grade 12"].map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.selectOpt, draft.gradeLevel === g && styles.selectOptActive]}
                      onPress={() => setDraft({ ...draft, gradeLevel: g })}
                    >
                      <Text style={[styles.selectOptText, draft.gradeLevel === g && styles.selectOptTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : <Text style={styles.infoValue}>{profile.gradeLevel}</Text>}
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>STRAND</Text>
              {isEditing ? (
                <View style={styles.selectRow}>
                  {["STEM", "ABM", "HUMSS", "TVL", "GAS"].map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.selectOpt, draft.strand === s && styles.selectOptActive]}
                      onPress={() => setDraft({ ...draft, strand: s })}
                    >
                      <Text style={[styles.selectOptText, draft.strand === s && styles.selectOptTextActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : <Text style={styles.infoValue}>{profile.strand}</Text>}
            </View>

          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Course Preferences ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Course Preferences</Text>
          </View>
          <Text style={styles.cardNote}>Adjusting these updates your recommendations.</Text>

          {/* Interests */}
          <Text style={styles.prefLabel}>INTERESTS</Text>
          <View style={styles.chipsWrap}>
            {allInterests.map(interest => {
              const selected = preferences.interestedIn.includes(interest);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleInterest(interest)}
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {selected ? "✓ " : ""}{interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Work Style */}
          <Text style={[styles.prefLabel, { marginTop: 20 }]}>PREFERRED WORK STYLE</Text>
          {workStyles.map(style => (
            <TouchableOpacity
              key={style}
              style={[styles.radioRow, preferences.preferredWorkStyle === style && styles.radioRowSelected]}
              onPress={() => setPreferences({ ...preferences, preferredWorkStyle: style })}
            >
              <Text style={[styles.radioIcon, preferences.preferredWorkStyle === style && styles.radioIconSelected]}>
                {preferences.preferredWorkStyle === style ? "●" : "○"}
              </Text>
              <Text style={[styles.radioText, preferences.preferredWorkStyle === style && styles.radioTextSelected]}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Career Priority */}
          <Text style={[styles.prefLabel, { marginTop: 20 }]}>CAREER PRIORITY</Text>
          {careerPriorities.map(goal => (
            <TouchableOpacity
              key={goal}
              style={[styles.radioRow, preferences.careerPriority === goal && styles.radioRowSelected]}
              onPress={() => setPreferences({ ...preferences, careerPriority: goal })}
            >
              <Text style={[styles.radioIcon, preferences.careerPriority === goal && styles.radioIconSelected]}>
                {preferences.careerPriority === goal ? "●" : "○"}
              </Text>
              <Text style={[styles.radioText, preferences.careerPriority === goal && styles.radioTextSelected]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          >
            <Text style={styles.saveBtnText}>Update Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.logoutText}>⎋  Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6fb" },

  // Header
  header: { backgroundColor: "#4da3f5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 90 },
  backBtnText: { color: "white", fontSize: 13, fontWeight: "600" },
  headerTitle: { color: "white", fontSize: 16, fontWeight: "700" },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  // Avatar
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#4da3f5", justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#4da3f5", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  avatarText: { fontSize: 30, fontWeight: "800", color: "white" },
  avatarName: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 3 },
  avatarRole: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },

  // Toast
  toast: { backgroundColor: "#d4edda", borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 16 },
  toastText: { color: "#155724", fontSize: 13, fontWeight: "700" },

  // Card
  card: { backgroundColor: "white", borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1.5, borderColor: "#f1f5f9" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1.5, borderBottomColor: "#f1f5f9" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  cardNote: { fontSize: 12, color: "#94a3b8", marginBottom: 16, marginTop: -8 },

  // Edit button
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: "#e2e8f0" },
  editBtnText: { fontSize: 12, fontWeight: "600", color: "#64748b" },

  // Info grid
  infoGrid: { gap: 16, marginBottom: 4 },
  infoField: { gap: 5 },
  infoLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.8 },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#1e293b" },

  // Input
  input: { borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 10, padding: 10, fontSize: 14, color: "#1e293b", backgroundColor: "#f8fafc" },

  // Select options (grade/strand)
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  selectOpt: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#f8fafc" },
  selectOptActive: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  selectOptText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  selectOptTextActive: { color: "#1a7a74" },

  // Save button
  saveBtn: { backgroundColor: "#FBB217", borderRadius: 10, padding: 13, alignItems: "center", marginTop: 16 },
  saveBtnText: { color: "white", fontSize: 14, fontWeight: "700" },

  // Preferences
  prefLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.8, marginBottom: 10 },

  // Interest chips
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#f8fafc" },
  chipSelected: { backgroundColor: "#4da3f5", borderColor: "transparent" },
  chipText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  chipTextSelected: { color: "white" },

  // Radio rows
  radioRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: "#e2e8f0", backgroundColor: "#f8fafc", marginBottom: 8 },
  radioRowSelected: { borderColor: "#2bbbad", backgroundColor: "#f0fdf4" },
  radioIcon: { fontSize: 16, color: "#94a3b8" },
  radioIconSelected: { color: "#2bbbad" },
  radioText: { fontSize: 13, color: "#475569", flex: 1, fontWeight: "500" },
  radioTextSelected: { color: "#1a7a74", fontWeight: "600" },

  // Logout card
  logoutCard: { backgroundColor: "white", borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1.5, borderColor: "#fecaca", marginBottom: 8 },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
});