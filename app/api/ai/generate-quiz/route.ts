import { NextRequest, NextResponse } from 'next/server';
import { generateComprehensionQuiz } from '@/lib/ai/agents/comprehensionQuiz';

export async function POST(request: NextRequest) {
  try {
    const { textRead, wordCount } = await request.json();

    if (!textRead || !wordCount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quiz = await generateComprehensionQuiz(textRead, wordCount);

    return NextResponse.json({
      success: true,
      quiz,
    });

  } catch (error) {
    console.error('Quiz generation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate quiz',
      },
      { status: 500 }
    );
  }
}