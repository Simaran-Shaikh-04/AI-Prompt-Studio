// src/data/careerHubData.ts

export interface CareerResource {
  id: string;
  name: string;
  url: string;
  stars: number;
  cost: "free" | "freemium";
  bestFor: string;
  skills: string[];
  reputation: string; // qualitative/industry note
  aiClassification?: "resistant" | "augmented";
}

export interface CareerCategory {
  id: string;
  title: string;
  description: string;
  resources: CareerResource[];
}

export const CAREER_HUB_CATEGORIES: CareerCategory[] = [
  {
    id: "data-analysis",
    title: "Data Analysis & SQL Foundations",
    description: "The core skill of modern business analytics. Master SQL, query building, database operations, and data transformations.",
    resources: [
      {
        id: "sqlbolt",
        name: "SQLBolt",
        url: "https://sqlbolt.com",
        stars: 5,
        cost: "free",
        bestFor: "Interactive, step-by-step SQL tutorials directly in your browser",
        skills: ["SQL SELECT", "Table Joins", "Aggregations", "Filtering Data"],
        reputation: "Highly recommended for absolute beginners to build confidence."
      },
      {
        id: "sqlzoo",
        name: "SQLZoo",
        url: "https://sqlzoo.net",
        stars: 5,
        cost: "free",
        bestFor: "Hands-on SQL practice quizzes with immediate query testing",
        skills: ["Database Queries", "Subqueries", "SUM and COUNT", "SQL Joins"],
        reputation: "An industry-standard playground used by bootcamps worldwide."
      },
      {
        id: "mode-sql",
        name: "Mode Analytics SQL Tutorial",
        url: "https://mode.com/sql-tutorial",
        stars: 5,
        cost: "free",
        bestFor: "Advanced business analytics and real-world database queries",
        skills: ["Window Functions", "Data Wrangling", "Subqueries", "Performance Tuning"],
        reputation: "Highly trusted by data scientists for realistic analytics scenarios."
      },
      {
        id: "kaggle-sql",
        name: "Kaggle SQL Course",
        url: "https://www.kaggle.com/learn/intro-to-sql",
        stars: 5,
        cost: "free",
        bestFor: "BigQuery and large-dataset SQL operations inside Jupyter notebooks",
        skills: ["Google BigQuery", "Structured Queries", "AS & WITH clauses", "Group By"],
        reputation: "Best for transitioning SQL knowledge into Python environments."
      },
      {
        id: "leetcode-sql",
        name: "LeetCode SQL Study Plan",
        url: "https://leetcode.com/studyplan/30-days-of-sql",
        stars: 4,
        cost: "freemium",
        bestFor: "Solving competitive database challenges for interview prep",
        skills: ["Complex Joins", "Database Schema", "Query Optimization", "CTE"],
        reputation: "Excellent for polishing skills to pass technical screenings."
      },
      {
        id: "w3-sql",
        name: "W3Schools SQL",
        url: "https://www.w3schools.com/sql",
        stars: 4,
        cost: "free",
        bestFor: "Quick syntactical reference, cheatsheets, and mini-quizzes",
        skills: ["SQL Syntax", "INSERT/UPDATE/DELETE", "Primary Keys", "Foreign Keys"],
        reputation: "The most popular quick-reference cheatsheet on the internet."
      }
    ]
  },
  {
    id: "emerging-careers",
    title: "Emerging Fields & Fast-Growing Roles",
    description: "Skills and careers not traditionally taught in school or college curriculums, but seeing exponential industry growth.",
    resources: [
      {
        id: "learn-prompting",
        name: "Learn Prompting",
        url: "https://learnprompting.org",
        stars: 5,
        cost: "free",
        bestFor: "Mastering Prompt Engineering, AI Ops, and LLM orchestration",
        skills: ["Prompt Design", "Few-Shot Learning", "AI Agents", "Adversarial Prompting"],
        reputation: "Award-winning comprehensive curriculum on using AI effectively."
      },
      {
        id: "deeplearning-ai",
        name: "DeepLearning.AI (Andrew Ng)",
        url: "https://www.deeplearning.ai",
        stars: 5,
        cost: "free",
        bestFor: "Generative AI, AI Agent workflows, and vector databases",
        skills: ["LLM Orchestration", "RAG Systems", "AI Agents", "LangChain"],
        reputation: "Founded by industry icon Andrew Ng; considered the gold standard."
      },
      {
        id: "bubble-academy",
        name: "Bubble Academy",
        url: "https://academy.bubble.io",
        stars: 4,
        cost: "free",
        bestFor: "No-Code Development, visual programming, and shipping web apps",
        skills: ["Visual Programming", "Database Design", "Workflow Logic", "API Connectors"],
        reputation: "The premier platform for building apps without writing code."
      },
      {
        id: "webflow-univ",
        name: "Webflow University",
        url: "https://university.webflow.com",
        stars: 5,
        cost: "free",
        bestFor: "Visual CSS design, interaction development, and Web Design careers",
        skills: ["Visual CSS Grid", "Micro-Animations", "Flexbox Layout", "SEO Setup"],
        reputation: "Famed for its highly engaging, humorous, and clear courses."
      },
      {
        id: "cryptozombies",
        name: "CryptoZombies",
        url: "https://cryptozombies.io",
        stars: 5,
        cost: "free",
        bestFor: "Interactive Solidity programming for Smart Contracts & Blockchain",
        skills: ["Solidity", "Smart Contracts", "Web3.js", "Ethereum Basics"],
        reputation: "Learn coding by building a multiplayer zombie game."
      }
    ]
  },
  {
    id: "bcom-resistant",
    title: "B.Com Pathways: AI-Resistant Careers",
    description: "Traditional and advanced commerce roles that depend on human auditing, physical verification, regulatory law, and ethical judgement.",
    resources: [
      {
        id: "icai-bos",
        name: "ICAI Board of Studies (CA)",
        url: "https://www.icai.org",
        stars: 5,
        cost: "free",
        bestFor: "Chartered Accountancy - Statutory Audit, Forensic Audit & Tax Compliance",
        skills: ["Statutory Auditing", "Direct/Indirect Taxation", "Corporate Law", "Forensic Accounting"],
        reputation: "Regulated statutory audit must be signed by a licensed human CA.",
        aiClassification: "resistant"
      },
      {
        id: "icsi-bos",
        name: "ICSI Academic Portal (CS)",
        url: "https://www.icsi.edu",
        stars: 5,
        cost: "free",
        bestFor: "Company Secretary - Legal Compliance, Corporate Governance & Board Procedures",
        skills: ["Company Law", "Corporate Governance", "Board Minutes", "Compliance Auditing"],
        reputation: "Fiduciary responsibilities and board mediation require human oversight.",
        aiClassification: "resistant"
      },
      {
        id: "actuaries-india",
        name: "Actuarial Society of India",
        url: "https://www.actuariesindia.org",
        stars: 5,
        cost: "free",
        bestFor: "Actuarial Science - Advanced risk forecasting, insurance models & probability",
        skills: ["Risk Modeling", "Probability Statistics", "Pension Funds", "Financial Valuation"],
        reputation: "Complex mathematical risk assessment combined with legal compliance.",
        aiClassification: "resistant"
      },
      {
        id: "zerodha-varsity-law",
        name: "Zerodha Varsity (Corporate & Tax Law)",
        url: "https://zerodha.com/varsity",
        stars: 5,
        cost: "free",
        bestFor: "Learning foundational financial law, corporate taxes, and risk rules",
        skills: ["Corporate Taxation", "Filing Procedures", "Stock Market Rules", "Personal Finance"],
        reputation: "Best free Indian regulatory & markets study portal.",
        aiClassification: "resistant"
      }
    ]
  },
  {
    id: "bcom-augmented",
    title: "B.Com Pathways: AI-Augmented / Tech Careers",
    description: "Commerce and finance roles where AI, automation, dashboards, and quantitative algorithms are heavily used.",
    resources: [
      {
        id: "maven-analytics",
        name: "Maven Analytics",
        url: "https://mavenanalytics.io",
        stars: 5,
        cost: "freemium",
        bestFor: "Business Intelligence - building Power BI, Tableau, and Excel dashboards",
        skills: ["Power BI", "Tableau", "DAX", "Data Modeling in Excel"],
        reputation: "Highly practical, project-focused business intelligence courses.",
        aiClassification: "augmented"
      },
      {
        id: "cfi-augmented",
        name: "CFI (Corporate Finance Institute)",
        url: "https://corporatefinanceinstitute.com",
        stars: 5,
        cost: "freemium",
        bestFor: "AI-Augmented Financial Modeling, corporate valuation, and M&A analytics",
        skills: ["Financial Modeling", "Excel Automation", "Valuation Models", "AI in Finance"],
        reputation: "Gold standard for investment banking and corporate finance analysts.",
        aiClassification: "augmented"
      },
      {
        id: "quantinsti",
        name: "QuantInsti (EPAT)",
        url: "https://www.quantinsti.com",
        stars: 4,
        cost: "freemium",
        bestFor: "Algorithmic Trading & Quantitative Finance models",
        skills: ["Algorithmic Trading", "Python for Finance", "Quantitative Models", "Machine Learning"],
        reputation: "Popular platform for learning automated trading strategies.",
        aiClassification: "augmented"
      }
    ]
  }
];
