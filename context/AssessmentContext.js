import { createContext, useContext, useState } from "react";

const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [assessmentAnswers, setAssessmentAnswers] = useState(null);
  const [recommendations,   setRecommendations]   = useState([]);
  const [questions,         setQuestions]          = useState(null);
  const [questionsLoading,  setQuestionsLoading]   = useState(false);
  const [questionsError,    setQuestionsError]     = useState(null);
  const [resultId,          setResultId]           = useState(null);

  return (
    <AssessmentContext.Provider value={{
      assessmentAnswers, setAssessmentAnswers,
      recommendations,   setRecommendations,
      questions,         setQuestions,
      questionsLoading,  setQuestionsLoading,
      questionsError,    setQuestionsError,
      resultId,          setResultId,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  return useContext(AssessmentContext);
}