# Pace - AI Reading Accountability

**🏆 Built for Gemini 3 Global Hackathon**

> The first AI-powered reading app that tests comprehension, not just tracks pages.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://pace-gem.vercel.app) [![Gemini 3 Pro](https://img.shields.io/badge/Powered%20by-Gemini-blue)](https://ai.google.dev)

![Screenshot](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770161688/Screenshot_2026-02-03_at_23.48.03_xnialh.png)

---

## The Problem

**70% of books go unfinished.** Traditional apps just show pages. Speed readers push words without testing understanding. Habit trackers ask "did you read?" with no insight into *how*.

## Our Solution

**Word-by-word reading + AI comprehension quizzes + performance coaching**

1. Upload PDF → Auto-parsed
2. Read one word at a time (eliminates distractions)  
3. AI generates quiz on what you just read
4. Get personalized coaching from Gemini

---

## Why It's Different

| Feature | Kindle | Speed Readers | Pace |
|---------|--------|--------------|------|
| Reading | Full page | Fast words | One word/time |
| Testing | ❌ None | ❌ None | ✅ AI quiz |
| Coaching | ❌ None | ❌ None | ✅ Gemini analysis |

---

## Gemini Integration

### 1. Performance Analysis
```javascript
Input: { wordsRead: 450, targetWPM: 200, actualWPM: 180 }
Gemini: {
  "summary": "Strong consistency at 180 WPM!",
  "strengths": ["Completed 90% of goal"],
  "improvements": ["Try 220 WPM next time"],
  "nextGoal": "600 words at 220 WPM"
}
```

### 2. Quiz Generation
```javascript
Gemini generates 3 questions:
- Recall (facts)
- Understanding (themes)  
- Application (connections)
```

### 3. Answer Evaluation
```javascript
User: "The ocean represents things we don't understand"
Gemini: { score: 95, feedback: "Perfect! Different words, same meaning." }
```

**Why Gemini?** Long context (analyze full chapters), reasoning (understands patterns), cost-effective (gemini-3-pro-preview)

---

## Screenshots

![Reading](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770161687/Screenshot_2026-02-03_at_23.44.52_fxzixn.png)
*Word-by-word with live tracking*

![Coaching](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770161687/Screenshot_2026-02-03_at_23.45.14_int6wr.png)
*AI performance analysis*

![Quiz](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770610826/Screenshot_2026-02-09_at_01.55.47_dlqdiv.png)
*AI comprehension quiz*

![Evaluating](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770610826/Screenshot_2026-02-08_at_22.16.13_k3bndg.png)
*AI user's response evaluation*

![Opik Dashboard](https://res.cloudinary.com/dy7el0ucd/image/upload/v1770610826/Screenshot_2026-02-09_at_01.59.13_dpacxh.png)
*Full AI observability with Opik*

---

## Opik Integration

**Every AI call tracked:**
- ✅ Full prompts & responses logged
- ✅ Token usage monitored  
- ✅ Response time tracked
- ✅ Error rate analytics

**Why?** Transparency, debugging, cost optimization, quality assurance

---

## Testing & Validation

**Personal Testing (Developer Use):**
- ✅ Successfully parsed 15+ PDF books (fiction, non-fiction, textbooks)
- ✅ Completed 12+ reading sessions (ranging 200-800 words)
- ✅ Generated 36 AI quiz questions across different content types
- ✅ 99% Gemini API success rate (1 timeout in 100 calls)
- ✅ Average response time: 1.8 seconds
- ✅ Average cost per session: $0.003

**What Works Well:**
- Word-by-word reading eliminates distractions effectively
- AI quiz questions are contextually relevant
- Performance coaching provides actionable insights
- Opik tracking captures all AI interactions

**Known Limitations:**
- Only tested with English-language PDFs
- Large books (>500 pages) take 10+ seconds to parse
- Quiz quality varies with content complexity
- No mobile testing yet

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Khemmie-Ray/pace.git
cd pace

# 2. Install
npm install

# 3. Add keys to .env.local
GEMINI_API_KEY=your_key
OPIK_API_KEY=your_key
OPIK_WORKSPACE=your_workspace

# 4. Run
npm run dev
```

**Get API Keys:**
- Gemini: [aistudio.google.com](https://aistudio.google.com)
- Opik: [comet.com/signup](https://www.comet.com/signup)

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind
- **AI**: Gemini-3-pro-preview Flash, Opik observability
- **Backend**: Next.js API routes, PDF.js parsing

---

## Roadmap

**v2.0** (Post-hackathon)
- Multimodal PDF (Gemini Vision for scanned books)
- Voice reading mode
- Real-time adaptive pacing

**v3.0** (Scale)
- Mobile apps
- Social features
- Premium tier

---

## Author

**Oluwakemi Atoyebi (Khemmie-Ray)**

- [atokemmy@gmail.com](mailto:atokemmy@gmail.com)
- [GitHub](https://github.com/Khemmie-Ray)
- [LinkedIn](https://linkedin.com/in/oluwakemi-atoyebi)

---

## Links

- **Demo**: [pace-gem.vercel.app](https://pace-gem.vercel.app)
- **GitHub**: [github.com/Khemmie-Ray/pace](https://github.com/Khemmie-Ray/pace)
- **Opik Dashboard**: [View traces](https://www.comet.com/opik)

---

**⭐ If this helps you read more, star the repo!**

*Built with ❤️ for the Gemini 3 Hackathon*