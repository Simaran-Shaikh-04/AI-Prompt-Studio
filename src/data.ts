import { OptimizationProfile } from "./types";

export const OPTIMIZATION_PROFILES: OptimizationProfile[] = [
  {
    id: "token-saving",
    name: "Token Squeezer",
    description: "Forces Claude to output ONLY code changes or modular diffs with absolutely zero boilerplate, chat commentary, or boilerplate code. Save up to 60%+ output tokens.",
    icon: "Cpu",
    tokenFocus: "Outputs minimal code changes inside standard diff blocks or surgical replacements. Skips lengthy explanations and file rewrites.",
    claudeBias: "Optimized for long chat threads to extend the conversation context by up to 3x before memory runs out."
  },
  {
    id: "architectural",
    name: "Modular Architect",
    description: "Sets rigid instructions for scalable system structure, strict TypeScript types first, clean directory schemas, and explicit separation of business logic from UI rendering.",
    icon: "Layers",
    tokenFocus: "Defines clean file trees, writes rigorous interface boundaries, and orders components with robust separation of concerns.",
    claudeBias: "Best for building large, professional applications where folder integrity and clean design principles are required."
  },
  {
    id: "mvp-prototype",
    name: "High-Fidelity MVP",
    description: "Instructs Claude to focus heavily on a single gorgeous interactive screen or polished visual view. Limits complexity, standardizes state using localStorage, and models rich micro-animations.",
    icon: "Zap",
    tokenFocus: "Instructs Claude to bypass mock backend layers, database credentials, or complex external APIs to create a functional client-side masterpiece instantly.",
    claudeBias: "Perfect for fast creations, demos, calculators, or feature playgrounds without structural bloating."
  },
  {
    id: "comprehensive",
    name: "Deep Thinking Spec",
    description: "Tells Claude to think exhaustively step-by-step inside XML `<thinking>` tags before outputting any code, validating edge cases, performance, security, and UI transitions.",
    icon: "Brain",
    tokenFocus: "Ensures Claude checks error boundaries, double-checks logical rules, explains potential issues, and covers dark-mode contrast or accessibility.",
    claudeBias: "Recommended for high-stakes core systems, complex parsers, formula grids, or interactive puzzle structures."
  }
];

export const STARTER_IDEAS = [
  {
    title: "🎨 Creative Canvas",
    idea: "A physics-based draw and drop playground using HTML Canvas, allowing users to draw shapes that fall under gravity, collide, and generate musical notes on impact."
  },
  {
    title: "📊 Financial Analytics",
    idea: "A single-screen budget planner featuring interactive flow charts, localized currency conversions, custom nested categories, and CSV data import/export."
  },
  {
    title: "🎵 Synthesizer Synth",
    idea: "An interactive ambient music composer incorporating step sequencers, multi-oscillator filters, adjustable feedback delays, and dynamic visual frequency displays."
  },
  {
    title: "🧩 Retro Game Builder",
    idea: "A visual tile-based micro-game engine and editor where users can design 2D obstacle tracks, set actor behaviors, and play/save their customized stages."
  }
];

export const CLAUDE_TIPS = [
  {
    title: "XML Tags are Claude's Superpower",
    description: "Claude is specifically trained to segment rules, variables, and code inside structured tags like `<system_instructions>`, `<code_block>`, or `<context_boundaries>` for maximum adherence."
  },
  {
    title: "Provide Negative Constraints",
    description: "Telling Claude what NOT to do (e.g., 'Do not write any comments inside the generated TypeScript code') saves extensive output tokens and yields faster speeds."
  },
  {
    title: "State Types First",
    description: "Claude designs better business logic when prompted to create `/src/types.ts` first and review its structure before generating the UI layout or handler functions."
  }
];

export interface StudentPreset {
  id: string;
  title: string;
  name: string;
  description: string;
  defaultIdea: string;
  questions: { id: string; question: string; helperText: string }[];
}

export const STUDENT_PRESETS: StudentPreset[] = [
  {
    id: "academic-notes",
    title: "📝 Study Notes & Active Recall",
    name: "Academic Notes Generator",
    description: "Generate highly structured active-recall study guides, flashcard lists (compatible with Anki), and conceptual notes directly from lectures & transcripts.",
    defaultIdea: "I want to generate active-recall academic notes, mnemonic cheat sheets, and cloze-deletion flashcards from my lecture transcript about Distributed Database Concordance and Raft Consensus algorithms.",
    questions: [
      {
        id: "note-format",
        question: "What formatting style supports your learning best?",
        helperText: "Options include: Cornell Note Taking system, standard hierarchical outline, or active-recall Q&A sheets."
      },
      {
        id: "flashcard-format",
        question: "What flashcard format should we compile?",
        helperText: "e.g., standard Anki Q&A, Cloze deletion format, or matching pairs definitions."
      },
      {
        id: "depth",
        question: "What level of academic depth should notes target?",
        helperText: "Specify depth (e.g., high school basics, undergraduate foundation, or graduate-level research rigor)."
      },
      {
        id: "synthesis-addons",
        question: "Would you like definition sidebars, mnemonics, or test-prep questions?",
        helperText: "Add custom tools like conceptual cheat sheets, practice mock questions, or visualization diagrams drafts."
      }
    ]
  },
  {
    id: "assignment-research",
    title: "🔍 Assignment & Project Research",
    name: "Research Blueprint & MLA/APA Citations",
    description: "Draft structural thesis skeletons, methodology design parameters, counterargument vectors, and verified citations guidelines (APA, MLA, IEEE).",
    defaultIdea: "I need to construct a rigorous research skeleton and thesis methodology exploring the environmental impacts of localized crypto mining on high-altitude power grids.",
    questions: [
      {
        id: "citation-style",
        question: "What academic citation style is required?",
        helperText: "Select formatting style (e.g., APA 7th Edition, MLA 9th, IEEE format, or Chicago Manual)."
      },
      {
        id: "analysis-criteria",
        question: "Specify your research methodologies profile:",
        helperText: "Describe the approach: qualitative analysis, peer-reviewed lit review, statistical validation, or comparative case study."
      },
      {
        id: "argumentative-depth",
        question: "What is your main thesis statement or core argument?",
        helperText: "e.g., 'Decentralized mining leads to regional grid instability but creates incentives for direct off-grid hydroelectric generation.'"
      },
      {
        id: "validity-checks",
        question: "Should Claude formulate counter-theses and bias evaluations?",
        helperText: "We can direct Claude to outline weak points, historical conflicts, or alternative arguments to solidify your work."
      }
    ]
  },
  {
    id: "skill-finder",
    title: "🚀 Skill Builder & Free Resource Finder",
    name: "Skill Master Roadmap & Resource Finder",
    description: "Construct tailored step-by-step master syllabi and list highly-rated free video series, sandboxes, and books from trusted communities.",
    defaultIdea: "I want to acquire a master-level understanding of Rust Memory Safety, owner-borrow semantics, concurrent programming, and async runtime patterns, starting from zero.",
    questions: [
      {
        id: "target-skill",
        question: "What exact skill or engineering domain are you mastering?",
        helperText: "e.g., WebGPU shaders, Rust compile-time constraints, quantitative finance formulas, or color-theory styling."
      },
      {
        id: "current-level",
        question: "What is your starting baseline and final goal?",
        helperText: "Describe experience (e.g., 'Junior programmer with some JS background. Goal is to contribute to production engines')."
      },
      {
        id: "source-verification",
        question: "What type of trusted learning resources do you prefer?",
        helperText: "e.g., Interactive in-browser sandboxes, video-course playlists, GitHub source code repos, or PDF handbooks."
      },
      {
        id: "review-sources",
        question: "Which communities/sources do you trust for reviews?",
        helperText: "Specify vetted platforms (e.g., Hacker News, Reddit consensus, GitHub Stars, or university open-courseware reviews)."
      }
    ]
  },
  {
    id: "interview-practice",
    title: "💼 Interactive Interview Practice Coach",
    name: "Interactive Interview Coach Simulator",
    description: "Prompt Claude to operate as a live technical, behavioral, or system-design interviewer. Scores inputs using a performance analytics rubric.",
    defaultIdea: "I need to practice technical system design and live coding data structures (e.g., priority queues and binary trees), with Claude simulating a senior staff engineer.",
    questions: [
      {
        id: "interview-type",
        question: "What specific interview category are you preparing for?",
        helperText: "e.g., Software engineering live coding, backend system design, behavioral STAR questionnaire, or project walk-throughs."
      },
      {
        id: "difficulty-tier",
        question: "What is the job experience tier?",
        helperText: "e.g., Undergraduate standard internship, college grad full-time, or senior level specialist."
      },
      {
        id: "rubric-criteria",
        question: "What evaluation criteria should Claude grade you on?",
        helperText: "Choose: code correctness, Big-O complexity execution, edge-case mitigation, collaborative communication, or STAR method structures."
      },
      {
        id: "simulation-flow",
        question: "How should the live interview run?",
        helperText: "Options: Ask one question at a time and wait for input, or output a full checklist of interactive scenarios first."
      }
    ]
  },
  {
    id: "resume-builder",
    title: "📄 STAR Formula Resume Tailor",
    name: "Google STAR-Method Resume Builder",
    description: "Recast static job bullets into achievements (Situation, Task, Action, Result) mapped perfectly to ATS match criteria.",
    defaultIdea: "Structure a high-impact metric-driven resume point for my portfolio. I built a file explorer and preview system with image generation helpers.",
    questions: [
      {
        id: "target-role",
        question: "What is your target job title or research role?",
        helperText: "e.g., Junior Full-Stack Developer, AI Research Intern, or Associate Systems Administrator."
      },
      {
        id: "experience-points",
        question: "What is the core task/project you built? (Raw draft)",
        helperText: "e.g., 'I made a tool that converts files. Users liked it.'"
      },
      {
        id: "star-formula",
        question: "What metrics can we measure or estimate?",
        helperText: "e.g., reduced compile times by 40%, supported uploads up to 50MB, or reached 200 daily active student developers."
      },
      {
        id: "ats-keywords",
        question: "What key search terms or libraries should be highlighted?",
        helperText: "e.g., React, TypeScript, Tailwind CSS, REST APIs, JSON validation schemas, FileReader API, etc."
      }
    ]
  },
  {
    id: "linkedin-writing",
    title: "✍️ Student LinkedIn Storyteller",
    name: "Open-Source & Hackathon Storyteller",
    description: "Write clean, deeply engaging, non-cringe technical narratives about recent student research successes, project launches, or peer lessons.",
    defaultIdea: "I want to share a tech story on LinkedIn about constructing a Claude-optimized prompt compiler using server-side proxy engines and drag-drop context materials.",
    questions: [
      {
        id: "milestone-theme",
        question: "What educational or technical milestone are you sharing?",
        helperText: "e.g., won a 24-hour hackathon, pushed first major open-source PR, or concluded an intensive software internship."
      },
      {
        id: "tone-voice",
        question: "How do you want to balance your tone?",
        helperText: "Options: Humble & technical details first, visual storyteller, or advice-centric post for other students. Strictly avoids cliché emojis or buzzwords."
      },
      {
        id: "code-inclusion",
        question: "Should a schematic breakdown or code block be written?",
        helperText: "Describe the architecture: node reverse proxy, frontend context loops, or file drag-and-drop state listeners."
      },
      {
        id: "hook-style",
        question: "What type of intro/hook do you prefer?",
        helperText: "Options: lesson-first (e.g., 'I built a 50MB file parser and here's why it broke'), raw excitement, or chronological story starting with the hurdle."
      }
    ]
  },
  {
    id: "internship-report",
    title: "🏢 Internship Log & Performance Report",
    name: "Internship Performance & Retrospective Writer",
    description: "Convert informal weekly sprint summaries and logs into high-quality, professional performance reviews and slides acceptable to college departments.",
    defaultIdea: "Help me synthesize my raw daily work notes from my 8-week internship as an assistant software developer at a logistics firm into a formal, structured corporate report.",
    questions: [
      {
        id: "duration-scope",
        question: "What is the timeframe and goal of this report?",
        helperText: "e.g., Weekly activity report, mid-term 4-week review, or final 12-week comprehensive retrospective slide template."
      },
      {
        id: "key-impacts",
        question: "What were your principal contributions?",
        helperText: "Specify contributions: migrations, feature coding, bug squashing, documentation, team sprints participation."
      },
      {
        id: "department-standards",
        question: "Select formatting standards required by your school/firm:",
        helperText: "e.g., chronological weekly table logs, formal academic write-up style, or engineering-centric problem-solution logs."
      },
      {
        id: "future-recommendations",
        question: "What future product or teamwork expansion suggestions did you note?",
        helperText: "Describe recommendations: automated testing suites, decoupled services, improved developer sandboxes, etc."
      }
    ]
  }
];
