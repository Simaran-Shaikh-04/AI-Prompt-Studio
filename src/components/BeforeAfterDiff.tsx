import { useState } from "react";
import { 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle,
  Code2,
  FileCode,
  Sliders,
  Terminal,
  Columns
} from "lucide-react";

interface DiffCase {
  id: string;
  title: string;
  rawCaption: string;
  optimizedCaption: string;
  rawPrompt: string;
  optimizedPrompt: string;
  benefit: string;
}

const COMPARISON_CASES: DiffCase[] = [
  {
    id: "todo-list",
    title: "1. Basic Todo Checklist",
    rawCaption: "Naive / Beginner Prompt",
    optimizedCaption: "Structured XML Directive",
    rawPrompt: `make me a responsive react todo list using tailwind css styles. can you make sure it saves items and has neat animations? also add categorized filters and edit capabilities.`,
    optimizedPrompt: `<system_role>
  You are an expert react visual engineer specializing in lightweight client-side state execution.
</system_role>

<context>
  Build a single-screen responsive Todo application styled with crisp Inter typography and deep charcoal tones.
</context>

<technical_requirements>
  - STATE: Use client-side localStorage to persist categories and checklist arrays.
  - COMPLIANCE: Mount framer-motion layout animations for item additions and checklist deletions.
  - STYLING: Tailwind CSS classes directly, absolute light-theme off-white contrast.
</technical_requirements>

<token_optimization_rules>
  - Return ONLY changed code files. Do not rewrite static setups or boilerplate configs.
</token_optimization_rules>`,
    benefit: "Saves up to 60k output tokens during subsequent changes, preserves layout transitions, and prevents Claude from creating mock backend services."
  },
  {
    id: "academic-notes",
    title: "2. Lecture Synthesis notes",
    rawCaption: "General Raw Text Capture",
    optimizedCaption: "Academic Active Recall XML Model",
    rawPrompt: `here is my lecture transcript about distributed database systems. can you give me structured notes for studying and some flashcard outlines? [Transcript Text...]`,
    optimizedPrompt: `<learning_objectives>
  Master Distributed Concordance models, Leader Election heartbeat cycles, and split-brain resolution protocols.
</learning_objectives>

<academic_notes_frame>
  - SYSTEM: Compile structured Cornell-Style note taking columns.
  - MEMORY: Generate exactly 5 Anki-ready Cloze deletion flashcards for active storage recall.
  - STUDY: Append a definition sidebar detailing high-criticality terminology definition keys.
</academic_notes_frame>

<reference_material_boundaries>
  <lecture_source>
    [Transcript Content Encapsulated Cleanly Here]
  </lecture_source>
</reference_material_boundaries>`,
    benefit: "Forces high pedagogical quality, structures Q&A directly for flashcard software imports, and avoids unstructured textual noise."
  }
];

export default function BeforeAfterDiff() {
  const [selectedCaseId, setSelectedCaseId] = useState("todo-list");
  const activeCase = COMPARISON_CASES.find(c => c.id === selectedCaseId) || COMPARISON_CASES[0];

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="before-after-diff-studio">
      <div className="border-b border-slate-800/80 pb-5 space-y-1">
        <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
          <Columns className="w-5 h-5 text-indigo-400" />
          Side-by-Side Prompt Transformation Visual Diff
        </h2>
        <p className="text-xs text-slate-400">Contrast how naive beginner prompts are transformed into structured, XML-delimited instructions optimized for Claude's reasoning parser.</p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850 self-start inline-flex" id="visual-diff-tabs">
        {COMPARISON_CASES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCaseId(item.id)}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              selectedCaseId === item.id
                ? "bg-indigo-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* The side-by-side interactive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="visual-diff-comparison-grid">
        {/* Left Side: Naive Prompt */}
        <div className="space-y-3.5 flex flex-col">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <div className="p-1 rounded-md bg-rose-950/40 border border-rose-900/30">
              <X className="w-3.5 h-3.5 text-rose-500" />
            </div>
            {activeCase.rawCaption}
          </div>
          
          <div className="flex-1 bg-slate-950/60 rounded-xl border border-slate-850 p-4 font-sans text-xs text-slate-400 leading-relaxed min-h-48 flex flex-col justify-between">
            <p className="italic">"{activeCase.rawPrompt}"</p>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
              ❌ Issues: Unclear constraints, no output formatting limits, causes high memory consumption.
            </div>
          </div>
        </div>

        {/* Right Side: Pro Prompt */}
        <div className="space-y-3.5 flex flex-col">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <div className="p-1 rounded-md bg-emerald-950/40 border border-emerald-900/30">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            {activeCase.optimizedCaption}
          </div>

          <div className="flex-1 bg-indigo-950/5 border border-indigo-500/30 rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-normal min-h-48 flex flex-col justify-between whitespace-pre-wrap">
            <span>{activeCase.optimizedPrompt}</span>
            <div className="mt-4 pt-3 border-t border-indigo-950 text-[10px] text-indigo-400 font-sans font-semibold">
              ✓ Optimized: XML boundaries, strict type-first directives, explicit token quotas.
            </div>
          </div>
        </div>
      </div>

      {/* Benefits summary container */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 flex gap-3 text-xs leading-normal">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200 block mb-0.5">Primary Architectural Benefit:</span>
          <p className="text-slate-450">{activeCase.benefit}</p>
        </div>
      </div>
    </div>
  );
}
