import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import QuizTimer from "./QuizTimer";

export default function QuestionDisplay({
  quiz,
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onTimeUp
}) {
  const progressValue = (questionNumber / totalQuestions) * 100;

  const getOptionStyle = (option) => {
    if (selectedAnswer === option) {
      return "quiz-gradient text-white";
    }
    return "bg-white hover:bg-blue-50";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto glass-card border-0 shadow-2xl">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-gray-700">Question {questionNumber}/{totalQuestions}</p>
          {quiz.time_limit > 0 && <QuizTimer timeLimit={quiz.time_limit} onTimeUp={onTimeUp} />}
        </div>
        <Progress value={progressValue} className="h-2" />
      </CardHeader>
      <CardContent className="p-8">
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">{question.question}</p>
          
          <div className="space-y-4">
            {question.type === "multiple_choice" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 justify-start text-left whitespace-normal text-base border-gray-200 transition-all duration-200 ${getOptionStyle(option)}`}
                    onClick={() => onAnswer(option)}
                  >
                    <div className="w-6 h-6 mr-3 rounded-full border border-current flex items-center justify-center flex-shrink-0">
                      {selectedAnswer === option && <Check className="w-4 h-4" />}
                    </div>
                    {option}
                  </Button>
                ))}
              </div>
            )}
            {question.type === "true_false" && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className={`flex-1 h-auto p-4 text-lg border-gray-200 transition-all duration-200 ${getOptionStyle("true")}`}
                  onClick={() => onAnswer("true")}
                >
                  <Check className="w-5 h-5 mr-2"/> True
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 h-auto p-4 text-lg border-gray-200 transition-all duration-200 ${getOptionStyle("false")}`}
                  onClick={() => onAnswer("false")}
                >
                  <X className="w-5 h-5 mr-2"/> False
                </Button>
              </div>
            )}
            {question.type === "short_answer" && (
              <input
                type="text"
                value={selectedAnswer || ""}
                onChange={(e) => onAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </motion.div>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="ml-auto quiz-gradient text-white text-lg px-8 py-3"
        >
          {questionNumber === totalQuestions ? "Finish Quiz" : "Next"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}