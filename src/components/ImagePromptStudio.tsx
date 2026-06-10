import { useState } from "react";
import {
  Sparkles, Copy, Check, Image as ImageIcon, Info, Wand2,
  Camera, Linkedin, Youtube, Instagram, Smartphone, FileImage,
  PencilRuler, Lightbulb, AlertTriangle
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// MODELS grouped by prompt "dialect". The dialect — not the brand — decides how
// the prompt is assembled, which is what was breaking the old version:
//   natural   → flowing description, no token lists, no --params (Gemini, DALL·E, FLUX)
//   tags      → comma-stacked descriptors + --params (Midjourney)
//   weighted  → token stack + a separate Negative prompt field (Stable Diffusion)
// ─────────────────────────────────────────────────────────────────────────────
type Dialect = "natural" | "tags" | "weighted";

interface ImageModel {
  id: string;
  name: string;
  dialect: Dialect;
  freeNote: string;
  badge: string;
  tip: string;
}

const MODELS: ImageModel[] = [
  { id: "gemini",     name: "Nano Banana / Gemini", dialect: "natural",  freeNote: "Free · ~20 imgs/day in the Gemini app", badge: "Natural",   tip: "Reads plain English. Describe the scene like you're briefing a photographer." },
  { id: "dalle",      name: "DALL·E 3 (Bing)",      dialect: "natural",  freeNote: "Free with a Microsoft account",          badge: "Natural",   tip: "Loves full sentences. Ignores keyword spam and negative-token lists." },
  { id: "flux",       name: "FLUX.2 (Raphael/Perchance)", dialect: "natural", freeNote: "Free, no signup (watermarked)",     badge: "Natural",   tip: "Strong prompt fidelity. Descriptive prose beats keyword stacks." },
  { id: "midjourney", name: "Midjourney v7",        dialect: "tags",     freeNote: "Paid (trial availability varies)",        badge: "Keyword",   tip: "Front-load the important words. Uses --ar and --no parameters." },
  { id: "sd",         name: "Stable Diffusion (SDXL)", dialect: "weighted", freeNote: "Free · open-source, self-host",        badge: "Weighted",  tip: "Comma tokens + a separate Negative prompt. Supports (weight:1.2) syntax." },
];

const STYLES = ["Photorealistic", "Cinematic film still", "3D render", "Digital illustration", "Anime / manga", "Watercolor", "Flat vector", "Isometric 3D", "Line art", "Oil painting"];
const LIGHTING = ["Soft studio softbox", "Golden hour", "Dramatic rim light", "Neon cyberpunk", "Volumetric god rays", "Overcast soft", "High-key bright", "Low-key moody", "Backlit silhouette"];
const COMPOSITION = ["Close-up portrait", "Medium shot", "Wide establishing shot", "Top-down flat lay", "Macro detail", "Rule of thirds", "Centered symmetry", "Bird's-eye view"];
const MOOD = ["Warm & inviting", "Cool & calm", "Vibrant & energetic", "Dark & moody", "Minimal & clean", "Dreamy pastel", "Vintage / retro"];
const CAMERA = ["85mm portrait f/1.8", "35mm street", "Macro 100mm", "Wide 24mm", "Shot on film, subtle grain"];

const ASPECTS = [
  { label: "1:1", v: "1:1" }, { label: "4:5", v: "4:5" }, { label: "9:16", v: "9:16" },
  { label: "16:9", v: "16:9" }, { label: "3:2", v: "3:2" }, { label: "2:3", v: "2:3" }, { label: "4:1", v: "4:1" },
];

interface Platform { id: string; name: string; icon: any; aspect: string; composition?: string; }
const PLATFORMS: Platform[] = [
  { id: "li-avatar", name: "LinkedIn Avatar", icon: Camera,     aspect: "1:1",  composition: "Close-up portrait" },
  { id: "li-banner", name: "LinkedIn Banner", icon: Linkedin,   aspect: "4:1",  composition: "Wide establishing shot" },
  { id: "yt-thumb",  name: "YouTube Thumb",   icon: Youtube,    aspect: "16:9", composition: "Medium shot" },
  { id: "ig-post",   name: "Instagram Post",  icon: Instagram,  aspect: "4:5" },
  { id: "story",     name: "Story / Reel",    icon: Smartphone, aspect: "9:16" },
  { id: "poster",    name: "Poster",          icon: FileImage,  aspect: "2:3" },
];

export default function ImagePromptStudio() {
  const [mode, setMode] = useState<"build" | "enhance">("build");
  const [modelId, setModelId] = useState("gemini");
  const [platformId, setPlatformId] = useState<string | null>(null);

  const [subject, setSubject] = useState("");        // build: subject · enhance: pasted weak prompt
  const [style, setStyle] = useState("");
  const [lighting, setLighting] = useState("");
  const [composition, setComposition] = useState("");
  const [mood, setMood] = useState("");
  const [camera, setCamera] = useState("");
  const [negative, setNegative] = useState("");
  const [aspect, setAspect] = useState("1:1");

  const [output, setOutput] = useState("");
  const [explain, setExplain] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNote, setAiNote] = useState("");

  const model = MODELS.find(m => m.id === modelId) || MODELS[0];

  const selectPlatform = (p: Platform) => {
    setPlatformId(p.id);
    setAspect(p.aspect);
    if (p.composition) setComposition(p.composition);
    setOutput(""); setExplain([]);
  };

  const toggle = (cur: string, val: string, set: (v: string) => void) => {
    set(cur === val ? "" : val);
    setOutput(""); setExplain([]);
  };

  // ─── Rule-based builder (the "heavy lifting" half of the hybrid enhancer) ──────
  const build = (): { prompt: string; why: string[] } => {
    const base = subject.trim().replace(/\s+/g, " ").replace(/[.\s]+$/, "");
    const why: string[] = [];

    if (model.dialect === "natural") {
      const adds: string[] = [];
      if (style) adds.push(`in a ${style.toLowerCase()} style`);
      if (lighting) adds.push(`${lighting.toLowerCase()} lighting`);
      if (composition) adds.push(composition.toLowerCase());
      if (mood) adds.push(`a ${mood.toLowerCase()} mood`);
      if (camera) adds.push(`${camera.toLowerCase()}`);
      let p = base + (adds.length ? `, ${adds.join(", ")}` : "") + ". High detail and visual coherence.";
      p += ` Compose for a ${aspect} aspect ratio.`;
      if (negative.trim()) p += ` Do not include: ${negative.trim()}.`;
      why.push(`Written as a flowing description — ${model.name} reads natural language, so keyword stacks and "8k, masterpiece" spam hurt more than help.`);
      why.push(`Aspect ratio is stated in words; this model has no --ar parameter.`);
      if (negative.trim()) why.push(`Your "avoid" items became a plain instruction, because natural-language models ignore Negative-prompt token lists.`);
      return { prompt: p, why };
    }

    if (model.dialect === "tags") {
      const segs = [base, style, lighting, composition, mood, camera, "highly detailed", "sharp focus"].filter(Boolean).join(", ");
      let p = `${segs} --ar ${aspect} --v 7 --style raw`;
      if (negative.trim()) p += ` --no ${negative.split(/,\s*/).filter(Boolean).join(", ")}`;
      why.push(`Comma-separated descriptors with the subject first — Midjourney weights front-loaded terms most heavily.`);
      why.push(`--ar ${aspect} sets the aspect ratio; --v 7 --style raw gives truer, less stylized output.`);
      if (negative.trim()) why.push(`--no excludes elements — Midjourney's negative syntax (not a token list).`);
      return { prompt: p, why };
    }

    // weighted (Stable Diffusion)
    const pos = [base, style, lighting, composition, mood, camera, "(masterpiece:1.2)", "ultra detailed", "8k"].filter(Boolean).join(", ");
    const neg = negative.trim() || "blurry, low quality, deformed, extra limbs, watermark, text, signature";
    const p = `${pos}\n\nNegative prompt: ${neg}`;
    why.push(`A weighted token stack plus a separate Negative prompt — exactly how Stable Diffusion expects input. (weight:1.2) nudges emphasis.`);
    why.push(`Set your canvas to a ${aspect} ratio in the UI; SD has no aspect token in the prompt itself.`);
    return { prompt: p, why };
  };

  const handleBuild = () => {
    if (!subject.trim()) {
      setError(mode === "build" ? "Describe your subject first." : "Paste the prompt you want to improve first.");
      return;
    }
    setError(null); setAiNote("");
    const { prompt, why } = build();
    setOutput(prompt); setExplain(why);
  };

  // ─── Optional AI polish (degrades gracefully if the endpoint isn't added) ──────
  const aiPolish = async () => {
    if (!subject.trim()) { setError("Add a subject or paste a prompt first."); return; }
    setError(null); setAiLoading(true); setAiNote("");
    const { prompt } = output ? { prompt: output } : build();
    try {
      const res = await fetch("/api/enhance-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: model.name, dialect: model.dialect }),
      });
      const data = await res.json();
      if (!res.ok || !data.enhanced) throw new Error(data.error || "unavailable");
      setOutput(data.enhanced);
      setExplain(prev => prev.length ? prev : []);
      setAiNote("Polished with AI.");
    } catch {
      if (!output) { const { prompt: p, why } = build(); setOutput(p); setExplain(why); }
      setAiNote("AI polish isn't wired up yet — showing the rule-based prompt. Add the /api/enhance-image route to enable it.");
    } finally {
      setAiLoading(false);
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // ─── Small chip-group renderer ────────────────────────────────────────────────
  const ChipGroup = ({ label, options, value, set }: { label: string; options: string[]; value: string; set: (v: string) => void }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => {
          const on = value === opt;
          return (
            <button key={opt} onClick={() => toggle(value, opt, set)}
              className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${on ? "bg-indigo-600 border-indigo-500 text-white font-semibold" : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="image-prompt-studio">
      {/* Header + mode toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" /> Image Prompt Studio
          </h2>
          <p className="text-xs text-slate-400">Structured prompts tuned to each model's dialect — natural-language, keyword, or weighted.</p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(["build", "enhance"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(""); setExplain([]); setError(null); }}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${mode === m ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
              {m === "build" ? <><PencilRuler className="w-3.5 h-3.5" /> Build</> : <><Wand2 className="w-3.5 h-3.5" /> Enhance vague prompt</>}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" /> {error}
          <button onClick={() => setError(null)} className="ml-auto font-bold text-red-400">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-5">
          {/* Model selector */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Target model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODELS.map(m => {
                const on = modelId === m.id;
                return (
                  <button key={m.id} onClick={() => { setModelId(m.id); setOutput(""); setExplain([]); }}
                    className={`text-left p-3 rounded-xl border transition cursor-pointer ${on ? "bg-indigo-950/20 border-indigo-500" : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${on ? "text-white" : "text-slate-300"}`}>{m.name}</span>
                      <span className="text-[8px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-900/40 shrink-0">{m.badge}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-1">{m.freeNote}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 flex items-start gap-1.5 pt-0.5">
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" /> {model.tip}
            </p>
          </div>

          {/* Platform presets (set aspect) */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Quick platform (sets aspect ratio)</label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map(p => {
                const Icon = p.icon; const on = platformId === p.id;
                return (
                  <button key={p.id} onClick={() => selectPlatform(p)}
                    className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${on ? "bg-indigo-600 border-indigo-500 text-white font-semibold" : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"}`}>
                    <Icon className="w-3 h-3" /> {p.name} <span className="font-mono text-slate-500">{p.aspect}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              {mode === "build" ? "Primary subject" : "Paste your vague / weak prompt"}
            </label>
            <textarea
              value={subject}
              onChange={e => { setSubject(e.target.value); setOutput(""); setExplain([]); }}
              placeholder={mode === "build"
                ? "e.g., a confident female software engineer at her desk, warm smile"
                : "e.g., cool robot in a city, make it look nice"}
              className="w-full h-24 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none"
            />
            <p className="text-[10px] text-slate-500">The controls below add structure — pick what matters, skip the rest.</p>
          </div>

          {/* Structured controls */}
          <ChipGroup label="Style" options={STYLES} value={style} set={setStyle} />
          <ChipGroup label="Lighting" options={LIGHTING} value={lighting} set={setLighting} />
          <ChipGroup label="Composition / framing" options={COMPOSITION} value={composition} set={setComposition} />
          <ChipGroup label="Mood (optional)" options={MOOD} value={mood} set={setMood} />
          <ChipGroup label="Camera / lens (for photoreal)" options={CAMERA} value={camera} set={setCamera} />

          {/* Aspect + negative */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Aspect ratio</label>
              <div className="flex flex-wrap gap-1.5">
                {ASPECTS.map(a => (
                  <button key={a.v} onClick={() => { setAspect(a.v); setPlatformId(null); setOutput(""); setExplain([]); }}
                    className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${aspect === a.v ? "bg-indigo-600 border-indigo-500 text-white font-semibold" : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"}`}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Avoid / exclude (optional)</label>
              <input type="text" value={negative} onChange={e => { setNegative(e.target.value); setOutput(""); setExplain([]); }}
                placeholder="text, watermark, extra fingers, blur"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
              <p className="text-[9px] text-slate-600">Applied correctly per model — as a sentence, --no, or a Negative prompt field.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={handleBuild}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" /> Build for {model.name}
            </button>
            <button onClick={aiPolish} disabled={aiLoading}
              className="px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs py-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700">
              {aiLoading ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-amber-300" />}
              Polish with AI
            </button>
          </div>
        </div>

        {/* RIGHT — output */}
        <div className="lg:col-span-5 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-5 lg:pt-0 lg:pl-6 space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">Generated prompt</span>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 min-h-32 leading-relaxed select-all whitespace-pre-wrap break-words">
            {output || <span className="text-slate-600 italic">Pick a model and subject, then Build. The prompt is assembled in that model's dialect.</span>}
          </div>

          {output && (
            <button onClick={copy}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${copied ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400" : "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white"}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy prompt</>}
            </button>
          )}

          {aiNote && <p className="text-[10px] text-amber-400/80 leading-normal">{aiNote}</p>}

          {explain.length > 0 && (
            <div className="bg-slate-950/40 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Why this works
              </span>
              <ul className="space-y-1.5">
                {explain.map((e, i) => (
                  <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-indigo-500 shrink-0 mt-0.5">›</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
