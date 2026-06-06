import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json());

// Initialize Gemini client on the server
// Note: We set the User-Agent header to 'aistudio-build' in httpOptions for telemetry.
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY_FOR_LOCAL_DEV",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper validation for API Key
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY in server environment. Please open Settings > Secrets and add your Gemini API Key."
    });
  }
  next();
};

// API: Generate questions based on the app idea
app.post("/api/generate-questions", checkApiKey, async (req, res) => {
  try {
    const { appIdea } = req.body;

    if (!appIdea || typeof appIdea !== "string" || appIdea.trim().length === 0) {
      return res.status(400).json({ error: "Application idea is required." });
    }

    const systemInstruction = 
      "You are a master Software Architect, Academic & Career Consultant, and Prompt Engineer specializing in Claude AI and large language models.\n" +
      "Your goal is to help the user build a concrete, successful specification of their development idea or academic/success task (such as notes generation, thesis research, verified self-taught syllabus mapping, mock interview practice, STAR resume building, professional storytelling, or internship logging).\n" +
      "Analyze the user's natural language application/academic idea and generate exactly 4 highly targeted, reflective, and non-obvious questions that will scope down their requirements for code-readiness or high-adherence results.\n" +
      "These questions should address architecture/structure, feature/outline boundaries, interaction mechanics, and output standards. Avoid generic questions and focus instead on specialized engineering or academic criteria relevant to their theme.";

    const prompt = `Task / App Idea: "${appIdea}"\n\nGenerate exactly 4 essential reflective questions that help narrow down the technical scope, methodology parameters, source expectations, interactive parameters, or output details of this task so that Claude can write the perfect code or construct the perfect academic response.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
                description: "Unique slug for this question (e.g., 'persistence', 'api-integration')."
              },
              question: {
                type: Type.STRING,
                description: "The main reflective, insight-oriented question styled beautifully."
              },
              helperText: {
                type: Type.STRING,
                description: "A helper hint or a set of 2-3 suggestions/choices to guide the user's decision."
              }
            },
            required: ["id", "question", "helperText"]
          }
        }
      }
    });

    const text = response.text?.trim() || "[]";
    const questions = JSON.parse(text);

    return res.json({ questions });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    return res.status(500).json({ error: error.message || "Failed to generate reflective questions." });
  }
});

// API: Generate optimized prompt and token token/architectural analysis
app.post("/api/generate-prompt", checkApiKey, async (req, res) => {
  try {
    const { appIdea, answers, profileId, attachments } = req.body;

    if (!appIdea) {
      return res.status(400).json({ error: "Application idea is required." });
    }

    // Convert answers into readable layout
    let answersContext = "";
    if (answers && Object.keys(answers).length > 0) {
      answersContext = Object.entries(answers)
        .map(([qId, answer]) => `- [Question ${qId}]: ${answer}`)
        .join("\n");
    } else {
      answersContext = "No additional answers provided.";
    }

    // Convert uploaded attachments into a clean readable context block
    let attachmentsContext = "";
    if (attachments && attachments.length > 0) {
      attachmentsContext = "\n\n### REFERENCE ATTACHMENTS AND DOCUMENTS GIVEN AS CONTEXT:\n";
      attachments.forEach((att: any, idx: number) => {
        const sizeMb = (att.size / (1024 * 1024)).toFixed(2);
        // Clean content if too long but keep key structure
        let cleanText = att.content || "";
        if (cleanText.startsWith("data:") && cleanText.length > 200) {
          cleanText = `[Base64 encoded Image Data (${att.type}), previewed matching width/height standards]`;
        }
        attachmentsContext += `<reference_attachment id="${att.id}" name="${att.name}" type="${att.type || 'unknown'}" size="${sizeMb} MB">\n`;
        attachmentsContext += `${cleanText}\n`;
        attachmentsContext += `</reference_attachment>\n\n`;
      });
    }

    const systemInstruction = 
      "You are a World-Class Claude Prompt Engineer. Your job is to compile a natural language app idea, user specifications, and attached documents/images/schemas into a pristine, highly structured, state-of-the-art prompt specifically optimized for Claude (Claude 3.5 Sonnet or similar models).\n\n" +
      "Claude is incredibly responsive to detailed XML schemas, clear separation of rules from text, explicit context boundaries, and step-by-step thinking directives.\n\n" +
      "Under your generated <reference_context> or <attachment_specifications> XML sections, incorporate the files/attachments provided by the user. If they are code or text attachments (like database schemas, reports, resume outlines, lecture notes), present them inside clear tags so Claude can parse them flawlessly.\n\n" +
      "If the input is an academic, vocational, or student template (e.g. academic notes, project research, skill roadmaps, interview simulation, STAR resume building, LinkedIn posting, internship report):\n" +
      "- Format the generated prompt with matching XML sections such as <learning_objectives>, <academic_criteria>, <review_standards>, <interview_rubric>, <star_metrics_formula>, or <narrative_tone_weights>.\n" +
      "- For study skill templates, include explicit instructions directing Claude to prioritize active recall questions, spaced-repetition prompts, and mapping vetted resources.\n" +
      "- For interview simulation templates, instruct Claude to act as an interviewer who asks one question at a time and scores performance using a clear feedback rubric.\n\n" +
      "Apply the requested optimization profile requirements in the output:\n" +
      "- 'token-saving': Emphasize maximum output token efficiency. Instruct Claude to strictly output ONLY changed blocks or concise drafts with absolutely zero filler commentary, chitchat, or long preambles.\n" +
      "- 'architectural': Emphasize system design, strict standards, structural taxonomies, clear references, and rigorous logical schemas first.\n" +
      "- 'mvp-prototype': Focus on immediate utility, highly interactive outputs, actionable takeaways, and beautiful clean structures.\n" +
      "- 'comprehensive': Provide a deep-dive specification template containing rigorous step-by-step instructions, edge-case checks, error limits, and detailed checklist frameworks.\n\n" +
      "Output your response strictly as a JSON object containing:\n" +
      "1. `optimizedPrompt`: A beautifully formatted string containing the complete, ready-to-copy markdown prompt for Claude. It must utilize elegant spacing, formatting, and XML tags (e.g., <system_role>, <context>, <instructions>, <token_optimization_rules>).\n" +
      "2. `analysis`: Structural details including efficiencyScore (0-100), estimated savings, pros, cons, and recommendations for working with Claude on this task.";

    const prompt = 
      `ORIGINAL APP IDEA:\n"${appIdea}"\n\n` +
      `USER SPECIFICATIONS/ANSWERS:\n${answersContext}\n\n` +
      `${attachmentsContext}` +
      `OPTIMIZATION PROFILE REQUESTED: "${profileId}"\n\n` +
      `Generate the structured prompt and full analysis now. Make sure the prompt has a visible section listing all ${attachments ? attachments.length : 0} uploaded files so Claude is aware to implement features relying on them.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: {
              type: Type.STRING,
              description: "The full, ready-to-copy markdown prompt for Claude utilizing robust XML tags, specific coding rules, and token saving mechanisms."
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                efficiencyScore: {
                  type: Type.INTEGER,
                  description: "Expert estimate score (0-100) of how optimized this prompt is for Claude's context window and precise generation."
                },
                tokenEstimation: {
                  type: Type.OBJECT,
                  properties: {
                    systemPromptTokens: { type: Type.INTEGER, description: "Estimated prompt length in tokens." },
                    estimatedSavings: { type: Type.INTEGER, description: "Estimated tokens saved compared to naive repeating instructions." },
                    reductionPercentage: { type: Type.INTEGER, description: "Percentage reduction in verbose chat noise." }
                  },
                  required: ["systemPromptTokens", "estimatedSavings", "reductionPercentage"]
                },
                pros: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-4 precise mechanical benefits of this prompt structure for Claude."
                },
                cons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "1-2 potential challenges or areas where conversational drifts could happen later in the chat."
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 concrete recommendations of how the user can instruct Claude when requesting iterative corrections."
                }
              },
              required: ["efficiencyScore", "tokenEstimation", "pros", "cons", "recommendations"]
            }
          },
          required: ["optimizedPrompt", "analysis"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const resultObj = JSON.parse(resultText);

    return res.json(resultObj);
  } catch (error: any) {
    console.error("Error generating prompt:", error);
    return res.status(500).json({ error: error.message || "Failed to generate optimized prompt." });
  }
});

// Setup Vite Dev server or Serve static files in production as requested in instructions
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend assets from dist in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Claude Prompt Architect server active on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
