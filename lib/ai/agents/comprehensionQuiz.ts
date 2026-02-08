import gemini from '@/lib/ai/geminiClient';

export interface QuizQuestion {
  question: string;
  type: 'recall' | 'understanding' | 'application';
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  questions: QuizQuestion[];
  textAnalyzed: string;
  wordCount: number;
}

/**
 * Generate comprehension quiz from recently read text
 */
export async function generateComprehensionQuiz(
  textRead: string,
  wordCount: number
): Promise<QuizResult> {
  
  // Only generate quiz for substantial reading (500+ words)
  if (wordCount < 500) {
    throw new Error('Need at least 500 words to generate meaningful quiz');
  }

  const prompt = `You are a reading comprehension expert. Generate 3 diverse comprehension questions based on this text excerpt.

TEXT EXCERPT (${wordCount} words):
"${textRead.substring(0, 2000)}..."

Generate exactly 3 questions that test different comprehension levels:

1. RECALL question - Tests memory of specific facts/details
2. UNDERSTANDING question - Tests grasp of main ideas/themes
3. APPLICATION question - Tests ability to connect to broader concepts

For each question, provide:
- The question itself
- The correct answer (concise, 1-2 sentences)
- Brief explanation of why this answer is correct

Return ONLY a JSON object in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "type": "recall",
      "correctAnswer": "The answer here",
      "explanation": "Why this is correct"
    },
    {
      "question": "Question text here?",
      "type": "understanding",
      "correctAnswer": "The answer here",
      "explanation": "Why this is correct"
    },
    {
      "question": "Question text here?",
      "type": "application",
      "correctAnswer": "The answer here",
      "explanation": "Why this is correct"
    }
  ]
}

Keep questions clear, specific to the text, and appropriate for the reading level.`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
    });

    const aiText = response.text || '';

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.questions || parsed.questions.length !== 3) {
      throw new Error('AI did not return 3 questions');
    }

    await gemini.flush();

    return {
      questions: parsed.questions,
      textAnalyzed: textRead,
      wordCount,
    };

  } catch (error) {
    console.error('Quiz generation error:', error);
    await gemini.flush(); 
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

/**
 * Evaluate user's answer to a quiz question
 */
export async function evaluateAnswer(
  question: QuizQuestion,
  userAnswer: string
): Promise<{ isCorrect: boolean; feedback: string; score: number }> {
  
  const prompt = `You are evaluating a reading comprehension answer.

QUESTION: ${question.question}
CORRECT ANSWER: ${question.correctAnswer}
USER'S ANSWER: ${userAnswer}

Evaluate if the user's answer demonstrates understanding of the concept, even if wording differs from the correct answer.

Return ONLY a JSON object:
{
  "isCorrect": true or false,
  "feedback": "Brief explanation (1-2 sentences)",
  "score": 0 to 100 (percentage score based on accuracy)
}

Be fair but accurate in evaluation.`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    const aiText = response.text || '';
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('AI did not return valid evaluation');
    }

    const result = JSON.parse(jsonMatch[0]);

    await gemini.flush();

    return result;

  } catch (error) {
    console.error('Answer evaluation error:', error);
    await gemini.flush();
    throw new Error('Failed to evaluate answer');
  }
}