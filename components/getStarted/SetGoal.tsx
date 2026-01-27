"use client"

import React, { useState } from "react";
import { dummyBook } from "../../lib/dummyBook";

const SetGoal = ({ onStart }: { onStart: (data: any) => void }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [goalWords, setGoalWords] = useState("");
  const [wpm, setWpm] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    setFileName(file.name);
  };

  const handleStart = () => {
    onStart({
      book: dummyBook,
      goalWords: Number(goalWords),
      wpm: Number(wpm),
    });
  };

  return (
    <div>
      <h2 className="text-[20px] font-bold font-montserrat mb-6 bg-gradient-to-br from-purple-400 to-white bg-clip-text text-transparent">
        Set goals
      </h2>

      {/* Upload */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">Upload PDF</p>

        <label className="cursor-pointer border border-dashed border-white/30 rounded-lg p-4 flex justify-between items-center hover:bg-white/5 transition">
          <span className="text-sm text-gray-300">
            {fileName ?? "Click to upload a PDF"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Goal inputs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-[48%]">
          <p className="mb-2 font-semibold">Word goal</p>
          <input
            value={goalWords}
            onChange={(e) => setGoalWords(e.target.value)}
            placeholder="e.g. 1200"
            className="p-2 w-full rounded-lg bg-transparent border border-white/20 outline-none"
          />
        </div>

        <div className="w-full md:w-[48%]">
          <p className="mb-2 font-semibold">Words per minute</p>
          <input
            value={wpm}
            onChange={(e) => setWpm(e.target.value)}
            placeholder="e.g. 250"
            className="p-2 w-full rounded-lg bg-transparent border border-white/20 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full rounded-lg bg-linear-to-br from-purple-500 to-fuchsia-500 p-3 font-semibold"
      >
        Start Reading
      </button>
    </div>
  );
};

export default SetGoal;
