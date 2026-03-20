import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const quickActions = [
  {
    title: "AI Quiz Generator",
    description: "Let AI create questions from your content",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    action: createPageUrl("CreateQuiz")
  },
  {
    title: "Browse Templates",
    description: "Start with pre-built quiz templates",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    action: createPageUrl("CreateQuiz")
  },
  {
    title: "Practice Mode",
    description: "Take quizzes to test your knowledge",
    icon: Brain,
    color: "from-green-500 to-teal-500",
    action: createPageUrl("Dashboard")
  }
];

export default function QuickStart() {
  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Start
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.action}>
              <div className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2">Tips for Better Quizzes</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use clear, concise questions</li>
            <li>• Mix different question types</li>
            <li>• Add explanations for answers</li>
            <li>• Set appropriate time limits</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}