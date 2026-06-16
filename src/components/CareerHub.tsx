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

  const downloadCategoryRoadmap = (cat: CareerCategory) => {
    let roadmapHtml = "";

    if (cat.id === "data-analysis") {
      roadmapHtml = `
        <h1>Career Roadmap: Data Analysis & SQL Mastery</h1>
        <p>This roadmap guides you from absolute zero knowledge to an expert, job-ready Data Analyst / Business Intelligence position.</p>
        
        <h2>📈 Starting from 0 to 5 Complete Mastery</h2>
        <div class="level-card">
          <div class="level-title">Level 0: Absolute Beginner (Orientation)</div>
          <div class="level-goal">Goal: Setup and Relational Database Basics</div>
          <div class="level-detail">Understand databases vs spreadsheets. Set up a local database tool like SQLite, DBeaver, or pgAdmin. Master basic commands: <strong>SELECT, FROM, and LIMIT</strong>.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 1: Novice (Fundamentals)</div>
          <div class="level-goal">Goal: Basic Data Filtering & Aggregations</div>
          <div class="level-detail">Learn to filter rows using <strong>WHERE</strong>, combining conditions with <strong>AND, OR, NOT, IN, LIKE, and BETWEEN</strong>. Master basic aggregations: <strong>COUNT, SUM, AVG, MIN, MAX</strong>, and how to group results using <strong>GROUP BY</strong> and <strong>HAVING</strong>.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 2: Intermediate (Application)</div>
          <div class="level-goal">Goal: Table Joins & Nested Queries</div>
          <div class="level-detail">Understand database relationships. Master <strong>INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN</strong>. Practice writing nested queries (subqueries) to answer multi-step business questions.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 3: Competent (Advanced Techniques)</div>
          <div class="level-goal">Goal: CTEs, Case Logic & Window Functions</div>
          <div class="level-detail">Write <strong>Common Table Expressions (CTEs)</strong> using <code>WITH</code> to structure complex queries cleanly. Master <strong>Window Functions</strong> (<code>ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG</code>) for running totals and analytics. Learn conditional <strong>CASE WHEN</strong> logic.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 4: Proficient (Systems & Architecture)</div>
          <div class="level-goal">Goal: Schema Design & Query Performance Optimization</div>
          <div class="level-detail">Learn database normalization rules. Practice creating tables, declaring primary/foreign keys, and writing database <strong>VIEWS</strong>. Understand how <strong>INDEXES</strong> speed up queries and how to read query execution plans.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 5: Complete Mastery (Hirable Status)</div>
          <div class="level-goal">Goal: Scale, Security & BI Dashboards Integration</div>
          <div class="level-detail">Write database triggers and stored procedures. Set up database access security. Build data pipelines that automatically push SQL query results to update business dashboards in <strong>Power BI or Tableau</strong>.</div>
        </div>

        <h2>📝 Resume Presentation & Portfolio Guide</h2>
        <h3>1. How to Present Yourself in Your Resume</h3>
        <ul>
          <li><strong>Skills Section:</strong> Group your skills clearly: <em>Database: SQL (PostgreSQL/MySQL), Analytics: Excel (Power Query), Visualization: Power BI/Tableau, Language: Python (Pandas/NumPy)</em>.</li>
          <li><strong>Focus on Business Impact:</strong> Instead of just listing "SQL" as a skill, show how you used it to find insights or save money. Use strong action verbs like <em>Queried, Optimized, Visualized, Modeled, Cleaned, Analyzed, Automated</em>.</li>
          <li><strong>Sample Bullet Point:</strong> "Designed optimized SQL queries using indexes and CTEs, reducing dashboard load times by 35% and saving 10 hours of manual weekly reporting."</li>
        </ul>

        <h3>2. Portfolio Projects to Build (To Be Hirable)</h3>
        <ul>
          <li><strong>Sales Performance Dashboard:</strong> Query a retail dataset in SQL, calculate month-over-month growth, and build a Power BI dashboard showing key metrics.</li>
          <li><strong>Database Optimization Project:</strong> Take a slow-running query, explain why it was slow (using execution plans), add indexes, and document the speedup. Save this in a GitHub repository with clean `.sql` files.</li>
        </ul>
      `;
    } else if (cat.id === "emerging-careers") {
      roadmapHtml = `
        <h1>Career Roadmap: Emerging Roles & Tech Fields</h1>
        <p>This roadmap guides you from absolute zero to an expert, job-ready Prompt Engineer / No-Code Developer / AI Integrations Specialist.</p>
        
        <h2>📈 Starting from 0 to 5 Complete Mastery</h2>
        <div class="level-card">
          <div class="level-title">Level 0: Absolute Beginner (Orientation)</div>
          <div class="level-goal">Goal: Understanding the AI & Visual Development Ecosystem</div>
          <div class="level-detail">Learn key vocabulary, no-code drag-and-drop builder components, and basic prompt models. Create builder accounts and review the documentation.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 1: Novice (Fundamentals)</div>
          <div class="level-goal">Goal: Core Workflows & Basic Builds</div>
          <div class="level-detail">Construct simple, functional prototypes. Learn logic rules, layout adjustments, and basic zero-shot, few-shot prompting techniques.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 2: Intermediate (Application)</div>
          <div class="level-goal">Goal: API Connectors & Third-Party Integrations</div>
          <div class="level-detail">Connect your builder tools to databases (Airtable) or AI models via APIs. Build a portfolio of 3-5 functional web tools.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 3: Competent (Advanced Techniques)</div>
          <div class="level-goal">Goal: Custom Logic & Prompt Chain Optimizations</div>
          <div class="level-detail">Refine logic workflows, handle database exceptions, structure robust state management, and write optimized prompt chains. Focus on performance tuning.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 4: Proficient (Systems & Architecture)</div>
          <div class="level-goal">Goal: Scaling Apps for Production</div>
          <div class="level-detail">Deploy live applications or automated AI agent clusters. Structure backends for production workloads and optimize page loading times.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 5: Complete Mastery (Hirable Status)</div>
          <div class="level-goal">Goal: Security Auditing & Global Deployments</div>
          <div class="level-detail">Audit application security, prevent AI jailbreaking (prompt injection), ensure access control compliance, and deploy enterprise products to global users.</div>
        </div>

        <h2>📝 Resume Presentation & Portfolio Guide</h2>
        <h3>1. How to Present Yourself in Your Resume</h3>
        <ul>
          <li><strong>Skills Section:</strong> List your core frameworks: <em>AI Ops: LLM Orchestration, Prompt Engineering, API Connectors. No-Code: Bubble, Webflow, Airtable, Make.com. Blockchain: Solidity, Web3.js</em>.</li>
          <li><strong>Focus on Speed & Innovation:</strong> Highlight your ability to ship functional applications quickly without heavy engineering debt. Use action verbs like <em>Integrated, Automated, Architected, Designed, Shipped, Configured</em>.</li>
          <li><strong>Sample Bullet Point:</strong> "Built a fully functional AI-powered support chatbot that solved 45% of customer queries automatically."</li>
        </ul>

        <h3>2. Portfolio Projects to Build (To Be Hirable)</h3>
        <ul>
          <li><strong>Live SaaS App (No-code):</strong> Build a fully working subscription marketplace on Bubble.io with Airtable database backend and stripe payment integration.</li>
          <li><strong>AI Multi-Agent Workspace:</strong> Build a custom workflow on Make.com connecting OpenAI API to Google Docs and Slack to automate article research.</li>
        </ul>
      `;
    } else if (cat.id === "bcom-resistant") {
      roadmapHtml = `
        <h1>Career Roadmap: B.Com Pathways (AI-Resistant)</h1>
        <p>This roadmap guides you from zero to expert human compliance auditor, tax litigator, and risk consultant.</p>
        
        <h2>📈 Starting from 0 to 5 Complete Mastery</h2>
        <div class="level-card">
          <div class="level-title">Level 0: Absolute Beginner (Orientation)</div>
          <div class="level-goal">Goal: Financial Literacy & Corporate Structures</div>
          <div class="level-detail">Learn double-entry bookkeeping rules, legal entity definitions, basic tax codes, and financial reporting terminology.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 1: Novice (Fundamentals)</div>
          <div class="level-goal">Goal: Transactions, Auditing & Professional Foundations</div>
          <div class="level-detail">Clear professional intermediate exams (CA/CS/CMA). Learn to prepare journal entries, construct balance sheets, and verify general ledgers.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 2: Intermediate (Application)</div>
          <div class="level-goal">Goal: Compliance Audits & Articleship Training</div>
          <div class="level-detail">Perform regulatory compliance filings, conduct physical inventory checks, study corporate law details, and complete articleship training.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 3: Competent (Advanced Techniques)</div>
          <div class="level-goal">Goal: Strategic Costing & Final Professional Licensing</div>
          <div class="level-detail">Study advanced corporate taxation laws, portfolio theories, corporate valuation metrics, and clear final professional licensing exams.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 4: Proficient (Systems & Analytics)</div>
          <div class="level-goal">Goal: Forensic Investigations & System Audits</div>
          <div class="level-detail">Master forensic accounting techniques to identify fraud and trace shell transactions. Configure and audit green/ESG compliance dashboards.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 5: Complete Mastery (Hirable Status)</div>
          <div class="level-goal">Goal: CFO Advisory & Board Governance</div>
          <div class="level-detail">Lead corporate restructuring (M&A), design global risk hedging strategies, arbitrate shareholder legal disputes, and direct financial strategy.</div>
        </div>

        <h2>📝 Resume Presentation & Portfolio Guide</h2>
        <h3>1. How to Present Yourself in Your Resume</h3>
        <ul>
          <li><strong>Skills Section:</strong> Highlight professional compliance frameworks: <em>Auditing Standards, Direct/Indirect Taxation, Corporate Law, Compliance Auditing, Forensic Accounting</em>.</li>
          <li><strong>Focus on Professional Trust:</strong> Highlight your regulatory certifications and details of statutory audits. Use action verbs like <em>Audited, Filed, Evaluated, Structured, Arbitrated, Advised</em>.</li>
          <li><strong>Sample Bullet Point:</strong> "Conducted statutory compliance audits for 8 corporate clients, identifying 12+ accounting discrepancies and ensuring zero filing penalties."</li>
        </ul>

        <h3>2. Portfolio Projects to Build (To Be Hirable)</h3>
        <ul>
          <li><strong>Corporate Compliance Audit Case Study:</strong> Write a detailed audit case study analyzing a mock corporation's balance sheets and highlighting governance discrepancies.</li>
          <li><strong>ESG Risk Framework:</strong> Build a custom sustainability audit report assessing corporate compliance with ESG standards.</li>
        </ul>
      `;
    } else if (cat.id === "bcom-augmented") {
      roadmapHtml = `
        <h1>Career Roadmap: B.Com Pathways (AI-Augmented)</h1>
        <p>This roadmap guides you from zero to expert financial analyst, M&A strategist, and algorithmic quant specialist.</p>
        
        <h2>📈 Starting from 0 to 5 Complete Mastery</h2>
        <div class="level-card">
          <div class="level-title">Level 0: Absolute Beginner (Orientation)</div>
          <div class="level-goal">Goal: US GAAP & Accounting Ledger Automation</div>
          <div class="level-detail">Learn US GAAP, international auditing standards, basic investment valuation models, and automated ledger terminology.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 1: Novice (Fundamentals)</div>
          <div class="level-goal">Goal: Automated Costing & Professional Exams Prep</div>
          <div class="level-detail">Learn automated transaction mapping. Clear initial global licensing exam stages (CPA/CMA/CFA).</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 2: Intermediate (Application)</div>
          <div class="level-goal">Goal: Financial Modeling & Cost Budgeting</div>
          <div class="level-detail">Build financial models in Excel. Master corporate costing, planning databases, and pass core global licensing sections.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 3: Competent (Advanced Techniques)</div>
          <div class="level-goal">Goal: Asset Valuation & Professional Licensing Completion</div>
          <div class="level-detail">Master portfolio asset valuation, derivatives analysis, and complete your final global certifications.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 4: Proficient (Systems & Analytics)</div>
          <div class="level-goal">Goal: Quantitative Financial Systems Integration</div>
          <div class="level-detail">Incorporate analytics engines (Power BI, Power Query) to automate costing reports. Write Python scripts to clean financial data.</div>
        </div>
        <div class="level-card">
          <div class="level-title">Level 5: Complete Mastery (Hirable Status)</div>
          <div class="level-goal">Goal: Corporate M&A Strategy & Risk Hedging</div>
          <div class="level-detail">Design quantitative investment models and automated risk hedging algorithms. Direct corporate M&A transactions.</div>
        </div>

        <h2>📝 Resume Presentation & Portfolio Guide</h2>
        <h3>1. How to Present Yourself in Your Resume</h3>
        <ul>
          <li><strong>Skills Section:</strong> Highlight financial modeling and tech stacks: <em>Financial Modeling, US GAAP, Excel Power Query, Quantitative Valuation, Power BI</em>.</li>
          <li><strong>Focus on Analytical Scale:</strong> Highlight how you used automation to optimize reports. Use action verbs like <em>Automated, Modeled, Valued, Forecasted, Standardized, Programmed</em>.</li>
          <li><strong>Sample Bullet Point:</strong> "Built a dynamic DCF financial valuation model for a tech startup, predicting cash flows with 92% accuracy and automating cost budgeting reports."</li>
        </ul>

        <h3>2. Portfolio Projects to Build (To Be Hirable)</h3>
        <ul>
          <li><strong>DCF Financial Valuation Model:</strong> Build a fully dynamic Discounted Cash Flow valuation model in Excel/Google Sheets for a public company and document the calculations.</li>
          <li><strong>Cost Forecasting Dashboard:</strong> Build a Power BI financial planning dashboard tracking expenses and forecasting revenue.</li>
        </ul>
      `;
    }

    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Career Roadmap: ${cat.title}</title>
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
  h3 {
    color: #4F46E5;
    font-size: 13px;
    margin-top: 15px;
    margin-bottom: 6px;
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
  ul {
    font-size: 12px;
    line-height: 1.5;
  }
  li {
    margin-bottom: 6px;
  }
</style>
</head>
<body>

  ${roadmapHtml}

  <h2>📚 Curated Study Resources & Websites</h2>
  <ul>
    ${cat.resources.map(r => `
      <li>
        <strong>${r.name}</strong> (${r.url}) - ${r.bestFor} (${r.cost.toUpperCase()})
        <br/><span style="color:#64748B; font-size:10px; font-style:italic;">Reputation: ${r.reputation}</span>
      </li>
    `).join("")}
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
    a.download = `${cat.id}-roadmap.doc`;
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
              {/* Category Header with Roadmap Exporter */}
              <div className="border-b border-[#1A2138] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {cat.id === "data-analysis" && <Database className="w-4 h-4 text-cyan-400" />}
                    {cat.id === "emerging-careers" && <Cpu className="w-4 h-4 text-rose-400" />}
                    {cat.id === "bcom-resistant" && <Shield className="w-4 h-4 text-emerald-400" />}
                    {cat.id === "bcom-augmented" && <Sparkles className="w-4 h-4 text-amber-400" />}
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal">{cat.description}</p>
                </div>
                <button
                  onClick={() => downloadCategoryRoadmap(cat)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg transition shrink-0 cursor-pointer self-start sm:self-auto shadow-md"
                  title={`Download complete ${cat.title} Career Roadmap & Resume Guide (.doc)`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Roadmap & Resume Guide</span>
                </button>
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
                      <span className="italic truncate max-w-[70%] text-slate-600">{r.reputation}</span>
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
