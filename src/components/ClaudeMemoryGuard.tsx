import { useState } from "react";
import { 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  Check, 
  Copy, 
  RotateCcw, 
  Sliders, 
  Info,
  Layers,
  Activity
} from "lucide-react";

export default function ClaudeMemoryGuard() {
  const [threadTurns, setThreadTurns] = useState(8);
  const [codeBloatText, setCodeBloatText] = useState("");
  const [copied, setCopied] = useState(false);

  // Estimates context weight based on turns and code bloat text
  const getContextWeight = () => {
    const rawTurnsWeight = threadTurns * 3500; // Average 3.5k tokens per conversational turn code exchange
    const textBlobTokens = Math.floor(codeBloatText.length / 4);
    return rawTurnsWeight + textBlobTokens;
  };

  const getDegradationStatus = () => {
    const totalTkn = getContextWeight();
    
    if (totalTkn < 30000) {
      return {
        level: "Safe & Optimal",
        description: "Strict directive adherence, high-fidelity reasoning, perfectly sound XML tag parsing.",
        vibe: "excellent",
        barColor: "bg-emerald-500",
        textColor: "text-emerald-400",
        badgeStyle: "bg-emerald-950/60 border-emerald-900/50 text-emerald-400"
      };
    } else if (totalTkn < 75000) {
      return {
        level: "Minor Memory Satiation",
        description: "Occasional forgetfulness. Claude might repeat boilerplate blocks unless warned inside negative boundaries.",
        vibe: "warning",
        barColor: "bg-amber-400",
        textColor: "text-amber-400",
        badgeStyle: "bg-amber-950/60 border-amber-900/50 text-amber-400"
      };
    } else if (totalTkn < 140000) {
      return {
        level: "Moderate Lost In Middle (LIM)",
        description: "Claude loses focus in long central code blocks. High risk of repeating previously resolved syntax errors.",
        vibe: "danger",
        barColor: "bg-orange-500",
        textColor: "text-orange-400",
        badgeStyle: "bg-orange-950/60 border-orange-900/50 text-orange-400"
      };
    } else {
      return {
        level: "Severe Context Degradation",
        description: "Chitchats endlessly, refuses surgical code-block writes, completely fails system rules. Restart prompt thread immediately.",
        vibe: "critical",
        barColor: "bg-red-500",
        textColor: "text-red-400",
        badgeStyle: "bg-red-950/60 border-red-900/50 text-red-400"
      };
    }
  };

  const currentStatus = getDegradationStatus();
  const contextWeightRatio = Math.min(100, (getContextWeight() / 200000) * 100);

  const boosterPrompt = `<!-- CLAUDE CHAT CONTEXT COMPRESSION & MEMORY GUARD ACTIVE -->
<memory_booster_checkpoint>
  [THREAD REFOCUS]: We are deep in a long context conversation of ${threadTurns} turns. 
  To combat context loss and ensure pristine reasoning, review your system state before proceeding:
  
  1. DO NOT output repeated file boilerplate or chitchat commentary.
  2. Perform a strict self-reflection check before editing existing code.
  3. Validate all imported interfaces in types.ts against active exports.
  4. Write only surgical changes or replacement blocks using XML tags.
</memory_booster_checkpoint>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(boosterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="claude-memory-guard">
      <div className="border-b border-slate-800/80 pb-5 space-y-1">
        <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Iterative Memory & Context Inflation Guard
        </h2>
        <p className="text-xs text-slate-400">Monitor conversational bloat and trigger active checkpoint memory-bursters to extend Claude's logical limits in late-stage threads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thread Controls (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Thread Degradation Calculator</span>

          {/* Slider for Thread Turns */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-350">Estimated Chat Exchanges (Turns)</span>
              <span className="font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded text-[11px] font-bold">
                {threadTurns} exchanges
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={threadTurns}
              onChange={(e) => setThreadTurns(parseInt(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Fresh chat (1)</span>
              <span>Average limit (30)</span>
              <span>Extreme bloat (60)</span>
            </div>
          </div>

          {/* Code Bloat textarea estimation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Paste active code size (Estimate context bloat)</label>
              <span className="text-[9px] text-slate-500 font-mono">
                {codeBloatText.length} characters (~{Math.floor(codeBloatText.length / 4)} tokens)
              </span>
            </div>
            <textarea
              value={codeBloatText}
              onChange={(e) => setCodeBloatText(e.target.value)}
              placeholder="Paste custom codes here to estimate their specific weight inside Claude's context limits..."
              className="w-full h-24 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Thread degradation diagnostics output */}
          <div className="bg-slate-950/80 p-4.5 rounded-xl border border-slate-850 space-y-3.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block">Diagnostic Diagnostics Report</span>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Predicted Active Context Weight:</span>
                <span className="font-mono text-slate-200 font-bold">{getContextWeight().toLocaleString()} tokens</span>
              </div>
              
              {/* Context Bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${currentStatus.barColor}`}
                  style={{ width: `${contextWeightRatio}%` }}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1 border-t border-slate-900">
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border shrink-0 mt-0.5 ${currentStatus.badgeStyle}`}>
                {currentStatus.level}
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed">
                {currentStatus.description}
              </p>
            </div>
          </div>
        </div>

        {/* Booster / Copy Section (Right 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-5 lg:pt-0 lg:pl-6">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Context Booster Checkpoint
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you hit thread warning thresholds, copy this system spacer and send it. It resets Claude's semantic mapping constraints on the next turn.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-450 min-h-36 max-h-[250px] overflow-y-auto leading-normal select-all whitespace-pre-wrap">
                {boosterPrompt}
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
                    Checkpointed Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Checkpoint Booster
                  </>
                )}
              </button>

              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 uppercase block mb-0.5">Beginner Guideline:</span>
                  To maintain the highest-quality coding, open a fresh chat context thread for every major new feature page or directory schema changes!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
