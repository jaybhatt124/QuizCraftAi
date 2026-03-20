import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookOpen, Clock, Globe, Calendar, Power } from "lucide-react";

const subjects = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "literature", label: "Literature" },
  { value: "geography", label: "Geography" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "custom", label: "Custom/Other" }
];

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

export default function QuizCreationForm({ initialData, onNext }) {
  const [formData, setFormData] = useState({
    ...initialData,
    is_active: initialData.is_active !== undefined ? initialData.is_active : true,
    start_date: initialData.start_date || "",
    end_date: initialData.end_date || ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    
    // Validate date range
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        newErrors.end_date = "End date must be after start date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="w-6 h-6" />
          Quiz Information
        </CardTitle>
        <p className="text-gray-600">Let's start with the basics of your quiz</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Quiz Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., World History Quiz, Math Challenge..."
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your quiz covers and what participants can expect to learn..."
            className={`min-h-20 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => handleInputChange('subject', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time_limit">Time Limit (minutes)</Label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Input
              id="time_limit"
              type="number"
              min="0"
              value={formData.time_limit}
              onChange={(e) => handleInputChange('time_limit', parseInt(e.target.value) || 0)}
              placeholder="0 for no limit"
              className="flex-1"
            />
          </div>
          <p className="text-sm text-gray-500">Set to 0 for no time limit</p>
        </div>

        {/* Quiz Scheduling */}
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="flex items-center gap-2 font-semibold text-blue-900">
            <Calendar className="w-5 h-5" />
            Quiz Scheduling (Optional)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date & Time</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date & Time</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
            </div>
          </div>
          <p className="text-sm text-blue-700">
            Leave blank to make the quiz available immediately and indefinitely
          </p>
        </div>

        {/* Quiz Status */}
        <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
          <Power className="w-4 h-4 text-green-600" />
          <Label htmlFor="is_active" className="flex-1">Quiz is active and available to students</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
        </div>

        <div className="flex items-center space-x-2 p-4 bg-purple-50 rounded-lg">
          <Globe className="w-4 h-4 text-purple-600" />
          <Label htmlFor="is_public" className="flex-1">Make this quiz public</Label>
          <Switch
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked) => handleInputChange('is_public', checked)}
          />
        </div>

        <Button 
          onClick={handleNext}
          className="w-full quiz-gradient text-white hover:opacity-90 transition-opacity"
          size="lg"
        >
          Continue to Questions
        </Button>
      </CardContent>
    </Card>
  );
}