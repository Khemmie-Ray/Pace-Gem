import gemini from "@/lib/ai/geminiClient";
import { NextRequest, NextResponse } from "next/server";

interface SessionData {
  wordGoal: number;
  wordsRead: number;
  targetWPM: number;
  actualWPM: number;
  timeSpent: number;
  completionRate: number;
}

export async function POST(request: NextRequest) {
  try {
    const sessionData: SessionData = await request.json();

    const prompt = `You are a reading coach analyzing a user's reading session.

SESSION DATA:
- Goal: ${sessionData.wordGoal} words
- Actually Read: ${sessionData.wordsRead} words (${sessionData.completionRate.toFixed(1)}%)
- Target Speed: ${sessionData.targetWPM} WPM
- Actual Speed: ${sessionData.actualWPM} WPM
- Time Spent: ${Math.floor(sessionData.timeSpent / 60)}m ${sessionData.timeSpent % 60}s

Provide a JSON response with:
{
  "summary": "Brief 1-sentence performance overview",
  "strengths": ["what they did well", "another strength"],
  "improvements": ["actionable tip 1", "actionable tip 2"],
  "nextGoal": "Specific suggestion for next session"
}

Be encouraging but honest. Focus on actionable insights.`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiText = response?.text ?? "";

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    await gemini.flush();

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    try {
      await gemini.flush();
    } catch {}

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze session'
      },
      { status: 500 }
    );
  }
}