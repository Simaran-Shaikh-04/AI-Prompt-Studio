import { useState } from "react";
import { 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Check, 
  Copy,
  ToggleLeft,
  ToggleRight,
  Database,
  Search,
  BookOpen
} from "lucide-react";

interface HiddenSetting {
  id: string;
  category: string;
  title: string;
  description: string;
  howToActivate: string;
  systemPromptAddon: string;
  icon: any;
}

const HIDDEN_SETTINGS: HiddenSetting[] = [
  {
    id: "claude-projects-instructions",
    category: "Claude Projects",
    title: "Project Custom Instructions",
    description: "Forces a core professional behavior across all chats in your Claude Project. Avoids repeating manual ground rules for every single conversation.",
    howToActivate: "Create a Project, click on 'Project Instructions' on the right sidebar, and paste the startup system guidelines there.",
    systemPromptAddon: "CONSTRAINTS: Follow Swiss-Design aesthetics, write strict type-safe modular files first inside /src/types.ts, and outline a 3-bullet plan before issuing any code changes.",
    icon: Settings
  },
  {
    id: "artifacts-sandboxing",
    category: "Interface Settings",
    title: "Strict Artifact Sandboxing",
    description: "Mandates Claude to serve interactive visual code, web mockups, dashboards, or calculators inside independent preview windows instead of raw chat screens.",
    howToActivate: "Go to your Account -> Feature Preview -> Toggle 'Artifacts' to ON.",
    systemPromptAddon: "INTERFACE EXPECTATION: Leverage interactive visual Artifact blocks for any HTML/CSS elements, charts, single-page spreadsheets, or sequence workflows.",
    icon: ShieldCheck
  },
  {
    id: "data-connectors",
    category: "AI Connectors",
    title: "Live Cloud Storage Connectors (Drive / GitHub)",
    description: "Allows Claude to dynamically query, scan, or analyze massive directories from your Google Drive, Notion docs, or Git repos directly.",
    howToActivate: "Inside your Project sidebar, click 'Add Context' -> 'Connect to GitHub' or 'Connect to Google Drive'.",
    systemPromptAddon: "CONTEXT_AWARENESS: Search connected directory trees first before requesting user files or code definitions.",
    icon: Database
  },
  {
    id: "academic-active-recall",
    category: "Student Focus",
    title: "Active-Recall Spaced Repetition",
    description: "Configures Claude to dynamically construct Anki-style flashcards and Cornell summaries after explaining any complex subject.",
    howToActivate: "Check this option to inject flashcard metrics directly into your workspace prompts.",
    systemPromptAddon: "PEDAGOGY: Conclude every concept breakdown with exactly 3 active-recall questions and 1 Cloze deletion flashcard template.",
    icon: BookOpen
  }
];

export default function ExpertSettingsGuide() {
  const [activeSettings, setActiveSettings] = useState<Record<string, boolean>>({
    "claude-projects-instructions": true,
    "artifacts-sandboxing": true,
    "data-connectors": false,
    "academic-active-recall": true
  });
  const [copied, setCopied] = useState(false);

  const toggleSetting = (id: string) => {
    setActiveSettings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compile selected system prompt
  const getCompiledInstructions = () => {
    let result = "<!-- BEGIN SYSTEM SYSTEM PRESETS FOR CLAUDE PROJECTS -->\n<system_rules>\n";
    
    HIDDEN_SETTINGS.forEach(setting => {
      if (activeSettings[setting.id]) {
        result += `  <!-- Category: ${setting.category} - ${setting.title} -->\n  ${setting.systemPromptAddon}\n\n`;
      }
    });
    
    result += "</system_rules>\n<!-- END SYSTEM SYSTEM PRESETS -->";
    return result;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCompiledInstructions());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="expert-settings-guide">
      <div className="border-b border-slate-800/80 pb-5 space-y-1">
        <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          AI Expert Settings & Connectors Studio
        </h2>
        <p className="text-xs text-slate-400">Unlock hidden optimizations: custom instructions, interactive artifacts, active recall formatting, and Google Drive & GitHub data connectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hidden settings list (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Configure Project Instructions & Connectors</span>
          
          <div className="space-y-3" id="hidden-settings-toggles-container">
            {HIDDEN_SETTINGS.map((setting) => {
              const Icon = setting.icon;
              const isEnabled = activeSettings[setting.id];
              return (
                <div 
                  key={setting.id}
                  className={`p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 justify-between ${
                    isEnabled
                      ? "bg-slate-900/60 border-indigo-500/40"
                      : "bg-slate-950/20 border-slate-850 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isEnabled ? "bg-indigo-950 text-indigo-400" : "bg-slate-950 text-slate-600"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">{setting.title}</span>
                        <span className="text-[8px] uppercase font-mono font-bold tracking-wide text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                          {setting.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{setting.description}</p>
                      
                      {/* Guide Box */}
                      <div className="text-[10px] text-indigo-300/80 bg-slate-950/40 p-2 rounded-md border border-slate-850/50 mt-2 font-sans italic">
                        <span className="font-bold uppercase text-[8px] text-indigo-400 block mb-0.5 not-italic">How to activate:</span>
                        {setting.howToActivate}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className="shrink-0 mt-0.5 text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                    id={`toggle-btn-${setting.id}`}
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Prompt Compiler Panel (Right 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-5 lg:pt-0 lg:pl-6">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Project Rule Block
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By enabling these switches, you assemble highly directive guidelines that tell Claude exactly how to interpret links, files, and format academic summaries. Paste this into your Project instructions.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-400 min-h-36 max-h-[300px] overflow-y-auto leading-normal select-all whitespace-pre-wrap">
                {getCompiledInstructions()}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border transition duration-150 cursor-pointer ${
                  copied
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                    : "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied instructions!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Custom Rule Block
                  </>
                )}
              </button>

              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 uppercase block mb-0.5">Beginner Recommendation:</span>
                  If you are working with long files (like full databases or textbooks), connect Google Drive so Claude can look up chapters via vector search without exceeding the normal context limits.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
