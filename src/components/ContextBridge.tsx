import { useState, useRef } from "react";
import {
  Link2, Copy, Check, RotateCcw, ExternalLink, ArrowRight,
  UploadCloud, FileCheck, X, ChevronDown, ChevronUp,
  RefreshCw, Download, MessageSquare, Image as ImageIcon, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AI_MODELS } from "../data";
import { Attachment, Question } from "../types";

interface BridgeResult {
  contextSummary: string;
  bridgePrompt: string;
  reflectiveQuestions: Question[];
}

const ALL_MODELS = [{ id: "unknown", shortName: "Unknown AI", name: "Other / Unknown AI", textClass: "text-slate-400", bgClass: "bg-slate-800/30", borderClass: "border-slate-700/50", activeBgClass: "bg-slate-800/50", accentHex: "#64748B", badgeText: "", iconEmoji: "?" }, ...AI_MODELS];

export default function ContextBridge() {
  const [sourceModelId, setSourceModelId] = useState("unknown");
  const [targetModelId, setTargetModelId] = useState("gemini");
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [chatHistory, setChatHistory] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [continuationGoal, setContinuationGoal] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<BridgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Reflective questions
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [isRefining, setIsRefining] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState("");

  // Copy state
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedRefined, setCopiedRefined] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const sourceModel = ALL_MODELS.find(m => m.id === sourceModelId) || ALL_MODELS[0];
  const targetModel = AI_MODELS.find(m => m.id === targetModelId) || AI_MODELS[0];

  // ─── File upload ─────────────────────────────────────────────────────────────
  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach(file => {
      if (file.size > 50 * 1024 * 1024) { setError(`"${file.name}" exceeds 50 MB.`); return; }
      const reader = new FileReader();
      const isImage = file.type.startsWith("image/");
      reader.onload = e => {
        const content = e.target?.result as string;
        setAttachments(prev => {
          if (prev.some(a => a.name === file.name && a.size === file.size)) return prev;
          return [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name, type: file.type || "application/octet-stream",
            size: file.size, content,
            previewUrl: isImage ? content : undefined
          }];
        });
      };
      if (isImage) reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // ─── Generate bridge ──────────────────────────────────────────────────────────
  const handleBridge = async (withAnswers = false) => {
    const hasContent = chatHistory.trim() || attachments.length > 0;
    if (!hasContent) { setError("Paste your chat history or upload a screenshot to bridge."); return; }
    setError(null);

    if (withAnswers) setIsRefining(true);
    else {
      setIsGenerating(true); setResult(null); setShowQuestions(false);
      setQuestionAnswers({}); setRefinedPrompt("");
    }

    try {
      const res = await fetch("/api/bridge-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceModelId,
          sourceModelName: sourceModel.name,
          targetModelId,
          targetModelName: targetModel.name,
          targetPromptingStyle: targetModel.promptingStyle,
          targetPromptingTips: targetModel.promptingTips,
          targetSystemPromptSupport: targetModel.systemPromptSupport,
          chatHistory: inputMode === "paste" ? chatHistory : "",
          continuationGoal,
          attachments,
          questionAnswers: withAnswers ? questionAnswers : {}
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bridge generation failed.");

      if (withAnswers) {
        setRefinedPrompt(data.bridgePrompt);
      } else {
        setResult(data);
        setShowQuestions(true);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
      setIsRefining(false);
    }
  };

  const handleCopy = (text: string, which: "main" | "refined") => {
    navigator.clipboard.writeText(text);
    if (which === "main") { setCopiedMain(true); setTimeout(() => setCopiedMain(false), 2000); }
    else { setCopiedRefined(true); setTimeout(() => setCopiedRefined(false), 2000); }
  };

  const handleDownload = (text: string, prefix: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${prefix}-bridge-to-${targetModel.id}.md`;
    a.click();
  };

  const handleReset = () => {
    setChatHistory(""); setAttachments([]); setContinuationGoal("");
    setResult(null); setError(null); setShowQuestions(false);
    setQuestionAnswers({}); setRefinedPrompt("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            Context Bridge
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Hit a usage limit? Paste your chat history or screenshot — the Bridge creates a seamless continuation prompt for any new AI.
          </p>
        </div>
        {(result || chatHistory) && (
          <button onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-[#0D1225] hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-[#1A2138] transition cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-300 text-sm">
            <X className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 1: Model pair selector ───────────────────────────────────────── */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
          01 · AI Model Transfer
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" /> Leaving (Source AI)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_MODELS.map(m => (
                <button key={m.id} onClick={() => setSourceModelId(m.id)}
                  className={`p-2 rounded-lg border text-[10px] font-semibold transition cursor-pointer text-center ${
                    sourceModelId === m.id
                      ? `${m.activeBgClass} ${m.borderClass} ${m.textClass}`
                      : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}>
                  <span className="block text-base mb-0.5">{m.iconEmoji}</span>
                  {m.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Arrow divider */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60 inline-block" /> Continuing On (Target AI)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {AI_MODELS.map(m => (
                <button key={m.id} onClick={() => setTargetModelId(m.id)}
                  className={`p-2 rounded-lg border text-[10px] font-semibold transition cursor-pointer text-center ${
                    targetModelId === m.id
                      ? `${m.activeBgClass} ${m.borderClass} ${m.textClass}`
                      : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}>
                  <span className="block text-base mb-0.5">{m.iconEmoji}</span>
                  {m.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transfer summary strip */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#080C16] border border-[#1A2138]">
          <span className={`text-sm font-bold ${sourceModel.textClass}`}>{sourceModel.shortName}</span>
          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
          <span className={`text-sm font-bold ${targetModel.textClass}`}>{targetModel.shortName}</span>
          <span className="text-[10px] text-slate-600 ml-auto">Bridge will use {targetModel.name}'s prompt syntax</span>
        </div>
      </div>

      {/* ── Step 2: Context input ──────────────────────────────────────────────── */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
          02 · Previous Conversation Context
        </span>

        {/* Mode toggle */}
        <div className="flex bg-[#080C16] p-1 rounded-xl border border-[#1A2138] w-fit gap-1">
          <button onClick={() => setInputMode("paste")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer ${
              inputMode === "paste" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50" : "text-slate-500 hover:text-slate-300"
            }`}>
            <MessageSquare className="w-3.5 h-3.5" /> Paste Chat
          </button>
          <button onClick={() => setInputMode("upload")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer ${
              inputMode === "upload" ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/50" : "text-slate-500 hover:text-slate-300"
            }`}>
            <ImageIcon className="w-3.5 h-3.5" /> Upload Screenshot
          </button>
        </div>

        {inputMode === "paste" ? (
          <textarea
            value={chatHistory}
            onChange={e => { setChatHistory(e.target.value); if (error) setError(null); }}
            placeholder={`Paste your full conversation here.\n\nYou: [your message]\nAI: [response]\nYou: [follow-up]\nAI: [response]\n\nTip: Copy all messages from the AI conversation and paste them here. Include as much as possible — more context = better bridge.`}
            className="w-full h-52 bg-[#080C16] border border-[#1A2138] focus:border-slate-600 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-700 focus:outline-none resize-none font-mono leading-relaxed"
          />
        ) : (
          <div
            onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive ? "border-cyan-600 bg-cyan-950/10" : "border-[#1A2138] hover:border-slate-700 hover:bg-[#080C16]"
            }`}>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={e => handleFileUpload(e.target.files)} />
            <UploadCloud className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-semibold">Drop screenshots here</p>
            <p className="text-xs text-slate-600 mt-1">PNG, JPG, WebP — multiple files supported</p>
          </div>
        )}

        {/* Attachment list (for upload mode or when files added) */}
        {attachments.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Attached files</span>
            {attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#080C16] border border-[#1A2138]">
                {att.previewUrl
                  ? <img src={att.previewUrl} className="w-10 h-7 rounded object-cover shrink-0" alt={att.name} />
                  : <FileCheck className="w-4 h-4 text-slate-500 shrink-0" />
                }
                <span className="text-[11px] text-slate-300 truncate flex-1">{att.name}</span>
                <button onClick={() => setAttachments(p => p.filter(a => a.id !== att.id))}
                  className="text-slate-600 hover:text-red-400 transition p-0.5 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Step 3: Continuation goal ─────────────────────────────────────────── */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
          03 · Continuation Goal
        </span>
        <textarea
          value={continuationGoal}
          onChange={e => setContinuationGoal(e.target.value)}
          placeholder={`What do you want to continue or focus on next?\n\ne.g. "Continue building the authentication system — we stopped at implementing JWT refresh tokens"\ne.g. "Summarize what we've done and then continue with the essay's third section"`}
          className="w-full h-24 bg-[#080C16] border border-[#1A2138] focus:border-slate-600 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans leading-relaxed"
        />

        <button
          onClick={() => handleBridge(false)}
          disabled={isGenerating || (!chatHistory.trim() && attachments.length === 0)}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${targetModel.textClass}`}
          style={{ background: `linear-gradient(135deg, ${targetModel.accentHex}20, ${targetModel.accentHex}08)`, border: `1px solid ${targetModel.accentHex}40` }}>
          {isGenerating ? (
            <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Building Bridge to {targetModel.shortName}…</>
          ) : (
            <><Sparkles className="w-4 h-4" />Build Bridge Prompt for {targetModel.shortName}<ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {/* ── Output ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && !isGenerating && (
          <motion.div ref={outputRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade-up">

            {/* Context Summary (collapsible) */}
            <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl overflow-hidden">
              <button
                onClick={() => setSummaryOpen(p => !p)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-[#111830] transition">
                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                  Context Summary (what the AI extracted)
                </span>
                {summaryOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {summaryOpen && (
                <div className="px-4 pb-4 border-t border-[#1A2138]">
                  <pre className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans mt-3">{result.contextSummary}</pre>
                </div>
              )}
            </div>

            {/* Bridge Prompt */}
            <div className={`bg-[#0D1225] border rounded-2xl p-5 space-y-3 ${targetModel.borderClass}`}
              style={{ borderColor: `${targetModel.accentHex}30` }}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${targetModel.textClass}`}>
                  Bridge Prompt → {targetModel.name}
                </span>
                <a href={targetModel.url} target="_blank" rel="noreferrer"
                  className={`flex items-center gap-1 text-[10px] ${targetModel.textClass} hover:underline`}>
                  Open {targetModel.shortName} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto select-all">
                {result.bridgePrompt}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleCopy(result.bridgePrompt, "main")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    copiedMain ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-400"
                      : `${targetModel.bgClass} ${targetModel.borderClass} ${targetModel.textClass} hover:opacity-80`
                  }`}>
                  {copiedMain ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Bridge Prompt</>}
                </button>
                <button onClick={() => handleDownload(result.bridgePrompt, "bridge")}
                  className="p-2.5 rounded-lg bg-[#080C16] border border-[#1A2138] text-slate-500 hover:text-white transition cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reflective questions ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && result.reflectiveQuestions?.length > 0 && showQuestions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Refine the Bridge
                  <span className="ml-2 text-[9px] text-slate-600 normal-case tracking-normal font-normal">(optional — skip freely)</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">These questions fill gaps the AI spotted in your conversation history.</p>
              </div>
              <button onClick={() => setShowQuestions(false)} className="text-slate-600 hover:text-slate-300 transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.reflectiveQuestions.map((q, i) => (
                <div key={q.id}
                  className={`p-3 rounded-xl border transition-all ${
                    questionAnswers[q.id]?.trim()
                      ? `bg-cyan-950/20 border-cyan-900/50`
                      : "bg-[#080C16] border-[#1A2138]"
                  }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400">Q{i + 1}</span>
                    <p className="text-xs font-semibold text-slate-200 leading-snug">{q.question}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{q.helperText}</p>
                  <textarea
                    value={questionAnswers[q.id] || ""}
                    onChange={e => setQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Optional answer…"
                    className="w-full h-14 bg-[#080C16] border border-[#1A2138] focus:border-slate-600 rounded-lg p-2 text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => handleBridge(true)} disabled={isRefining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-cyan-400 bg-cyan-950/25 border border-cyan-900/40 transition cursor-pointer disabled:opacity-40 hover:bg-cyan-950/40">
                {isRefining
                  ? <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />Refining…</>
                  : <><RefreshCw className="w-3.5 h-3.5" />Refine Bridge with Answers</>
                }
              </button>
              <button onClick={() => { setShowQuestions(false); setQuestionAnswers({}); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
                Skip all
              </button>
            </div>

            <AnimatePresence>
              {refinedPrompt && !isRefining && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border space-y-3 ${targetModel.bgClass} ${targetModel.borderClass}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${targetModel.textClass}`}>
                    ✦ Refined Bridge Prompt
                  </span>
                  <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto select-all">
                    {refinedPrompt}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(refinedPrompt, "refined")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        copiedRefined ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-400"
                          : `${targetModel.borderClass} ${targetModel.textClass} hover:opacity-80`
                      }`}>
                      {copiedRefined ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Refined Bridge</>}
                    </button>
                    <button onClick={() => handleDownload(refinedPrompt, "refined-bridge")}
                      className="p-2 rounded-lg bg-[#080C16] border border-[#1A2138] text-slate-500 hover:text-white transition cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
