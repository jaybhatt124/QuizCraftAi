import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { createPageUrl } from "@/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ShareQuizButton({ quiz, className = "" }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const quizUrl = `${window.location.origin}${createPageUrl(`TakeQuiz?id=${quiz.id}`)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy quiz link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: quiz.title,
          text: `Take this quiz: ${quiz.title}`,
          url: quizUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`text-blue-600 hover:bg-blue-50 ${className}`}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Quiz
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-1">{quiz.title}</h3>
            <p className="text-sm text-blue-700">{quiz.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                {quiz.questions?.length || 0} questions
              </Badge>
              {quiz.time_limit > 0 && (
                <Badge className="bg-purple-100 text-purple-800">
                  {quiz.time_limit} min
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quiz Link</label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={quizUrl}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className={copied ? "text-green-600 border-green-200 bg-green-50" : ""}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600">Link copied to clipboard!</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleShareNative}
              className="flex-1 quiz-gradient text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {navigator.share ? 'Share' : 'Copy Link'}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Students can take this quiz by clicking the link above
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}