import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizStatistics({ quiz, attempts }) {
  const calculateAverageScore = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(total / attempts.length);
  };

  const calculateAverageTime = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, attempt) => sum + (attempt.total_time || 0), 0);
    return Math.round(total / attempts.length / 60); // Convert to minutes
  };

  const getHighestScore = () => {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map(attempt => attempt.score));
  };

  const getCompletionRate = () => {
    if (attempts.length === 0) return 0;
    // For now, assume all attempts in the list are completed
    return 100;
  };

  const stats = [
    {
      title: "Students Attempted",
      value: attempts.length,
      icon: Users,
      color: "blue"
    },
    {
      title: "Average Score",
      value: `${calculateAverageScore()}%`,
      icon: Trophy,
      color: "green"
    },
    {
      title: "Highest Score",
      value: `${getHighestScore()}%`,
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Average Time",
      value: `${calculateAverageTime()}min`,
      icon: Clock,
      color: "amber"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <Card key={stat.title} className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}