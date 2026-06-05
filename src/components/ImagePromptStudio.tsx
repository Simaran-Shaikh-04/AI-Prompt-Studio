import { useState } from "react";
import { 
  Camera, 
  Layers, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Sliders, 
  Sparkles, 
  Copy, 
  Check, 
  Image as ImageIcon,
  ArrowRight,
  Info
} from "lucide-react";

interface ImagePreset {
  id: string;
  name: string;
  icon: any;
  ratioText: string;
  dimensions: string;
  midjourneyRatio: string;
  description: string;
  placeholderText: string;
  styles: string[];
}

const PRESETS: ImagePreset[] = [
  {
    id: "linkedin-avatar",
    name: "Professional LinkedIn Avatar",
    icon: Camera,
    ratioText: "1:1 Square",
    dimensions: "400 x 400 px",
    midjourneyRatio: "1:1",
    description: "Create a pristine, high-trust headshot styled for enterprise visibility and networking.",
    placeholderText: "e.g., A frontend software engineer with a confident, warm smile, wearing smart casual navy blue blazer...",
    styles: ["Studio Softbox Lighting", "Cinematic Corporate Bokeh", "Minimalist Textured Solid Slate Gray", "Natural Golden Hour Outdoor"]
  },
  {
    id: "linkedin-banner",
    name: "Enterprise LinkedIn Banner",
    icon: Linkedin,
    ratioText: "4:1 Landscape",
    dimensions: "1584 x 396 px",
    midjourneyRatio: "1584:396",
    description: "Generate beautiful background art highlighting your primary technical domain and skillset.",
    placeholderText: "e.g., Clean abstract futuristic node grid network connecting computer circuits and dark slate data modules...",
    styles: ["Minimal Tech Blueprint", "Isometric Bento UI Mockup", "Abstract Flowing Fluid Dynamics", "Dark Clean Neomorphic Geometric Pattern"]
  },
  {
    id: "youtube-thumbnail",
    name: "Click-Optimized YouTube Thumbnail",
    icon: Youtube,
    ratioText: "16:9 Widescreen",
    dimensions: "1280 x 720 px",
    midjourneyRatio: "16:9",
    description: "Draft striking visual compositions featuring high-contrast subject matter and background highlights.",
    placeholderText: "e.g., A developers workspace with colorful neon backlighting, an empty glowing IDE shell screen on the desk...",
    styles: ["High-Contrast Volumetric Lighting", "Vibrant Cyberpunk Epic Accent", "Clean Minimalist 3D Clay Render", "Photorealistic Depth of Field"]
  },
  {
    id: "instagram-post",
    name: "Aesthetic Instagram Layout",
    icon: Instagram,
    ratioText: "1:1 Square or 4:5",
    dimensions: "1080 x 1080 px",
    midjourneyRatio: "1:1",
    description: "Craft artistic elements customized with balanced visual assets, soft color grades, and rich negative space.",
    placeholderText: "e.g., A student coffee setup with a stylish open notebook on the table, warm sunlight casting minimal leaves shadows...",
    styles: ["Aesthetic Film Grain Look", "Lofi Warm Soft Warm Lighting", "Sleek Conceptual Neo-Brutalism", "Earthy Warm Pastel Palette Canvas"]
  }
];

const ENGINES = [
  { id: "midjourney", name: "Midjourney v6", tag: "--v 6.0 --style raw" },
  { id: "firefly", name: "Adobe Firefly", tag: "[Maximize Realism, High Fidelity Output]" },
  { id: "imagen", name: "Google Imagen (Nano / Ultra)", tag: "aspect-ratio: 1:1, photorealistic output" }
];

export default function ImagePromptStudio() {
  const [selectedPresetId, setSelectedPresetId] = useState("linkedin-avatar");
  const [selectedEngine, setSelectedEngine] = useState("midjourney");
  const [subjectText, setSubjectText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [customVibe, setCustomVibe] = useState("Sharp photorealistic details, high-fidelity render, 8k resolution, shot on Hasselblad lens, professional color grading.");
  const [negativePrompt, setNegativePrompt] = useState("unnatural skin textures, low quality, cartoon, digital drawing, logo, watermark, deformed limbs, text banners");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleGenerate = () => {
    if (!subjectText.trim()) {
      alert("Please describe the subject first!");
      return;
    }

    const styleSegment = selectedStyle ? `${selectedStyle} style` : "";
    const engineConfig = ENGINES.find(e => e.id === selectedEngine) || ENGINES[0];
    
    let constructed = "";
    
    if (selectedEngine === "midjourney") {
      constructed = `${subjectText}. ${styleSegment ? `${styleSegment}, ` : ""}${customVibe} --ar ${activePreset.midjourneyRatio} ${engineConfig.tag}`;
    } else if (selectedEngine === "firefly") {
      constructed = `[Adobe Firefly Prompt] ${subjectText}. Style: ${styleSegment || "Photorealistic Professional"}. Qualifiers: ${customVibe}. Negative Elements: exclude [${negativePrompt}]. Target Resolution aspect ratio matching ${activePreset.ratioText}`;
    } else {
      constructed = `[Imagen Prompt] ${subjectText}. styled as ${styleSegment || "a premium commercial print"}. ${customVibe}. Aspect Ratio parameters: ${activePreset.ratioText}. Negative constraints: ${negativePrompt}`;
    }
    
    setGeneratedPrompt(constructed);
  };

  const handleQuickPresetSelect = (preset: ImagePreset) => {
    setSelectedPresetId(preset.id);
    setSelectedStyle(preset.styles[0]);
    setSubjectText("");
    setGeneratedPrompt("");
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6" id="image-prompt-studio">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            Image Prompt Builder
          </h2>
          <p className="text-xs text-slate-400">Generate high-fidelity, aspect-ratio calibrated parameters for Midjourney, Adobe Firefly, and Google Imagen.</p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800" id="image-engine-tabs">
          {ENGINES.map((engine) => (
            <button
              key={engine.id}
              onClick={() => {
                setSelectedEngine(engine.id);
                setGeneratedPrompt("");
              }}
              className={`text-[10px] font-mono font-medium px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                selectedEngine === engine.id
                  ? "bg-indigo-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {engine.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Presets and options (Left Columns) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Buttons Grid */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Select Aspect Ratio Category</label>
            <div className="grid grid-cols-2 gap-2" id="image-presets-grid">
              {PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleQuickPresetSelect(preset)}
                    className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-indigo-950/20 border-indigo-500 text-white"
                        : "bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold">{preset.name}</div>
                      <div className="text-[9px] font-mono text-slate-500 block">
                        {preset.ratioText} ({preset.dimensions})
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt inputs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Primary Subject Description
              </label>
              <span className="text-[10px] text-slate-500 font-mono italic">Avoid buzzwords, focus on composition</span>
            </div>
            <textarea
              value={subjectText}
              onChange={(e) => {
                setSubjectText(e.target.value);
                setGeneratedPrompt("");
              }}
              placeholder={activePreset.placeholderText}
              className="w-full h-24 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none font-sans"
            />
          </div>

          {/* Quick Vibe Selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Vibe & Composition Presets</label>
            <div className="flex flex-wrap gap-1.5" id="vibe-presets-container">
              {activePreset.styles.map((style, i) => {
                const isStyleSelected = selectedStyle === style;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedStyle(style);
                      setGeneratedPrompt("");
                    }}
                    className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                      isStyleSelected
                        ? "bg-indigo-600 border-indigo-500 text-white font-semibold"
                        : "bg-slate-950/80 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced prompt adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Renderer Modifiers</label>
              <input
                type="text"
                value={customVibe}
                onChange={(e) => {
                  setCustomVibe(e.target.value);
                  setGeneratedPrompt("");
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Negative Elements</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => {
                  setNegativePrompt(e.target.value);
                  setGeneratedPrompt("");
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!subjectText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Build Optimized Prompt for {ENGINES.find(e => e.id === selectedEngine)?.name}
          </button>
        </div>

        {/* Generated output block (Right Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-5 lg:pt-0 lg:pl-6">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Render Engine Output
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copy and paste the string below directly into the generation tool box. Configured with standard aspect tags and positive markers.
              </p>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-300 min-h-28 leading-normal relative select-all break-words">
                {generatedPrompt ? (
                  generatedPrompt
                ) : (
                  <span className="text-slate-600 italic">Configure preset tags and click build tool button above to compile.</span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {generatedPrompt && (
                <div className="flex items-center gap-2">
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
                        Copied parameters!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Engine Prompt
                      </>
                    )
                  }
                  </button>
                </div>
              )}

              <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-lg flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-400 uppercase block mb-0.5">Ratio Check:</span>
                  LinkedIn Avatar needs a square 1:1 image. LinkedIn Banners require a strict 4:1 width-to-height crop to prevent unwanted scaling. YouTube structures need widescreen 16:9 thumbnails.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
