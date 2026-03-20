import React, { useState, useEffect, useCallback } from "react";
import { Quiz, QuizAttempt, User } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

import QuizStartScreen from "../components/take/QuizStartScreen";
import QuestionDisplay from "../components/take/QuestionDisplay";
import QuizResults from "../components/take/QuizResults";

export default function TakeQuizPage() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [quizState, setQuizState] = useState("loading"); // loading, start, in_progress, completed, already_taken, unavailable
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [finalAttempt, setFinalAttempt] = useState(null);
  const [existingAttempt, setExistingAttempt] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [unavailableReason, setUnavailableReason] = useState("");

  const quizId = new URLSearchParams(window.location.search).get('id');

  const loadQuiz = useCallback(async () => {
    if (!quizId) {
      navigate(createPageUrl("Dashboard"));
      return;
    }
    try {
      const user = await User.me();
      const quizzes = await Quiz.list();
      const fetchedQuiz = quizzes.find(q => q.id === quizId);
      
      if (fetchedQuiz) {
        // Check if quiz is available
        const now = new Date();
        
        // Check if quiz is active
        if (!fetchedQuiz.is_active) {
          setQuizState("unavailable");
          setUnavailableReason("This quiz has been closed by the instructor.");
          setQuiz(fetchedQuiz);
          return;
        }
        
        // Check start date
        if (fetchedQuiz.start_date) {
          const startDate = new Date(fetchedQuiz.start_date);
          if (startDate > now) {
            setQuizState("unavailable");
            setUnavailableReason(`This quiz will be available starting ${format(startDate, 'PPP p')}`);
            setQuiz(fetchedQuiz);
            return;
          }
        }
        
        // Check end date
        if (fetchedQuiz.end_date) {
          const endDate = new Date(fetchedQuiz.end_date);
          if (endDate < now) {
            setQuizState("unavailable");
            setUnavailableReason(`This quiz closed on ${format(endDate, 'PPP p')}`);
            setQuiz(fetchedQuiz);
            return;
          }
        }
        
        setQuiz(fetchedQuiz);
        
        // Check if user has already taken this quiz
        try {
          const attempts = await QuizAttempt.filter({ 
            quiz_id: quizId, 
            created_by: user.email 
          });
          const attempt = attempts.length > 0 ? attempts[0] : null;
          
          if (attempt) {
            setExistingAttempt(attempt);
            setQuizState("already_taken");
          } else {
            setQuizState("start");
          }
        } catch (error) {
          console.error("Error checking existing attempts:", error);
          setQuizState("start");
        }
      } else {
        console.error("Quiz not found");
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      navigate(createPageUrl("Dashboard"));
    }
  }, [quizId, navigate]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const handleStartQuiz = (name) => {
    setStudentName(name);
    setQuizState("in_progress");
    setStartTime(Date.now());
    setUserAnswers(Array(quiz.questions.length).fill(null));
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      answer,
      question_index: currentQuestionIndex,
      time_spent: 0,
    };
    setUserAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = async () => {
    const endTime = Date.now();
    const total_time = Math.round((endTime - startTime) / 1000);
    
    let correctCount = 0;
    const processedAnswers = userAnswers.map((userAnswer, index) => {
      if (!userAnswer) return null;
      const question = quiz.questions[index];
      const is_correct = userAnswer.answer?.toLowerCase() === question.correct_answer?.toLowerCase();
      if (is_correct) {
        correctCount++;
      }
      return { ...userAnswer, is_correct };
    }).filter(Boolean);
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const attemptData = {
      quiz_id: quiz.id,
      quiz_owner_email: quiz.created_by,
      student_name: studentName,
      user_answers: processedAnswers,
      score,
      total_time,
      completed_at: new Date().toISOString()
    };
    
    try {
      const savedAttempt = await QuizAttempt.create(attemptData);
      setFinalAttempt(savedAttempt);
      setQuizState("completed");
    } catch(error) {
      console.error("Failed to save quiz attempt:", error);
    }
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex]?.answer;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {quizState === "loading" && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-gray-600"
          >
            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            <p className="text-lg font-medium">Loading Quiz...</p>
          </motion.div>
        )}

        {quizState === "unavailable" && quiz && (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="w-full max-w-2xl mx-auto glass-card border-0 shadow-2xl">
              <CardHeader className="text-center p-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                <CardTitle className="text-2xl font-bold">Quiz Not Available</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-amber-50/50 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                    <p className="text-gray-600">{unavailableReason}</p>
                  </div>
                </div>
              </CardContent>
              <div className="p-8">
                <Button 
                  onClick={() => navigate(createPageUrl("Dashboard"))} 
                  className="w-full quiz-gradient text-white"
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {quizState === "already_taken" && existingAttempt && (
          <motion.div
            key="already_taken"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="w-full max-w-2xl mx-auto glass-card border-0 shadow-2xl">
              <CardHeader className="text-center p-8">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                <CardTitle className="text-2xl font-bold">Quiz Already Completed</CardTitle>
                <p className="text-gray-600 mt-2">You have already taken this quiz and cannot retake it.</p>
              </CardHeader>
              <CardContent className="p-8 bg-amber-50/50 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-2">Your Previous Score</h3>
                    <p className="text-3xl font-bold text-amber-600">{existingAttempt.score}%</p>
                  </div>
                  <p className="text-gray-600">
                    Quiz taken on {new Date(existingAttempt.created_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <div className="p-8">
                <Button 
                  onClick={() => navigate(createPageUrl("Dashboard"))} 
                  className="w-full quiz-gradient text-white"
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {quizState === "start" && quiz && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <QuizStartScreen quiz={quiz} onStart={handleStartQuiz} />
          </motion.div>
        )}

        {quizState === "in_progress" && quiz && currentQuestion && (
          <motion.div key="progress" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full max-w-4xl">
            <QuestionDisplay
              quiz={quiz}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.questions.length}
              selectedAnswer={selectedAnswer}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              onTimeUp={handleTimeUp}
            />
          </motion.div>
        )}

        {quizState === "completed" && finalAttempt && (
           <motion.div key="completed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
            <QuizResults quiz={quiz} attempt={finalAttempt} showRetake={false} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}