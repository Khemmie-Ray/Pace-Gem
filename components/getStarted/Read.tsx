"use client"

import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReading } from '@/contexts/ReadingContext';

const Read = () => {
  const {
    words,
    currentWordIndex,
    isPlaying,
    hasStarted,
    progressPercent,
    togglePlayPause,
    resetReading,
    goBack,
    goForward,
    wordsRead,
    wordGoal,
    wpm,
    timeSpent,
    formatTime,
    actualWPM,
  } = useReading();

  if (!hasStarted) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-400">
            Set your goals to begin reading
          </h2>
          <p className="text-gray-300">Upload a file and configure your reading settings</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="w-full border-2 border-white/20 rounded-xl flex flex-col justify-center items-center h-[60vh] bg-linear-to-br from-purple-900/20 to-pink-900/20 relative">

          <div className="absolute top-0 left-0 w-full h-2 bg-white/10 rounded-t-xl overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-6xl md:text-8xl font-bold text-center px-4 animate-pulse">
            {words[currentWordIndex] || 'Starting...'}
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Word {currentWordIndex + 1} of {words.length}
          </p>
          <div className="absolute bottom-6 flex gap-4">
            <button
              onClick={goBack}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentWordIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>

            <button
              onClick={goForward}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentWordIndex >= words.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={resetReading}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors ml-4"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-purple-400">Live Progress</h3>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <p className="text-sm text-gray-300 mb-2">Goal Pace</p>
            <p className="text-3xl font-bold text-purple-400">{wpm}</p>
            <p className="text-xs text-gray-400">WPM</p>
          </div>

          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <p className="text-sm text-gray-300 mb-2">Actual Pace</p>
            <p className="text-3xl font-bold text-pink-400">
              {actualWPM || '--'}
            </p>
            <p className="text-xs text-gray-400">WPM</p>
          </div>

          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <p className="text-sm text-gray-300 mb-2">Words Read</p>
            <p className="text-3xl font-bold text-green-400">{wordsRead}</p>
            <p className="text-xs text-gray-400">of {wordGoal}</p>
          </div>

          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <p className="text-sm text-gray-300 mb-2">Time Spent</p>
            <p className="text-3xl font-bold text-blue-400">
              {formatTime(timeSpent)}
            </p>
            <p className="text-xs text-gray-400">minutes</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Goal Progress</span>
            <span className="text-sm font-bold">{progressPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent >= 100 && (
            <p className="text-center mt-3 text-green-400 font-bold">
              🎉 Goal Achieved! Great job!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Read;