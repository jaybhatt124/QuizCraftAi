
import React, { useState } from "react";
import { Quiz } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import QuizCreationForm from "../components/create/QuizCreationForm";
import AIGenerationForm from "../components/create/AIGenerationForm";
import QuestionEditor from "../components/create/QuestionEditor";
import PreviewQuiz from "../components/create/PreviewQuiz";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("create"); // "create", "ai", "edit", "preview"
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    subject: "custom",
    difficulty: "medium",
    time_limit: 0,
    questions: [],
    is_public: true, // Make public by default
    is_active: true, // Make active by default
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBasicInfoNext = (basicInfo) => {
    setQuizData(prev => ({ ...prev, ...basicInfo }));
    setStep("ai");
  };

  const handleAIGeneration = async (content, questionCount) => {
    setIsGenerating(true);
    try {
      const prompt = `Create ${questionCount} quiz questions based on the following content. Make them ${quizData.difficulty} difficulty level and appropriate for ${quizData.subject === 'custom' ? 'general knowledge' : quizData.subject}.

Content: ${content}

Generate a mix of multiple choice, true/false, and short answer questions. For each question, provide:
- The question text
- Question type (multiple_choice, true_false, or short_answer)
- For multiple choice: 4 options with one correct answer
- For true/false: just true or false as the correct answer
- For short answer: the expected answer
- A brief explanation of why the answer is correct

Make the questions engaging and test understanding, not just memorization.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  type: { 
                    type: "string",
                    enum: ["multiple_choice", "true_false", "short_answer"]
                  },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correct_answer: { type: "string" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      setQuizData(prev => ({
        ...prev,
        questions: result.questions || []
      }));
      setStep("edit");
    } catch (error) {
      console.error('Error generating questions:', error);
    }
    setIsGenerating(false);
  };

  const handleManualCreation = () => {
    setStep("edit");
  };

  const handleQuestionsUpdate = (questions) => {
    setQuizData(prev => ({ ...prev, questions }));
  };

  const handlePreview = () => {
    setStep("preview");
  };

  const handleSaveQuiz = async () => {
    try {
      await Quiz.create(quizData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleBack = () => {
    if (step === "ai") setStep("create");
    else if (step === "edit") setStep("ai");
    else if (step === "preview") setStep("edit");
    else navigate(createPageUrl("Dashboard"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="text-gray-600 mt-1">Build engaging quizzes in minutes</p>
          </div>
          {step === "edit" && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              AI Generated
            </div>
          )}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-2">
            {["create", "ai", "edit", "preview"].map((stepName, index) => (
              <React.Fragment key={stepName}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    stepName === step
                      ? "quiz-gradient text-white"
                      : ["create", "ai", "edit", "preview"].indexOf(step) > index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 w-12 transition-all duration-300 ${
                      ["create", "ai", "edit", "preview"].indexOf(step) > index
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === "create" && (
            <QuizCreationForm
              initialData={quizData}
              onNext={handleBasicInfoNext}
            />
          )}

          {step === "ai" && (
            <AIGenerationForm
              onGenerate={handleAIGeneration}
              onManual={handleManualCreation}
              isGenerating={isGenerating}
            />
          )}

          {step === "edit" && (
            <QuestionEditor
              questions={quizData.questions}
              onUpdate={handleQuestionsUpdate}
              onPreview={handlePreview}
            />
          )}

          {step === "preview" && (
            <PreviewQuiz
              quizData={quizData}
              onSave={handleSaveQuiz}
              onBack={() => setStep("edit")}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
