import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Check, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function QuizResults({ quiz, attempt, showRetake = false }) {
  const navigate = useNavigate();
  const correctAnswers = attempt.user_answers.filter(a => a.is_correct).length;
  const totalQuestions = quiz.questions.length;

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getQuestionResult = (index) => {
    const userAnswer = attempt.user_answers.find(a => a.question_index === index);
    if (!userAnswer) return { status: 'unanswered' };
    return userAnswer.is_correct ? { status: 'correct', answer: userAnswer.answer } : { status: 'incorrect', answer: userAnswer.answer };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto glass-card border-0 shadow-2xl">
      <CardHeader className="text-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${getScoreColor(attempt.score)}`} />
        </motion.div>
        <CardTitle className="text-3xl font-bold tracking-tight">Quiz Complete!</CardTitle>
        <p className="text-gray-600 mt-2 text-lg">Here's how you did on "{quiz.title}"</p>
        {!showRetake && (
          <p className="text-sm text-amber-600 mt-2 bg-amber-50 px-4 py-2 rounded-full inline-block">
            This quiz can only be taken once
          </p>
        )}
      </CardHeader>
      <CardContent className="p-8 bg-blue-50/50 space-y-8">
        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Your Score</h3>
            <p className={`text-4xl font-bold ${getScoreColor(attempt.score)}`}>{attempt.score}%</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Correct Answers</h3>
            <p className="text-4xl font-bold text-gray-900">{correctAnswers}/{totalQuestions}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Time Taken</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(attempt.total_time / 60)}m {attempt.total_time % 60}s
            </p>
          </div>
        </div>
        
        {/* Answer Review */}
        <div>
          <h3 className="text-xl font-bold text-center mb-4">Answer Review</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {quiz.questions.map((question, index) => {
              const result = getQuestionResult(index);
              return (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-800 flex-1">{index + 1}. {question.question}</p>
                    {result.status === 'correct' && <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-4"/>}
                    {result.status === 'incorrect' && <X className="w-5 h-5 text-red-500 flex-shrink-0 ml-4"/>}
                    {result.status === 'unanswered' && <span className="text-sm text-gray-500">Unanswered</span>}
                  </div>
                  <div className="text-sm mt-2 pt-2 border-t">
                    <p>Your answer: <span className="font-semibold">{result.answer || 'N/A'}</span></p>
                    <p>Correct answer: <span className="font-semibold text-green-700">{question.correct_answer}</span></p>
                    {question.explanation && <p className="mt-1 text-gray-600"><em>Explanation: {question.explanation}</em></p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-8">
        <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="w-full quiz-gradient text-white">
          <Home className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}