import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

// Programs with their courses and details - Same as web version
const programsData = [
  {
    id: "eng",
    title: "Engineering",
    courses: [
      { id: "civil", title: "Civil Engineering", description: "Study of designing, building, and maintaining structures like roads and bridges.", duration: "5 years", careerPaths: ["Civil Engineer", "Structural Engineer", "Construction Manager"], futureWork: ["Design infrastructure like roads and buildings","Supervise construction projects","Ensure safety and compliance in structures"] },
      { id: "electrical", title: "Electrical Engineering", description: "Focus on electrical systems, circuits, and power generation.", duration: "5 years", careerPaths: ["Electrical Engineer", "Power Systems Engineer"], futureWork: ["Develop electrical systems and power solutions","Work on renewable energy projects","Design electronic circuits"] },
      { id: "computer_eng", title: "Computer Engineering", description: "Combines software and hardware design for computing systems.", duration: "5 years", careerPaths: ["Computer Engineer", "Embedded Systems Developer"], futureWork: ["Design computer hardware","Develop embedded systems","Integrate software and hardware"] },
      { id: "mechanical", title: "Mechanical Engineering", description: "Design and develop mechanical machines and systems.", duration: "5 years", careerPaths: ["Mechanical Engineer", "Automation Specialist"], futureWork: ["Create mechanical machines and tools","Improve manufacturing processes","Develop automated systems"] },
      { id: "geodetic", title: "Geodetic Engineering", description: "Surveying, mapping, and earth measurement science.", duration: "5 years", careerPaths: ["Geodetic Engineer", "Survey Engineer"], futureWork: ["Conduct land surveys","Develop mapping solutions","Work on GIS projects"] },
      { id: "electronics", title: "Electronics Engineering", description: "Focus on designing electronic circuits and devices.", duration: "5 years", careerPaths: ["Electronics Engineer", "Circuit Designer"], futureWork: ["Develop electronic devices","Design circuits","Work on communication systems"] },
      { id: "environmental", title: "Environmental Engineering", description: "Design solutions for environmental protection and sustainability.", duration: "5 years", careerPaths: ["Environmental Engineer", "Sustainability Specialist"], futureWork: ["Develop sustainable systems","Manage waste and pollution projects","Ensure environmental compliance"] },
      { id: "agri_bio", title: "Agricultural and Biosystems Engineering", description: "Combine agriculture and engineering to improve farming systems.", duration: "5 years", careerPaths: ["Agricultural Engineer", "Biosystems Analyst"], futureWork: ["Improve farming technology","Develop irrigation systems","Optimize food production processes"] },
      { id: "naval", title: "Naval Architecture and Marine Engineering", description: "Design ships, boats, and marine structures.", duration: "5 years", careerPaths: ["Naval Architect", "Marine Engineer"], futureWork: ["Design marine vessels","Develop offshore structures","Ensure safety at sea"] },
    ],
  },
  {
    id: "csis",
    title: "Computer Science and Information Systems",
    courses: [
      { id: "cs", title: "Computer Science", description: "Software development, algorithms, and computing principles.", duration: "4 years", careerPaths: ["Software Developer", "System Analyst"], futureWork: ["Develop software applications","Manage systems","Create IT solutions for businesses"] },
      { id: "data_science", title: "Data Science", description: "Analyze data to extract insights for businesses and research.", duration: "4 years", careerPaths: ["Data Scientist", "Data Analyst"], futureWork: ["Analyze and interpret data","Create predictive models","Develop data-driven solutions"] },
      { id: "tech_comm_mgmt", title: "Technology Communication Management", description: "Manage IT projects and communication systems.", duration: "4 years", careerPaths: ["IT Project Manager", "Communication Specialist"], futureWork: ["Lead IT projects","Manage communication technologies","Develop organizational IT strategies"] },
      { id: "it", title: "Information Technology", description: "Focus on managing IT systems and infrastructure.", duration: "4 years", careerPaths: ["IT Specialist", "Network Administrator"], futureWork: ["Maintain IT systems","Manage networks","Support technical operations"] },
    ],
  },
  {
    id: "tech",
    title: "Technology",
    courses: [
      { id: "agri_tech", title: "Agricultural Technology", description: "Hands-on study of modern agricultural systems.", duration: "4 years", careerPaths: ["Agri-Technologist", "Farm Manager"], futureWork: ["Manage farms","Develop efficient farming systems","Work with agricultural machinery"] },
      { id: "autotronics", title: "Autotronics", description: "Integration of automotive and electronics systems.", duration: "4 years", careerPaths: ["Autotronics Technician", "Automotive Engineer"], futureWork: ["Develop automotive electronics","Work on vehicle automation","Maintain automotive systems"] },
      { id: "electro_mech", title: "Electro-Mechanical Technology", description: "Combining mechanical and electrical systems.", duration: "4 years", careerPaths: ["Electro-Mechanical Technician","Industrial Automation Engineer"], futureWork: ["Maintain machinery","Develop automated systems","Integrate electrical and mechanical solutions"] },
      { id: "electronics_tech", title: "Electronics Technology", description: "Study of electronics and circuits in technical systems.", duration: "4 years", careerPaths: ["Electronics Technician","Circuit Developer"], futureWork: ["Design circuits","Maintain electronic systems","Work on communication technology"] },
      { id: "energy_mgmt", title: "Energy Systems and Management", description: "Managing energy production and efficiency.", duration: "4 years", careerPaths: ["Energy Manager","Power Systems Engineer"], futureWork: ["Develop sustainable energy solutions","Manage energy systems","Work on efficiency projects"] },
      { id: "food_proc", title: "Food Processing and Technology", description: "Processing and preservation of food products.", duration: "4 years", careerPaths: ["Food Technologist","Quality Analyst"], futureWork: ["Develop food processing techniques","Ensure food safety","Improve production efficiency"] },
      { id: "manufacturing", title: "Manufacturing Engineering Technology", description: "Production systems and industrial processes.", duration: "4 years", careerPaths: ["Manufacturing Engineer","Process Engineer"], futureWork: ["Optimize manufacturing processes","Implement automation","Manage industrial systems"] },
    ],
  },
  {
    id: "life",
    title: "Life Sciences",
    courses: [
      { id: "agriculture", title: "Agriculture", description: "Major in Animal Science, Crop Science, Entrepreneurship, Dairy Science, Agricultural Education.", duration: "4 years", careerPaths: ["Agriculturist","Farm Manager"], futureWork: ["Manage farms","Develop sustainable agriculture","Optimize food production"] },
      { id: "agroforestry", title: "Agroforestry", description: "Integrating trees and crops for sustainable land use.", duration: "4 years", careerPaths: ["Agroforestry Specialist","Environmental Planner"], futureWork: ["Plan tree-crop systems","Manage sustainable lands","Improve soil quality"] },
      { id: "horticulture", title: "Horticulture and Management", description: "Cultivation of plants for food, medicine, and decoration.", duration: "4 years", careerPaths: ["Horticulturist","Landscape Manager"], futureWork: ["Develop gardens and farms","Grow crops efficiently","Manage plant production"] },
      { id: "marine_bio", title: "Marine Biology", description: "Study of marine organisms and ecosystems.", duration: "4 years", careerPaths: ["Marine Biologist","Researcher"], futureWork: ["Conduct marine research","Protect marine ecosystems","Analyze marine life"] },
    ],
  },
  {
    id: "natural",
    title: "Natural Sciences",
    courses: [
      { id: "applied_math", title: "Applied Mathematics", description: "Mathematical techniques for real-world problems.", duration: "4 years", careerPaths: ["Mathematician","Data Analyst"], futureWork: ["Model real-world problems","Analyze data","Develop mathematical solutions"] },
      { id: "applied_physics", title: "Applied Physics", description: "Physics applied in technology and engineering.", duration: "4 years", careerPaths: ["Physicist","Research Scientist"], futureWork: ["Conduct experiments","Develop technology solutions","Analyze physical systems"] },
      { id: "chemistry", title: "Chemistry", description: "Study of chemical processes and materials.", duration: "4 years", careerPaths: ["Chemist","Lab Technician"], futureWork: ["Develop materials","Conduct chemical experiments","Ensure safety in chemical processes"] },
      { id: "env_sci", title: "Environmental Science", description: "Study of the environment and sustainability.", duration: "4 years", careerPaths: ["Environmental Scientist","Sustainability Officer"], futureWork: ["Analyze environmental data","Develop conservation plans","Manage sustainability projects"] },
    ],
  },
  {
    id: "social",
    title: "Social Sciences",
    courses: [
      { id: "sec_math", title: "Secondary Education (Math)", description: "Major in Mathematics for teaching.", duration: "4 years", careerPaths: ["Math Teacher","Education Specialist"], futureWork: ["Teach mathematics","Develop educational materials","Support students learning"] },
      { id: "sec_sci", title: "Secondary Education (Science)", description: "Major in Science for teaching.", duration: "4 years", careerPaths: ["Science Teacher","Education Specialist"], futureWork: ["Teach science","Create experiments","Support student learning"] },
      { id: "social_work", title: "Social Work", description: "Support communities and individuals.", duration: "4 years", careerPaths: ["Social Worker","Community Officer"], futureWork: ["Assist communities","Develop social programs","Support vulnerable groups"] },
      { id: "tech_voc", title: "Technical-Vocational Teacher", description: "Teach vocational and technical skills.", duration: "4 years", careerPaths: ["Vocational Instructor","Technical Teacher"], futureWork: ["Teach technical skills","Create curriculum","Support students development"] },
      { id: "tle", title: "Technology and Livelihood Education", description: "Major in Industrial Arts, Home Economics.", duration: "4 years", careerPaths: ["TLE Teacher","Skills Trainer"], futureWork: ["Teach life skills","Manage student projects","Develop practical learning programs"] },
    ],
  },
  {
    id: "art",
    title: "Art and Humanities",
    courses: [
      { id: "architecture", title: "Architecture", description: "Study of design, structures, and human spaces.", duration: "5 years", careerPaths: ["Architect"], futureWork: ["Design buildings and structures","Plan urban spaces","Create architectural drawings"] },
    ],
  },
];

// Course Card Component
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

// Program Card Component - Groups courses under a program title
function ProgramCard({ program, onCoursePress }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.programCard}>
      <TouchableOpacity 
        style={styles.programHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.programTitle}>{program.title}</Text>
        <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.programCourses}>
          {program.courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onPress={onCoursePress} 
            />
          ))}
        </View>
      )}
    </View>
  );
}

// Course Detail Modal
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

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Programs & Courses</Text>
          <Text style={styles.headerSub}>Explore our programs and course offerings</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Programs & Courses</Text>
          <Text style={styles.pageSub}>
            Tap any course card to see detailed information and future work opportunities
          </Text>
        </View>

        {/* Programs Grid */}
        <View style={styles.programsContainer}>
          {programsData.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              onCoursePress={handleCoursePress} 
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
    color: "white",
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
  // Program Card Styles
  programsContainer: {
    gap: 20,
  },
  programCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  programHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  programTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4da3f5",
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6b7280",
  },
  programCourses: {
    padding: 12,
    gap: 12,
  },
  // Course Card Styles
  courseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e8f4f8",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  durationBadge: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 10,
    color: "#4da3f5",
    fontWeight: "600",
  },
  courseDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 11,
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
    fontSize: 22,
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
    alignSelf: "flex-start",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalDurationText: {
    fontSize: 13,
    color: "#4da3f5",
    fontWeight: "600",
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