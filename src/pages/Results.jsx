import React, { useState, useEffect } from "react";
import { QuizAttempt, Quiz, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const userAttempts = await QuizAttempt.filter(
        { created_by: user.email }, 
        '-created_date', 
        50
      );
      const allQuizzes = await Quiz.list();
      
      setAttempts(userAttempts);
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error loading results:', error);
    }
    setIsLoading(false);
  };

  const getQuizTitle = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || 'Unknown Quiz';
  };

  const calculateAverageScore = () => {
    if (attempts.length === 0) return 0;
    return Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length);
  };

  const getBestScore = () => {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map(attempt => attempt.score));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Quiz Results</h1>
          <p className="text-gray-600">Track your progress and performance</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateAverageScore()}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">{getBestScore()}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Quizzes Taken</p>
                  <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz attempts yet</h3>
                  <p className="text-gray-500">Take your first quiz to see results here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attempts.map((attempt, index) => (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {getQuizTitle(attempt.quiz_id)}
                        </h3>
                        <Badge className={`border ${getScoreColor(attempt.score)}`}>
                          {attempt.score}% Score
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(attempt.created_date), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {Math.round((attempt.total_time || 0) / 60)} minutes
                        </div>
                        <div>
                          {attempt.user_answers?.length || 0} questions answered
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}