import { useState, useMemo } from "react";
import {
  Library, ExternalLink, Check, Flag, Search,
  BookOpen, GraduationCap, Target, Rocket
} from "lucide-react";
import { RESOURCES, RESOURCE_CATEGORIES } from "../data/hubData";
import type { Resource, ResourceCategory, ResourceCost } from "../data/hubData";
import type { StudentLevel } from "../data/studentPresets";

const LEVELS: { id: StudentLevel | "all"; label: string; icon: any }[] = [
  { id: "all", label: "All levels", icon: Library },
  { id: "school", label: "School", icon: BookOpen },
  { id: "college", label: "College", icon: GraduationCap },
  { id: "competitive", label: "Competitive", icon: Target },
  { id: "professional", label: "Career", icon: Rocket },
];

const COST_LABEL: Record<ResourceCost, { label: string; c: string }> = {
  "free": { label: "Free", c: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50" },
  "freemium": { label: "Freemium", c: "text-sky-400 bg-sky-950/40 border-sky-800/50" },
  "free-audit": { label: "Free to audit", c: "text-violet-400 bg-violet-950/40 border-violet-800/50" },
  "paid": { label: "Paid", c: "text-slate-400 bg-slate-800/40 border-slate-700/50" },
};

export default function ResourceHub() {
  const [level, setLevel] = useState<StudentLevel | "all">("all");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [freeFirst, setFreeFirst] = useState(false);
  const [query, setQuery] = useState("");
  const [flagged, setFlagged] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      if (level !== "all" && !r.levels.includes(level)) return false;
      if (category !== "all" && r.category !== category) return false;
      if (freeFirst && !(r.cost === "free" || r.cost === "free-audit")) return false;
      if (query.trim() && !(`${r.name} ${r.bestFor}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [level, category, freeFirst, query]);

  const reportDead = (r: Resource) => {
    const text = `Resource report — "${r.name}" (${r.url}): [describe the issue, e.g. dead link / outdated / moved]`;
    navigator.clipboard.writeText(text);
    setFlagged(r.id);
    setTimeout(() => setFlagged(null), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Library className="w-5 h-5 text-amber-400" /> Resource Hub
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">Trusted, free-first places to learn — every entry links to its official source.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources…"
            className="w-full bg-[#080C16] border border-[#1A2138] focus:border-amber-700/50 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map(l => {
            const Icon = l.icon; const on = level === l.id;
            return (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${on ? "bg-amber-950/40 text-amber-300 border-amber-800/60" : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300 hover:border-slate-700"}`}>
                <Icon className="w-3 h-3" /> {l.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setCategory("all")}
            className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${category === "all" ? "bg-slate-800 text-white border-slate-700" : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300"}`}>All</button>
          {RESOURCE_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${category === cat ? "bg-slate-800 text-white border-slate-700" : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300"}`}>{cat}</button>
          ))}
          <button onClick={() => setFreeFirst(f => !f)}
            className={`ml-auto text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${freeFirst ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60" : "bg-[#080C16] border-[#1A2138] text-slate-500 hover:text-slate-300"}`}>
            {freeFirst ? "✓ Free only" : "Free only"}
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-8">No resources match these filters yet. Clear a filter, or add one to <code className="text-slate-400">hubData.ts</code>.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(r => {
            const cost = COST_LABEL[r.cost];
            return (
              <div key={r.id} className="bg-[#0D1225] border border-[#1A2138] rounded-xl p-4 space-y-2.5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="text-sm font-bold text-white hover:text-amber-300 inline-flex items-center gap-1.5 transition">
                    {r.name} <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ${cost.c}`}>{cost.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed flex-1">{r.bestFor}.</p>
                {r.reputationNote && <p className="text-[10px] text-slate-500 italic leading-normal">{r.reputationNote}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-[#1A2138]">
                  <span className="text-[9px] text-slate-600">{r.category} · checked {r.asOf}</span>
                  <button onClick={() => reportDead(r)}
                    className={`text-[9px] inline-flex items-center gap-1 transition cursor-pointer ${flagged === r.id ? "text-emerald-400" : "text-slate-600 hover:text-amber-400"}`}>
                    {flagged === r.id ? <><Check className="w-2.5 h-2.5" /> Copied report</> : <><Flag className="w-2.5 h-2.5" /> Report</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-slate-600 text-center">
        Free-first and piracy-free by design — only official sites and openly-licensed material. "Report" copies a prefilled note for you to log.
      </p>
    </div>
  );
}
