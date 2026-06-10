import { useState, useRef } from "react";
import {
  Sparkles, Copy, Check, RotateCcw, ExternalLink,
  UploadCloud, FileCheck, X,
  ArrowRight, Lightbulb, RefreshCw, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AI_MODELS } from "../data";
import { Attachment, Question } from "../types";

interface ForgeResult {
  forgedPrompt: string;
  promptTip: string;
  reflectiveQuestions: Question[];
}

export default function PromptForge() {
  const [selectedModelId, setSelectedModelId] = useState("gemini");
  const [userRequest, setUserRequest] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ForgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reflective questions state
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState("");

  // Copy state
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedRefined, setCopiedRefined] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];

  // ─── File upload ─────────────────────────────────────────────────────────────
  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 50 MB limit.`);
        return;
      }
      const reader = new FileReader();
      const isImage = file.type.startsWith("image/");
      const isText = file.type.startsWith("text/") ||
        ["json","ts","tsx","js","jsx","sql","py","csv","md","yaml","yml"]
          .some(ext => file.name.endsWith(`.${ext}`));

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
      else if (isText) reader.readAsText(file);
      else reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // ─── Main generation ──────────────────────────────────────────────────────────
  const handleForge = async (withAnswers = false) => {
    if (!userRequest.trim()) { setError("Describe what you want to do."); return; }
    setError(null);

    if (withAnswers) setIsRefining(true);
    else { setIsGenerating(true); setResult(null); setShowQuestions(false); setQuestionAnswers({}); setCurrentQIdx(0); setRefinedPrompt(""); }

    try {
      const res = await fetch("/api/forge-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userRequest,
          modelId: selectedModel.id,
          modelName: selectedModel.name,
          promptingStyle: selectedModel.promptingStyle,
          promptingTips: selectedModel.promptingTips,
          systemPromptSupport: selectedModel.systemPromptSupport,
          contextWindow: selectedModel.contextWindow,
          attachments,
          questionAnswers: withAnswers ? questionAnswers : {}
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");

      if (withAnswers) {
        setRefinedPrompt(data.forgedPrompt);
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
    a.download = `${prefix}-${selectedModel.id}-prompt.md`;
    a.click();
  };

  const handleReset = () => {
    setUserRequest(""); setAttachments([]); setResult(null);
    setError(null); setShowQuestions(false); setQuestionAnswers({});
    setCurrentQIdx(0); setRefinedPrompt("");
  };

  const activeQ = result?.reflectiveQuestions?.[currentQIdx];
  const allQAnswered = result?.reflectiveQuestions
    ? result.reflectiveQuestions.every(q => questionAnswers[q.id] !== undefined)
    : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Prompt Forge
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Transforms your request into an optimized prompt for any free AI — tailored to how each model actually thinks.
          </p>
        </div>
        {(result || userRequest) && (
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
            <X className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 1: AI Model selector ─────────────────────────────────────────── */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            01 · Select Target AI
          </span>
          <a href={selectedModel.url} target="_blank" rel="noreferrer"
            className={`flex items-center gap-1 text-[10px] font-semibold ${selectedModel.textClass} hover:underline`}>
            Open {selectedModel.shortName} <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AI_MODELS.map(model => {
            const isActive = model.id === selectedModelId;
            return (
              <button key={model.id} onClick={() => { setSelectedModelId(model.id); setResult(null); setShowQuestions(false); setRefinedPrompt(""); }}
                className={`relative text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? `${model.activeBgClass} ${model.borderClass} shadow-lg`
                    : "bg-[#080C16] border-[#1A2138] hover:border-slate-700 hover:bg-[#0D1225]"
                }`}
                style={isActive ? { boxShadow: `0 0 0 1px ${model.accentHex}30, 0 4px 20px ${model.accentHex}15` } : {}}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-base ${isActive ? model.textClass : "text-slate-600 group-hover:text-slate-400"} transition-colors`}>
                    {model.iconEmoji}
                  </span>
                  <span className={`text-xs font-bold leading-tight ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} transition-colors`}>
                    {model.shortName}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? `${model.bgClass} ${model.textClass}` : "bg-slate-900 text-slate-600"} transition-colors`}>
                  {model.badgeText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected model info strip */}
        <div className={`flex flex-wrap items-start gap-3 p-3 rounded-xl border ${selectedModel.bgClass} ${selectedModel.borderClass}`}>
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-semibold ${selectedModel.textClass} mb-0.5`}>{selectedModel.name}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">{selectedModel.freeInfo}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedModel.strengths.map(s => (
              <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-[#080C16] text-slate-400 border border-[#1A2138]">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step 2: Input ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
            02 · Describe Your Request
          </span>

          <textarea
            value={userRequest}
            onChange={e => { setUserRequest(e.target.value); if (error) setError(null); }}
            placeholder={`What do you want ${selectedModel.shortName} to do? Write naturally — the Forge will optimize the language for ${selectedModel.shortName}'s prompting style.\n\ne.g. "Explain how TCP handshakes work to a first-year CS student with diagrams"`}
            className="w-full h-36 bg-[#080C16] border border-[#1A2138] focus:border-slate-600 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans leading-relaxed"
          />

          {/* File upload */}
          <div
            onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative border border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
              dragActive ? "border-slate-500 bg-slate-800/20" : "border-[#1A2138] hover:border-slate-700 hover:bg-[#080C16]"
            }`}>
            <input ref={fileInputRef} type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={e => handleFileUpload(e.target.files)} />
            <UploadCloud className="w-5 h-5 text-slate-600 mx-auto mb-1" />
            <p className="text-[11px] text-slate-500">
              Drop files or screenshots · <span className="text-slate-400">browse</span> · 50MB max
            </p>
          </div>

          {/* Attachment list */}
          {attachments.length > 0 && (
            <div className="space-y-1.5">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#080C16] border border-[#1A2138]">
                  {att.previewUrl
                    ? <img src={att.previewUrl} className="w-7 h-7 rounded object-cover shrink-0" alt={att.name} />
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

          <button
            onClick={() => handleForge(false)}
            disabled={isGenerating || !userRequest.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedModel.textClass}`}
            style={{ background: `linear-gradient(135deg, ${selectedModel.accentHex}20, ${selectedModel.accentHex}10)`, border: `1px solid ${selectedModel.accentHex}40` }}>
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Forging for {selectedModel.shortName}…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Forge Prompt for {selectedModel.shortName}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* ── Step 3: Output ────────────────────────────────────────────────────── */}
        <div ref={outputRef} className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4 min-h-[200px] flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
            03 · Forged Prompt
          </span>

          {!result && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-2">
              <div className={`text-3xl opacity-20 ${selectedModel.textClass}`}>{selectedModel.iconEmoji}</div>
              <p className="text-xs text-slate-600">Your {selectedModel.shortName}-optimized prompt will appear here.</p>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-200 rounded-full animate-spin" />
              <p className="text-xs text-slate-500 animate-pulse-soft">Forging for {selectedModel.shortName}…</p>
            </div>
          )}

          {result && !isGenerating && (
            <div className="flex-1 flex flex-col gap-3 animate-fade-up">
              {/* Tip strip */}
              {result.promptTip && (
                <div className={`flex items-start gap-2 p-2.5 rounded-lg text-[11px] ${selectedModel.bgClass} ${selectedModel.borderClass} border`}>
                  <Lightbulb className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${selectedModel.textClass}`} />
                  <span className="text-slate-300 leading-relaxed">{result.promptTip}</span>
                </div>
              )}

              {/* Prompt box */}
              <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-4 flex-1 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto select-all">
                {result.forgedPrompt}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleCopy(result.forgedPrompt, "main")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    copiedMain ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-400"
                      : `${selectedModel.bgClass} ${selectedModel.borderClass} ${selectedModel.textClass} hover:opacity-80`
                  }`}>
                  {copiedMain ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Prompt</>}
                </button>
                <button onClick={() => handleDownload(result.forgedPrompt, "forge")}
                  className="p-2.5 rounded-lg bg-[#080C16] border border-[#1A2138] text-slate-500 hover:text-white transition cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 4: Reflective questions (optional) ───────────────────────────── */}
      <AnimatePresence>
        {result && result.reflectiveQuestions?.length > 0 && showQuestions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block">
                  04 · Refine with Reflective Questions
                  <span className="ml-2 text-[9px] text-slate-600 normal-case tracking-normal font-normal">(optional — skip anytime)</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Answer any questions below to get a more precise prompt. Unanswered questions are ignored.</p>
              </div>
              <button onClick={() => setShowQuestions(false)}
                className="text-slate-600 hover:text-slate-300 transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.reflectiveQuestions.map((q, i) => (
                <div key={q.id}
                  className={`p-3 rounded-xl border transition-all ${
                    questionAnswers[q.id]?.trim()
                      ? `${selectedModel.bgClass} ${selectedModel.borderClass}`
                      : "bg-[#080C16] border-[#1A2138]"
                  }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedModel.bgClass} ${selectedModel.textClass}`}>Q{i + 1}</span>
                    <p className="text-xs font-semibold text-slate-200 leading-snug">{q.question}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{q.helperText}</p>
                  <textarea
                    value={questionAnswers[q.id] || ""}
                    onChange={e => setQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Your answer (optional)…"
                    className="w-full h-16 bg-[#080C16] border border-[#1A2138] focus:border-slate-600 rounded-lg p-2 text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={() => handleForge(true)} disabled={isRefining}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer disabled:opacity-40 ${selectedModel.textClass}`}
                style={{ background: `${selectedModel.accentHex}18`, border: `1px solid ${selectedModel.accentHex}35` }}>
                {isRefining
                  ? <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />Refining…</>
                  : <><RefreshCw className="w-3.5 h-3.5" />Refine Prompt with Answers</>
                }
              </button>
              <button onClick={() => { setShowQuestions(false); setQuestionAnswers({}); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
                Skip all questions
              </button>
            </div>

            {/* Refined prompt output */}
            <AnimatePresence>
              {refinedPrompt && !isRefining && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 p-4 rounded-xl border space-y-3 ${selectedModel.bgClass} ${selectedModel.borderClass}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedModel.textClass}`}>
                    ✦ Refined Prompt
                  </span>
                  <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-4 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto select-all">
                    {refinedPrompt}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(refinedPrompt, "refined")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        copiedRefined ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-400"
                          : `${selectedModel.borderClass} ${selectedModel.textClass} hover:opacity-80`
                      }`}>
                      {copiedRefined ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Refined</>}
                    </button>
                    <button onClick={() => handleDownload(refinedPrompt, "refined")}
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

      {/* Prompting tips sidebar (shows when no result yet) */}
      {!result && (
        <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-3">
          <span className={`text-[11px] font-bold uppercase tracking-widest ${selectedModel.textClass}`}>
            How {selectedModel.name} thinks
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">{selectedModel.promptingStyle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {selectedModel.promptingTips.map((tip, i) => (
              <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-[11px] ${selectedModel.bgClass} ${selectedModel.borderClass}`}>
                <span className={`font-mono font-bold text-[10px] shrink-0 mt-0.5 ${selectedModel.textClass}`}>{i + 1}.</span>
                <span className="text-slate-300 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
