import { GoogleGenerativeAI } from "@google/generative-ai";

export type ProcessedIdea = {
  problem_category: string;
  competitor_mentioned: string | null;
  urgency_score: number;
  summary: string;
};

const schemaPrompt = `You extract startup pain points from public posts.
Return only valid JSON with exactly these fields:
{
  "problem_category": string,
  "competitor_mentioned": string | null,
  "urgency_score": integer from 1 to 10,
  "summary": string
}
Do not include markdown, explanations, or additional fields.`;

export async function processWithGemini(input: {
  title: string;
  selftext: string;
}): Promise<ProcessedIdea> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const result = await model.generateContent(
    `${schemaPrompt}\n\nTitle: ${input.title}\nPost: ${input.selftext}`,
  );
  const text = result.response.text();
  const parsed = JSON.parse(text) as Partial<ProcessedIdea>;
  const urgency = Number(parsed.urgency_score);

  if (
    typeof parsed.problem_category !== "string" ||
    typeof parsed.summary !== "string" ||
    !Number.isInteger(urgency) ||
    urgency < 1 ||
    urgency > 10 ||
    (parsed.competitor_mentioned !== null &&
      typeof parsed.competitor_mentioned !== "string")
  ) {
    throw new Error("Gemini returned an invalid idea schema");
  }

  return {
    problem_category: parsed.problem_category,
    competitor_mentioned: parsed.competitor_mentioned ?? null,
    urgency_score: urgency,
    summary: parsed.summary,
  };
}
