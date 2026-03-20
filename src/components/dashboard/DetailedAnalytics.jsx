import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import { format, subDays, isAfter } from "date-fns";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DetailedAnalytics({ quizzes, attempts, userEmail }) {
  const [selectedQuizId, setSelectedQuizId] = useState("all");
  const [timeRange, setTimeRange] = useState("30"); // days

  // Filter user's quizzes
  const userQuizzes = useMemo(() => 
    quizzes.filter(q => q.created_by === userEmail),
    [quizzes, userEmail]
  );

  // Filter attempts based on selected quiz and time range
  const filteredAttempts = useMemo(() => {
    let filtered = attempts;
    
    if (selectedQuizId !== "all") {
      filtered = filtered.filter(a => a.quiz_id === selectedQuizId);
    } else {
      // Only show attempts for user's quizzes
      const userQuizIds = userQuizzes.map(q => q.id);
      filtered = filtered.filter(a => userQuizIds.includes(a.quiz_id));
    }
    
    const cutoffDate = subDays(new Date(), parseInt(timeRange));
    filtered = filtered.filter(a => isAfter(new Date(a.created_date), cutoffDate));
    
    return filtered;
  }, [attempts, selectedQuizId, timeRange, userQuizzes]);

  // Calculate per-quiz statistics
  const quizStats = useMemo(() => {
    const stats = {};
    
    userQuizzes.forEach(quiz => {
      const quizAttempts = filteredAttempts.filter(a => a.quiz_id === quiz.id);
      
      if (quizAttempts.length > 0) {
        const avgScore = quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length;
        const uniqueStudents = new Set(quizAttempts.map(a => a.created_by)).size;
        
        stats[quiz.id] = {
          title: quiz.title,
          attempts: quizAttempts.length,
          avgScore: Math.round(avgScore),
          uniqueStudents,
          quizAttempts
        };
      }
    });
    
    return stats;
  }, [userQuizzes, filteredAttempts]);

  // Prepare data for charts
  const quizPerformanceData = Object.values(quizStats).map(stat => ({
    name: stat.title.length > 20 ? stat.title.substring(0, 20) + '...' : stat.title,
    score: stat.avgScore,
    attempts: stat.attempts
  }));

  // Calculate completion rate over time
  const completionTrend = useMemo(() => {
    const days = parseInt(timeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      const attemptsOnDay = filteredAttempts.filter(a => 
        format(new Date(a.created_date), 'MMM dd') === dateStr
      );
      
      data.push({
        date: dateStr,
        attempts: attemptsOnDay.length,
        avgScore: attemptsOnDay.length > 0 
          ? Math.round(attemptsOnDay.reduce((sum, a) => sum + a.score, 0) / attemptsOnDay.length)
          : 0
      });
    }
    
    return data;
  }, [filteredAttempts, timeRange]);

  // Find most common incorrect answers
  const commonMistakes = useMemo(() => {
    const mistakes = {};
    
    filteredAttempts.forEach(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quiz_id);
      if (!quiz) return;
      
      attempt.user_answers?.forEach(answer => {
        if (!answer.is_correct) {
          const question = quiz.questions[answer.question_index];
          const key = `${quiz.title}|${question?.question}`;
          
          if (!mistakes[key]) {
            mistakes[key] = {
              quizTitle: quiz.title,
              question: question?.question || 'Unknown',
              correctAnswer: question?.correct_answer || 'Unknown',
              incorrectCount: 0
            };
          }
          mistakes[key].incorrectCount++;
        }
      });
    });
    
    return Object.values(mistakes)
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, 5);
  }, [filteredAttempts, quizzes]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = {
      '90-100%': 0,
      '80-89%': 0,
      '70-79%': 0,
      '60-69%': 0,
      'Below 60%': 0
    };
    
    filteredAttempts.forEach(attempt => {
      if (attempt.score >= 90) ranges['90-100%']++;
      else if (attempt.score >= 80) ranges['80-89%']++;
      else if (attempt.score >= 70) ranges['70-79%']++;
      else if (attempt.score >= 60) ranges['60-69%']++;
      else ranges['Below 60%']++;
    });
    
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [filteredAttempts]);

  if (userQuizzes.length === 0) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
          <p className="text-gray-500">Create quizzes to see detailed analytics here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Quiz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  {userQuizzes.map(quiz => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{filteredAttempts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAttempts.length > 0
                    ? Math.round(filteredAttempts.reduce((sum, a) => sum + a.score, 0) / filteredAttempts.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAttempts.length > 0
                    ? Math.round((filteredAttempts.filter(a => a.score >= 70).length / filteredAttempts.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(filteredAttempts.map(a => a.created_by)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Quiz */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Average Score by Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {quizPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366f1" name="Avg Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {scoreDistribution.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completion Trend */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {completionTrend.some(d => d.attempts > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="attempts" stroke="#6366f1" name="Attempts" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#10b981" name="Avg Score (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Most Challenging Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commonMistakes.length > 0 ? (
            <div className="space-y-4">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="bg-white">
                      {mistake.quizTitle}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700">
                      {mistake.incorrectCount} incorrect answers
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {mistake.question}
                  </p>
                  <p className="text-sm text-gray-600">
                    Correct answer: <span className="font-medium text-green-700">{mistake.correctAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No incorrect answers recorded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Per-Quiz Details */}
      {selectedQuizId === "all" && Object.keys(quizStats).length > 0 && (
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quiz Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.values(quizStats).map(stat => (
                <div key={stat.title} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{stat.title}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge className="bg-blue-100 text-blue-700">
                        {stat.attempts} attempts
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700">
                        {stat.uniqueStudents} students
                      </Badge>
                      <Badge className="bg-green-100 text-green-700">
                        {stat.avgScore}% avg score
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}