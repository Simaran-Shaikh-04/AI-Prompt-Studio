import { useState, useMemo } from "react";
import {
  Briefcase, Database, Cpu, Shield, Star, ExternalLink, Search,
  BookOpen, GraduationCap, Target, Rocket, Sparkles, Check, Copy, Download
} from "lucide-react";
import { CAREER_HUB_CATEGORIES } from "../data/careerHubData";
import type { CareerResource, CareerCategory } from "../data/careerHubData";

export default function CareerHub() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return CAREER_HUB_CATEGORIES.map(cat => {
      // Filter resources inside category
      const matchedResources = cat.resources.filter(r => {
        const matchesQuery = query.trim() === "" ||
          `${r.name} ${r.bestFor} ${r.skills.join(" ")} ${r.reputation}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return matchesQuery;
      });

      return {
        ...cat,
        resources: matchedResources
      };
    }).filter(cat => {
      // Filter category list itself
      if (activeCategoryId !== "all" && cat.id !== activeCategoryId) return false;
      return cat.resources.length > 0;
    });
  }, [activeCategoryId, query]);

  const handleCopyLink = (r: CareerResource) => {
    navigator.clipboard.writeText(r.url);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRoadmapLevels = (r: CareerResource) => {
    // If it is SQL/Data Analysis
    if (
      r.id.includes("sql") ||
      r.id === "maven-analytics" ||
      r.id === "leetcode-sql" ||
      r.id === "mode-sql" ||
      r.id === "sqlbolt" ||
      r.id === "sqlzoo" ||
      r.id === "kaggle-sql" ||
      r.id === "w3-sql"
    ) {
      return [
        { level: "Level 0: Absolute Beginner (Orientation)", goal: "Setup and Relational Database Basics", detail: "Understand databases vs spreadsheets. Set up local SQL environment (SQLite/PostgreSQL) or work on browser sandboxes. Master SELECT, FROM, and LIMIT commands." },
        { level: "Level 1: Novice (Fundamentals)", goal: "Basic Data Filtering & Aggregations", detail: "Master SQL filter operators (WHERE, AND, OR, IN, LIKE, BETWEEN). Learn grouping and aggregating data: COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING." },
        { level: "Level 2: Intermediate (Application)", goal: "Table Joins & Nested Queries", detail: "Master database relationships. Write INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN. Practice subqueries to query tables within queries." },
        { level: "Level 3: Competent (Advanced Techniques)", goal: "CTEs, Case Logic & Window Functions", detail: "Write Common Table Expressions (CTEs) for clean script structure. Master analytics Window Functions (ROW_NUMBER, RANK, LEAD, LAG) and conditional CASE WHEN logic." },
        { level: "Level 4: Proficient (Systems & Architecture)", goal: "Schema Design & Performance Tuning", detail: "Understand database normalization rules. Learn to construct tables, primary/foreign keys, write database views, and implement INDEXES to optimize query performance." },
        { level: "Level 5: Complete Mastery (Enterprise)", goal: "Scale, Security & BI Dashboards integration", detail: "Practice writing stored procedures and database triggers. Set up backup protocols, secure user access controls, and build pipelines to feed SQL data into BI tools (Power BI/Tableau)." }
      ];
    }

    // AI or Emerging Roles
    if (
      r.id === "learn-prompting" ||
      r.id === "deeplearning-ai" ||
      r.id === "bubble-academy" ||
      r.id === "webflow-univ" ||
      r.id === "cryptozombies"
    ) {
      return [
        { level: "Level 0: Absolute Beginner (Orientation)", goal: "Understanding the Ecosystem & Mechanics", detail: "Learn key vocabulary, prompt structures, or no-code drag-and-drop builder components. Create builder accounts and review the documentation." },
        { level: "Level 1: Novice (Fundamentals)", goal: "Core Workflows & Basic Builds", detail: "Construct simple, functional prototypes or execute basic tasks. Learn logic rules, layout adjustments, and initial parameter configurations." },
        { level: "Level 2: Intermediate (Application)", goal: "API Connectors & Third-Party Integrations", detail: "Connect your builder tools to database APIs, vector storage, or external plugins. Build a portfolio of 3-5 functional web tools." },
        { level: "Level 3: Competent (Advanced Techniques)", goal: "Custom Logic & Prompt Chain Optimizations", detail: "Refine logic workflows, handle exceptions, structure robust state management, and write optimized prompt chains. Focus on performance tuning." },
        { level: "Level 4: Proficient (Systems & Architecture)", goal: "Production-ready scaling", detail: "Deploy live applications or automated AI agent clusters. Structure backends for production workloads and optimize page loading times." },
        { level: "Level 5: Complete Mastery (Enterprise)", goal: "Security Auditing & Global Deployments", detail: "Audit application/smart contract security vulnerabilities, ensure complete access control compliance, and deploy enterprise products to global users." }
      ];
    }

    // Default Commerce/B.Com Pathways (CA, CS, CPA, CMA, CFA, ESG, etc.)
    return [
      { level: "Level 0: Absolute Beginner (Orientation)", goal: "Financial Literacy & Corporate Structures", detail: "Learn double-entry bookkeeping rules, legal entity definitions, basic tax codes, and financial reporting terminology." },
      { level: "Level 1: Novice (Fundamentals)", goal: "Transactions, Basic Auditing & Professional Foundations", detail: "Learn to prepare journal entries, construct balance sheets, verify general ledgers, and clear intermediate professional exams." },
      { level: "Level 2: Intermediate (Application)", goal: "Corporate Compliance, Statutory Audits & Internships", detail: "Perform regulatory compliance filings, conduct physical inventory checks, study corporate law details, and complete articleship training." },
      { level: "Level 3: Competent (Advanced Techniques)", goal: "Strategic Costing, Valuation & Professional Licensing", detail: "Study advanced corporate taxation laws, portfolio theories, corporate valuation metrics, and clear final licensing exams." },
      { level: "Level 4: Proficient (Systems & Analytics)", goal: "Forensic Investigations, BI Dashboards & System Audits", detail: "Deploy BI tools (Excel, Power BI) to automate reporting. Learn forensic accounting techniques to identify fraud and trace shell transactions." },
      { level: "Level 5: Complete Mastery (Leadership)", goal: "CFO Advisory, Risk Management & Corporate Strategy", detail: "Lead corporate restructuring (M&A), design global risk hedging strategies, arbitrate shareholder legal disputes, and direct financial strategy." }
    ];
  };

  const downloadRoadmap = (r: CareerResource, categoryTitle: string) => {
    const levels = getRoadmapLevels(r);

    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Career Roadmap: ${r.name}</title>
<style>
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    line-height: 1.6;
    color: #2D3748;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
  }
  h1 {
    color: #1E3A8A;
    font-size: 24px;
    border-bottom: 2px solid #3B82F6;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
  h2 {
    color: #2563EB;
    font-size: 16px;
    margin-top: 25px;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 4px;
  }
  p {
    font-size: 12px;
    margin-bottom: 12px;
  }
  .meta-box {
    background-color: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 25px;
  }
  .meta-title {
    font-weight: bold;
    color: #475569;
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .meta-value {
    font-size: 12px;
    color: #1E293B;
    margin-bottom: 8px;
  }
  .level-card {
    background-color: #FFFFFF;
    border-left: 4px solid #3B82F6;
    padding: 12px;
    margin-bottom: 12px;
    border-top: 1px solid #E2E8F0;
    border-right: 1px solid #E2E8F0;
    border-bottom: 1px solid #E2E8F0;
    border-radius: 0 8px 8px 0;
  }
  .level-title {
    font-size: 13px;
    font-weight: bold;
    color: #1E3A8A;
    margin-bottom: 2px;
  }
  .level-goal {
    font-size: 11px;
    font-weight: 600;
    color: #4F46E5;
    margin-bottom: 6px;
  }
  .level-detail {
    font-size: 11px;
    color: #4A5568;
    line-height: 1.4;
  }
  .footer {
    text-align: center;
    font-size: 9px;
    color: #94A3B8;
    margin-top: 40px;
    border-top: 1px solid #E2E8F0;
    padding-top: 10px;
  }
</style>
</head>
<body>

  <h1>Career Mastery Roadmap: ${r.name}</h1>
  
  <div class="meta-box">
    <div class="meta-title">Field / Category</div>
    <div class="meta-value">${categoryTitle}</div>
    
    <div class="meta-title">AI Impact Classification</div>
    <div class="meta-value">${
      r.aiClassification === "resistant"
        ? "🛡️ AI-Resistant (Requires human compliance, regulatory law & qualitative audit)"
        : r.aiClassification === "augmented"
        ? "🤖 AI-Augmented (Leverages quantitative algorithms, models & BI dashboards)"
        : "Standard"
    }</div>
    
    <div class="meta-title">Industry Reputation</div>
    <div class="meta-value">${r.reputation}</div>
    
    <div class="meta-title">Recommended Platform</div>
    <div class="meta-value">${r.name} (${r.url})</div>
  </div>

  <h2>🎯 Target Skills to Master</h2>
  <p>${r.skills.join(" · ")}</p>

  <h2>📈 Roadmap from 0 to 5 Complete Mastery</h2>
  
  ${levels
    .map(
      lvl => `
    <div class="level-card">
      <div class="level-title">${lvl.level}</div>
      <div class="level-goal">Goal: ${lvl.goal}</div>
      <div class="level-detail">${lvl.detail}</div>
    </div>
  `
    )
    .join("")}

  <h2>📋 Core Career Qualifications & Milestones</h2>
  <ul>
    ${
      r.qualifications && r.qualifications.length > 0
        ? r.qualifications.map(q => `<li>${q}</li>`).join("")
        : `<li>Self-study portfolio & practical tools built using ${r.name}</li>`
    }
  </ul>

  <div class="footer">
    Generated by AI Prompt Scoping Studio - Career & Skills Hub.
  </div>

</body>
</html>
`;

    const blob = new Blob([docHtml], { type: "application/msword;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `roadmap-${r.id}.doc`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" /> Career & Skills Hub
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Explore high-growth careers, master critical skills like SQL, and discover AI-Resistant or AI-Augmented pathways.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-4 space-y-4 shadow-lg">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search skills, websites, or certifications..."
            className="w-full bg-[#080C16] border border-[#1A2138] focus:border-indigo-500/50 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
          />
        </div>

        {/* Category Toggles */}
        <div className="flex flex-wrap gap-1.5 border-t border-[#1A2138] pt-3">
          <button
            onClick={() => setActiveCategoryId("all")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border transition cursor-pointer ${
              activeCategoryId === "all"
                ? "bg-indigo-950/40 text-indigo-300 border-indigo-800/60"
                : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300"
            }`}
          >
            <Briefcase className="w-3 h-3" /> All Categories
          </button>
          {CAREER_HUB_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border transition cursor-pointer ${
                activeCategoryId === cat.id
                  ? "bg-indigo-950/40 text-indigo-300 border-indigo-800/60"
                  : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300"
              }`}
            >
              {cat.id === "data-analysis" && <Database className="w-3 h-3 text-cyan-400" />}
              {cat.id === "emerging-careers" && <Cpu className="w-3 h-3 text-rose-400" />}
              {cat.id === "bcom-resistant" && <Shield className="w-3 h-3 text-emerald-400" />}
              {cat.id === "bcom-augmented" && <Sparkles className="w-3 h-3 text-amber-400" />}
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render Categorized Resources */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-[#0D1225] border border-[#1A2138] rounded-2xl">
            <Briefcase className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-55 animate-pulse" />
            <p className="text-xs text-slate-500">No resources found matching your search.</p>
          </div>
        ) : (
          filteredCategories.map(cat => (
            <div key={cat.id} className="space-y-4">
              {/* Category Header */}
              <div className="border-b border-[#1A2138] pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {cat.id === "data-analysis" && <Database className="w-4 h-4 text-cyan-400" />}
                  {cat.id === "emerging-careers" && <Cpu className="w-4 h-4 text-rose-400" />}
                  {cat.id === "bcom-resistant" && <Shield className="w-4 h-4 text-emerald-400" />}
                  {cat.id === "bcom-augmented" && <Sparkles className="w-4 h-4 text-amber-400" />}
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">{cat.description}</p>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.resources.map(r => (
                  <div
                    key={r.id}
                    className="bg-[#0D1225] border border-[#1A2138] hover:border-indigo-900/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <div className="space-y-2.5">
                      {/* Name, Stars, Price */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-white hover:text-indigo-400 inline-flex items-center gap-1.5 transition"
                          >
                            {r.name} <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </a>
                          {/* Visual Star Rating */}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < r.stars ? "fill-amber-400 text-amber-400" : "text-slate-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              r.cost === "free"
                                ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                                : "text-sky-400 bg-sky-950/40 border-sky-800/50"
                            }`}
                          >
                            {r.cost}
                          </span>
                          {r.aiClassification && (
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                r.aiClassification === "resistant"
                                  ? "text-emerald-400 bg-emerald-950/30 border-emerald-900/35"
                                  : "text-amber-400 bg-amber-950/30 border-amber-900/35"
                              }`}
                            >
                              {r.aiClassification === "resistant" ? "🛡️ AI-Resistant" : "🤖 AI-Augmented"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Best For */}
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        {r.bestFor}
                      </p>

                      {/* Qualifications */}
                      {r.qualifications && r.qualifications.length > 0 && (
                        <div className="bg-[#080C16] border border-[#1A2138]/50 p-2.5 rounded-lg space-y-1">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide block">Required Qualifications:</span>
                          <ul className="list-disc pl-3.5 space-y-0.5">
                            {r.qualifications.map((qual, idx) => (
                              <li key={idx} className="text-[10px] text-slate-400 leading-normal">
                                {qual}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills taught */}
                      <div className="flex flex-wrap gap-1">
                        {r.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-semibold bg-[#080C16] border border-[#1A2138] text-slate-400 px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-[#1A2138] mt-4 pt-3 text-[10px] text-slate-500">
                      <button
                        onClick={() => downloadRoadmap(r, cat.title)}
                        className="text-[10px] font-semibold inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer transition"
                        title="Download detailed Markdown career roadmap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Roadmap</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline italic text-slate-600 truncate max-w-[120px]">{r.reputation}</span>
                        <button
                          onClick={() => handleCopyLink(r)}
                          className={`text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer transition ${
                            copiedId === r.id ? "text-emerald-400" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {copiedId === r.id ? (
                            <>
                              <Check className="w-3 h-3" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-4 text-center">
        <p className="text-[10px] text-slate-500">
          💡 <strong>Tip:</strong> All cataloged resources are verified, legitimate, and safe. Click their titles to visit the official sites directly.
        </p>
      </div>
    </div>
  );
}
