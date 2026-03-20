import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, HelpCircle, Play, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const subjectColors = {
  mathematics: "bg-blue-100 text-blue-800",
  science: "bg-green-100 text-green-800",
  history: "bg-amber-100 text-amber-800",
  literature: "bg-purple-100 text-purple-800",
  geography: "bg-teal-100 text-teal-800",
  technology: "bg-gray-100 text-gray-800",
  business: "bg-orange-100 text-orange-800",
  custom: "bg-pink-100 text-pink-800"
};

export default function QuizStartScreen({ quiz, onStart }) {
  const [studentName, setStudentName] = useState("");

  const handleStart = () => {
    if (studentName.trim()) {
      onStart(studentName.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-card border-0 shadow-2xl">
      <CardHeader className="text-center p-8">
        <Badge className={`mx-auto mb-4 ${subjectColors[quiz.subject]}`}>{quiz.subject.replace('_', ' ')}</Badge>
        <CardTitle className="text-3xl font-bold tracking-tight">{quiz.title}</CardTitle>
        <p className="text-gray-600 mt-2 text-lg">{quiz.description}</p>
      </CardHeader>
      
      <CardContent className="p-8 space-y-6">
        {/* Student Name Input */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <Label htmlFor="studentName" className="text-lg font-semibold text-blue-900">
              Enter Your Name
            </Label>
          </div>
          <Input
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Your full name"
            className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500"
          />
          <p className="text-sm text-blue-700 mt-2">
            Your teacher will see your name with your results
          </p>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Questions</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{quiz.questions.length}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Time Limit</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {quiz.time_limit > 0 ? `${quiz.time_limit} min` : "No limit"}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-8">
        <Button 
          onClick={handleStart} 
          disabled={!studentName.trim()}
          className="w-full quiz-gradient text-white hover:opacity-90 shadow-lg text-lg py-6"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}