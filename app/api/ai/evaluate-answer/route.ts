import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer, QuizQuestion } from '@/lib/ai/agents/comprehensionQuiz';

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer } = await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const evaluation = await evaluateAnswer(question as QuizQuestion, userAnswer);

    return NextResponse.json({
      success: true,
      evaluation,
    });

  } catch (error) {
    console.error('Answer evaluation API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to evaluate answer',
      },
      { status: 500 }
    );
  }
}