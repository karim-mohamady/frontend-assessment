/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Simulated interview route
  app.post('/api/interview/chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API is not configured. Please add the GEMINI_API_KEY secret in Settings.',
        });
      }

      const { category, difficulty, language, currentQuestion, userResponse, questionCount } = req.body;

      const isStart = !userResponse || userResponse.trim() === '';

      let prompt = '';
      if (isStart) {
        prompt = `This is the beginning of the interview. Generate the very first technical question for a candidate. Do not evaluate any response yet. Set score to -1 and feedback to empty.`;
      } else {
        prompt = `Here is the current interview progress:
Topic Category: ${category}
Seniority Level: ${difficulty}
Language code: ${language}
Question Asked: "${currentQuestion}"
Candidate Answer: "${userResponse}"
This is question number ${questionCount} of 5.

Please:
1. Provide constructive feedback on the answer (identify if accurate, what is missing, how to improve).
2. Rate the answer on a scale of 0 to 10 (as integer).
3. If this is question ${questionCount} out of 5 (i.e. ${questionCount} >= 5), set isEnd to true, leave the next question empty, and construct a detailed overall summary and final percentage score (0-100).
4. Otherwise (i.e. ${questionCount} < 5), set isEnd to false and generate the next highly relevant interview question.`;
      }

      const systemInstruction = `You are an expert front-end developer interviewer conducting a rigorous simulated tech interview.
Topic: ${category}
Seniority: ${difficulty}
Language: ${language === 'ar' ? 'Arabic (العربية) - Conduct the entire interaction in fluent professional technical Arabic' : 'English - Conduct the entire interaction in English'}

Rules:
- Give professional, constructive, and accurate feedback.
- For Arabic language, use modern software development terminology used in the Arab tech industry.
- Always output a valid JSON matching the schema. No backticks or wrap-around string comments.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: {
                type: Type.STRING,
                description: 'Critique and pointers for the candidate\'s answer. Empty if starting.',
              },
              score: {
                type: Type.INTEGER,
                description: 'Score from 0 to 10. -1 if starting.',
              },
              question: {
                type: Type.STRING,
                description: 'The next interview question. Empty if isEnd is true.',
              },
              isEnd: {
                type: Type.BOOLEAN,
                description: 'Whether the 5 questions interview is complete.',
              },
              overallSummary: {
                type: Type.STRING,
                description: 'Detailed final breakdown of strengths, weaknesses, and key learning suggestions. Only if isEnd is true.',
              },
              overallScore: {
                type: Type.INTEGER,
                description: 'Overall final rating as a percentage (0-100). Only if isEnd is true.',
              },
            },
            required: ['feedback', 'score', 'question', 'isEnd'],
          },
        },
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error('Interview API Error:', error);
      res.status(500).json({ error: error.message || 'Internal server error during interview simulation' });
    }
  });

  // Vite middleware for dev or standard static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
