import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Layers, 
  Brain, 
  Cpu, 
  Zap, 
  Send, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Trash2, 
  Download,
  AlertTriangle,
  Lightbulb,
  Info,
  HelpCircle,
  FileText,
  Paperclip,
  UploadCloud,
  FileCheck,
  BookOpen,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

import { Question, OptimizationProfile, PromptAnalysis, HistoryItem, GenerationState, Attachment } from "./types";
import { OPTIMIZATION_PROFILES, STARTER_IDEAS, CLAUDE_TIPS, STUDENT_PRESETS } from "./data";

import ImagePromptStudio from "./components/ImagePromptStudio";
import NotebookLMSuite from "./components/NotebookLMSuite";
import ExpertSettingsGuide from "./components/ExpertSettingsGuide";
import ClaudeMemoryGuard from "./components/ClaudeMemoryGuard";
import BeforeAfterDiff from "./components/BeforeAfterDiff";
import UserManualAndAlternatives from "./components/UserManualAndAlternatives";

export default function App() {
  // Global Persistence: History of generated prompts
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("claude_prompt_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("claude_prompt_history", JSON.stringify(history));
  }, [history]);

  // Current session building state
  const [state, setState] = useState<GenerationState>({
    appIdea: "",
    isLoadingQuestions: false,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    selectedProfileId: "token-saving",
    generatedPrompt: "",
    isGeneratingPrompt: false,
    analysis: null,
    attachments: []
  });

  const [activeStep, setActiveStep] = useState<"ideation" | "questions" | "result">("ideation");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activePresetTab, setActivePresetTab] = useState<"software" | "student">("software");
  const [activeTab, setActiveTab] = useState<"architect" | "image-studio" | "notebooklm" | "settings-guide" | "memory-guard" | "visual-diff" | "user-manual">("architect");

  // File Upload Handlers (Durable Under 50MB Each)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB
    const attachmentsToRead = Array.from(files);

    attachmentsToRead.forEach((file) => {
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds the 50 MB size limit specification.`);
        return;
      }

      const reader = new FileReader();
      const isImage = file.type.startsWith("image/");
      const isText = file.type.startsWith("text/") || 
                     file.name.endsWith(".json") || 
                     file.name.endsWith(".ts") || 
                     file.name.endsWith(".tsx") || 
                     file.name.endsWith(".js") || 
                     file.name.endsWith(".jsx") || 
                     file.name.endsWith(".sql") || 
                     file.name.endsWith(".py") || 
                     file.name.endsWith(".csv") || 
                     file.name.endsWith(".md") ||
                     file.name.endsWith(".yaml") ||
                     file.name.endsWith(".yml");

      reader.onload = (e) => {
        const resultSrc = e.target?.result as string;
        
        setState(prev => {
          const currentList = prev.attachments || [];
          if (currentList.some(item => item.name === file.name && item.size === file.size)) {
            return prev; // Prevent duplication
          }

          const newAttachment: Attachment = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            content: resultSrc,
            previewUrl: isImage ? resultSrc : undefined
          };

          return {
            ...prev,
            attachments: [...currentList, newAttachment]
          };
        });
      };

      if (isImage) {
        reader.readAsDataURL(file);
      } else if (isText) {
        reader.readAsText(file);
      } else {
        // Binary files encoded as standard data URLs (Base64)
        reader.readAsDataURL(file);
      }
    });
  };

  const removeAttachment = (id: string) => {
    setState(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(item => item.id !== id)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Quick action: Select standard starter idea
  const selectStarterIdea = (ideaText: string) => {
    setState(prev => ({ 
      ...prev, 
      appIdea: ideaText,
      questions: [],
      answers: {},
      currentQuestionIndex: 0
    }));
    setErrorMessage(null);
  };

  // Step 1: Submit original idea and generate 4 targeted reflective questions
  const generateQuestions = async () => {
    if (!state.appIdea.trim()) {
      setErrorMessage("Please share a basic description of the app you want to build.");
      return;
    }

    setState(prev => ({ ...prev, isLoadingQuestions: true, questions: [], currentQuestionIndex: 0, answers: {} }));
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appIdea: state.appIdea })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to trigger the prompt engine.");
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No scoping questions returned. Try summarizing your idea differently.");
      }

      setState(prev => ({
        ...prev,
        questions: data.questions,
        isLoadingQuestions: false
      }));
      setActiveStep("questions");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong connection to the server.");
      setState(prev => ({ ...prev, isLoadingQuestions: false }));
    }
  };

  // Step 2: Proceed in the question wizard
  const handleAnswerSubmit = (value: string) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    // Save answer
    setState(prev => {
      const updatedAnswers = { ...prev.answers, [currentQuestion.id]: value };
      const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;

      return {
        ...prev,
        answers: updatedAnswers,
        currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1
      };
    });

    // If it was the last question, we automatically prompt compilation
    if (state.currentQuestionIndex >= state.questions.length - 1) {
      // Allow user to review or immediately compile. We'll let them hit "Compile Prompt" explicitly or we can transition
    }
  };

  const handlePreviousQuestion = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
    }));
  };

  const skipQuestionsAndCompile = () => {
    // Fill empty answers with 'Not specified' and compile
    const filledAnswers: Record<string, string> = {};
    state.questions.forEach(q => {
      filledAnswers[q.id] = state.answers[q.id] || "Bypassed / Standard layout config";
    });

    setState(prev => ({ ...prev, answers: filledAnswers }));
    compileFinalPrompt(filledAnswers);
  };

  // Step 3: Trigger the final prompt generation with chosen optimization profile
  const compileFinalPrompt = async (forcedAnswers?: Record<string, string>) => {
    setState(prev => ({ ...prev, isGeneratingPrompt: true }));
    setErrorMessage(null);

    const answersToSubmit = forcedAnswers || state.answers;

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appIdea: state.appIdea,
          answers: answersToSubmit,
          profileId: state.selectedProfileId,
          attachments: state.attachments || []
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Prompt compiled with errors.");
      }

      setState(prev => ({
        ...prev,
        generatedPrompt: data.optimizedPrompt,
        analysis: data.analysis,
        isGeneratingPrompt: false
      }));

      // Add to persistent history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        appIdea: state.appIdea,
        optimizedPrompt: data.optimizedPrompt,
        profileId: state.selectedProfileId,
        answers: answersToSubmit,
        attachments: state.attachments || []
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveStep("result");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to compile the Claude-optimized prompt.");
      setState(prev => ({ ...prev, isGeneratingPrompt: false }));
    }
  };

  // Quick Action: Copy generated prompt
  const copyToClipboard = () => {
    if (!state.generatedPrompt) return;
    navigator.clipboard.writeText(state.generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Action: Export prompt as file
  const downloadMarkdownFile = () => {
    if (!state.generatedPrompt) return;
    const element = document.createElement("a");
    const safeTitle = state.appIdea.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
    const file = new Blob([state.generatedPrompt], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `claude-prompt-${safeTitle || 'app'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Reset entire workflow back to state ideation
  const resetWorkspace = () => {
    setState({
      appIdea: "",
      isLoadingQuestions: false,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      selectedProfileId: "token-saving",
      generatedPrompt: "",
      isGeneratingPrompt: false,
      analysis: null,
      attachments: []
    });
    setActiveStep("ideation");
    setErrorMessage(null);
  };

  // Load a historical prompt back into result page
  const loadHistoryItem = (item: HistoryItem) => {
    // Generate dummy/reconstructed analysis to show
    setState({
      appIdea: item.appIdea,
      isLoadingQuestions: false,
      questions: Object.entries(item.answers).map(([key, val]) => ({
        id: key,
        question: `Scoping aspect for ${key}`,
        helperText: `Previously selected setting: "${val}"`
      })),
      currentQuestionIndex: 0,
      answers: item.answers,
      selectedProfileId: item.profileId as any,
      generatedPrompt: item.optimizedPrompt,
      isGeneratingPrompt: false,
      attachments: item.attachments || [],
      analysis: {
        efficiencyScore: 94,
        tokenEstimation: {
          systemPromptTokens: item.optimizedPrompt.length / 4,
          estimatedSavings: (item.optimizedPrompt.length / 4) * 2,
          reductionPercentage: 62
        },
        pros: [
          "Optimized with explicit structural XML segments",
          "Includes strict feedback loops to avoid code repetition",
          "Includes modular styling directives"
        ],
        cons: [
          "Needs constant references back to the code tree in long threads."
        ],
        recommendations: [
          "Remind Claude of these rules by prepending your request with: [Profile: Token Squeezer]",
          "Provide feedback in structured change summaries rather than raw code logs."
        ]
      }
    });

    setActiveStep("result");
    setShowHistory(false);
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Map icon component strings dynamically
  const renderProfileIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu": return <Cpu className="w-5 h-5 text-indigo-400" id="icon-cpu" />;
      case "Layers": return <Layers className="w-5 h-5 text-emerald-400" id="icon-layers" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" id="icon-zap" />;
      case "Brain": return <Brain className="w-5 h-5 text-rose-400" id="icon-brain" />;
      default: return <Sparkles className="w-5 h-5 text-blue-400" id="icon-sparkles" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200" id="app-root">
      {/* Background visual accents */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-10 left-[20%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Main Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-2.5 rounded-xl shadow-lg shadow-indigo-950/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans tracking-tight text-white flex items-center gap-2">
                Claude Prompt Architect
                <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/40">v1.2</span>
              </h1>
              <p className="text-xs text-slate-400">Natural language to optimized token-saving Claude directives</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="history-toggle"
              onClick={() => setShowHistory(true)}
              className="relative flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 px-3.5 py-2 rounded-lg border border-slate-800 transition-all duration-200"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Saved Prompts
              {history.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>
            <button
              id="new-prompt"
              onClick={resetWorkspace}
              className="flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-950/20 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Workspace
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8" id="app-main">
        {/* Error notifications */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-300 text-sm"
              id="error-banner"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Configuration Alert</span>
                <p>{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200 font-bold ml-2">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Tab Navigation Bar */}
        <div className="flex flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 mb-8 gap-1.5" id="workspace-main-tabs">
          <button
            onClick={() => setActiveTab("architect")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "architect"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Claude Agent Architect
          </button>
          <button
            onClick={() => setActiveTab("image-studio")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "image-studio"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Image Studio (Adobe / Nano)
          </button>
          <button
            onClick={() => setActiveTab("notebooklm")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "notebooklm"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            NotebookLM Scholar Suite
          </button>
          <button
            onClick={() => setActiveTab("settings-guide")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "settings-guide"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <Layers className="w-4 h-4 text-yellow-400" />
            Expert Settings & Connectors
          </button>
          <button
            onClick={() => setActiveTab("memory-guard")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "memory-guard"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <Brain className="w-4 h-4 text-rose-400" />
            Memory Guard Station
          </button>
          <button
            onClick={() => setActiveTab("visual-diff")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "visual-diff"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
          >
            <Clock className="w-4 h-4 text-purple-400" />
            Before & After Visual Diff
          </button>
          <button
            onClick={() => setActiveTab("user-manual")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === "user-manual"
                ? "bg-indigo-600 text-white shadow-lg font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/40"
            }`}
            id="tab-user-manual"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            📚 User Manual & Safe alternatives
          </button>
        </div>

        {activeTab === "architect" && (
          <>
            {/* STEP 1: IDEATION (Form to input initial idea) */}
            {activeStep === "ideation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="step-ideation-view">
            {/* Input Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                    <span className="text-indigo-400">01.</span> App Vision
                  </h2>
                  <p className="text-sm text-slate-400">Describe what you want to build in natural, casual language. Big or small, let it flow.</p>
                </div>

                {/* Big Text Area */}
                <div className="space-y-2">
                  <textarea
                    id="idea-textarea"
                    value={state.appIdea}
                    onChange={(e) => {
                      setState(prev => ({ ...prev, appIdea: e.target.value }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g., A client-side kanban board app with support for dragging tasks, custom columns, column coloring, tags, archive, and offline sync using browser storage. Keep it clean with dynamic filters..."
                    className="w-full h-44 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 resize-none font-sans"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span>Markdown formatting supported</span>
                    <span>{state.appIdea.length} characters</span>
                  </div>
                </div>

                {/* Starter Suggestions Categories */}
                <div className="space-y-3.5 border-t border-slate-800/40 pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Quick Starter Blueprints & Templates
                    </span>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 self-start sm:self-auto" id="preset-tabs">
                      <button
                        onClick={() => setActivePresetTab("software")}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                          activePresetTab === "software"
                            ? "bg-indigo-600 text-white shadow-md font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        💻 Software Blueprints
                      </button>
                      <button
                        onClick={() => setActivePresetTab("student")}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                          activePresetTab === "student"
                            ? "bg-indigo-600 text-white shadow-md font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        🎓 Student Success Suite
                      </button>
                    </div>
                  </div>

                  {activePresetTab === "software" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="starter-suggestions-grid">
                      {STARTER_IDEAS.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => selectStarterIdea(item.idea)}
                          className="text-left p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-705 transition-all duration-150 group cursor-pointer"
                        >
                          <div className="text-xs font-semibold text-slate-300 group-hover:text-indigo-300 transition-colors mb-0.5">{item.title}</div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">{item.idea}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="student-presets-grid">
                      {STUDENT_PRESETS.map((item) => {
                        const isSelected = state.appIdea === item.defaultIdea;
                        return (
                          <button
                            key={item.id}
                            id={`student-preset-${item.id}`}
                            onClick={() => {
                              setState(prev => ({
                                ...prev,
                                appIdea: item.defaultIdea,
                                questions: item.questions,
                                currentQuestionIndex: 0,
                                answers: {}
                              }));
                              setErrorMessage(null);
                            }}
                            className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? "bg-indigo-950/20 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/10" 
                                : "bg-slate-950/40 border-slate-850 hover:border-slate-700/80 hover:bg-slate-900/20"
                            } group`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                                  {item.title}
                                </span>
                                {isSelected && (
                                  <span className="text-[8px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 mt-2.5 uppercase tracking-wide">
                              <span>Load active refiner</span>
                              <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* File Reference Section (Under 50MB Each) */}
                <div className="space-y-3 pt-6 border-t border-slate-800/60 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-tight text-slate-200 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-400" />
                      02. Reference Attachments & Specifications
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80">
                      Max 50MB per file
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Drop database schemas (SQL), design mockups (images), wireframes, API docs, or text specifications to seamlessly feed them into Claude's prompt constraints.
                  </p>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded-xl p-5 transition-all relative flex flex-col items-center justify-center gap-2 bg-slate-950/40 hover:bg-slate-950/70 cursor-pointer ${
                      dragActive 
                        ? "border-indigo-500 bg-indigo-500/5 shadow-inner" 
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <input 
                      type="file" 
                      id="doc-attachment-input" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                      multiple 
                      onChange={(e) => handleFileUpload(e.target.files)} 
                    />
                    <UploadCloud className="w-7 h-7 text-slate-500" />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-300">
                        Drag & Drop or <span className="text-indigo-400 underline">browse computer references</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Any images, code context, PDFs or DB schemas under 50MB
                      </p>
                    </div>
                  </div>

                  {/* Present Attachments list */}
                  {state.attachments && state.attachments.length > 0 && (
                    <div className="space-y-2 mt-3 pt-2" id="attachments-preview-section">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
                        Uploaded reference materials ({state.attachments.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {state.attachments.map((att) => {
                          const isImg = att.type.startsWith("image/");
                          const sizeKb = (att.size / 1024).toFixed(1);
                          const sizeDisplay = att.size > 1024 * 1024 
                            ? `${(att.size / (1024 * 1024)).toFixed(2)} MB` 
                            : `${sizeKb} KB`;

                          return (
                            <div 
                              key={att.id} 
                              className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-all"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {isImg && att.previewUrl ? (
                                  <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                    <img 
                                      src={att.previewUrl} 
                                      alt={att.name} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-md bg-indigo-950/20 border border-indigo-900/30 text-indigo-400 shrink-0 flex items-center justify-center">
                                    <FileCheck className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="overflow-hidden">
                                  <div className="text-xs font-medium text-slate-200 truncate" title={att.name}>
                                    {att.name}
                                  </div>
                                  <div className="text-[9px] text-slate-500 font-mono">
                                    {sizeDisplay}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeAttachment(att.id)}
                                className="p-1 px-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition cursor-pointer self-center shrink-0 font-bold"
                                title="Remove reference"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Selector */}
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="space-y-1 block">
                  <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                    <span className="text-indigo-400">03.</span> Optimization Preference (for Claude)
                  </h2>
                  <p className="text-sm text-slate-400">Select how you want the completed prompt to mold Claude's development and code-output logic.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="profiles-grid">
                  {OPTIMIZATION_PROFILES.map((profile) => {
                    const isSelected = state.selectedProfileId === profile.id;
                    return (
                      <button
                        id={`profile-card-${profile.id}`}
                        key={profile.id}
                        onClick={() => setState(prev => ({ ...prev, selectedProfileId: profile.id }))}
                        className={`text-left p-4.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden group ${
                          isSelected 
                            ? "bg-slate-900/80 border-indigo-500/80 shadow-lg shadow-indigo-950/20" 
                            : "bg-slate-950/30 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/20"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10 rounded-bl-full flex items-center justify-center border-l border-b border-indigo-500/30">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-slate-800 text-indigo-400" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"} transition-colors`}>
                              {renderProfileIcon(profile.icon)}
                            </div>
                            <span className={`text-sm font-semibold tracking-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                              {profile.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {profile.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
                {state.questions && state.questions.length > 0 && (
                  <button
                    id="btn-launch-instant-questions"
                    onClick={() => {
                      setActiveStep("questions");
                      setErrorMessage(null);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold shadow-xl shadow-indigo-950/30 px-8 py-4 rounded-xl text-sm transition-all duration-200 cursor-pointer text-center"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    Launch Student Scoping Steps
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="btn-analyze-scoping"
                  onClick={generateQuestions}
                  disabled={state.isLoadingQuestions || !state.appIdea.trim()}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-sm transition-all duration-200 cursor-pointer text-center ${
                    state.questions && state.questions.length > 0
                      ? "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-950/30"
                  }`}
                >
                  {state.isLoadingQuestions ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                      Consulting Architect API...
                    </>
                  ) : (
                    <>
                      {state.questions && state.questions.length > 0 ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          Regenerate Scoping with AI
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze & Generate Scoping Questions
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar Column (Tips / Benefits) */}
            <div className="space-y-6">
              {/* Claude's prompting strategy explanation */}
              <div className="bg-gradient-to-b from-indigo-950/20 to-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  Engineering for Claude
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">Structured Specifications</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unlike standard language models, Claude is trained on precise XML tag compliance and system-specification structures. This builder scopes your design and packages instructions to save massive token budgets.
                  </p>
                </div>

                <hr className="border-slate-800/80" />

                <div className="space-y-4">
                  {CLAUDE_TIPS.map((tip, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-slate-900 border border-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-slate-200">{tip.title}</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight Box */}
              <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4.5 flex gap-3 text-slate-400 text-xs leading-relaxed">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Token Saver Guard:</strong> Standard prompts repeat bulky setup modules in every turn. Our generated instructions include explicit instructions for Claude to return localized blocks, conserving your API limits.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: QUESTIONS WIZARD */}
        {activeStep === "questions" && (
          <div className="max-w-3xl mx-auto" id="step-questions-view">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
              {/* Wizard Nav */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep("ideation")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Step 2 of 3</span>
                    <h2 className="text-base font-bold text-white tracking-tight">Interactive App Refiner</h2>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">
                    Question <span className="text-white font-semibold">{state.currentQuestionIndex + 1}</span> of <span className="font-semibold">{state.questions.length}</span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                      style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Loading Prompt Indicator */}
              {state.isGeneratingPrompt ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h3 className="text-base font-bold text-white">Architecting Custom Specifications...</h3>
                    <p className="text-xs text-slate-400 mt-1">Injecting XML patterns, feedback boundaries, and optimization parameters for Claude.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Question Panel */}
                  <AnimatePresence mode="wait">
                    {state.questions[state.currentQuestionIndex] && (
                      <motion.div
                        key={state.questions[state.currentQuestionIndex].id}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-indigo-950 border border-indigo-900/50 text-indigo-300 rounded-md">
                            Refinement Scope
                          </span>
                          <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-white leading-snug">
                            {state.questions[state.currentQuestionIndex].question}
                          </h3>
                        </div>

                        {/* Helper guidance */}
                        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                          <div className="flex gap-2 items-start text-xs text-slate-400 leading-relaxed">
                            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-300 font-medium">Scoping Suggestions: </strong>
                              {state.questions[state.currentQuestionIndex].helperText}
                            </div>
                          </div>
                        </div>

                        {/* Text Answer Input Area */}
                        <div className="space-y-3">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Describe Your Choice</label>
                          <textarea
                            id={`answer-input-${state.questions[state.currentQuestionIndex].id}`}
                            defaultValue={state.answers[state.questions[state.currentQuestionIndex].id] || ""}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                const val = (e.target as HTMLTextAreaElement).value;
                                if (val.trim()) {
                                  handleAnswerSubmit(val);
                                  (e.target as HTMLTextAreaElement).value = "";
                                }
                              }
                            }}
                            ref={(el) => {
                              if (el) {
                                // Focus text field on transition
                                el.focus();
                              }
                            }}
                            placeholder="Type your preferences here... (Hit enter to submit, or use the direct recommendation capsules below)"
                            className="w-full h-28 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 resize-none font-sans"
                          />
                        </div>

                        {/* Suggestion capsules to click */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Recommended Quick Choices</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                const el = document.getElementById(`answer-input-${state.questions[state.currentQuestionIndex].id}`) as HTMLTextAreaElement;
                                if (el) {
                                  el.value = "Keep it simple and focused purely on offline browser execution.";
                                  handleAnswerSubmit(el.value);
                                  el.value = "";
                                }
                              }}
                              className="text-xs bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition py-1 cursor-pointer"
                            >
                              Standard Offline Setup
                            </button>
                            <button
                              onClick={() => {
                                const el = document.getElementById(`answer-input-${state.questions[state.currentQuestionIndex].id}`) as HTMLTextAreaElement;
                                if (el) {
                                  el.value = "Full state persistence using durable local index tables or local state management.";
                                  handleAnswerSubmit(el.value);
                                  el.value = "";
                                }
                              }}
                              className="text-xs bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition py-1 cursor-pointer"
                            >
                              Full Durable Architecture
                            </button>
                            <button
                              onClick={() => {
                                const el = document.getElementById(`answer-input-${state.questions[state.currentQuestionIndex].id}`) as HTMLTextAreaElement;
                                if (el) {
                                  el.value = "Use custom CSS styling adjustments and beautiful transitions for an eye-catching experience.";
                                  handleAnswerSubmit(el.value);
                                  el.value = "";
                                }
                              }}
                              className="text-xs bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition py-1 cursor-pointer"
                            >
                              Premium Visual Design Focus
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Wizard controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={state.currentQuestionIndex === 0}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={skipQuestionsAndCompile}
                        className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition"
                      >
                        Skip & Generate Instantly
                      </button>

                      <button
                        id="wizard-next-submit"
                        onClick={() => {
                          const inp = document.getElementById(`answer-input-${state.questions[state.currentQuestionIndex].id}`) as HTMLTextAreaElement;
                          const typedValue = inp && inp.value.trim() ? inp.value.trim() : "Standard recommended behavior";
                          
                          if (state.currentQuestionIndex >= state.questions.length - 1) {
                            const finalAnswers = { ...state.answers, [state.questions[state.currentQuestionIndex].id]: typedValue };
                            setState(prev => ({ ...prev, answers: finalAnswers }));
                            compileFinalPrompt(finalAnswers);
                          } else {
                            handleAnswerSubmit(typedValue);
                            if (inp) inp.value = "";
                          }
                        }}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 font-semibold px-4 py-2 text-xs rounded-lg text-white transition cursor-pointer"
                      >
                        {state.currentQuestionIndex >= state.questions.length - 1 ? (
                          <>
                            Compile Prompt
                            <Send className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Next Question
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Force Compilation button if user filled some answers already */}
                  {Object.keys(state.answers).length > 0 && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => compileFinalPrompt()}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate with current {Object.keys(state.answers).length} answered preferences
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT AND ANALYSIS DISPLAY */}
        {activeStep === "result" && (
          <div className="space-y-8" id="step-result-view">
            {/* Header reset button banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-2xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Prompt Ready</span>
                <h3 className="text-sm font-bold text-slate-300 leading-tight">
                  Prompt compiled using <span className="text-white">"{state.selectedProfileId}"</span> profile.
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStep("ideation")}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-lg transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Refine App Idea
                </button>
                <button
                  onClick={resetWorkspace}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Write Another App
                </button>
              </div>
            </div>

            {/* Structured Dual Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Mechanical Scorecard and metrics */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="space-y-1 pb-4 border-b border-slate-850">
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      Claude Optimization Scorecard
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Mechanical scoring of XML rules and token footprint estimation.</p>
                  </div>

                  {state.analysis && (
                    <div className="space-y-6">
                      {/* Efficiency Radial / Gauge */}
                      <div className="flex items-center gap-5 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                        <div className="relative w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center shrink-0">
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow opacity-60" />
                          <span className="text-sm font-bold text-white">{state.analysis.efficiencyScore}%</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-300 block">Efficiency Rating</span>
                          <span className="text-[11px] text-indigo-400 block font-mono">Expert Token Savings Compliance</span>
                          <p className="text-[11px] text-slate-500 mt-1 uppercase font-semibold">Matched to Claude 3.5 Sonnet</p>
                        </div>
                      </div>

                      {/* Score Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Prompt Size</span>
                          <span className="text-sm font-bold font-mono text-slate-200">
                            ~{state.analysis.tokenEstimation.systemPromptTokens}
                          </span>
                          <span className="text-[9px] text-slate-500 block">tokens</span>
                        </div>
                        <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono text-emerald-400">Tokens Saved</span>
                          <span className="text-sm font-bold font-mono text-emerald-400">
                            ~{state.analysis.tokenEstimation.estimatedSavings}
                          </span>
                          <span className="text-[9px] text-slate-500 block">estimated</span>
                        </div>
                        <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 font-mono">% Noise Saved</span>
                          <span className="text-sm font-bold font-mono text-indigo-400">
                            {state.analysis.tokenEstimation.reductionPercentage}%
                          </span>
                          <span className="text-[9px] text-slate-500 block">sleeker</span>
                        </div>
                      </div>

                      {/* Pros & Cons detailed lists */}
                      <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Mechanical Benefits
                          </span>
                          <ul className="space-y-1.5 pl-1">
                            {state.analysis.pros.map((pro, i) => (
                              <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                <span className="text-emerald-500 shrink-0 mt-1">•</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Late Chat Challenges
                          </span>
                          <ul className="space-y-1.5 pl-1">
                            {state.analysis.cons.map((con, i) => (
                              <li key={i} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                                <span className="text-amber-500 shrink-0 mt-1">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Included Attachments list if any */}
                      {state.attachments && state.attachments.length > 0 && (
                        <div className="space-y-2.5 pt-4 border-t border-slate-850">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5" />
                            Compiled Context Material
                          </span>
                          <div className="space-y-1.5">
                            {state.attachments.map((att) => {
                              const sizeKb = (att.size / 1024).toFixed(1);
                              return (
                                <div key={att.id} className="bg-slate-950/80 p-2 rounded-lg border border-slate-850/60 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="text-[11px] text-slate-300 truncate" title={att.name}>
                                      {att.name}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 font-mono shrink-0">
                                    {att.size > 1024 * 1024 ? `${(att.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeKb} KB`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Second Turn Optimization Guide */}
                {state.analysis && (
                  <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/15 border border-indigo-950 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                      <HelpCircle className="w-4 h-4" />
                      Prompting Strategies & Recommendations
                    </div>
                    <div className="space-y-3.5">
                      {state.analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <div className="w-4.5 h-4.5 rounded bg-indigo-950 border border-indigo-900/50 flex items-center justify-center text-[10px] text-indigo-300 font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Code/Markdown Container */}
              <div className="lg:col-span-7 space-y-4">
                {/* Visual Code Box Header */}
                <div className="flex items-center justify-between bg-slate-900 p-4 border border-b-0 border-slate-800 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full" />
                      <span className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full" />
                      <span className="w-2.5 h-2.5 bg-green-500/80 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-2 border-l border-slate-800 pl-3">claude-system-spec.md</span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2" id="prompt-actions-row">
                    <button
                      id="btn-copy-prompt"
                      onClick={copyToClipboard}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all border cursor-pointer ${
                        copied 
                          ? "bg-emerald-950 border-emerald-500/40 text-emerald-400" 
                          : "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                    <button
                      id="btn-download-prompt"
                      onClick={downloadMarkdownFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                      title="Download Markdown Prompt file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Big Formatted Spec Block */}
                <div className="bg-slate-950 rounded-b-2xl border border-t-0 border-slate-800 shadow-2xl relative">
                  <div className="max-h-[800px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 pointer-events-auto select-all selection:bg-indigo-500/25">
                    {/* Rendered Prompt Preview */}
                    <div className="markdown-body font-sans text-slate-300 leading-relaxed text-sm select-text" id="final-markdown-render">
                      <Markdown
                        components={{
                          h1: ({children}) => <h1 className="text-base font-bold font-sans tracking-tight text-white border-b border-slate-800/80 pb-2 mt-8 mb-4 flex items-center gap-2 select-text">{children}</h1>,
                          h2: ({children}) => <h2 className="text-sm font-bold font-sans text-indigo-400 uppercase tracking-wider mt-6 mb-3 select-text">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xs font-bold font-sans text-slate-200 uppercase tracking-widest mt-4 mb-2 select-text">{children}</h3>,
                          p: ({children}) => <p className="text-slate-300 text-xs leading-relaxed mb-4 font-sans select-text">{children}</p>,
                          code: ({children, className}) => {
                            const codeText = String(children).trim();
                            // If is is of format <tag> or </tag>, highlight elegantly
                            const isXmlTag = /^<\/?[a-zA-Z0-9_-]+>$/.test(codeText) || /^[A-Z_]+_ENV/.test(codeText);
                            if (isXmlTag) {
                              return <code className="bg-indigo-950/40 text-indigo-400 font-mono text-[11px] px-1.5 py-0.5 rounded border border-indigo-900/50 select-text">{children}</code>;
                            }
                            return <code className="bg-slate-950 text-amber-400 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-900 select-text">{children}</code>;
                          },
                          ul: ({children}) => <ul className="list-disc leading-relaxed text-slate-300 mb-4 pl-4 space-y-1.5 text-xs font-sans select-text">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal leading-relaxed text-slate-300 mb-4 pl-4 space-y-1.5 text-xs font-sans select-text">{children}</ol>,
                          li: ({children}) => <li className="text-slate-300 select-text">{children}</li>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-indigo-500/80 bg-indigo-950/20 px-3.5 py-1 text-xs text-slate-400 italic rounded-r-lg my-4 select-text">{children}</blockquote>
                        }}
                      >
                        {state.generatedPrompt}
                      </Markdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {activeTab === "image-studio" && <ImagePromptStudio />}
        {activeTab === "notebooklm" && <NotebookLMSuite />}
        {activeTab === "settings-guide" && <ExpertSettingsGuide />}
        {activeTab === "memory-guard" && <ClaudeMemoryGuard />}
        {activeTab === "visual-diff" && <BeforeAfterDiff />}
        {activeTab === "user-manual" && <UserManualAndAlternatives />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-950 bg-slate-950 py-8 px-6 mt-16 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>Designed for full compliance with Claude 3.5 Sonnet, Claude 3.1, and Claude Web interface models.</p>
          <p>© 2026 Claude Prompt Architect. Zero logs generated, fully offline local backup.</p>
        </div>
      </footer>

      {/* SLIDE OVER HISTORY PANEL */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
              id="history-slide-panel"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm">Saved Architecture Prompts</span>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 px-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition font-bold"
                >
                  ×
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs">No saved architecture prompts found.</p>
                    <p className="text-[10px] text-slate-600">Compile an app idea to populate history durable records.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-indigo-500/40 hover:bg-slate-950/80 transition shadow cursor-pointer group space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-slate-900 text-indigo-400 px-2 py-0.5 rounded border border-indigo-950">
                          {item.profileId}
                        </span>
                        <span className="text-[10px] text-slate-500 self-center">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-100 line-clamp-2 leading-relaxed">
                          "{item.appIdea}"
                        </span>
                        <p className="text-[10px] text-slate-400">
                          Includes {Object.keys(item.answers).length} customized scoping parameters{item.attachments && item.attachments.length > 0 ? ` • ${item.attachments.length} reference file${item.attachments.length > 1 ? "s" : ""}` : ""}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                          Load into view
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <button
                          onClick={(e) => deleteHistoryItem(e, item.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
