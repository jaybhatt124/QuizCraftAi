import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionEditor({ questions, onUpdate, onPreview }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const addNewQuestion = () => {
    const newQuestion = {
      question: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: ""
    };
    onUpdate([...questions, newQuestion]);
    setEditingIndex(questions.length);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onUpdate(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const newOptions = [...updatedQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = newOptions;
    onUpdate(updatedQuestions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onUpdate(updatedQuestions);
    setEditingIndex(null);
  };

  const QuestionCard = ({ question, index }) => {
    const isEditing = editingIndex === index;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingIndex(isEditing ? null : index)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter your question..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {question.options.map((option, optionIndex) => (
                      <Input
                        key={optionIndex}
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  {question.type === 'multiple_choice' ? (
                    <Select
                      value={question.correct_answer}
                      onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.filter(Boolean).map((option, i) => (
                          <SelectItem key={i} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : question.type === 'true_false' ? (
                    <Select
                      value={question.correct_answer}
                      onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={question.correct_answer}
                      onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                      placeholder="Expected answer"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                    placeholder="Explain why this is the correct answer..."
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {question.type.replace('_', ' ')}
                  </span>
                </div>
                
                {question.type === 'multiple_choice' && (
                  <div className="space-y-1">
                    {question.options.filter(Boolean).map((option, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded border text-sm ${
                          option === question.correct_answer 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {option} {option === question.correct_answer && '✓'}
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type !== 'multiple_choice' && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    Answer: {question.correct_answer}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Questions</h2>
          <p className="text-gray-600">Review and customize your quiz questions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addNewQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button
            onClick={onPreview}
            className="quiz-gradient text-white hover:opacity-90"
            disabled={questions.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Quiz
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Add your first question to get started</p>
            <Button onClick={addNewQuestion} className="quiz-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add First Question
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard key={index} question={question} index={index} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}