"use client";

import React from "react";
import { useReading } from "@/contexts/ReadingContext";

const AssessGoal = () => {
  const {
    hasStarted,
    wordsRead,
    wordGoal,
    actualWPM,
    wpm,
    timeSpent,
    formatTime,
    progressPercent,
    aiAnalysis,
    isAnalyzing,
  } = useReading();

  if (!hasStarted) return null;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold font-montserrat mb-6 bg-linear-to-br from-purple-400 to-white bg-clip-text text-transparent">
        Session Analytics
      </h2>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Completion Rate</span>
            <span className="text-lg font-bold text-purple-400">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-gray-300 mb-2">Performance vs Goal</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">Target WPM</p>
              <p className="text-2xl font-bold text-purple-400">{wpm}</p>
            </div>
            <div className="text-3xl">
              {actualWPM >= parseInt(wpm) ? "🔥" : "📈"}
            </div>
            <div>
              <p className="text-xs text-gray-400">Actual WPM</p>
              <p className="text-2xl font-bold text-pink-400">
                {actualWPM || "--"}
              </p>
            </div>
          </div>
          {actualWPM > 0 && (
            <p className="text-xs text-center mt-2 text-gray-400">
              {actualWPM >= parseInt(wpm)
                ? "🎯 You're meeting your pace goal!"
                : "💪 Keep going to reach your target pace!"}
            </p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-gray-300 mb-3">Session Summary</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Words Read</p>
              <p className="text-lg font-bold text-green-400">{wordsRead}</p>
            </div>
            <div>
              <p className="text-gray-400">Goal</p>
              <p className="text-lg font-bold text-blue-400">{wordGoal}</p>
            </div>
            <div>
              <p className="text-gray-400">Time Elapsed</p>
              <p className="text-lg font-bold text-orange-400">
                {formatTime(timeSpent)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Remaining</p>
              <p className="text-lg font-bold text-yellow-400">
                {Math.max(0, parseInt(wordGoal) - wordsRead)}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for Opik AI insights */}
        <div className="p-4 rounded-lg linear-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          {/* <p className="text-xs text-purple-300 mb-2">🤖 AI Insights (Coming Soon)</p>
          <p className="text-sm text-gray-300">
            Opik AI will analyze your reading patterns and provide personalized recommendations here.
          </p> */}
          {/* AI Performance Analysis */}
          {isAnalyzing && (
            <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 animate-pulse">
              <p className="text-sm text-purple-300">
                🤖 AI is analyzing your performance...
              </p>
            </div>
          )}

          {aiAnalysis && (
            <div className="space-y-3 mt-6">
              {/* Summary */}
              <div className="p-4 rounded-lg bg-linear-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
                <p className="text-xs text-purple-300 mb-1">
                  🤖 AI Performance Summary
                </p>
                <p className="text-sm text-white">{aiAnalysis.summary}</p>
              </div>

              {/* Strengths */}
              {aiAnalysis.strengths && (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30">
                  <p className="text-xs text-green-300 mb-2 font-semibold">
                    ✓ What You Did Well
                  </p>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {aiAnalysis.strengths.map((strength: string, i: number) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {aiAnalysis.improvements && (
                <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                  <p className="text-xs text-blue-300 mb-2 font-semibold">
                    💡 Growth Areas
                  </p>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {aiAnalysis.improvements.map((tip: string, i: number) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Goal */}
              {aiAnalysis.nextGoal && (
                <div className="p-3 rounded-lg bg-orange-900/20 border border-orange-500/30">
                  <p className="text-xs text-orange-300 mb-1 font-semibold">
                    🎯 Next Session
                  </p>
                  <p className="text-sm text-gray-200">{aiAnalysis.nextGoal}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessGoal;
