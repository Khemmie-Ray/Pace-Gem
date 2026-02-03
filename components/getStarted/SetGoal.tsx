"use client";

import React, { useState } from "react";
import { Upload, Loader2, CheckCircle, FileText } from "lucide-react";
import { useReading } from "@/contexts/ReadingContext";
import { toast } from "sonner";

const SetGoal = () => {
  const {
    wordGoal,
    setWordGoal,
    wpm,
    setWpm,
    fileName,
    setFileName,
    words,
    setWords,
    loadDummyData,
    startReading,
    hasStarted,
    startWordIndex,
    setStartWordIndex,
  } = useReading();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [parsedMetadata, setParsedMetadata] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [previewPage, setPreviewPage] = useState(0);
  const WORDS_PER_PAGE = 100;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning("Please upload a PDF file only");
      e.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.warning(
        "File is too large. Please upload a PDF smaller than 10MB.",
      );
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setUploadProgress("Reading PDF...");

    try {
      setUploadProgress("Extracting text...");
      const { parsePDF } = await import("@/lib/pdf/pdfParser");
      const parsed = await parsePDF(file);

      setUploadProgress("Processing content...");

      setWords(parsed.words);
      setFileName(file.name);
      setParsedMetadata(parsed.metadata);
      setChapters(parsed.chapters);

      setUploadProgress("Complete!");

      //   console.log('PDF parsed successfully:', {
      //     pages: parsed.metadata.totalPages,
      //     words: parsed.metadata.totalWords,
      //     chapters: parsed.chapters.length,
      //   });

      const suggestedGoal = Math.min(
        1000,
        Math.floor(parsed.metadata.totalWords * 0.1),
      );
      setWordGoal(suggestedGoal.toString());

      setTimeout(() => {
        setUploadProgress("");
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error("PDF upload error:", error);
      toast.error("Failed to parse PDF. Please try another file.");
      setIsUploading(false);
      setUploadProgress("");
      e.target.value = "";
    }
  };

  if (hasStarted) return null;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/10">
      <h2 className="text-2xl font-bold font-montserrat mb-6 bg-linear-to-br from-purple-400 to-white bg-clip-text text-transparent">
        Set Goals
      </h2>

      <div className="mb-6">
        <p className="mb-3 font-semibold">Upload Your eBook (PDF)</p>

        <label className="block">
          <div
            className={`border-2 border-dashed ${
              isUploading
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/20 hover:border-purple-400"
            } transition-colors p-8 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10`}
          >
            <div className="flex flex-col items-center justify-center gap-3 p-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                  <p className="text-center text-purple-300">
                    {uploadProgress}
                  </p>
                </>
              ) : fileName ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <p className="text-center text-green-300 wrap-break-all whitespace-normal px-4">{fileName.length > 40 ? fileName.slice(0, 40) + "..." : fileName}</p>
                  <p className="text-xs text-gray-400">
                    Click to upload different file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-purple-400" />
                  <p className="text-center">Click to upload PDF file</p>
                  <p className="text-sm text-gray-400">
                    PDF files only (max 10MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </label>

        <button
          onClick={loadDummyData}
          className="mt-3 px-4 py-3 rounded-lg transition-all duration-200 bg-linear-to-br from-[#5F5DFC] to-[#B840F9] text-white hover:opacity-90 hover:font-bold text-sm w-full"
          disabled={isUploading}
        >
          Use Sample Data (for testing)
        </button>
      </div>

      {parsedMetadata && (
        <div className="mb-6 p-4 rounded-lg border border-white/20 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-400" />
            <p className="font-semibold text-purple-300">Book Information</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Total Pages</p>
              <p className="font-bold text-white">
                {parsedMetadata.totalPages}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Words</p>
              <p className="font-bold text-white">
                {parsedMetadata.totalWords.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Chapters Found</p>
              <p className="font-bold text-white">{chapters.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Est. Reading Time</p>
              <p className="font-bold text-white">
                {parsedMetadata.estimatedReadingTime} min
              </p>
            </div>
          </div>
          {words.length > 0 && (
            <div className="mb-6 space-y-4 mt-4">
            
              {chapters.length > 0 && (
                <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                  <p className="text-sm text-gray-300 mb-3 font-semibold">
                    Jump to Section:
                  </p>
                  <select
                    value={
                      chapters.findIndex(
                        (ch) =>
                          ch.startIndex <= startWordIndex &&
                          ch.endIndex > startWordIndex,
                      ) ?? 0
                    }
                    onChange={(e) => {
                      const chapterIndex = parseInt(e.target.value);
                      const chapter = chapters[chapterIndex];
                      if (chapter) {
                        setStartWordIndex(chapter.startIndex);
                        setPreviewPage(
                          Math.floor(chapter.startIndex / WORDS_PER_PAGE),
                        );
                        toast.success(`Will start from: ${chapter.title}`);
                      }
                    }}
                    className="w-full p-2 border border-white/20 rounded-lg bg-white/5 text-white focus:border-purple-400 transition-colors"
                  >
                    {chapters.map((chapter, idx) => (
                      <option key={idx} value={idx}>
                        {chapter.title} (Word {chapter.startIndex + 1})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* <div className=""> */}
                <div className="flex justify-between items-center mb-2 mt-3 border-b border-white/20">
                  <p className="text-sm text-gray-300 font-semibold py-2 ">
                    Preview <br />Click any word to start:
                  </p>
          
                  <p className="text-xs text-gray-400">
                    Words <br />{previewPage * WORDS_PER_PAGE + 1} -{" "}
                    {Math.min((previewPage + 1) * WORDS_PER_PAGE, words.length)}
                  </p>
                </div>

                <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar mb-3">
                  <p className="text-sm leading-relaxed">
                    {words
                      .slice(
                        previewPage * WORDS_PER_PAGE,
                        (previewPage + 1) * WORDS_PER_PAGE,
                      )
                      .map((word, relativeIdx) => {
                        const absoluteIdx =
                          previewPage * WORDS_PER_PAGE + relativeIdx;
                        return (
                          <span
                            key={absoluteIdx}
                            onClick={() => {
                              setStartWordIndex(absoluteIdx);
                              toast.success(
                                `Will start from word ${absoluteIdx + 1}: "${word}"`,
                              );
                            }}
                            className={`cursor-pointer hover:bg-purple-500/30 hover:text-purple-200 px-1 rounded transition-colors ${
                              absoluteIdx === startWordIndex
                                ? "bg-purple-500/50 text-purple-100 font-bold"
                                : ""
                            }`}
                          >
                            {word}{" "}
                          </span>
                        );
                      })}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={() =>
                      setPreviewPage((prev) => Math.max(0, prev - 1))
                    }
                    disabled={previewPage === 0}
                    className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    ← Previous
                  </button>


                  <button
                    onClick={() =>
                      setPreviewPage((prev) =>
                        Math.min(
                          Math.ceil(words.length / WORDS_PER_PAGE) - 1,
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      previewPage >=
                      Math.ceil(words.length / WORDS_PER_PAGE) - 1
                    }
                    className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Next →
                  </button>
                </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Page {previewPage + 1} of{" "}
                      {Math.ceil(words.length / WORDS_PER_PAGE)}
                    </p>
                    {startWordIndex > 0 && (
                      <button
                        onClick={() => {
                          setPreviewPage(
                            Math.floor(startWordIndex / WORDS_PER_PAGE),
                          );
                          toast.info("Jumped to selected word");
                        }}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors"
                      >
                        Go to selected word
                      </button>
                    )}
                  </div>

                {startWordIndex > 0 && (
                  <p className="text-xs text-purple-300 mt-2 text-center">
                    ✓ Starting from word {startWordIndex + 1} of{" "}
                    {words.length.toLocaleString()}
                  </p>
                )}
              {/* </div> */}
            </div>
          )}

          {chapters.length > 0 && chapters.length < 20 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">Chapters detected:</p>
              <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                {chapters.map((chapter, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span className="truncate">{chapter.title}</span>
                    <span className="text-gray-500 ml-2">
                      {chapter.wordCount} words
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center flex-col mb-6">
        <div className="w-full">
          <p className="mb-2 font-semibold">Goal (words):</p>
          <input
            type="number"
            placeholder="e.g., 500"
            value={wordGoal}
            onChange={(e) => setWordGoal(e.target.value)}
            className="p-3 border outline-0 border-white/20 rounded-lg w-full bg-white/5 focus:border-purple-400 transition-colors"
          />
        </div>
        <div className="w-full">
          <p className="mb-2 font-semibold">Words per minute:</p>
          <input
            type="number"
            placeholder="e.g., 200"
            value={wpm}
            onChange={(e) => setWpm(e.target.value)}
            className="p-3 border outline-0 border-white/20 rounded-lg w-full bg-white/5 focus:border-purple-400 transition-colors"
          />
        </div>
      </div>

      {wordGoal && wpm && (
        <p className="text-sm text-gray-300 mb-4">
          Estimated time: {Math.ceil(parseInt(wordGoal) / parseInt(wpm))}{" "}
          minutes
        </p>
      )}

      <button
        onClick={startReading}
        disabled={isUploading || words.length === 0}
        className="w-full py-3 transition-all duration-200 bg-linear-to-br from-[#5F5DFC] to-[#B840F9] text-white hover:opacity-90 hover:font-bold hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {words.length === 0
          ? "Upload a book to start"
          : "Start Reading Session"}
      </button>
    </div>
  );
};

export default SetGoal;
