import * as pdfjsLib from 'pdfjs-dist';


if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
}

interface ParsedContent {
  fullText: string;
  words: string[];
  chapters: Chapter[];
  metadata: {
    totalPages: number;
    totalWords: number;
    estimatedReadingTime: number; // in minutes at 200 WPM
    fileName: string;
  };
}

interface Chapter {
  title: string;
  content: string;
  wordCount: number;
  startIndex: number; // Where it starts in the words array
  endIndex: number;
}

// Patterns to detect sections we want to SKIP
const SKIP_PATTERNS = [
  /^table of contents$/i,
  /^contents$/i,
  /^acknowledgements?$/i,
  /^acknowledgments?$/i,
  /^preface$/i,
  /^foreword$/i,
  /^introduction$/i, // Sometimes you want to skip this
  /^about the author$/i,
  /^copyright$/i,
  /^dedication$/i,
  /^bibliography$/i,
  /^references$/i,
  /^index$/i,
  /^glossary$/i,
];

const CHAPTER_PATTERNS = [
  /^chapter\s+\d+/i,
  /^chapter\s+[ivxlcdm]+/i, 
  /^part\s+\d+/i,
  /^section\s+\d+/i,
  /^\d+\.\s+[A-Z]/,  
];

/**
 * Main PDF parsing function
 */
export async function parsePDF(file: File): Promise<ParsedContent> {
  try {
    console.log('Starting PDF parse for:', file.name);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    // Load PDF document with better error handling
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0, // Reduce console noise
    });
    
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    
    console.log(`PDF loaded successfully: ${totalPages} pages`);
    
    // Extract text from all pages
    let fullText = '';
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with spaces
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      // Log progress every 10 pages
      if (pageNum % 10 === 0) {
        console.log(`Processed ${pageNum}/${totalPages} pages`);
      }
    }
    
    console.log('Text extraction complete');
    
    const cleanedText = cleanText(fullText);
    const mainContent = removeFrontMatter(cleanedText);
    const chapters = detectChapters(mainContent);
    
    const words = mainContent
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    const totalWords = words.length;
    const estimatedReadingTime = Math.ceil(totalWords / 200); 
    
    return {
      fullText: mainContent,
      words,
      chapters,
      metadata: {
        totalPages,
        totalWords,
        estimatedReadingTime,
        fileName: file.name,
      },
    };
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('This PDF file appears to be corrupted or invalid.');
      }
      if (error.message.includes('password')) {
        throw new Error('This PDF is password-protected. Please use an unprotected PDF.');
      }
      throw new Error(`PDF Error: ${error.message}`);
    }
    
    throw new Error('Failed to parse PDF. Please ensure it\'s a valid PDF file.');
  }
}

/**
 * Clean extracted text
 */
function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove page numbers (common patterns)
    .replace(/\bPage\s+\d+\b/gi, '')
    .replace(/^\d+\s*$/gm, '')
    // Remove extra newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim();
}

/**
 * Detect and remove front matter sections
 */
function removeFrontMatter(text: string): string {
  const lines = text.split('\n');
  let contentStartIndex = 0;
  let foundFirstChapter = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line is a chapter heading
    const isChapter = CHAPTER_PATTERNS.some(pattern => pattern.test(line));
    
    if (isChapter && !foundFirstChapter) {
      foundFirstChapter = true;
      contentStartIndex = i;
      break;
    }
    
    // Check if this line matches skip patterns
    const shouldSkip = SKIP_PATTERNS.some(pattern => pattern.test(line));
    
    if (shouldSkip) {
      console.log('Skipping section:', line);
      continue;
    }
  }
  

  if (foundFirstChapter) {
    console.log('Starting content from line:', contentStartIndex);
    return lines.slice(contentStartIndex).join('\n');
  }
  
  // Otherwise, try to skip first 10% as likely front matter
  const skipLines = Math.floor(lines.length * 0.1);
  console.log(`No clear chapter found. Skipping first ${skipLines} lines as front matter`);
  return lines.slice(skipLines).join('\n');
}

/**
 * Detect chapters in the text
 */
// function detectChapters(text: string): Chapter[] {
//   const chapters: Chapter[] = [];
//   const lines = text.split('\n');
  
//   let currentChapter: Partial<Chapter> | null = null;
//   let currentContent: string[] = [];
//   let wordIndex = 0;
  
//   for (const line of lines) {
//     const trimmedLine = line.trim();
    
//     // Check if this line is a chapter heading
//     const isChapterHeading = CHAPTER_PATTERNS.some(pattern => 
//       pattern.test(trimmedLine)
//     );
    
//     if (isChapterHeading) {
//       // Save previous chapter if exists
//       if (currentChapter && currentContent.length > 0) {
//         const content = currentContent.join('\n');
//         const words = content.split(/\s+/).filter(w => w.length > 0);
        
//         chapters.push({
//           title: currentChapter.title!,
//           content,
//           wordCount: words.length,
//           startIndex: currentChapter.startIndex!,
//           endIndex: wordIndex,
//         });
//       }
      
//       // Start new chapter
//       currentChapter = {
//         title: trimmedLine,
//         startIndex: wordIndex,
//       };
//       currentContent = [];
      
//       console.log('Found chapter:', trimmedLine);
//     } else if (currentChapter) {
//       // Add to current chapter content
//       currentContent.push(line);
//       const lineWords = line.split(/\s+/).filter(w => w.length > 0);
//       wordIndex += lineWords.length;
//     }
//   }
  
//   // Save last chapter
//   if (currentChapter && currentContent.length > 0) {
//     const content = currentContent.join('\n');
//     const words = content.split(/\s+/).filter(w => w.length > 0);
    
//     chapters.push({
//       title: currentChapter.title!,
//       content,
//       wordCount: words.length,
//       startIndex: currentChapter.startIndex!,
//       endIndex: wordIndex,
//     });
//   }
  
//   // If no chapters detected, create one "main" chapter
//   if (chapters.length === 0) {
//     const words = text.split(/\s+/).filter(w => w.length > 0);
//     chapters.push({
//       title: 'Main Content',
//       content: text,
//       wordCount: words.length,
//       startIndex: 0,
//       endIndex: words.length,
//     });
//   }
  
//   console.log(`Detected ${chapters.length} chapters`);
//   return chapters;
// }

function detectChapters(text: string): Chapter[] {
  const chapters: Chapter[] = [];
  const lines = text.split('\n');
  
  // Expanded patterns to include ALL sections
  const ALL_SECTION_PATTERNS = [
    /^foreword$/i,
    /^preface$/i,
    /^prologue$/i,
    /^introduction$/i,
    /^table of contents$/i,
    /^contents$/i,
    /^acknowledgements?$/i,
    /^dedication$/i,
    /^about the author$/i,
    /^chapter\s+\d+/i,
    /^chapter\s+[ivxlcdm]+/i,
    /^part\s+\d+/i,
    /^section\s+\d+/i,
    /^\d+\.\s+[A-Z]/,
    /^epilogue$/i,
    /^afterword$/i,
    /^appendix/i,
  ];
  
  let currentChapter: Partial<Chapter> | null = null;
  let currentContent: string[] = [];
  let wordIndex = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this is ANY section heading
    const isSectionHeading = ALL_SECTION_PATTERNS.some(pattern => 
      pattern.test(trimmedLine)
    ) && trimmedLine.length < 100; // Headings are short
    
    if (isSectionHeading) {
      // Save previous section if exists
      if (currentChapter && currentContent.length > 0) {
        const content = currentContent.join('\n');
        const words = content.split(/\s+/).filter(w => w.length > 0);
        
        chapters.push({
          title: currentChapter.title!,
          content,
          wordCount: words.length,
          startIndex: currentChapter.startIndex!,
          endIndex: wordIndex,
        });
      }
      
      // Start new section
      currentChapter = {
        title: trimmedLine,
        startIndex: wordIndex,
      };
      currentContent = [];
      
      console.log('Found section:', trimmedLine);
    } else if (currentChapter) {
      currentContent.push(line);
      const lineWords = line.split(/\s+/).filter(w => w.length > 0);
      wordIndex += lineWords.length;
    } else {
      // Before any section - count words
      const lineWords = line.split(/\s+/).filter(w => w.length > 0);
      wordIndex += lineWords.length;
    }
  }
  
  // Save last section
  if (currentChapter && currentContent.length > 0) {
    const content = currentContent.join('\n');
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    chapters.push({
      title: currentChapter.title!,
      content,
      wordCount: words.length,
      startIndex: currentChapter.startIndex!,
      endIndex: wordIndex,
    });
  }
  
  // If no sections detected, create one "Full Book" section
  if (chapters.length === 0) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    chapters.push({
      title: 'Full Book',
      content: text,
      wordCount: words.length,
      startIndex: 0,
      endIndex: words.length,
    });
  }
  
  console.log(`Detected ${chapters.length} sections`);
  return chapters;
}