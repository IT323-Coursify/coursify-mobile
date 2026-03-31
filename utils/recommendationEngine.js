const courses = [
  { id:1,  course:"BS Civil Engineering",                       careerPaths:["Civil Engineer","Structural Engineer","Construction Manager","Urban Planner"],           riasec:{R:3,I:2,C:1}, mbti:["ISTJ","INTJ","ISTP","ESTP","ESTJ","ENTJ"], strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id:2,  course:"BS Electrical Engineering",                  careerPaths:["Electrical Engineer","Power Systems Engineer","Automation Engineer"],                   riasec:{R:3,I:2,C:1}, mbti:["INTJ","ISTJ","INTP","ISTP","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:2,English:1} },
  { id:3,  course:"BS Computer Engineering",                    careerPaths:["Computer Engineer","Embedded Systems Developer","IoT Engineer"],                        riasec:{I:3,R:2,C:1}, mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ","ENTP"], strands:{STEM:3,TVL:1,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id:4,  course:"BS Mechanical Engineering",                  careerPaths:["Mechanical Engineer","Automation Specialist","Manufacturing Engineer"],                  riasec:{R:3,I:2,C:1}, mbti:["ISTJ","INTJ","ISTP","ESTJ","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id:5,  course:"BS Electronics Engineering",                 careerPaths:["Electronics Engineer","Circuit Designer","Telecom Engineer"],                          riasec:{I:3,R:2,C:1}, mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id:6,  course:"BS Geodetic Engineering",                    careerPaths:["Geodetic Engineer","Survey Engineer","GIS Specialist"],                                 riasec:{R:3,I:2,C:2}, mbti:["ISTJ","INTJ","ISTP","ESTJ"],               strands:{STEM:3,TVL:1,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id:7,  course:"BS Environmental Engineering",               careerPaths:["Environmental Engineer","Sustainability Specialist","EHS Officer"],                     riasec:{I:2,R:2,S:1,C:1}, mbti:["INFJ","INTJ","ISTJ","ISFJ","ENFJ"],   strands:{STEM:3,TVL:1,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },
  { id:8,  course:"BS Agricultural and Biosystems Engineering", careerPaths:["Agricultural Engineer","Biosystems Analyst","Irrigation Specialist"],                   riasec:{R:3,I:2,S:1}, mbti:["ISTJ","ISTP","ESTJ","INTJ"],               strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:3,Computer:1,English:1} },
  { id:9,  course:"BS Naval Architecture and Marine Engineering",careerPaths:["Naval Architect","Marine Engineer","Offshore Engineer"],                               riasec:{R:3,I:2,C:1}, mbti:["ISTJ","INTJ","ISTP","ESTP","ESTJ"],        strands:{STEM:3,TVL:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id:10, course:"BS Computer Science",                        careerPaths:["Software Engineer","ML Engineer","Data Scientist","Cybersecurity Specialist"],          riasec:{I:3,R:2,C:1}, mbti:["INTJ","INTP","ISTJ","ISTP","ENTJ","ENTP"], strands:{STEM:3,TVL:1,ABM:0,HUMSS:0,GAS:1}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id:11, course:"BS Information Technology",                  careerPaths:["IT Manager","Network Admin","Web Developer","Database Admin"],                          riasec:{I:2,R:2,C:2}, mbti:["ISTJ","ESTJ","ISTP","ESTP","ENTJ","INTJ"], strands:{STEM:3,TVL:2,ABM:1,HUMSS:0,GAS:1}, subjects:{Math:2,Science:1,Computer:3,English:1} },
  { id:12, course:"BS Information Systems",                     careerPaths:["Business Analyst","Systems Analyst","ERP Consultant","Project Manager"],                riasec:{E:2,C:2,I:1}, mbti:["ESTJ","ENTJ","ISTJ","ENFJ","ESFJ"],        strands:{STEM:2,ABM:3,TVL:1,HUMSS:1,GAS:2}, subjects:{Math:2,Science:1,Computer:3,English:2} },
  { id:13, course:"BS Data Science",                            careerPaths:["Data Scientist","Data Analyst","ML Engineer","BI Analyst"],                            riasec:{I:3,C:2,E:1}, mbti:["INTJ","INTP","ISTJ","ENTJ","ENTP"],        strands:{STEM:3,ABM:2,TVL:0,HUMSS:0,GAS:1}, subjects:{Math:3,Science:2,Computer:3,English:1} },
  { id:14, course:"BS Technology Communication Management",     careerPaths:["IT Project Manager","Communication Specialist","Tech Operations Lead"],                 riasec:{E:2,C:2,S:1}, mbti:["ESTJ","ENTJ","ENFJ","ESFJ","ISTJ"],        strands:{ABM:3,STEM:2,GAS:2,HUMSS:1,TVL:1}, subjects:{Math:1,Science:1,Computer:3,English:3} },
  { id:15, course:"BS Agricultural Technology",                 careerPaths:["Agri-Technologist","Farm Manager","Crop Specialist"],                                  riasec:{R:3,I:1,S:1}, mbti:["ISTP","ESTP","ISTJ","ESTJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id:16, course:"BS Electro-Mechanical Technology",           careerPaths:["Electro-Mechanical Technician","Automation Engineer"],                                  riasec:{R:3,I:2,C:1}, mbti:["ISTP","ESTP","ISTJ","ESTJ"],               strands:{TVL:3,STEM:3,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },
  { id:17, course:"BS Electronics Technology",                  careerPaths:["Electronics Technician","Circuit Developer","Communication Tech"],                      riasec:{R:3,I:2,C:1}, mbti:["ISTP","ESTP","ISTJ"],                      strands:{TVL:3,STEM:2,GAS:1,ABM:0,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },
  { id:18, course:"BS Energy Systems and Management",           careerPaths:["Energy Manager","Power Systems Engineer","Energy Auditor"],                             riasec:{I:2,R:2,E:1,C:1}, mbti:["INTJ","ISTJ","ENTJ","ESTJ"],           strands:{STEM:3,TVL:2,ABM:1,GAS:2,HUMSS:0}, subjects:{Math:3,Science:3,Computer:1,English:1} },
  { id:19, course:"BS Food Processing and Technology",          careerPaths:["Food Technologist","Quality Analyst","Food Safety Inspector"],                          riasec:{R:2,I:2,C:2}, mbti:["ISTJ","ISFJ","ESTJ","ESFJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id:20, course:"BS Manufacturing Engineering Technology",    careerPaths:["Manufacturing Engineer","Process Engineer","Quality Engineer"],                         riasec:{R:3,I:2,C:1}, mbti:["ISTJ","ISTP","ESTJ","ESTP"],               strands:{TVL:3,STEM:2,GAS:1,ABM:1,HUMSS:0}, subjects:{Math:2,Science:2,Computer:2,English:1} },
  { id:21, course:"BS Agriculture",                             careerPaths:["Agriculturist","Farm Manager","Agri-Entrepreneur"],                                    riasec:{R:2,I:2,S:1}, mbti:["ISTJ","ISTP","ESTJ","ISFJ"],               strands:{TVL:3,STEM:2,GAS:2,ABM:1,HUMSS:0}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id:22, course:"BS Agroforestry",                            careerPaths:["Agroforestry Specialist","Environmental Planner","Forest Manager"],                    riasec:{R:2,I:2,S:1}, mbti:["INFJ","ISTJ","ISFJ","INTJ"],               strands:{STEM:2,TVL:2,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:1,Science:3,Computer:1,English:2} },
  { id:23, course:"BS Horticulture and Management",             careerPaths:["Horticulturist","Landscape Manager","Plant Scientist"],                                 riasec:{R:2,I:2,A:1}, mbti:["ISFP","ISFJ","ISTP","INFP"],               strands:{TVL:3,STEM:2,GAS:2,ABM:0,HUMSS:1}, subjects:{Math:1,Science:3,Computer:1,English:1} },
  { id:24, course:"BS Marine Biology",                          careerPaths:["Marine Biologist","Ocean Conservationist","Aquaculture Specialist"],                   riasec:{I:3,R:1,S:1}, mbti:["INTJ","INTP","INFJ","INFP","ISFJ"],        strands:{STEM:3,GAS:2,TVL:1,ABM:0,HUMSS:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },
  { id:25, course:"BS Applied Mathematics",                     careerPaths:["Mathematician","Actuary","Data Analyst","Statistician"],                               riasec:{I:3,C:2,R:1}, mbti:["INTJ","INTP","ISTJ","INFJ","ENTP"],        strands:{STEM:3,ABM:2,GAS:1,TVL:0,HUMSS:0}, subjects:{Math:3,Science:2,Computer:2,English:1} },
  { id:26, course:"BS Applied Physics",                         careerPaths:["Physicist","Research Scientist","Instrumentation Engineer"],                           riasec:{I:3,R:2,C:1}, mbti:["INTJ","INTP","ISTJ","INFJ"],               strands:{STEM:3,GAS:1,TVL:0,ABM:0,HUMSS:0}, subjects:{Math:3,Science:3,Computer:2,English:1} },
  { id:27, course:"BS Chemistry",                               careerPaths:["Chemist","Lab Analyst","Chemical Engineer","Researcher"],                              riasec:{I:3,R:2,C:1}, mbti:["INTJ","ISTJ","INTP","INFJ"],               strands:{STEM:3,GAS:1,TVL:0,ABM:0,HUMSS:0}, subjects:{Math:2,Science:3,Computer:1,English:1} },
  { id:28, course:"BS Environmental Science",                   careerPaths:["Environmental Scientist","Ecologist","Conservation Officer"],                          riasec:{I:2,R:2,S:1}, mbti:["INFJ","INTJ","ISFJ","ENFJ","INFP"],        strands:{STEM:3,GAS:2,HUMSS:1,ABM:0,TVL:1}, subjects:{Math:2,Science:3,Computer:1,English:2} },
  { id:29, course:"BS Secondary Education (Mathematics)",       careerPaths:["Math Teacher","Education Specialist","Curriculum Developer"],                          riasec:{S:3,I:2,A:1}, mbti:["ESFJ","ENFJ","ISFJ","INFJ","ESTJ"],        strands:{STEM:2,HUMSS:3,GAS:2,ABM:1,TVL:1}, subjects:{Math:3,Science:1,Computer:1,English:2,Filipino:2} },
  { id:30, course:"BS Secondary Education (Science)",           careerPaths:["Science Teacher","Lab Coordinator","Education Specialist"],                            riasec:{S:3,I:2,A:1}, mbti:["ESFJ","ENFJ","ISFJ","INFJ","ESTJ"],        strands:{STEM:2,HUMSS:3,GAS:2,ABM:1,TVL:1}, subjects:{Math:2,Science:3,Computer:1,English:2,Filipino:2} },
  { id:31, course:"BS Social Work",                             careerPaths:["Social Worker","Community Development Officer","Case Manager"],                        riasec:{S:3,A:1,E:1}, mbti:["ENFJ","ESFJ","INFJ","ISFJ","ENFP"],        strands:{HUMSS:3,GAS:2,ABM:1,STEM:0,TVL:0}, subjects:{English:3,Filipino:3,Humanities:2,Science:1} },
  { id:32, course:"BS Technical-Vocational Teacher Education",  careerPaths:["Technical Teacher","Vocational Instructor","Training Officer"],                        riasec:{S:3,R:1,E:1}, mbti:["ESFJ","ESTJ","ISFJ","ENFJ"],               strands:{TVL:3,HUMSS:2,GAS:2,STEM:1,ABM:1}, subjects:{Math:1,Computer:2,English:2,Filipino:2} },
  { id:33, course:"BS Technology and Livelihood Education",     careerPaths:["TLE Teacher","Skills Trainer","Industrial Arts Instructor"],                           riasec:{S:3,R:2,A:1}, mbti:["ESFJ","ISFJ","ESFP","ENFJ"],               strands:{TVL:3,HUMSS:2,GAS:2,ABM:1,STEM:1}, subjects:{Math:1,Computer:1,English:2,Filipino:3} },
  { id:34, course:"BS Business Administration",                 careerPaths:["Business Manager","Marketing Specialist","Entrepreneur","Financial Analyst"],          riasec:{E:3,S:2,C:1}, mbti:["ESTJ","ENTJ","ESTP","ENFJ","ESFJ","ENTP"], strands:{ABM:3,HUMSS:2,GAS:2,STEM:1,TVL:1}, subjects:{Math:2,English:2,Filipino:1,Humanities:1} },
  { id:35, course:"BS Nursing",                                 careerPaths:["Registered Nurse","Clinical Nurse","Public Health Nurse","Nurse Educator"],            riasec:{S:3,I:2,R:1}, mbti:["ISFJ","ESFJ","INFJ","ENFJ","ISTJ","ESTJ"], strands:{STEM:3,GAS:2,HUMSS:1,ABM:0,TVL:1}, subjects:{Math:1,Science:3,English:2,Filipino:1} },
  { id:36, course:"BS Psychology",                              careerPaths:["Psychologist","Guidance Counselor","HR Specialist","Researcher"],                      riasec:{S:3,I:2,A:1}, mbti:["INFJ","INFP","ENFJ","ENFP","ISFJ","ESFJ"], strands:{HUMSS:3,ABM:1,GAS:2,STEM:1,TVL:0}, subjects:{English:3,Filipino:2,Humanities:2,Science:1} },
  { id:37, course:"BS Architecture",                            careerPaths:["Architect","Urban Designer","Interior Designer","Landscape Architect"],                riasec:{A:3,R:2,I:1}, mbti:["INTJ","INFJ","INTP","INFP","ENTP","ENFP"], strands:{STEM:2,HUMSS:2,GAS:2,ABM:1,TVL:1}, subjects:{Math:2,Science:1,Computer:2,English:2} },
  { id:38, course:"AB Communication",                           careerPaths:["Journalist","PR Specialist","Broadcaster","Content Creator"],                          riasec:{A:2,S:2,E:2}, mbti:["ENFP","ENFJ","ESFP","ENTP","INFP","INFJ"], strands:{HUMSS:3,ABM:2,GAS:2,STEM:0,TVL:0}, subjects:{English:3,Filipino:3,Humanities:2,Computer:1} },
  { id:39, course:"AB Political Science",                       careerPaths:["Political Scientist","Lawyer","Diplomat","Policy Analyst"],                            riasec:{E:2,I:2,S:1}, mbti:["ENTJ","ENFJ","INTJ","INFJ","ENTP","INTP"], strands:{HUMSS:3,ABM:2,GAS:2,STEM:0,TVL:0}, subjects:{English:3,Filipino:2,Humanities:3,Science:0} },
];

const riasecQuestionTypes = {
  q1:"R",q2:"I",q3:"A",q4:"S",q5:"E",q6:"C",
  q7:"R",q8:"I",q9:"A",q10:"S",q11:"E",q12:"C",
};

function computeRIASEC(riasecAnswers) {
  const scores = {R:0,I:0,A:0,S:0,E:0,C:0};
  Object.entries(riasecAnswers||{}).forEach(([qid,rating]) => {
    const type = riasecQuestionTypes[qid];
    if (type) scores[type] += rating;
  });
  return scores;
}

// Majority-vote MBTI from 8 answers (2 per dimension, keyed by index)
function computeMBTI(mbtiAnswers) {
  if (!mbtiAnswers || Object.keys(mbtiAnswers).length < 8) return null;
  const dims = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  Object.values(mbtiAnswers).forEach(v => { if (v && dims[v]!==undefined) dims[v]++; });
  return `${dims.E>=dims.I?"E":"I"}${dims.S>=dims.N?"S":"N"}${dims.T>=dims.F?"T":"F"}${dims.J>=dims.P?"J":"P"}`;
}

function computeAcademicScores(academicAnswers) {
  const scores = {};
  Object.entries(academicAnswers||{}).forEach(([subject,answers]) => {
    const total = Object.values(answers).filter(Boolean).length;
    scores[subject] = Math.max(1, Math.round((total/10)*5));
  });
  return scores;
}

export function computeRecommendations(answers) {
  const {strand,riasecAnswers,mbtiAnswers,academicAnswers} = answers;
  const riasecScores   = computeRIASEC(riasecAnswers);
  const mbtiType       = computeMBTI(mbtiAnswers);
  const academicScores = computeAcademicScores(academicAnswers);

  const scored = courses.map(course => {
    let score = 0; let breakdown = [];

    const strandScore = (course.strands[strand]||0)*10;
    score += strandScore;
    if (strandScore>0) breakdown.push(`Your ${strand} strand aligns with this course.`);

    let riasecTotal=0;
    Object.entries(course.riasec).forEach(([type,weight]) => {
      riasecTotal += (riasecScores[type]||0)*weight;
    });
    const riasecNorm = Math.min(30,Math.round((riasecTotal/60)*30));
    score += riasecNorm;
    if (riasecNorm>12) breakdown.push(`Your interests strongly match this field.`);

    if (mbtiType && course.mbti.includes(mbtiType)) {
      score += 20;
      breakdown.push(`Your ${mbtiType} personality type fits this field.`);
    }

    let acadTotal=0,acadWeight=0;
    Object.entries(course.subjects).forEach(([subject,weight]) => {
      acadTotal  += (academicScores[subject]||0)*weight;
      acadWeight += weight;
    });
    const acadNorm = acadWeight>0 ? Math.min(20,Math.round((acadTotal/(acadWeight*5))*20)) : 0;
    score += acadNorm;
    if (acadNorm>10) breakdown.push(`Your academic strengths support this course.`);

    return {
      ...course,
      matchScore: Math.max(30,Math.min(99,score)),
      reason: breakdown[0]||"This course matches your overall profile.",
      whyRecommended: breakdown.length>0 ? breakdown : ["This course aligns with your general profile."],
    };
  });

  return scored.sort((a,b)=>b.matchScore-a.matchScore).slice(0,5);
}