
import React, { useState, useEffect, useCallback } from "react";
import { Quiz, QuizAttempt, User } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

import StudentResultsList from "../components/results/StudentResultsList";
import QuizStatistics from "../components/results/QuizStatistics";

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const quizId = new URLSearchParams(window.location.search).get('id');

  const loadQuizResults = useCallback(async () => {
    if (!quizId) {
      navigate(createPageUrl("Dashboard"));
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get all quizzes to find the specific one
      const quizzes = await Quiz.list();
      const fetchedQuiz = quizzes.find(q => q.id === quizId);
      
      if (!fetchedQuiz) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      // Check if user owns this quiz
      if (fetchedQuiz.created_by !== currentUser.email && currentUser.role !== 'admin') {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      setQuiz(fetchedQuiz);

      // Get all attempts for this quiz
      const allAttempts = await QuizAttempt.list();
      const quizAttempts = allAttempts.filter(attempt => attempt.quiz_id === quizId);
      setAttempts(quizAttempts);

    } catch (error) {
      console.error('Error loading quiz results:', error);
      navigate(createPageUrl("Dashboard"));
    }
    setIsLoading(false);
  }, [quizId, navigate]);

  useEffect(() => {
    loadQuizResults();
  }, [loadQuizResults]);

  const shareQuizLink = () => {
    const quizUrl = `${window.location.origin}${createPageUrl(`TakeQuiz?id=${quizId}`)}`;
    navigator.clipboard.writeText(quizUrl);
    alert('Quiz link copied to clipboard! Share this with your students.');
  };

  const downloadResults = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Score (%)', 'Time Taken (minutes)', 'Completed At'].join(','),
      ...attempts.map(attempt => [
        attempt.student_name || 'Anonymous',
        attempt.created_by || '',
        attempt.score,
        Math.round(attempt.total_time / 60),
        format(new Date(attempt.created_date), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quiz.title}_results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
            <p className="text-gray-600">{quiz?.title}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={shareQuizLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Quiz Link
            </Button>
            {attempts.length > 0 && (
              <Button variant="outline" onClick={downloadResults}>
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </Button>
            )}
          </div>
        </motion.div>

        {/* Quiz Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {quiz?.subject?.replace('_', ' ')}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {quiz?.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {quiz?.time_limit ? `${quiz.time_limit} minutes` : 'No time limit'}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {attempts.length} students attempted
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <QuizStatistics quiz={quiz} attempts={attempts} />

        {/* Student Results */}
        <StudentResultsList attempts={attempts} />
      </div>
    </div>
  );
}
