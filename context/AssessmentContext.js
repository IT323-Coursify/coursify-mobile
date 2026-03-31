import { createContext, useContext, useState } from "react";

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [assessmentAnswers, setAssessmentAnswers] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  return (
    <AssessmentContext.Provider value={{
      assessmentAnswers, setAssessmentAnswers,
      recommendations,  setRecommendations,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  return useContext(AssessmentContext);
}