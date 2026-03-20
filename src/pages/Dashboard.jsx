import React, { useState, useEffect } from "react";
import { Quiz, QuizAttempt, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, BookOpen, Clock, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import RecentQuizzes from "../components/dashboard/RecentQuizzes";
import QuickStart from "../components/dashboard/QuickStart";
import DetailedAnalytics from "../components/dashboard/DetailedAnalytics";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      
      // Get all available quizzes, sorted by most recent
      const allQuizzes = await Quiz.list('-created_date', 50);
      
      // Get user's own attempts
      const userAttempts = await QuizAttempt.filter({ created_by: currentUser.email }, '-created_date', 10);
      
      setUser(currentUser);
      setQuizzes(allQuizzes);
      setAttempts(userAttempts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const calculateAverageScore = () => {
    if (attempts.length === 0) return 0;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(totalScore / attempts.length);
  };

  const getTotalQuizTime = () => {
    const totalSeconds = attempts.reduce((sum, attempt) => sum + (attempt.total_time || 0), 0);
    return Math.round(totalSeconds / 60); // Convert to minutes
  };

  // Get user's created quizzes for stats
  const userCreatedQuizzes = quizzes.filter(quiz => quiz.created_by === user?.email);

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Quiz Master'}!
            </h1>
            <p className="text-gray-600 text-lg">Ready to create some amazing quizzes?</p>
          </div>
          <Link to={createPageUrl("CreateQuiz")}>
            <Button className="quiz-gradient text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5 mr-2" />
              Create New Quiz
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Quizzes Created"
            value={userCreatedQuizzes.length}
            icon={BookOpen}
            color="blue"
            trend={`${userCreatedQuizzes.filter(q => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(q.created_date) > weekAgo;
            }).length} this week`}
          />
          <StatsCard
            title="Quiz Attempts"
            value={attempts.length}
            icon={Play}
            color="green"
            trend={`${attempts.filter(a => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(a.created_date) > weekAgo;
            }).length} this week`}
          />
          <StatsCard
            title="Average Score"
            value={`${calculateAverageScore()}%`}
            icon={TrendingUp}
            color="purple"
            trend={attempts.length > 0 ? "Great progress!" : "Take a quiz to see"}
          />
          <StatsCard
            title="Study Time"
            value={`${getTotalQuizTime()}min`}
            icon={Clock}
            color="amber"
            trend="Total time spent"
          />
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DetailedAnalytics quizzes={quizzes} attempts={attempts} userEmail={user?.email} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentQuizzes quizzes={quizzes} isLoading={isLoading} onQuizUpdate={loadData} />
          </div>
          <div>
            <QuickStart />
          </div>
        </div>
        </div>
        </div>
        );
        }