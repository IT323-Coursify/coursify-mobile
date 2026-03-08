const courses = [
  {
    id: 1,
    course: "BS Computer Science",
    description: "Focuses on algorithms, software development, and computational theory. Students build software systems and solve complex technical problems.",
    careerPaths: ["Software Engineer", "Data Scientist", "ML Engineer", "Systems Analyst", "Cybersecurity Specialist"],
    riasec: { I: 3, R: 2, C: 1 },
    mbti: ["INTJ", "INTP", "ISTJ", "ISTP", "ENTJ", "ENTP"],
    strands: { STEM: 3, TVL: 1, ABM: 0, HUMSS: 0, GAS: 1 },
    subjects: { Math: 3, Science: 2, Computer: 3, English: 1 },
  },
  {
    id: 2,
    course: "BS Information Technology",
    description: "Bridges technology and real-world application. Focuses on networks, databases, web systems, and IT infrastructure.",
    careerPaths: ["IT Manager", "Network Admin", "Web Developer", "Database Admin", "IT Consultant"],
    riasec: { I: 2, R: 2, C: 2 },
    mbti: ["ISTJ", "ESTJ", "ISTP", "ESTP", "ENTJ", "INTJ"],
    strands: { STEM: 3, TVL: 2, ABM: 1, HUMSS: 0, GAS: 1 },
    subjects: { Math: 2, Science: 1, Computer: 3, English: 1 },
  },
  {
    id: 3,
    course: "BS Information Systems",
    description: "Combines business fundamentals with IT. Focuses on designing systems that support organizational decision-making.",
    careerPaths: ["Business Analyst", "Systems Analyst", "ERP Consultant", "Project Manager", "IT Auditor"],
    riasec: { E: 2, C: 2, I: 1 },
    mbti: ["ESTJ", "ENTJ", "ISTJ", "ENFJ", "ESFJ"],
    strands: { STEM: 2, ABM: 3, TVL: 1, HUMSS: 1, GAS: 2 },
    subjects: { Math: 2, Science: 1, Computer: 2, English: 2 },
  },
  {
    id: 4,
    course: "BS Business Administration",
    description: "Covers management, marketing, finance, and entrepreneurship. Prepares students to lead and manage organizations.",
    careerPaths: ["Business Manager", "Marketing Specialist", "Entrepreneur", "Financial Analyst", "HR Manager"],
    riasec: { E: 3, S: 2, C: 1 },
    mbti: ["ESTJ", "ENTJ", "ESTP", "ENFJ", "ESFJ", "ENTP"],
    strands: { ABM: 3, HUMSS: 2, GAS: 2, STEM: 1, TVL: 1 },
    subjects: { Math: 2, English: 2, Filipino: 1, History: 1 },
  },
  {
    id: 5,
    course: "BS Psychology",
    description: "Studies human behavior, mental processes, and emotional wellbeing.",
    careerPaths: ["Psychologist", "Guidance Counselor", "HR Specialist", "Researcher", "Social Worker"],
    riasec: { S: 3, I: 2, A: 1 },
    mbti: ["INFJ", "INFP", "ENFJ", "ENFP", "ISFJ", "ESFJ"],
    strands: { HUMSS: 3, ABM: 1, GAS: 2, STEM: 1, TVL: 0 },
    subjects: { English: 3, Filipino: 2, History: 2, Science: 1 },
  },
  {
    id: 6,
    course: "BS Nursing",
    description: "Trains students in patient care, health assessment, and clinical practice.",
    careerPaths: ["Registered Nurse", "Clinical Nurse", "Public Health Nurse", "Nurse Educator", "Healthcare Manager"],
    riasec: { S: 3, I: 2, R: 1 },
    mbti: ["ISFJ", "ESFJ", "INFJ", "ENFJ", "ISTJ", "ESTJ"],
    strands: { STEM: 3, GAS: 2, HUMSS: 1, ABM: 0, TVL: 1 },
    subjects: { Science: 3, Math: 2, English: 2, Filipino: 1 },
  },
  {
    id: 7,
    course: "BS Education",
    description: "Prepares students to become professional teachers.",
    careerPaths: ["Teacher", "School Administrator", "Curriculum Developer", "Tutor", "Education Consultant"],
    riasec: { S: 3, A: 1, E: 1 },
    mbti: ["ESFJ", "ENFJ", "ISFJ", "INFJ", "ESTJ", "ENFP"],
    strands: { HUMSS: 3, GAS: 2, ABM: 1, STEM: 1, TVL: 1 },
    subjects: { English: 3, Filipino: 3, History: 2, Math: 1 },
  },
  {
    id: 8,
    course: "BS Civil Engineering",
    description: "Covers the design and construction of infrastructure — buildings, roads, bridges, and water systems.",
    careerPaths: ["Civil Engineer", "Structural Engineer", "Construction Manager", "Urban Planner", "Project Engineer"],
    riasec: { R: 3, I: 2, C: 1 },
    mbti: ["ISTJ", "INTJ", "ISTP", "ESTP", "ESTJ", "ENTJ"],
    strands: { STEM: 3, TVL: 2, GAS: 1, ABM: 0, HUMSS: 0 },
    subjects: { Math: 3, Science: 3, Computer: 1, English: 1 },
  },
];

const riasecQuestionTypes = {
  q1: "R", q2: "I", q3: "A", q4: "S",  q5: "E",  q6: "C",
  q7: "R", q8: "I", q9: "A", q10: "S", q11: "E", q12: "C",
};

function computeRIASEC(riasecAnswers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  Object.entries(riasecAnswers || {}).forEach(([qid, rating]) => {
    const type = riasecQuestionTypes[qid];
    if (type && scores[type] !== undefined) scores[type] += rating;
  });
  return scores;
}

function computeMBTI(mbtiAnswers) {
  if (!mbtiAnswers) return null;
  return `${mbtiAnswers.EI || "I"}${mbtiAnswers.SN || "N"}${mbtiAnswers.TF || "T"}${mbtiAnswers.JP || "J"}`;
}

export function computeRecommendations(answers) {
  const { strand, riasecAnswers, mbtiAnswers, academicRatings } = answers;
  const riasecScores = computeRIASEC(riasecAnswers);
  const mbtiType = computeMBTI(mbtiAnswers);

  const scored = courses.map((course) => {
    let score = 0;
    let breakdown = [];

    const strandScore = (course.strands[strand] || 0) * 10;
    score += strandScore;
    if (strandScore > 0) breakdown.push(`Your ${strand} strand aligns with this course.`);

    let riasecTotal = 0;
    Object.entries(course.riasec).forEach(([type, weight]) => {
      riasecTotal += (riasecScores[type] || 0) * weight;
    });
    const riasecNorm = Math.min(30, Math.round((riasecTotal / 60) * 30));
    score += riasecNorm;
    if (riasecNorm > 12) breakdown.push(`Your interests strongly match this field.`);

    if (mbtiType && course.mbti.includes(mbtiType)) {
      score += 20;
      breakdown.push(`Your ${mbtiType} personality type fits this field.`);
    }

    let acadTotal = 0;
    let acadWeight = 0;
    Object.entries(course.subjects).forEach(([subject, weight]) => {
      const rating = (academicRatings || {})[subject] || 0;
      acadTotal += rating * weight;
      acadWeight += weight;
    });
    const acadNorm = acadWeight > 0
      ? Math.min(20, Math.round((acadTotal / (acadWeight * 5)) * 20))
      : 0;
    score += acadNorm;
    if (acadNorm > 10) breakdown.push(`Your academic strengths support this course.`);

    return {
      ...course,
      matchScore: Math.max(30, Math.min(99, score)),
      reason: breakdown[0] || "This course matches your overall profile.",
      whyRecommended: breakdown.length > 0
        ? breakdown
        : ["This course aligns with your general profile."],
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}