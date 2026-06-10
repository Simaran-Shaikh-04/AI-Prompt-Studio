import { useState } from "react";
import {
  GraduationCap, FileText, Tv, Volume2, BookOpen, Network, Layers,
  Sparkles, Copy, Check, HelpCircle, Target, Rocket
} from "lucide-react";
import { STUDENT_LEVELS } from "../data/studentPresets";
import type { StudentLevel } from "../data/studentPresets";

// Level icons (reusing the shared STUDENT_LEVELS taxonomy from Student Suite)
const LEVEL_ICONS: Record<string, any> = { BookOpen, GraduationCap, Target, Rocket };

// Audience + example topic per level — keeps examples student-appropriate
const AUDIENCE: Record<StudentLevel, string> = {
  school: "school students (≈ class 6–12)",
  college: "undergraduate college students",
  competitive: "competitive-exam aspirants (e.g. CA / CS / UPSC / GATE)",
  professional: "self-learners and early-career professionals",
};
const EXAMPLE_TOPIC: Record<StudentLevel, string> = {
  school: "Photosynthesis — the light and dark reactions",
  college: "The Mundell–Fleming model in open-economy macroeconomics",
  competitive: "Registration of Charges under the Companies Act (CS Executive)",
  professional: "SQL joins and aggregation for data analysis",
};

interface Template {
  id: string;
  title: string;
  icon: any;
  objective: string;
  instructionTemplate: string;
}

const TEMPLATES: Template[] = [
  {
    id: "slides",
    title: "Presentation Slides & PPT Outline",
    icon: FileText,
    objective: "Slide-by-slide deck structure with layout cues, bullets, and visual prompts.",
    instructionTemplate: `Act as an expert Academic Graphic Designer and Presentation Strategist.
Draft a professional slide deck outline of exactly 8 modular slides on: "<topic>", for an audience of <audience>.

For each slide specify:
1. Slide title (outcome-oriented, human)
2. Layout & visual guidance (bento grid, schema diagram, or image-prompt cue)
3. Exactly 3 high-impact bullets aiding active recall
4. One simple real-world metaphor for the core idea

Format: wrap each slide inside <slide_n> tags.`,
  },
  {
    id: "video",
    title: "Video Narrative & Script",
    icon: Tv,
    objective: "A timestamped explainer script with hook, core mechanics, and takeaway.",
    instructionTemplate: `Act as a master science communicator and scriptwriter (Kurzgesagt / Veritasium style).
Write an engaging 3-minute video script teaching: "<topic>" to <audience>.

Include:
- [0:00–0:30 The Hook]: a surprising question or paradox that challenges intuition
- [0:30–2:00 Core Mechanics]: step-by-step with analogies and explicit [VISUAL ACTION] cues
- [2:00–3:00 Takeaway]: a memory hook + an active rehearsal challenge

Format: timestamped sections with clear Voiceover and Visual lines.`,
  },
  {
    id: "audio",
    title: "NotebookLM Dialogue (Audio Overview)",
    icon: Volume2,
    objective: "A witty two-host podcast script for dual-voice audio overviews.",
    instructionTemplate: `Act as two podcast hosts (Alex and Taylor) skilled at turning dense material into witty, clear dialogue.
Create a 5-minute audio-overview conversation on: "<topic>" for <audience>.

Rules:
1. Alex frames the "why should I care?" question with energy.
2. Taylor answers with an everyday, real-life analogy.
3. Dynamic back-and-forth — clarifying questions, simple explanations, casual phrasing.
4. No dry textbook jargon.

Format: dialogue lines tagged Alex: and Taylor:.`,
  },
  {
    id: "study-guide",
    title: "Study Guide",
    icon: BookOpen,
    objective: "High-yield structured notes: overview, key points, terms, and recall questions.",
    instructionTemplate: `Act as an expert tutor building a high-yield study guide.
Create a study guide on: "<topic>" for <audience>.

Include:
1. A 120-word plain-language overview
2. 8–10 key points (one line each)
3. Key terms, each with a one-line definition
4. One worked example, step by step
5. Five active-recall questions (answers listed together at the very end)

Format: clean markdown headings.`,
  },
  {
    id: "mind-map",
    title: "Mind Map",
    icon: Network,
    objective: "A nested hierarchical map (pastable into Markmap / XMind).",
    instructionTemplate: `Act as a learning architect creating a mind map.
Produce a hierarchical mind map of: "<topic>" for <audience>.

Rules:
- Nested markdown bullets, maximum 3 levels: central topic → main branches → sub-points
- Keep each node to 6 words or fewer
- End with 3 "cross-links" showing how separate branches connect

Format: a markdown nested list, ready to paste into Markmap or XMind.`,
  },
  {
    id: "flashcards",
    title: "Flashcards (Anki-ready)",
    icon: Layers,
    objective: "Atomic spaced-repetition cards, including cloze deletions.",
    instructionTemplate: `Act as a spaced-repetition specialist.
Create 12 atomic flashcards on: "<topic>" for <audience>.

Rules:
- One fact per card (atomic)
- Mix definition, application, and "why" cards
- Include 3 cloze-deletion cards

Format: a two-column list as "Front | Back", with the cloze cards prefixed "CLOZE:". Ready to paste into Anki.`,
  },
];

export default function NotebookLMSuite() {
  const [level, setLevel] = useState<StudentLevel>("college");
  const [activeTemplateId, setActiveTemplateId] = useState("slides");
  const [topic, setTopic] = useState("");
  const [customBrief, setCustomBrief] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const activeTemplate = TEMPLATES.find(t => t.id === activeTemplateId) || TEMPLATES[0];

  const handleGenerate = () => {
    const audience = AUDIENCE[level];
    let result = activeTemplate.instructionTemplate
      .replaceAll("<topic>", topic.trim() || EXAMPLE_TOPIC[level])
      .replaceAll("<audience>", audience);
    if (customBrief.trim()) {
      result += `\n\n<additional_constraints>\n${customBrief.trim()}\n</additional_constraints>`;
    }
    setGeneratedPrompt(result);
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2138] pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" /> NotebookLM Academic Suite
          </h2>
          <p className="text-xs text-slate-400">Structured prompts for slides, scripts, audio overviews, study guides, mind maps, and flashcards.</p>
        </div>
      </div>

      {/* Level selector */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Tailor for level</span>
        <div className="flex flex-wrap gap-1.5">
          {STUDENT_LEVELS.map(lvl => {
            const Icon = LEVEL_ICONS[lvl.iconName] || BookOpen;
            const on = level === lvl.id;
            return (
              <button key={lvl.id} title={lvl.blurb}
                onClick={() => { setLevel(lvl.id); setGeneratedPrompt(""); }}
                className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer ${on ? lvl.activeClass : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300 hover:border-slate-700"}`}>
                <Icon className="w-3.5 h-3.5" /> {lvl.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500">Tailored for: {AUDIENCE[level]}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Output type</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map(item => {
                const Icon = item.icon;
                const isSelected = activeTemplateId === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTemplateId(item.id); setGeneratedPrompt(""); }}
                    className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected ? "bg-emerald-950/20 border-emerald-700/50" : "bg-[#080C16] border-[#1A2138] hover:bg-[#0D1225] hover:border-slate-700"}`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-emerald-600 text-white" : "bg-[#0D1225] text-slate-500"}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">{item.objective}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Topic / lecture theme</label>
            <input type="text" value={topic}
              onChange={e => { setTopic(e.target.value); setGeneratedPrompt(""); }}
              placeholder={EXAMPLE_TOPIC[level]}
              className="w-full bg-[#080C16] border border-[#1A2138] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-600/60" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Extra directions (optional)</label>
            <textarea value={customBrief}
              onChange={e => { setCustomBrief(e.target.value); setGeneratedPrompt(""); }}
              placeholder="e.g. emphasise diagrams, focus on exam-relevant points, keep it under 10 minutes…"
              className="w-full h-20 bg-[#080C16] border border-[#1A2138] focus:border-emerald-600/60 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none" />
          </div>

          <button onClick={handleGenerate}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Build structured prompt
          </button>
        </div>

        {/* Right: output */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1A2138] pt-5 lg:pt-0 lg:pl-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">Instruction template</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">Paste directly into Gemini, Claude, ChatGPT, or NotebookLM to generate the output.</p>
            <div className="bg-[#080C16] p-4 rounded-xl border border-[#1A2138] font-mono text-[11px] text-slate-300 min-h-36 max-h-[300px] overflow-y-auto leading-normal select-all whitespace-pre-wrap">
              {generatedPrompt || <span className="text-slate-600 italic">Pick a level + output type, set your topic, then Build.</span>}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {generatedPrompt && (
              <button onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition duration-150 cursor-pointer ${copied ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white"}`}>
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy prompt</>}
              </button>
            )}
            <div className="bg-[#080C16] border border-[#1A2138] p-3.5 rounded-lg flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-400 uppercase block mb-0.5">Tip</span>
                For NotebookLM audio, paste the Dialogue prompt as a source note; for slides, feed the outline into Gamma or PowerPoint AI.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
