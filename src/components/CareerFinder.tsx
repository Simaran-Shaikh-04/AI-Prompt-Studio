import { useState } from "react";
import {
  Compass, Search, MapPin, GraduationCap, TrendingUp, Minus, TrendingDown,
  CheckCircle2, XCircle, ExternalLink, Briefcase, AlertCircle, Wrench
} from "lucide-react";
import { matchCareers, CAREERS } from "../data/hubData";
import type { CareerPath, Citation, DemandSignal } from "../data/hubData";

function CiteTag({ cite }: { cite?: Citation }) {
  if (!cite) return <span className="text-[9px] text-amber-400/70 italic">no source — treat as unverified</span>;
  return (
    <a href={cite.url} target="_blank" rel="noreferrer"
      className="text-[9px] text-slate-500 hover:text-sky-400 inline-flex items-center gap-1 transition">
      <ExternalLink className="w-2.5 h-2.5" /> {cite.source} · verified {cite.asOf}
    </a>
  );
}

function SignalBadge({ signal }: { signal: DemandSignal }) {
  const map: Record<DemandSignal, { c: string; icon: any; label: string }> = {
    "growing": { c: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50", icon: TrendingUp, label: "Growing" },
    "stable": { c: "text-slate-300 bg-slate-800/40 border-slate-700/50", icon: Minus, label: "Stable" },
    "declining": { c: "text-red-400 bg-red-950/40 border-red-800/50", icon: TrendingDown, label: "Declining" },
    "insufficient-data": { c: "text-amber-400 bg-amber-950/40 border-amber-800/50", icon: AlertCircle, label: "Insufficient data" },
  };
  const m = map[signal]; const Icon = m.icon;
  return <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${m.c}`}><Icon className="w-3 h-3" />{m.label}</span>;
}

export default function CareerFinder() {
  const [pursuit, setPursuit] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<CareerPath[] | null>(null);

  const run = () => setResults(matchCareers(pursuit));

  const localFor = (c: CareerPath) => {
    const loc = location.toLowerCase().trim();
    if (!loc) return null;
    return c.localDemand.find(d => d.location.toLowerCase().includes(loc) || loc.includes(d.location.toLowerCase())) || null;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400" /> Career Finder
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">Honest, source-backed guidance — no hype, no predictions without data.</p>
      </div>

      {/* Inputs */}
      <div className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">What are you currently pursuing?</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={pursuit} onChange={e => setPursuit(e.target.value)}
                onKeyDown={e => e.key === "Enter" && run()}
                placeholder="e.g., B.Com, CS Executive, computer science"
                className="w-full bg-[#080C16] border border-[#1A2138] focus:border-sky-700/60 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Your location (optional)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === "Enter" && run()}
                placeholder="e.g., Nagpur, Maharashtra"
                className="w-full bg-[#080C16] border border-[#1A2138] focus:border-sky-700/60 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none" />
            </div>
          </div>
        </div>
        <button onClick={run}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
          <Search className="w-3.5 h-3.5" /> Find matching paths
        </button>
      </div>

      {/* Results */}
      {results !== null && results.length === 0 && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-5 text-amber-300/90 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold">No curated career matches "{pursuit}" yet.</p>
            <p className="text-xs text-amber-300/70 mt-1">Rather than guess, the Finder stays quiet. Try a broader term (e.g. "commerce", "computer", "finance"), or add this path to <code className="text-amber-200">hubData.ts</code> with a source.</p>
          </div>
        </div>
      )}

      {results !== null && results.length > 0 && (
        <div className="space-y-4">
          {location.trim() && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-sky-400" /> Showing global outlook — add cited local data for "{location}" to refine.
            </p>
          )}
          {results.map(c => {
            const local = localFor(c);
            return (
              <div key={c.id} className="bg-[#0D1225] border border-[#1A2138] rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2"><Briefcase className="w-4 h-4 text-sky-400" />{c.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.field}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{c.summary}</p>
                  </div>
                  <SignalBadge signal={c.outlook.signal} />
                </div>

                {/* Outlook */}
                <div className="bg-[#080C16] border border-[#1A2138] rounded-xl p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">Demand outlook</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{c.outlook.note}</p>
                  <CiteTag cite={c.outlook.cite} />
                  <div className="pt-1.5 mt-1.5 border-t border-[#1A2138]">
                    {local ? (
                      <><p className="text-[11px] text-slate-300">{location}: {local.note}</p><CiteTag cite={local.cite} /></>
                    ) : (
                      <p className="text-[10px] text-amber-400/70 italic">No local demand data for {location.trim() || "your area"} in the dataset yet — not estimated.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Qualification path</span>
                    <ol className="space-y-1">
                      {c.qualifications.map((q, i) => <li key={i} className="text-[11px] text-slate-400 flex gap-1.5"><span className="text-sky-500">{i + 1}.</span>{q}</li>)}
                    </ol>
                    {c.pathCite && <CiteTag cite={c.pathCite} />}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1"><Wrench className="w-3 h-3" /> Core skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.coreSkills.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#080C16] border border-[#1A2138] text-slate-400">{s}</span>)}
                    </div>
                    {c.governingBody && <p className="text-[10px] text-slate-500">Body: {c.governingBody}</p>}
                  </div>
                </div>

                {/* Fit guide */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-[#1A2138]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">A fit if you</span>
                    {c.fitFor.map((f, i) => <p key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />{f}</p>)}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">Maybe not if you</span>
                    {c.notFitIf.map((f, i) => <p key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5"><XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />{f}</p>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {results === null && (
        <p className="text-xs text-slate-500 text-center py-6">Enter what you're studying to see source-backed career paths from {CAREERS.length} curated entries.</p>
      )}
    </div>
  );
}
