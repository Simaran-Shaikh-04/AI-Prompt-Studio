import { useState } from "react";
import { 
  FileText, 
  Tv, 
  Volume2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  HelpCircle,
  GraduationCap
} from "lucide-react";

interface SubSection {
  id: string;
  title: string;
  icon: any;
  objective: string;
  description: string;
  instructionTemplate: string;
}

const TEMPLATES: SubSection[] = [
  {
    id: "slides",
    title: "1. AI Presentation Slides & PPT Outline",
    icon: FileText,
    objective: "Generates step-by-step corporate slide structures, design cues, visual diagrams specs, and student bento layouts.",
    description: "Construct slide-by-slide titles, direct bullet text, and detailed prompt placeholders for visual slide-designer tools (Gamma, Tome, or PowerPoint AI).",
    instructionTemplate: `Act as an expert Academic Graphic Designer and PPT Visual Strategist. 
Draft a comprehensive, professional presentation deck outline containing exactly 8 modular slides based on: "<lecture_theme>" targeting an audience of "<target_audience>".

For each slide, specify:
1. Slide Title (bold, human, and outcome-oriented)
2. Slide Layout & Visual Theme Guidance: Custom bento-grids, schema diagrams, or image prompt cues for Midjourney/Firefly.
3. Core Text Content: Exactly 3 high-impact bullet items focusing on cognitive active-recall.
4. Concept Metaphor: A physical metaphor simplifying the core lesson.

Formatting: Present each slide inside a clear <slide_i> XML tag structure.`
  },
  {
    id: "video",
    title: "2. Student Video Narratives & Video Scripts",
    icon: Tv,
    objective: "Generates educational video flowsheets, vocal talking points, video-editor prompts, and visual cuts.",
    description: "Build chronological transcripts focusing on hook-style intros, structural visual actions, and summary takeaways.",
    instructionTemplate: `Act as a master Science Communicator and Video Scriptwriter like Kurzgesagt or Veritasium.
Generate a highly engaging, professional 3-minute video script teaching: "<lecture_theme>" to a student demographic defined as "<target_audience>".

Include:
- 0:00 - 0:30 [The Hook]: A thrilling common-sense paradox or intriguing question that challenges understanding.
- 0:30 - 2:00 [The Core Mechanics]: Clear, step-by-step breakdown using conversational analogies. Provide explicit [VISUAL ACTION GUIDE] guidelines for animations or real-world clips.
- 2:00 - 3:00 [The Deep-Takeaway]: A lasting mnemonic memory code and active rehearsal challenge.

Formatting: Segment sections inside [<timestamp>] brackets with clear Voiceover and Visual prompts.`
  },
  {
    id: "audio",
    title: "3. NotebookLM Dialogues (Engaging Audio Overviews)",
    icon: Volume2,
    objective: "Generates two-speaker podcast discussions, witty banters, simplified analogies, and back-and-forth educational analysis.",
    description: "Create interactive conversational scripts for dual TTS voice actors (ElevenLabs or notebook hosts) mimicking live academic explainers.",
    instructionTemplate: `Act as two world-class podcast hosts (Host: Alex, Co-host: Taylor) who are incredibly skilled at converting dense academic material into understandable, witty verbal exchanges.
Conduct an interactive, deep-dive 5-minute audio overview discussion based on: "<lecture_theme>" for a target listening base of "<target_audience>".

Conversation Rules:
1. Alex starts with dynamic energy and frames the 'Why should I care?' question.
2. Taylor responds with an offline real-life analogy (e.g., comparing database locks to reserving library tables with notebooks).
3. Both hosts must have dynamic back-and-forth: Alex asks clarifying questions, Taylor explains simply, using casual colloquial phrases (e.g. 'Wait, let that sink in', 'Exactly! Here is the catch...').
4. Avoid dry textbook jargon. Synthesize complex details into relatable banter.

Formatting: Output the dialogue list using Alex: and Taylor: role tags.`
  }
];

export default function NotebookLMSuite() {
  const [activeTemplateId, setActiveTemplateId] = useState("slides");
  const [lectureTheme, setLectureTheme] = useState("Distributed Consensus Systems using Raft protocols");
  const [targetAudience, setTargetAudience] = useState("Undergraduate Junior CS Students");
  const [customBrief, setCustomBrief] = useState("Focus on simplifying Leader Election, Heartbeat pulses, and split-brain resolution scenarios using graphical, relatable metaphors.");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const activeTemplate = TEMPLATES.find(t => t.id === activeTemplateId) || TEMPLATES[0];

  const handleGenerate = () => {
    let result = activeTemplate.instructionTemplate
      .replace("<lecture_theme>", lectureTheme)
      .replace("<target_audience>", targetAudience);

    if (customBrief.trim()) {
      result += `\n\n<additional_pedagogical_constraints>\n${customBrief}\n</additional_pedagogical_constraints>`;
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
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="notebooklm-scholar-suite">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            NotebookLM Academic Synthesis Suite
          </h2>
          <p className="text-xs text-slate-400">Generate high-adherence structured prompts to fuel AI multi-modal generators for educational slides, scripts, and podcast audio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Inputs (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section Selection Cards */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Select Generation Objective</span>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTemplateId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTemplateId(item.id);
                      setGeneratedPrompt("");
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-950/20 border-indigo-500 text-white shadow-md"
                        : "bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-500"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                      {item.objective}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Lecture / Topic Theme</label>
              <input
                type="text"
                value={lectureTheme}
                onChange={(e) => {
                  setLectureTheme(e.target.value);
                  setGeneratedPrompt("");
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Target Scholar Demographic</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => {
                  setTargetAudience(e.target.value);
                  setGeneratedPrompt("");
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Custom Pedagogical Directives (Raw Ideas)</label>
            <textarea
              value={customBrief}
              onChange={(e) => {
                setCustomBrief(e.target.value);
                setGeneratedPrompt("");
              }}
              className="w-full h-20 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Build Multi-modal Prompt Directive
          </button>
        </div>

        {/* Results / Copy Box (Right 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-5 lg:pt-0 lg:pl-6">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">
                Instruction Template Box
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Feed this markdown instruction directly into Claude or ChatGPT to generate pristine presentation outlines, script talking-points, or dual-audio podcasts with impeccable compliance.
              </p>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-300 min-h-36 max-h-[300px] overflow-y-auto leading-normal select-all whitespace-pre-wrap">
                {generatedPrompt ? (
                  generatedPrompt
                ) : (
                  <span className="text-slate-600 italic">Adjust target topic fields and click Build above to formulate markdown prompt parameters.</span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {generatedPrompt && (
                <button
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition duration-150 cursor-pointer ${
                    copied
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                      : "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Compiled block copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Compiled Directive
                    </>
                  )}
                </button>
              )}

              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 uppercase block mb-0.5">Host Dialogue Tip:</span>
                  NotebookLM style podcasts work exceptionally well when Host Alex does the setup, and Taylor unpacks with creative, funny system comparisons. Paste this prompt and explore active vocal learning!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
