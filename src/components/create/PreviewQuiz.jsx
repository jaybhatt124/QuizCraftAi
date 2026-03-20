
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewQuiz({ quizData, onSave, onBack }) {
  // A simple mock for createPageUrl. In a real application, this would typically
  // be a utility function that constructs URLs based on your routing setup.
  // For example, if using Next.js, it might be a simple string or a function
  // that uses a route name to generate a path.
  // Given the usage `createPageUrl("TakeQuiz?id=QUIZ_ID")`, it seems to expect a string
  // representing the path and query, and simply returns it.
  const createPageUrl = (path) => path;

  const handleShareAfterSave = () => {
    // This will be called after the quiz is saved
    // Note: QUIZ_ID is a placeholder. In a real scenario, this would be the actual
    // ID of the quiz returned after a successful save operation.
    const quizUrl = `${window.location.origin}${createPageUrl(`TakeQuiz?id=QUIZ_ID`)}`;
    console.log('Quiz will be shareable at:', quizUrl);
    // In a real application, you might display this URL to the user,
    // copy it to clipboard, or integrate with a sharing service.
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Preview</h2>
          <p className="text-gray-600">Review your quiz before publishing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <Button onClick={onSave} className="quiz-gradient text-white hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Publish Quiz
          </Button>
        </div>
      </div>

      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl">{quizData.title}</CardTitle>
            <p className="text-gray-600 text-lg">{quizData.description}</p>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {quizData.subject.replace('_', ' ')}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {quizData.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {quizData.time_limit ? `${quizData.time_limit} minutes` : 'No time limit'}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" />
                {quizData.is_public ? 'Public' : 'Private'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quiz Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Total Questions:</span>
                <p className="text-blue-900 font-bold">{quizData.questions?.length || 0}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Multiple Choice:</span>
                <p className="text-blue-900 font-bold">
                  {quizData.questions?.filter(q => q.type === 'multiple_choice').length || 0}
                </p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">True/False:</span>
                <p className="text-blue-900 font-bold">
                  {quizData.questions?.filter(q => q.type === 'true_false').length || 0}
                </p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Short Answer:</span>
                <p className="text-blue-900 font-bold">
                  {quizData.questions?.filter(q => q.type === 'short_answer').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">📋 After Publishing</h3>
            <p className="text-sm text-green-700 mb-2">
              Once published, you'll be able to:
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Share the quiz link with students</li>
              <li>• Track student responses and scores</li>
              <li>• Download results as CSV</li>
              <li>• Open/close the quiz anytime</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Questions Preview</h3>
            <div className="space-y-4">
              {quizData.questions?.slice(0, 3).map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {question.type.replace('_', ' ')}
                      </span>
                      {question.type === 'multiple_choice' && (
                        <div className="mt-2 space-y-1">
                          {question.options?.filter(Boolean).slice(0, 2).map((option, i) => (
                            <div key={i} className="text-sm text-gray-600 ml-4">
                              • {option}
                            </div>
                          ))}
                          {question.options?.filter(Boolean).length > 2 && (
                            <div className="text-sm text-gray-500 ml-4">
                              ... and {question.options.filter(Boolean).length - 2} more options
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {quizData.questions?.length > 3 && (
                <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    ... and {quizData.questions.length - 3} more questions
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
