const { GoogleGenAI } = require("@google/genai");
const { buildPrompt } = require("./prompt.builder");
const { aiResponseSchema } = require("../models/aiResponse.schema");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Called by problem.controller.js
// Streams Gemini tokens to SSE response
// Returns the parsed+validated aiResponse object

const streamSolution = async (question, language = "C++", res, problemId = null) => {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let buffer = "";

  try {
    // Gemini streaming call
    const stream = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: buildPrompt(question, language),
      config: {
        responseMimeType: "application/json",
      },
    });

    // Stream each token to client
    for await (const chunk of stream) {
      const text = chunk.text || "";

      buffer += text;

      res.write(
        `data: ${JSON.stringify({
          token: text,
        })}\n\n`,
      );
    }

    // Validate final JSON
    let parsed;

    try {
      parsed = aiResponseSchema.parse(JSON.parse(buffer));
    } catch (parseErr) {
      res.write(
        `data: ${JSON.stringify({
          error: "AI returned invalid response",
          retry: true,
        })}\n\n`,
      );

      res.end();
      return null;
    }

    // Do not send done:true or res.end() here. 
    // Return parsed so the controller can save to DB first, then end the stream.
    return parsed;
  } catch (err) {
    console.error("[aiService] Stream error:", err.message);

    let errorMessage = "Streaming failed. Please try again.";
    
    if (err.message.includes("429") || err.message.includes("Quota exceeded")) {
      errorMessage = "Our AI is currently at capacity. Please try again in 1 minute.";
    }

    res.write(
      `data: ${JSON.stringify({
        error: errorMessage,
        retry: true,
      })}\n\n`,
    );

    res.end();

    return null;
  }
};

const evaluateStudentAnswer = async (question, studentAnswer, correctSolution) => {
  try {
    const prompt = `You are a strict but encouraging DSA interview coach evaluating a student's explanation.

The student was asked to explain their understanding of this problem:
[PROBLEM]: ${question}

[CORRECT APPROACH]: ${correctSolution}

[STUDENT'S EXPLANATION]: ${studentAnswer}

Evaluate the student's explanation for TRUE UNDERSTANDING vs ROTE MEMORIZATION.
Check if they understand:
1. Why this approach works (not just what it does)
2. The core insight or pattern
3. Time and space complexity reasoning
4. Edge cases awareness

Respond with ONLY a JSON object:
{
  "score": <number 0-100>,
  "verdict": "<one of: Excellent | Good | Needs Work | Memorized, Not Understood>",
  "feedback": "<2-3 sentence constructive feedback>",
  "missed": ["<key concept they missed>", ...]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Empty response from AI");
    return JSON.parse(rawText);
  } catch (err) {
    console.error('[aiService] Evaluation error:', err.message);
    return {
      score: 0,
      verdict: 'Error',
      feedback: 'Could not evaluate. Please try again.',
      missed: []
    };
  }
};

module.exports = {
  streamSolution,
  evaluateStudentAnswer,
};
