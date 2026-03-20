
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Circle,
    ArrowUpCircle,
    Pencil,
    Trash2,
    PowerOff,
    Power,
    Share2,
    MoreVertical // Added for dropdown menu trigger
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { QuizAttempt, User, Quiz } from "@/entities/all";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

export default function RecentQuizzes({ quizzes, isLoading, onQuizUpdate }) {
  const [userAttempts, setUserAttempts] = React.useState([]);
  const [attemptsLoaded, setAttemptsLoaded] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        const attempts = await QuizAttempt.filter({ created_by: user.email });
        setUserAttempts(attempts);
      } catch (error) {
        console.error('Error loading user data:', error);
        setCurrentUser(null);
      }
      setAttemptsLoaded(true);
    };

    if (!isLoading) {
      loadUserData();
    }
  }, [isLoading]);

  const hasUserTakenQuiz = (quizId) => {
    return userAttempts.some(attempt => attempt.quiz_id === quizId);
  };

  const isQuizAvailable = (quiz) => {
    const now = new Date();
    
    // Check if quiz is active
    if (!quiz.is_active) return false;
    
    // Check start date
    if (quiz.start_date && new Date(quiz.start_date) > now) return false;
    
    // Check end date
    if (quiz.end_date && new Date(quiz.end_date) < now) return false;
    
    return true;
  };

  const getQuizStatus = (quiz) => {
    const now = new Date();
    
    if (!quiz.is_active) return { status: 'closed', text: 'Closed', color: 'bg-red-100 text-red-800' };
    
    if (quiz.start_date && new Date(quiz.start_date) > now) {
      return { status: 'scheduled', text: `Opens ${format(new Date(quiz.start_date), 'MMM d, HH:mm')}`, color: 'bg-orange-100 text-orange-800' };
    }
    
    if (quiz.end_date && new Date(quiz.end_date) < now) {
      return { status: 'expired', text: 'Expired', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (quiz.end_date && new Date(quiz.end_date) > now) {
      return { status: 'active', text: `Ends ${format(new Date(quiz.end_date), 'MMM d, HH:mm')}`, color: 'bg-green-100 text-green-800' };
    }
    
    return { status: 'active', text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await Quiz.delete(quizId);
      if (onQuizUpdate) onQuizUpdate();
      toast.success("Quiz deleted successfully.");
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error("Failed to delete quiz.");
    }
  };

  const handleToggleQuizStatus = async (quiz) => {
    try {
      await Quiz.update(quiz.id, { is_active: !quiz.is_active });
      if (onQuizUpdate) onQuizUpdate();
      toast.success(`Quiz status updated to ${quiz.is_active ? 'inactive' : 'active'}.`);
    } catch (error) {
      console.error('Error updating quiz status:', error);
      toast.error("Failed to update quiz status.");
    }
  };

  const handleShareQuiz = async (quizId) => {
    const quizUrl = `${window.location.origin}${createPageUrl(`TakeQuiz?id=${quizId}`)}`;
    try {
      await navigator.clipboard.writeText(quizUrl);
      toast.success('Quiz link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy quiz link:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  if (isLoading || !attemptsLoaded) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Available Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Circle className="w-5 h-5" />
          Available Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {quizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Circle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
              <p className="text-gray-500 mb-4">Create your first quiz or wait for public quizzes!</p>
              <Link to={createPageUrl("CreateQuiz")}>
                <Button className="quiz-gradient text-white">Create Quiz</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, index) => {
                const userTakenQuiz = hasUserTakenQuiz(quiz.id);
                const isOwner = quiz.created_by === currentUser?.email;
                const quizAvailable = isQuizAvailable(quiz);
                const quizStatus = getQuizStatus(quiz);

                return (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {isOwner ? 'Your Quiz' : `By ${quiz.created_by}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {/* Share button (always available) */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShareQuiz(quiz.id)}
                          className="text-blue-600 hover:bg-blue-50"
                          title="Share Quiz"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>

                        {isOwner ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="px-2" title="More options">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link to={createPageUrl(`CreateQuiz?id=${quiz.id}`)}>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Quiz
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem onClick={() => handleToggleQuizStatus(quiz)}>
                                {quiz.is_active ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                                {quiz.is_active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <Link to={createPageUrl(`QuizResults?id=${quiz.id}`)}>
                                <DropdownMenuItem>
                                  <ArrowUpCircle className="mr-2 h-4 w-4 rotate-90" /> {/* Icon for results */}
                                  View Results
                                </DropdownMenuItem>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()} 
                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Quiz
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : userTakenQuiz ? (
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </div>
                        ) : quizAvailable ? (
                          <Link to={createPageUrl(`TakeQuiz?id=${quiz.id}`)}>
                            <Button size="sm" className="quiz-gradient text-white hover:opacity-90">
                              <Circle className="w-4 h-4 mr-1" />
                              Take Quiz
                            </Button>
                          </Link>
                        ) : (
                          <div className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                            Not Available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className={subjectColors[quiz.subject]}>
                        {quiz.subject.replace('_', ' ')}
                      </Badge>
                      <Badge className={difficultyColors[quiz.difficulty]}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge className={quizStatus.color}>
                        {quizStatus.text}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        {quiz.time_limit ? `${quiz.time_limit}min` : 'No limit'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{quiz.questions?.length || 0} questions</span>
                      <span>Created {format(new Date(quiz.created_date), 'MMM d, yyyy')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
