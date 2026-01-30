import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle, FileText } from 'lucide-react';
import { useReading } from '@/contexts/ReadingContext';
import { parsePDF } from '@/lib/pdf/pdfParser';
import { toast } from 'sonner';

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
  } = useReading();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [parsedMetadata, setParsedMetadata] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      e.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
      alert('File is too large. Please upload a PDF smaller than 10MB.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress('Reading PDF...');

    try {
      setUploadProgress('Extracting text...');
      const parsed = await parsePDF(file);

      setUploadProgress('Processing content...');
      
      setWords(parsed.words);
      setFileName(file.name);
      setParsedMetadata(parsed.metadata);
      setChapters(parsed.chapters);

      setUploadProgress('Complete!');
      
      console.log('PDF parsed successfully:', {
        pages: parsed.metadata.totalPages,
        words: parsed.metadata.totalWords,
        chapters: parsed.chapters.length,
      });

      const suggestedGoal = Math.min(1000, Math.floor(parsed.metadata.totalWords * 0.1));
      setWordGoal(suggestedGoal.toString());

      setTimeout(() => {
        setUploadProgress('');
        setIsUploading(false);
      }, 1500);

    } catch (error) {
      console.error('PDF upload error:', error);
      toast.error('Failed to parse PDF. Please try another file.');
      setIsUploading(false);
      setUploadProgress('');
      e.target.value = '';
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
          <div className={`border-2 border-dashed ${
            isUploading ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-400'
          } transition-colors p-8 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10`}>
            <div className="flex flex-col items-center justify-center gap-3">
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                  <p className="text-center text-purple-300">{uploadProgress}</p>
                </>
              ) : fileName ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-400" />
                  <p className="text-center text-green-300">{fileName}</p>
                  <p className="text-xs text-gray-400">Click to upload different file</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-purple-400" />
                  <p className="text-center">Click to upload PDF file</p>
                  <p className="text-sm text-gray-400">PDF files only (max 10MB)</p>
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
          className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm w-full"
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
              <p className="font-bold text-white">{parsedMetadata.totalPages}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Words</p>
              <p className="font-bold text-white">{parsedMetadata.totalWords.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Chapters Found</p>
              <p className="font-bold text-white">{chapters.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Est. Reading Time</p>
              <p className="font-bold text-white">{parsedMetadata.estimatedReadingTime} min</p>
            </div>
          </div>

          {chapters.length > 0 && chapters.length < 20 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">Chapters detected:</p>
              <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                {chapters.map((chapter, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300">
                    <span className="truncate">{chapter.title}</span>
                    <span className="text-gray-500 ml-2">{chapter.wordCount} words</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {words.length > 0 && (
        <div className="p-4 rounded-lg mb-6 border border-white/20 bg-white/5">
          <p className="text-sm text-gray-300 mb-2">Preview (first 50 words):</p>
          <p className="text-sm leading-relaxed">
            {words.slice(0, 50).join(' ')}...
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
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
          Estimated time: {Math.ceil(parseInt(wordGoal) / parseInt(wpm))} minutes
        </p>
      )}

      <button
        onClick={startReading}
        disabled={isUploading || words.length === 0}
        className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {words.length === 0 ? 'Upload a book to start' : 'Start Reading Session'}
      </button>
    </div>
  );
};

export default SetGoal;