import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

// Dummy text data to simulate parsed PDF
const DUMMY_TEXT = `The power of consistent reading cannot be overstated. In today's fast-paced world, finding time to read can be challenging. However, with the right tools and accountability, anyone can develop a strong reading habit. Reading expands your knowledge, improves focus, and opens doors to new perspectives. The key is to start small and build momentum. Set achievable goals and track your progress. Celebrate small wins along the way. Remember that every word read is a step forward. Consistency matters more than speed. Find your comfortable pace and stick with it. Over time, you'll notice improvements in both speed and comprehension. The journey of a thousand books begins with a single word.`;

interface ReadingContextType {
  wordGoal: string;
  setWordGoal: (goal: string) => void;
  wpm: string;
  setWpm: (wpm: string) => void;

  words: string[];
  setWords: (words: string[]) => void;
  currentWordIndex: number;
  setCurrentWordIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;

  wordsRead: number;
  setWordsRead: (words: number) => void;
  timeSpent: number;
  setTimeSpent: (time: number) => void;
  actualWPM: number;

  fileName: string;
  setFileName: (name: string) => void;

  loadDummyData: () => void;
  startReading: () => void;
  togglePlayPause: () => void;
  resetReading: () => void;
  goBack: () => void;
  goForward: () => void;
  formatTime: (seconds: number) => string;
  progressPercent: number;
  startWordIndex: number;
  setStartWordIndex: (index: number) => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const ReadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wordGoal, setWordGoal] = useState<string>("");
  const [wpm, setWpm] = useState<string>("");
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wordsRead, setWordsRead] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [actualWPM, setActualWPM] = useState<number>(0);

  const [fileName, setFileName] = useState<string>("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [startWordIndex, setStartWordIndex] = useState<number>(0);

  const loadDummyData = () => {
    const wordsArray = DUMMY_TEXT.split(/\s+/).filter(
      (word) => word.length > 0,
    );
    setWords(wordsArray);
    setFileName("dummy-book.pdf (Sample Data)");
  };

  const startReading = () => {
    if (!wordGoal || !wpm) {
      alert("Please set both word goal and reading speed");
      return;
    }
    if (words.length === 0) {
      alert("Please upload a file or load dummy data");
      return;
    }
    setHasStarted(true);
    setIsPlaying(true);
    setCurrentWordIndex(startWordIndex); // Start from selected position
    setWordsRead(startWordIndex); // Account for words already "read"
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (isPlaying && hasStarted && currentWordIndex < words.length) {
      const interval = (60 / parseInt(wpm)) * 1000;

      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          const next = prev + 1;
          if (next >= words.length) {
            setIsPlaying(false);
            return prev;
          }
          setWordsRead(next);
          return next;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, hasStarted, currentWordIndex, words.length, wpm]);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout;
    if (isPlaying && hasStarted) {
      timeInterval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timeInterval);
  }, [isPlaying, hasStarted]);

  useEffect(() => {
    if (timeSpent > 0) {
      const minutes = timeSpent / 60;
      const calculatedWPM = Math.round(wordsRead / minutes);
      setActualWPM(calculatedWPM);
    }
  }, [wordsRead, timeSpent]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetReading = () => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setWordsRead(0);
    setTimeSpent(0);
    setHasStarted(false);
  };

  const goBack = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
      setWordsRead((prev) => Math.max(0, prev - 1));
    }
  };

  const goForward = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setWordsRead((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = wordGoal
    ? Math.min((wordsRead / parseInt(wordGoal)) * 100, 100)
    : 0;

  return (
    <ReadingContext.Provider
      value={{
        wordGoal,
        setWordGoal,
        wpm,
        setWpm,
        words,
        setWords,
        currentWordIndex,
        setCurrentWordIndex,
        isPlaying,
        setIsPlaying,
        hasStarted,
        setHasStarted,
        wordsRead,
        setWordsRead,
        timeSpent,
        setTimeSpent,
        actualWPM,
        fileName,
        setFileName,
        loadDummyData,
        startReading,
        togglePlayPause,
        resetReading,
        goBack,
        goForward,
        formatTime,
        progressPercent,
        startWordIndex,
        setStartWordIndex,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error("useReading must be used within a ReadingProvider");
  }
  return context;
};
