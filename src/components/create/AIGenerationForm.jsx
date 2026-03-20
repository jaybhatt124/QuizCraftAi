import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, Loader2, Edit } from "lucide-react";

export default function AIGenerationForm({ onGenerate, onManual, isGenerating }) {
  const [content, setContent] = useState("");
  const [questionCount, setQuestionCount] = useState(10);

  const handleGenerate = () => {
    if (content.trim() && questionCount > 0) {
      onGenerate(content, questionCount);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Generation Option */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI-Powered Question Generation
          </CardTitle>
          <p className="text-gray-600">
            Paste your content below and let AI create engaging questions automatically
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Your Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text, article, notes, or any content you want to create questions from..."
              className="min-h-32"
              disabled={isGenerating}
            />
            <p className="text-sm text-gray-500">
              The more detailed your content, the better questions AI can generate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
              disabled={isGenerating}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!content.trim() || questionCount < 1 || isGenerating}
            className="w-full quiz-gradient text-white hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Questions with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Creation Option */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Edit className="w-6 h-6 text-blue-600" />
            Create Questions Manually
          </CardTitle>
          <p className="text-gray-600">
            Prefer to write your own questions? Start with a blank slate
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onManual}
            variant="outline"
            size="lg"
            className="w-full border-2 hover:bg-blue-50 hover:border-blue-200"
            disabled={isGenerating}
          >
            <FileText className="w-5 h-5 mr-2" />
            Start Creating Manually
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for AI Generation</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Provide comprehensive content for better question quality</li>
            <li>• Include key concepts, definitions, and important facts</li>
            <li>• AI works best with structured content like articles or study notes</li>
            <li>• You can always edit and refine the generated questions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}