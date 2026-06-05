import { useState } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  ArrowRight,
  Tv,
  Camera,
  Play,
  Share2,
  Cpu,
  BadgeAlert,
  Sliders,
  Copy,
  Plus
} from "lucide-react";

interface AlternativeApp {
  name: string;
  category: string;
  url: string;
  badge: string;
  safety: string;
  bestFor: string;
  tagline: string;
}

const FREE_TRUSTED_AI_APPS: AlternativeApp[] = [
  {
    name: "Claude AI (Free Tier)",
    category: "Coding & Creative Reasoning",
    url: "https://claude.ai",
    badge: "100% Safe & Trusted",
    safety: "No unsolicited data selling. Premium tier available, but standard free tier gives access to the world-class Claude 3.5 Sonnet.",
    bestFor: "Logical programming, code refactoring, complex academic summaries, and writing.",
    tagline: "The gold standard for software generation and text refiners."
  },
  {
    name: "Google Gemini Free",
    category: "Real-time Search & Multi-modal",
    url: "https://gemini.google.com",
    badge: "High-Speed Access",
    safety: "Owned by Google. Fully integrated with YouTube search, Google Docs, Drive, and Sheets.",
    bestFor: "Real-time news lookups, weather updates, summarizing long YouTube transcripts, and quick translations.",
    tagline: "Direct connection to Google's live knowledge base for grounded, real-time replies."
  },
  {
    name: "Hugging Face Chat",
    category: "Open-Source Models",
    url: "https://huggingface.co/chat",
    badge: "100% Privacy Focused",
    safety: "No login or email forced. Run state-of-the-art open source community models with maximum user data privacy.",
    bestFor: "Running open-source models like Llama-3, DeepSeek-Coder, and Command R+ without restriction.",
    tagline: "Uncensored, community-pioneered open source LLM playground with zero tracking."
  },
  {
    name: "NotebookLM by Google",
    category: "Source-Grounded Notebook",
    url: "https://notebooklm.google",
    badge: "Free Google Scholar Tool",
    safety: "Secure virtual workspace. Google doesn't train publicly on your private uploaded research PDFs.",
    bestFor: "Converting dense books, notes, and records into a simulated dual-host audio podcast overview and study flashcards.",
    tagline: "Instantly translate thousands of text pages into smart notes and audio dialogs."
  },
  {
    name: "Quora Poe Free",
    category: "Multi-Model Playground",
    url: "https://poe.com",
    badge: "All-in-One Hub",
    safety: "Operated by Quora. Includes sandboxed free tokens to speak with multiple developer tools in one tab.",
    bestFor: "Switching rapidly between Claude, ChatGPT, Llama, and Gemini models to compare raw differences.",
    tagline: "A unified terminal dashboard hosting hundreds of custom visual and text AI configurations."
  },
  {
    name: "ChatGPT Free",
    category: "General Intelligence & Memory",
    url: "https://chatgpt.com",
    badge: "Ubiquitous & Versatile",
    safety: "Developed by OpenAI. Safe sandbox with custom memory toggle to save user preference state over chats.",
    bestFor: "Quick day-to-day brainstorming, rapid text editing, structured CSV tabular conversions, and general knowledge Q&As.",
    tagline: "The world's most popular chatbot, equipped with basic custom GPT plugins and analysis."
  },
  {
    name: "Adobe Firefly (Free Credits)",
    category: "Graphic Design & Painting",
    url: "https://firefly.adobe.com",
    badge: "Copyright Protected",
    safety: "Commercial-safe generators. Only trained on copyright-free Adobe Stock assets to prevent legal copyright issues.",
    bestFor: "Generating beautiful business vector assets, smart generative fills, and texture-perfect LinkedIn banners.",
    tagline: "Enterprise-grade high-fidelity digital art and UI graphics that are legally safe."
  },
  {
    name: "Microsoft Copilot Free",
    category: "Free Premium GPT-4 Access",
    url: "https://copilot.microsoft.com",
    badge: "GPT-4 & DALL-E 3 Integrated",
    safety: "Corporate grade security protocols built directly into Microsoft Edge and Windows ecosystems.",
    bestFor: "Free access to GPT-4's logical depth and OpenAI's DALL-E 3 image generation engine without paying a monthly fee.",
    tagline: "Your daily AI companion for web search, document drafting, and smart photorealistic imagery."
  }
];

export default function UserManualAndAlternatives() {
  const [expandedSection, setExpandedSection] = useState<string | null>("getting-started");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [progressChecklist, setProgressChecklist] = useState<Record<string, boolean>>({
    "step1-read-manual": true,
    "step2-architect-compile": false,
    "step3-image-banner": false,
    "step4-podcast-generate": false,
    "step5-memory-booster": false
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggleCheck = (id: string) => {
    setProgressChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredApps = FREE_TRUSTED_AI_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                          app.bestFor.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          app.tagline.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || app.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const categories = ["all", "Coding", "Search", "Open-Source", "Scholar", "Graphic", "Premium"];

  return (
    <div className="space-y-8" id="manual-alternatives-hub">
      {/* HEADER SECTION WITH FLOATING BADGE */}
      <div className="bg-slate-900/40 backdrop-blur border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden" id="manual-welcome-banner">
        <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Interactive Welcome & Alternative Station
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white">
              📚 Beginner's User Manual & Safe AI alternatives Hub
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Welcome! If you are a complete beginner, this documentation explains exactly how to unlock the hidden capabilities of this platform. Explore step-by-step interactive workflows, safety metrics, and a hand-curated library of trusted free AI tools.
            </p>
          </div>

          {/* PULSING QUICK LINK BADGE */}
          <a 
            href="#safe-alternatives-hub" 
            className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold p-4.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-emerald-950/40 text-center shrink-0 w-full sm:w-auto cursor-pointer animate-none hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-400 rounded-full blur animate-ping opacity-75" />
              <ShieldCheck className="w-4 h-4 text-white relative" />
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-emerald-200">Alternative Hub</span>
              <span className="font-semibold block text-left">Free & Safe AI Apps</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-200" />
          </a>
        </div>
      </div>

      {/* TWO PANEL INTERACTIVE COMPONENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL 1: BEGINNER USER MANUAL (LEFT 7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Interactive Beginner Manual</h3>
                <p className="text-[10px] text-slate-500">A simplified playbook outlining 'What to Do' and 'How to Do It' on each screen.</p>
              </div>
            </div>

            {/* ACCORDION WRAPPERS */}
            <div className="space-y-3" id="manual-accordion-container">
              
              {/* ACCORDION 1: GETTING STARTED */}
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40">
                <button 
                  onClick={() => toggleSection("getting-started")}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-xs text-slate-200 hover:bg-slate-900/40 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-1.5 py-0.5 rounded text-[10px]">01</span>
                    🚀 Phase 1: Custom Claude Agent Architect (Initial Scoping)
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedSection === "getting-started" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "getting-started" && (
                  <div className="p-4.5 border-t border-slate-850 text-[11px] text-slate-400 space-y-3 leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-indigo-400">What to Do:</span>
                      Explain your custom web app idea or technical homework scope inside the "Primary Application Idea" box on the first tab.
                    </div>
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-indigo-400">How to Do:</span>
                      1. Type or paste your rough brainstorm, e.g., <span className="text-slate-300 font-mono">"Make a responsive calorie counter with visual summary charts"</span>.<br />
                      2. Choose an optimization slider preset (e.g. <span className="text-slate-300">"Token-Saving Fast Mode"</span> to prevent exceeding free boundaries).<br />
                      3. Click <span className="text-indigo-400 font-semibold uppercase">"Analyze & Generate Scoping Questions"</span>.<br />
                      4. Answer the subsequent step-by-step wizard questions so the system understands database needs, safety flags, and visual metrics.<br />
                      5. Copy the finalized Compiled Prompt Block and paste it directly as the first prompt inside Claude AI Web or ChatGPT!
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 2: MULTI-RATIO IMAGES */}
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40">
                <button 
                  onClick={() => toggleSection("images-howto")}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-xs text-slate-200 hover:bg-slate-900/40 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded text-[10px]">02</span>
                    💻 Phase 2: Design Assets & Image Studio (Adobe / Nano)
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedSection === "images-howto" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "images-howto" && (
                  <div className="p-4.5 border-t border-slate-850 text-[11px] text-slate-400 space-y-3 leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-emerald-400">What to Do:</span>
                      Formulate high-fidelity image prompts for professional networks without guessing complex parameters. Build proper ratios for LinkedIn Profile pics, Banners, and Youtube assets.
                    </div>
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-emerald-400">How to Do:</span>
                      1. Navigate to the **Image Studio** tab on the workspace navigation bar.<br />
                      2. Select your category: <span className="text-slate-300">"Professional LinkedIn Avatar (1:1)"</span> or <span className="text-slate-300">"Enterprise LinkedIn Banner (4:1 width ratio)"</span>.<br />
                      3. Choose your compilation target engine: Midjourney, Adobe Firefly, or Google Imagen Nano.<br />
                      4. Type a normal sentence describing the subject. Select fine-art styling presets (e.g. <span className="text-slate-300">"Cinematic Bokeh"</span>, <span className="text-slate-300">"Neomorphic Blueprints"</span>).<br />
                      5. Click <span className="text-slate-300">"Build Optimized Prompt"</span>. Copy the parameters directly and slide them into your image renderer app of choice!
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 3: NOTEBOOK_LM CODES */}
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40">
                <button 
                  onClick={() => toggleSection("notebooklm-howto")}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-xs text-slate-200 hover:bg-slate-900/40 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-1.5 py-0.5 rounded text-[10px]">03</span>
                    🎓 Phase 3: NotebookLM Scholarly Script Formulation
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedSection === "notebooklm-howto" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "notebooklm-howto" && (
                  <div className="p-4.5 border-t border-slate-850 text-[11px] text-slate-400 space-y-3 leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-cyan-400">What to Do:</span>
                      Formulate high-engagement dialog transcripts, active-recall PPT structures, or video tutorials based on lecture themes for students.
                    </div>
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-cyan-400">How to Do:</span>
                      1. Open **NotebookLM Scholar Suite** tab.<br />
                      2. Pick your core learning objective:<br />
                         &nbsp;&nbsp;• <span className="text-slate-300">1. AI Presentation Slides & PPT Outline</span><br />
                         &nbsp;&nbsp;• <span className="text-slate-300">2. Student Video Narratives & Video Scripts</span><br />
                         &nbsp;&nbsp;• <span className="text-slate-300">3. NotebookLM Dialogues (Engaging Audio Overviews)</span><br />
                      3. Input your lecture topic (e.g., <span className="text-slate-300">"Photosynthesis and Cellular Respiration"</span>) and student target demographic.<br />
                      4. Click <span className="text-cyan-400 font-semibold upper bg-[rgba(34,211,238,0.05)] px-1 px-y rounded">"Build Multi-modal Prompt Directive"</span>, copy, and send!
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 4: CLAUDE MEMORY BUFFER */}
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/40">
                <button 
                  onClick={() => toggleSection("memory-howto")}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-xs text-slate-200 hover:bg-slate-900/40 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 bg-rose-950/40 border border-rose-900/30 px-1.5 py-0.5 rounded text-[10px]">04</span>
                    🛡️ Phase 4: Thread Preservation & Memory Boosters
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedSection === "memory-howto" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "memory-howto" && (
                  <div className="p-4.5 border-t border-slate-850 text-[11px] text-slate-400 space-y-3 leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-rose-400">What to Do:</span>
                      Prevent ChatGPT or Claude from getting confused, slow, and repeating bugs once your chat gets over 10-15 messages.
                    </div>
                    <div>
                      <span className="font-bold text-slate-300 block mb-1 uppercase text-[9px] text-rose-400">How to Do:</span>
                      1. Open **Memory Guard Station** tab.<br />
                      2. Slide the turn count slider to reflect your active chat history depth.<br />
                      3. Read the Diagnostic Report. If warning flags are active, click <span className="text-rose-400 font-semibold">"Copy Checkpoint Booster"</span>.<br />
                      4. Send this short XML booster command into your ongoing AI conversation to instantly compress memory state and focus the engine!
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* CHECKLIST TRACKER FOR BEGINNERS */}
            <div className="p-4.5 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Your Beginner Learning Progress Checklist
              </span>
              <p className="text-[11px] text-slate-400">Complete these step-by-step trial milestones to master AI model prompts:</p>
              
              <div className="space-y-2.5 pt-1.5" id="manual-checklist-container">
                <button 
                  onClick={() => handleToggleCheck("step1-read-manual")}
                  className="flex items-start gap-2.5 text-left w-full text-xs cursor-pointer group"
                >
                  <div className={`p-0.5 rounded border ${progressChecklist["step1-read-manual"] ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800 bg-slate-950"}`}>
                    <Check className={`w-3 h-3 ${progressChecklist["step1-read-manual"] ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className={`text-[11px] ${progressChecklist["step1-read-manual"] ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium group-hover:text-white"}`}>
                    Read the beginner user manual instructions
                  </span>
                </button>

                <button 
                  onClick={() => handleToggleCheck("step2-architect-compile")}
                  className="flex items-start gap-2.5 text-left w-full text-xs cursor-pointer group"
                >
                  <div className={`p-0.5 rounded border ${progressChecklist["step2-architect-compile"] ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800 bg-slate-950"}`}>
                    <Check className={`w-3 h-3 ${progressChecklist["step2-architect-compile"] ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className={`text-[11px] ${progressChecklist["step2-architect-compile"] ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium group-hover:text-white"}`}>
                    Input an idea inside "Claude Agent Architect" & compile a prompt
                  </span>
                </button>

                <button 
                  onClick={() => handleToggleCheck("step3-image-banner")}
                  className="flex items-start gap-2.5 text-left w-full text-xs cursor-pointer group"
                >
                  <div className={`p-0.5 rounded border ${progressChecklist["step3-image-banner"] ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800 bg-slate-950"}`}>
                    <Check className={`w-3 h-3 ${progressChecklist["step3-image-banner"] ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className={`text-[11px] ${progressChecklist["step3-image-banner"] ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium group-hover:text-white"}`}>
                    Compile a professional LinkedIn banner prompt in the Image Studio
                  </span>
                </button>

                <button 
                  onClick={() => handleToggleCheck("step4-podcast-generate")}
                  className="flex items-start gap-2.5 text-left w-full text-xs cursor-pointer group"
                >
                  <div className={`p-0.5 rounded border ${progressChecklist["step4-podcast-generate"] ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800 bg-slate-950"}`}>
                    <Check className={`w-3 h-3 ${progressChecklist["step4-podcast-generate"] ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className={`text-[11px] ${progressChecklist["step4-podcast-generate"] ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium group-hover:text-white"}`}>
                    Formulate a podcast host script using NotebookLM Scholar Suite
                  </span>
                </button>

                <button 
                  onClick={() => handleToggleCheck("step5-memory-booster")}
                  className="flex items-start gap-2.5 text-left w-full text-xs cursor-pointer group"
                >
                  <div className={`p-0.5 rounded border ${progressChecklist["step5-memory-booster"] ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-800 bg-slate-950"}`}>
                    <Check className={`w-3 h-3 ${progressChecklist["step5-memory-booster"] ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className={`text-[11px] ${progressChecklist["step5-memory-booster"] ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium group-hover:text-white"}`}>
                    Trigger a memory guard booster command to preserve clean tokens
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 2: SAFE & FREE AI ALTERNATIVES (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-6" id="safe-alternatives-hub">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-emerald-950/40 border border-emerald-900/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Safe & Free AI Alternatives</h3>
                  <p className="text-[10px] text-slate-500">Global, safe platforms with excellent free tier support.</p>
                </div>
              </div>
              <span className="text-[8px] bg-emerald-950 text-emerald-400 px-2 py-0.5 border border-emerald-900/40 rounded-full font-mono font-bold uppercase tracking-wider">Verified App List</span>
            </div>

            {/* SEARCH AND CATEGORY FILTER */}
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search apps (e.g. Claude, Hugging Face, slides)..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-200 pl-8 pr-3 py-2 border border-slate-850 rounded-lg placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  id="search-alternative-apps"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-600">⌨</span>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-1" id="cat-filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[9px] px-2 py-1 rounded transition cursor-pointer font-bold ${
                      (cat === "all" && selectedCategory === "all") || (cat !== "all" && selectedCategory.includes(cat))
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-950 text-slate-450 hover:bg-slate-900"
                    }`}
                  >
                    {cat === "all" ? "🌐 Show All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ALTERNATIVE APPS LIST */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1" id="alternatives-scrolling-container">
              {filteredApps.length > 0 ? (
                filteredApps.map((app, index) => (
                  <div 
                    key={index} 
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 hover:border-slate-800 transition duration-150 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        {app.name}
                      </span>
                      
                      <a 
                        href={app.url} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        Launch
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-[10px] text-indigo-300/90 italic font-medium leading-tight">
                      "{app.tagline}"
                    </p>

                    <p className="text-[11px] text-slate-400 leading-normal">
                      <span className="font-semibold text-slate-350">Best used for:</span> {app.bestFor}
                    </p>

                    {/* Safety specifications banner */}
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850/50 flex gap-2 items-start text-[9px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Trust & Safety:</span>
                        {app.safety}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-600 italic">
                  No verified alternative apps matched your current filters.
                </div>
              )}
            </div>

            {/* DISCLAIMER CARD */}
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex gap-3 text-[10px] text-slate-500 leading-normal">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-400 uppercase block mb-1">Beginner Pro-Tip:</span>
                Always prefer models that support explicit Custom Instructions or System Profiles. By saving target specifications to your account system configurations, you guarantee precise development outcomes without eating up tokens on every turn.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
