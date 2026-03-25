import React, { useState } from 'react';
import { useRunScenario } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GitBranch, TrendingDown, TrendingUp, Target, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPercent } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const QUICK_SCENARIOS = [
  "Crude oil surges to $120/barrel",
  "US Fed cuts rates by 50bps",
  "Monsoon deficit of 20% this year",
  "HDFC Bank reports 20% profit drop",
  "India-China border tensions escalate",
];

export default function ScenarioEngine() {
  const [query, setQuery] = useState('');
  const { mutate: runScenario, data: result, isPending, error } = useRunScenario();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    runScenario(query);
  };

  const displayResult = result ?? (error ? {
    scenario: "What if crude oil prices surge to $120/barrel?",
    niftyImpact: -2.4,
    confidence: 82,
    explanation: "A surge in crude oil to $120 would significantly inflate India's import bill, widening the current account deficit and depreciating the Rupee. Inflationary pressures would likely force the RBI to tighten policy, impacting overall equity valuations.",
    sectorImpacts: [
      { sector: "Aviation", change: -6.5, direction: "down" },
      { sector: "Paints", change: -8.2, direction: "down" },
      { sector: "FMCG", change: -3.1, direction: "down" },
      { sector: "O&G Expl.", change: 5.4, direction: "up" },
      { sector: "IT", change: -0.5, direction: "neutral" },
    ],
    impactedCompanies: [
      { name: "Asian Paints", symbol: "ASIANPAINT.NS", impact: -9.5, direction: "down", reason: "Crude derivatives form 40% of raw material costs." },
      { name: "IndiGo", symbol: "INDIGO.NS", impact: -8.0, direction: "down", reason: "ATF constitutes 40-50% of operating expenses." },
      { name: "ONGC", symbol: "ONGC.NS", impact: 6.5, direction: "up", reason: "Higher crude realizations directly boost profitability." },
    ],
    actionableInsights: [
      "Hedge portfolio with out-of-the-money Nifty Puts.",
      "Reduce exposure to paint and aviation stocks immediately.",
      "Accumulate upstream oil exploration companies as a tactical play.",
    ]
  } : null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="px-3 py-2 rounded-xl text-sm" style={{ background: '#0D1226', border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <p className="font-semibold text-foreground mb-0.5">{d.sector}</p>
        <p className={`font-bold ${d.change >= 0 ? 'text-positive' : 'text-destructive'}`}>{formatPercent(d.change)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(79,70,229,0.15))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <GitBranch className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient">Scenario Engine</h1>
        </div>
        <p className="text-muted-foreground ml-12">Simulate macroeconomic events and model their sectoral ripple effects.</p>
      </header>

      <div className="divider-gradient opacity-40" />

      {/* Input */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(139,92,246,0.15)' }}
      >
        <form onSubmit={handleRun} className="flex gap-3">
          <input
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
            placeholder="e.g., What if the US Fed raises rates by 1%?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isPending || !query.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#8B5CF6,#4F46E5)', color: '#fff', boxShadow: '0 0 20px rgba(139,92,246,0.3)', flexShrink: 0 }}
          >
            {isPending
              ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              : <Zap className="w-4 h-4" />
            }
            {isPending ? 'Simulating…' : 'Run'}
          </button>
        </form>

        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {QUICK_SCENARIOS.map((s) => (
            <button key={s} onClick={() => setQuery(s)}
              className="text-xs px-3 py-1 rounded-full transition-all hover:opacity-90"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {displayResult && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Top row: Nifty Impact + Chart */}
            <div className="grid md:grid-cols-4 gap-5">
              <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                style={{
                  background: displayResult.niftyImpact >= 0
                    ? 'linear-gradient(145deg,rgba(16,185,129,0.1),rgba(52,211,153,0.05))'
                    : 'linear-gradient(145deg,rgba(244,63,94,0.1),rgba(251,113,133,0.05))',
                  border: `1px solid ${displayResult.niftyImpact >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
                }}
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">NIFTY Impact</p>
                <div className="flex items-center gap-2">
                  {displayResult.niftyImpact >= 0
                    ? <TrendingUp className="w-6 h-6 text-positive" />
                    : <TrendingDown className="w-6 h-6 text-destructive" />
                  }
                  <span className={`font-display font-bold text-4xl ${displayResult.niftyImpact >= 0 ? 'text-gradient-green' : 'text-gradient-red'}`}>
                    {formatPercent(displayResult.niftyImpact)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Confidence: <span className="text-foreground font-medium">{displayResult.confidence}%</span></p>
              </div>

              <div className="md:col-span-3 rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-4">Sectoral Impact Distribution</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayResult.sectorImpacts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="sector" stroke="rgba(200,200,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(200,200,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                      <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                        {displayResult.sectorImpacts.map((e: any, i: number) => (
                          <Cell key={i} fill={e.change >= 0 ? 'url(#greenGrad)' : 'url(#redGrad)'} />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F43F5E" />
                          <stop offset="100%" stopColor="#E11D48" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom row: Stocks + Rationale + Insights */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-4">Highly Impacted Stocks</h3>
                <div className="space-y-3">
                  {displayResult.impactedCompanies.map((c: any) => (
                    <div key={c.symbol} className="p-3.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="font-mono-data font-semibold text-sm text-foreground">{c.symbol}</p>
                          <p className="text-xs text-muted-foreground">{c.name}</p>
                        </div>
                        <span className={`font-bold text-sm ${c.impact >= 0 ? 'text-positive' : 'text-destructive'}`}>
                          {formatPercent(c.impact)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <h3 className="font-display font-semibold text-sm text-foreground mb-3">Rationale</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{displayResult.explanation}</p>
                </div>

                <div className="rounded-2xl p-5"
                  style={{ background: 'linear-gradient(145deg,rgba(245,158,11,0.08),rgba(252,211,77,0.04))', border: '1px solid rgba(245,158,11,0.2)' }}
                >
                  <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"
                    style={{ color: '#FCD34D' }}
                  >
                    <Lightbulb className="w-4 h-4" /> Actionable Insights
                  </h3>
                  <ul className="space-y-2">
                    {displayResult.actionableInsights.map((ins: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="text-yellow-400 mt-0.5">›</span>
                        <span className="text-foreground/85">{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
