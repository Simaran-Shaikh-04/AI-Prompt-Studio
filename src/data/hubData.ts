// src/data/hubData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Curated + cited data powering Career Finder and the Resource Hub.
//
// THE RULE (enforced by structure): every factual claim carries a Citation
// { source, url, asOf }. If a claim has no citation, the UI shows
// "insufficient data" instead of guessing. Nothing is predicted without a source.
//
// This is a SEED set, not exhaustive. Extending it = adding rows below,
// never editing component logic. Reuses the shared StudentLevel taxonomy.
// ─────────────────────────────────────────────────────────────────────────────

import type { StudentLevel } from "./studentPresets";

export interface Citation {
  source: string;   // human-readable label
  url: string;      // authoritative/official link
  asOf: string;     // when this was last verified, e.g. "Jan 2025"
}

// Shared, reusable citations -----------------------------------------------------
const WEF_2025: Citation = {
  source: "WEF Future of Jobs Report 2025",
  url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  asOf: "Jan 2025",
};
const ICAI: Citation = { source: "ICAI (official)", url: "https://www.icai.org", asOf: "2025 (New Scheme)" };
const ICSI: Citation = { source: "ICSI (official)", url: "https://www.icsi.edu", asOf: "2025" };
const CFA:  Citation = { source: "CFA Institute (official)", url: "https://www.cfainstitute.org", asOf: "2025" };

// ─── CAREERS ─────────────────────────────────────────────────────────────────
export type DemandSignal = "growing" | "stable" | "declining" | "insufficient-data";

export interface LocalDemand {
  location: string;            // e.g. "Maharashtra, IN"
  signal: DemandSignal;
  note: string;
  cite: Citation;              // local demand MUST be cited or it doesn't go in
}

export interface CareerPath {
  id: string;
  title: string;
  field: string;
  levels: StudentLevel[];
  summary: string;
  qualifications: string[];
  coreSkills: string[];
  governingBody?: string;
  pathCite?: Citation;         // source for the qualification path
  outlook: { signal: DemandSignal; note: string; cite?: Citation };
  localDemand: LocalDemand[];  // seeded empty — add cited local data over time
  fitFor: string[];
  notFitIf: string[];
  matches: string[];           // lowercase keywords matched against "what are you pursuing"
}

export const CAREERS: CareerPath[] = [
  {
    id: "ca",
    title: "Chartered Accountant (CA)",
    field: "Commerce & Finance",
    levels: ["college", "competitive"],
    summary: "Licensed professional in accounting, audit, taxation and financial compliance.",
    qualifications: [
      "Class 12 → CA Foundation",
      "CA Intermediate (2 groups, 6 papers under the New Scheme)",
      "Articleship (practical training) + ICAI self-paced modules",
      "CA Final",
    ],
    coreSkills: ["Financial reporting", "Auditing", "Direct & indirect tax", "Analytical rigour", "Ethics & law"],
    governingBody: "ICAI",
    pathCite: ICAI,
    outlook: { signal: "stable", note: "Core finance profession with steady demand; specialisation (forensic, risk, financial services) is emphasised in the New Scheme.", cite: ICAI },
    localDemand: [],
    fitFor: ["Detail-oriented with numbers", "Comfortable with long-haul study & discipline", "Interested in law + accounting"],
    notFitIf: ["You want fast results", "You dislike detailed rules and accounting standards"],
    matches: ["bcom", "b.com", "commerce", "accounting", "ca", "finance", "accounts"],
  },
  {
    id: "cs",
    title: "Company Secretary (CS)",
    field: "Commerce & Finance",
    levels: ["college", "competitive"],
    summary: "Corporate governance, secretarial and compliance specialist for companies.",
    qualifications: [
      "CSEET → CS Executive → CS Professional (per ICSI)",
      "Practical training as prescribed by ICSI",
    ],
    coreSkills: ["Corporate & company law", "Compliance & governance", "Drafting", "Board procedures"],
    governingBody: "ICSI",
    pathCite: ICSI,
    outlook: { signal: "stable", note: "Demand tied to corporate compliance needs; verify the current scheme on icsi.edu.", cite: ICSI },
    localDemand: [],
    fitFor: ["Enjoy law & regulation", "Methodical and precise", "Interested in corporate governance"],
    notFitIf: ["You dislike legal/regulatory detail"],
    matches: ["bcom", "b.com", "commerce", "cs", "company secretary", "law", "legal"],
  },
  {
    id: "equity-research",
    title: "Financial / Equity Research Analyst",
    field: "Commerce & Finance",
    levels: ["college", "professional"],
    summary: "Analyses companies and securities to support investment decisions.",
    qualifications: [
      "Degree in finance / commerce / economics (typical)",
      "CFA Program is a recognised credential (3 levels, optional but valued)",
      "Strong financial-modelling portfolio",
    ],
    coreSkills: ["Valuation & financial modelling", "Excel", "Reading financial statements", "Research & writing"],
    pathCite: CFA,
    outlook: { signal: "growing", note: "Fintech-adjacent finance roles are among the faster-growing categories.", cite: WEF_2025 },
    localDemand: [],
    fitFor: ["Curious about markets & businesses", "Strong with numbers + writing", "Self-driven research habits"],
    notFitIf: ["You dislike uncertainty / market volatility"],
    matches: ["bcom", "b.com", "commerce", "finance", "economics", "equity", "investment", "research", "analyst"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    field: "Data & Analytics",
    levels: ["college", "professional"],
    summary: "Turns raw data into insights that drive decisions.",
    qualifications: [
      "Any quantitative-friendly degree",
      "SQL + Python/R + statistics (often self-taught + portfolio)",
    ],
    coreSkills: ["SQL", "Python or R", "Statistics", "Data visualisation", "Business sense"],
    outlook: { signal: "growing", note: "Data analysts and big-data specialists are listed among the fastest-growing roles to 2030.", cite: WEF_2025 },
    localDemand: [],
    fitFor: ["Like finding patterns in data", "Comfortable with logic & some coding", "Want a fast-entry data path"],
    notFitIf: ["You avoid anything quantitative"],
    matches: ["bcom", "b.com", "statistics", "computer", "data", "analytics", "maths", "mathematics", "economics", "bca", "b.tech"],
  },
  {
    id: "software-dev",
    title: "Software Developer",
    field: "Technology",
    levels: ["college", "professional"],
    summary: "Designs and builds software applications and systems.",
    qualifications: ["CS/IT degree OR self-taught with a strong project portfolio"],
    coreSkills: ["A programming language", "Data structures & algorithms", "Version control (git)", "Problem-solving"],
    outlook: { signal: "growing", note: "Software and application developers rank among the fastest-growing roles.", cite: WEF_2025 },
    localDemand: [],
    fitFor: ["Enjoy building things & solving puzzles", "Patient with debugging", "Like continuous learning"],
    notFitIf: ["You dislike sitting with hard problems for long stretches"],
    matches: ["computer", "bca", "b.tech", "cs", "coding", "software", "it", "programming", "engineering"],
  },
  {
    id: "ml-specialist",
    title: "AI / Machine Learning Specialist",
    field: "Technology",
    levels: ["college", "professional"],
    summary: "Builds models that learn from data for prediction and automation.",
    qualifications: [
      "Strong maths (linear algebra, probability, calculus)",
      "CS + ML coursework; postgrad common but not mandatory",
      "Demonstrable ML projects",
    ],
    coreSkills: ["Python", "Maths/statistics", "ML frameworks", "Data handling", "Experimentation"],
    outlook: { signal: "growing", note: "AI and machine-learning specialists top the fastest-growing roles in percentage terms.", cite: WEF_2025 },
    localDemand: [],
    fitFor: ["Strong in maths", "Enjoy experimentation", "Comfortable with ambiguity"],
    notFitIf: ["You dislike maths", "You want highly predictable, rule-based work"],
    matches: ["computer", "b.tech", "data", "ai", "machine learning", "ml", "maths", "mathematics", "statistics", "bca"],
  },
  {
    id: "fintech-engineer",
    title: "Fintech Engineer",
    field: "Technology & Finance",
    levels: ["college", "professional"],
    summary: "Builds the software behind payments, trading, lending and financial platforms.",
    qualifications: ["Software engineering skills + finance-domain understanding"],
    coreSkills: ["Programming", "Systems design", "Finance fundamentals", "Security awareness"],
    outlook: { signal: "growing", note: "Fintech engineers are listed among the top fastest-growing roles to 2030.", cite: WEF_2025 },
    localDemand: [],
    fitFor: ["Like both code and finance", "Detail-focused", "Interested in real-world money systems"],
    notFitIf: ["You want pure-research work with no product pressure"],
    matches: ["finance", "computer", "fintech", "software", "commerce", "bcom", "b.com", "b.tech", "coding"],
  },
];

export const CAREER_FIELDS = Array.from(new Set(CAREERS.map(c => c.field)));

// ─── RESOURCES ───────────────────────────────────────────────────────────────
export type ResourceCategory = "Learn" | "Practice" | "Free Books" | "Tools" | "Jobs & Internships" | "Problem-Solvers";
export type ResourceCost = "free" | "freemium" | "free-audit" | "paid";

export interface Resource {
  id: string;
  name: string;
  url: string;             // official link — also serves as the citation
  category: ResourceCategory;
  levels: StudentLevel[];
  cost: ResourceCost;
  bestFor: string;
  reputationNote?: string; // editorial / qualitative — NOT presented as hard data
  asOf: string;
}

const Y = "2026";
export const RESOURCES: Resource[] = [
  // Learn
  { id: "fcc", name: "freeCodeCamp", url: "https://www.freecodecamp.org", category: "Learn", levels: ["college", "professional"], cost: "free", bestFor: "Hands-on coding & web/data curriculum", reputationNote: "Very widely recommended free coding path for beginners.", asOf: Y },
  { id: "khan", name: "Khan Academy", url: "https://www.khanacademy.org", category: "Learn", levels: ["school", "college"], cost: "free", bestFor: "School maths & science from scratch", reputationNote: "Long-standing go-to for school-level foundations.", asOf: Y },
  { id: "mitocw", name: "MIT OpenCourseWare", url: "https://ocw.mit.edu", category: "Learn", levels: ["college", "professional"], cost: "free", bestFor: "Full university course materials, free", asOf: Y },
  { id: "nptel", name: "NPTEL / SWAYAM", url: "https://nptel.ac.in", category: "Learn", levels: ["college", "competitive"], cost: "free", bestFor: "Indian university courses + recognised certificates", reputationNote: "Govt-backed (India); certificates via paid exam optional.", asOf: Y },
  { id: "cs50", name: "CS50 (Harvard)", url: "https://cs50.harvard.edu", category: "Learn", levels: ["college"], cost: "free", bestFor: "The classic intro to computer science", asOf: Y },
  { id: "coursera", name: "Coursera", url: "https://www.coursera.org", category: "Learn", levels: ["college", "professional"], cost: "free-audit", bestFor: "University courses — audit free, certificate paid", asOf: Y },
  { id: "mdn", name: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Learn", levels: ["college", "professional"], cost: "free", bestFor: "Authoritative web-development reference", asOf: Y },
  { id: "fcc-yt", name: "freeCodeCamp (YouTube)", url: "https://www.youtube.com/c/Freecodecamp", category: "Learn", levels: ["college", "professional"], cost: "free", bestFor: "Full-length free course videos", reputationNote: "YouTube picks are subjective — this is one of the most established channels.", asOf: Y },

  // Practice
  { id: "leetcode", name: "LeetCode", url: "https://leetcode.com", category: "Practice", levels: ["college", "professional"], cost: "freemium", bestFor: "Coding-interview problem practice", asOf: Y },
  { id: "kaggle", name: "Kaggle", url: "https://www.kaggle.com", category: "Practice", levels: ["college", "professional"], cost: "free", bestFor: "Datasets, notebooks & data-science competitions", asOf: Y },
  { id: "hackerrank", name: "HackerRank", url: "https://www.hackerrank.com", category: "Practice", levels: ["college", "professional"], cost: "freemium", bestFor: "Skill drills & coding assessments", asOf: Y },

  // Free Books (legal, non-piracy)
  { id: "openstax", name: "OpenStax", url: "https://openstax.org", category: "Free Books", levels: ["school", "college"], cost: "free", bestFor: "Peer-reviewed, openly-licensed textbooks", reputationNote: "Legally free (Rice University) — no piracy.", asOf: Y },
  { id: "gutenberg", name: "Project Gutenberg", url: "https://www.gutenberg.org", category: "Free Books", levels: ["school", "college", "professional"], cost: "free", bestFor: "Public-domain classic books", reputationNote: "Legally free public-domain works.", asOf: Y },

  // Tools
  { id: "anki", name: "Anki", url: "https://apps.ankiweb.net", category: "Tools", levels: ["school", "college", "competitive"], cost: "free", bestFor: "Spaced-repetition flashcards", asOf: Y },
  { id: "notion", name: "Notion", url: "https://www.notion.so", category: "Tools", levels: ["college", "professional"], cost: "freemium", bestFor: "Notes, planning & organisation", asOf: Y },
  { id: "zotero", name: "Zotero", url: "https://www.zotero.org", category: "Tools", levels: ["college", "professional"], cost: "free", bestFor: "Reference & citation manager", asOf: Y },
  { id: "overleaf", name: "Overleaf", url: "https://www.overleaf.com", category: "Tools", levels: ["college", "professional"], cost: "freemium", bestFor: "LaTeX writing for reports & theses", asOf: Y },
  { id: "desmos", name: "Desmos", url: "https://www.desmos.com", category: "Tools", levels: ["school", "college"], cost: "free", bestFor: "Free graphing calculator", asOf: Y },

  // Jobs & Internships
  { id: "internshala", name: "Internshala", url: "https://internshala.com", category: "Jobs & Internships", levels: ["college", "professional"], cost: "freemium", bestFor: "Internships & entry roles (India-focused)", asOf: Y },
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com", category: "Jobs & Internships", levels: ["college", "professional"], cost: "freemium", bestFor: "Networking + job listings", asOf: Y },
  { id: "wellfound", name: "Wellfound", url: "https://wellfound.com", category: "Jobs & Internships", levels: ["college", "professional"], cost: "free", bestFor: "Startup jobs & internships", asOf: Y },

  // Problem-Solvers
  { id: "stackoverflow", name: "Stack Overflow", url: "https://stackoverflow.com", category: "Problem-Solvers", levels: ["college", "professional"], cost: "free", bestFor: "Q&A for specific coding problems", asOf: Y },
  { id: "wolfram", name: "Wolfram Alpha", url: "https://www.wolframalpha.com", category: "Problem-Solvers", levels: ["school", "college"], cost: "freemium", bestFor: "Step-by-step maths & computation", asOf: Y },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = ["Learn", "Practice", "Free Books", "Tools", "Jobs & Internships", "Problem-Solvers"];

// ─── matching helper for Career Finder ─────────────────────────────────────────
export function matchCareers(pursuit: string): CareerPath[] {
  const q = pursuit.toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/[^a-z.+]+/).filter(Boolean);
  const scored = CAREERS.map(c => {
    let score = 0;
    for (const kw of c.matches) {
      if (q.includes(kw)) score += 2;
      else if (tokens.some(t => t === kw || kw.includes(t) && t.length > 2)) score += 1;
    }
    return { c, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.map(x => x.c);
}
