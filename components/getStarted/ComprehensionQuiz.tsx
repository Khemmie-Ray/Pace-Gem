"use client";

import React, { useState } from "react";
import { X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useReading } from "@/contexts/ReadingContext";
import { toast } from "sonner";

const ComprehensionQuiz = () => {
  const { quizData, showQuiz, setShowQuiz, setQuizScore, quizScore } =
    useReading();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(["", "", ""]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!showQuiz || !quizData) return null;

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitAnswer = async () => {
    const answer = userAnswers[currentQuestion];

    if (!answer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setIsEvaluating(true);

    try {
      const response = await fetch("/api/ai/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: quizData.questions[currentQuestion],
          userAnswer: answer,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newEvaluations = [...evaluations];
        newEvaluations[currentQuestion] = result.evaluation;
        setEvaluations(newEvaluations);

        // Move to next question or show results
        if (currentQuestion < 2) {
          setCurrentQuestion(currentQuestion + 1);
          toast.success("Answer submitted!");
        } else {
          // Calculate final score
          const totalScore =
            newEvaluations.reduce((sum, item) => sum + item.score, 0) / 3;
          setQuizScore(totalScore);
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("Failed to evaluate answer");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleClose = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setUserAnswers(["", "", ""]);
    setEvaluations([]);
    setShowResults(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recall":
        return "text-blue-400";
      case "understanding":
        return "text-purple-400";
      case "application":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-gray-900 to-purple-900 rounded-2xl border-2 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Comprehension Check
            </h2>
            <p className="text-sm text-purple-100">
              Test your understanding of what you just read
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < currentQuestion
                    ? "bg-green-500"
                    : i === currentQuestion
                      ? "bg-purple-500"
                      : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {!showResults ? (
          /* Question View */
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 capitalize">
                  {quizData.questions[currentQuestion].type}
                </span>
                <span className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of 3
                </span>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">
                {quizData.questions[currentQuestion].question}
              </h3>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">
                Your Answer:
              </label>
              <textarea
                value={userAnswers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none resize-none"
                disabled={isEvaluating}
              />
            </div>

            {/* Show feedback for answered questions */}
            {evaluations[currentQuestion] && (
              <div
                className={`mb-6 p-4 rounded-lg border-2 ${
                  evaluations[currentQuestion].isCorrect
                    ? "bg-green-900/20 border-green-500"
                    : "bg-orange-900/20 border-orange-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {evaluations[currentQuestion].isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-400" />
                  )}
                  <span className="font-semibold text-white">
                    Score: {evaluations[currentQuestion].score}%
                  </span>
                </div>
                <p className="text-sm text-gray-200">
                  {evaluations[currentQuestion].feedback}
                </p>
              </div>
            )}

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || !userAnswers[currentQuestion].trim()}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Evaluating...
                </>
              ) : currentQuestion < 2 ? (
                "Submit & Next"
              ) : (
                "Submit & See Results"
              )}
            </button>
          </div>
        ) : (
          /* Results View */
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {quizScore >= 80 ? "🎉" : quizScore >= 60 ? "👍" : "📚"}
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Final Score: {quizScore.toFixed(0)}%
              </h3>
              <p className="text-gray-300">
                {quizScore >= 80
                  ? "Excellent comprehension!"
                  : quizScore >= 60
                    ? "Good understanding, keep it up!"
                    : "Consider re-reading for better retention"}
              </p>
            </div>

            {/* Review Answers */}
            <div className="space-y-4">
              {quizData.questions.map((q: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-sm font-semibold ${getTypeColor(q.type)} capitalize`}
                    >
                      {q.type}
                    </span>
                    {evaluations[i] && (
                      <span className="text-sm text-gray-400">
                        {evaluations[i].score}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white mb-2">{q.question}</p>
                  <p className="text-xs text-gray-400 mb-1">Your answer:</p>
                  <p className="text-sm text-gray-200 mb-2">{userAnswers[i]}</p>
                  <p className="text-xs text-gray-400 mb-1">Correct answer:</p>
                  <p className="text-sm text-green-300">{q.correctAnswer}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Close Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensionQuiz;
