import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trophy, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentResultsList({ attempts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score"); // score, time, date

  const getScoreColor = (score) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const filteredAndSortedAttempts = attempts
    .filter(attempt => {
      const studentName = attempt.student_name || 'Anonymous';
      const studentEmail = attempt.created_by || '';
      return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "time":
          return (a.total_time || 0) - (b.total_time || 0);
        case "date":
          return new Date(b.created_date) - new Date(a.created_date);
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Results ({attempts.length})
          </CardTitle>
          
          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Highest Score</SelectItem>
                <SelectItem value="time">Fastest Time</SelectItem>
                <SelectItem value="date">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {filteredAndSortedAttempts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {attempts.length === 0 ? "No attempts yet" : "No results found"}
                </h3>
                <p className="text-gray-500">
                  {attempts.length === 0 
                    ? "Share your quiz link with students to see their results here."
                    : "Try adjusting your search criteria."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedAttempts.map((attempt, index) => (
                  <motion.div
                    key={`${attempt.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {attempt.student_name || 'Anonymous Student'}
                          </h3>
                          <p className="text-sm text-gray-600">{attempt.created_by || 'No email'}</p>
                        </div>
                      </div>
                      <Badge className={`border ${getScoreColor(attempt.score)}`}>
                        {attempt.score}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.round((attempt.total_time || 0) / 60)} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {attempt.user_answers?.filter(a => a.is_correct).length || 0} correct
                      </div>
                      <div>
                        Completed {format(new Date(attempt.created_date), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}