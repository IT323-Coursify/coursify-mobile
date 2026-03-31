import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const coursesData = [
  {
    id: '1',
    title: 'Engineering',
    description: 'Study of designing, building, and maintaining structures, machines, and systems across various engineering fields.',
    duration: '5 years',
    careerPaths: [
      'Civil Engineer',
      'Electrical Engineer',
      'Mechanical Engineer',
      'Geodetic Engineer',
      'Environmental Engineer',
      'Naval Architect'
    ],
    futureWork: [
      'Design infrastructure like roads and buildings',
      'Develop electrical systems and power solutions',
      'Create mechanical machines and tools',
      'Work on environmental sustainability projects',
      'Design marine vessels and offshore structures'
    ]
  },
  {
    id: '2',
    title: 'Computer Science and Information Systems',
    description: 'Focuses on computing, software development, and managing information systems in organizations.',
    duration: '4 years',
    careerPaths: [
      'Software Developer',
      'IT Specialist',
      'Data Scientist',
      'System Analyst'
    ],
    futureWork: [
      'Develop software applications',
      'Manage databases and systems',
      'Analyze and interpret data',
      'Create IT solutions for businesses',
      'Design and maintain networks'
    ]
  },
  {
    id: '3',
    title: 'Technology',
    description: 'Hands-on study of industrial and technical systems used in modern industries and production.',
    duration: '4 years',
    careerPaths: [
      'Technician',
      'Automation Specialist',
      'Manufacturing Engineer',
      'Energy Systems Manager'
    ],
    futureWork: [
      'Operate and maintain machines',
      'Develop automated systems',
      'Improve manufacturing processes',
      'Work on energy efficiency projects',
      'Handle technical repairs and diagnostics'
    ]
  },
  {
    id: '4',
    title: 'Life Sciences',
    description: 'Study of living organisms, agriculture, and environmental sustainability.',
    duration: '4 years',
    careerPaths: [
      'Agriculturist',
      'Marine Biologist',
      'Horticulturist',
      'Animal Scientist'
    ],
    futureWork: [
      'Manage farms and agricultural systems',
      'Conduct marine research',
      'Develop sustainable farming techniques',
      'Work in environmental conservation',
      'Improve food production systems'
    ]
  },
  {
    id: '5',
    title: 'Natural Sciences',
    description: 'Focus on scientific principles in mathematics, physics, chemistry, and environmental science.',
    duration: '4 years',
    careerPaths: [
      'Scientist',
      'Research Analyst',
      'Laboratory Technician',
      'Environmental Specialist'
    ],
    futureWork: [
      'Conduct scientific research',
      'Work in laboratories',
      'Analyze environmental data',
      'Develop scientific solutions',
      'Teach and share scientific knowledge'
    ]
  },
  {
    id: '6',
    title: 'Social Sciences',
    description: 'Study of society, education, and human behavior in different social contexts.',
    duration: '4 years',
    careerPaths: [
      'Teacher',
      'Social Worker',
      'Community Development Officer',
      'Vocational Instructor'
    ],
    futureWork: [
      'Teach in schools and institutions',
      'Work with communities and social programs',
      'Develop educational materials',
      'Support social welfare initiatives',
      'Train students in technical skills'
    ]
  },
  {
    id: '7',
    title: 'Art and Humanities',
    description: 'Focus on creative design, culture, and human expression through architecture and arts.',
    duration: '5 years',
    careerPaths: [
      'Architect',
    ],
    futureWork: [
      'Design buildings and structures',
      'Plan urban spaces',
      'Create architectural drawings',
      'Work on construction projects',
      'Develop sustainable design concepts'
    ]
  }
];

function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.courseCard} 
      onPress={() => onPress(course)} 
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{course.duration}</Text>
        </View>
      </View>
      <Text style={styles.courseDescription} numberOfLines={2}>
        {course.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Tap for details →</Text>
      </View>
    </TouchableOpacity>
  );
}

function CourseDetailModal({ visible, course, onClose }) {
  if (!course) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{course.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Duration Badge in Modal */}
            <View style={styles.modalDurationBadge}>
              <Text style={styles.modalDurationText}>⏱ Duration: {course.duration}</Text>
            </View>

            {/* Description Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>📖 About This Course</Text>
              <Text style={styles.sectionText}>{course.description}</Text>
            </View>

            {/* Career Paths Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>💼 Career Paths</Text>
              <View style={styles.careerList}>
                {course.careerPaths.map((career, index) => (
                  <View key={index} style={styles.careerItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.careerText}>{career}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Future Work Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>🚀 Future Work Aligned With This Course</Text>
              <View style={styles.futureWorkList}>
                {course.futureWork.map((work, index) => (
                  <View key={index} style={styles.futureWorkItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.futureWorkText}>{work}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Close Button at Bottom */}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Courses() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCoursePress = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4da3f5" />

      {/* Header - Same as Dashboard */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>All Courses</Text>
          <Text style={styles.headerSub}>Explore our course offerings</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Available Courses</Text>
          <Text style={styles.pageSub}>
            Tap any course card to see detailed information and future work opportunities
          </Text>
        </View>

        {/* Courses Grid */}
        <View style={styles.coursesGrid}>
          {coursesData.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={handleCoursePress}
            />
          ))}
        </View>
      </ScrollView>

      <CourseDetailModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFCF3",
  },
  // Header styles
  header: {
    backgroundColor: "#4da3f5",
    paddingHorizontal: 20,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginTop: 22,
  },
  headerSub: {
    fontSize: 12,
    color: "white",  // Changed to white
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Title Section
  titleSection: { 
    marginBottom: 20 
  },
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
  // Course Card Styles
  coursesGrid: {
    gap: 16,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  durationBadge: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: "#4da3f5",
    fontWeight: "600",
  },
  courseDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#FBB217",
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "600",
  },
  modalDurationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  modalDurationText: {
    fontSize: 13,
    color: "#4da3f5",
    fontWeight: "600",
  },
  durationHint: {
    fontSize: 11,
    color: "#6b7280",
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  careerList: {
    gap: 10,
  },
  careerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#4da3f5",
    fontWeight: "bold",
  },
  careerText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  futureWorkList: {
    gap: 12,
  },
  futureWorkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkmark: {
    fontSize: 16,
    color: "#2bbbad",
    fontWeight: "bold",
    marginTop: 1,
  },
  futureWorkText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  modalCloseBtn: {
    backgroundColor: "#4da3f5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  modalCloseBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});