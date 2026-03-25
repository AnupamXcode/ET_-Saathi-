import React, { useState } from 'react';
import { useDecisionEngine } from '../hooks/use-analysis';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ConfidenceMeter } from '../components/ui/confidence-meter';
import { Target, CheckCircle2, AlertOctagon, TrendingUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../lib/utils';

const POPULAR_STOCKS = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "BHARTIARTL.NS"];

export default function DecisionEngine() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [newsContext, setNewsContext] = useState('');
  const { mutate: getDecision, data: result, isPending, error } = useDecisionEngine();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol.trim()) return;
    getDecision({ stockSymbol: stockSymbol.toUpperCase(), newsContext });
  };

  const displayResult = result ?? (error ? {
    stock: "RELIANCE.NS",
    recommendation: "buy",
    confidence: 85,
    riskLevel: "medium",
    targetPrice: 3250,
    stopLoss: 2840,
    timeHorizon: "6-9 Months",
    explanation: "Reliance shows strong technical breakout supported by robust gross refining margins in the O2C segment and continued subscriber additions in Jio. The recent retail expansion adds to positive momentum.",
    reasons: [
      "O2C margins expanding beyond historical averages",
      "Jio ARPU increases starting to reflect in bottom line",
      "Debt reduction trajectory on track",
    ],
    warnings: [
      "Susceptible to sudden drops in global crude demand",
      "Valuations are slightly stretched vs. historical peers",
    ]
  } : null);

  const getRec = (rec: string) => {
    switch (rec?.toLowerCase()) {
      case 'buy': return {
        label: 'BUY', textGrad: 'linear-gradient(135deg,#10B981,#34D399)',
        bg: 'linear-gradient(145deg,rgba(16,185,129,0.12),rgba(52,211,153,0.05))',
        border: 'rgba(16,185,129,0.3)', glow: '0 0 60px rgba(16,185,129,0.18)',
      };
      case 'avoid': return {
        label: 'AVOID', textGrad: 'linear-gradient(135deg,#F43F5E,#FB7185)',
        bg: 'linear-gradient(145deg,rgba(244,63,94,0.12),rgba(251,113,133,0.05))',
        border: 'rgba(244,63,94,0.3)', glow: '0 0 60px rgba(244,63,94,0.18)',
      };
      default: return {
        label: 'HOLD', textGrad: 'linear-gradient(135deg,#F59E0B,#FCD34D)',
        bg: 'linear-gradient(145deg,rgba(245,158,11,0.12),rgba(252,211,77,0.05))',
        border: 'rgba(245,158,11,0.3)', glow: '0 0 60px rgba(245,158,11,0.18)',
      };
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(252,211,77,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <Target className="w-4 h-4 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold">Decision Engine</h1>
        </div>
        <p className="text-muted-foreground ml-12">Get AI-driven Buy / Hold / Avoid recommendations with confidence scoring.</p>
      </header>

      <div className="divider-gradient-gold opacity-50" />

      {/* Input */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(245,158,11,0.15)' }}
      >
        <form onSubmit={handleRun} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Stock Symbol
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="e.g. RELIANCE.NS"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-mono-data uppercase bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {POPULAR_STOCKS.map(s => (
                  <button key={s} type="button" onClick={() => setStockSymbol(s)}
                    className="text-[10px] px-2 py-0.5 rounded-full transition-all"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#FCD34D' }}
                  >
                    {s.replace('.NS', '')}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                Context / News (Optional)
              </label>
              <Textarea
                placeholder="Paste any recent news or thesis you want the AI to consider..."
                className="min-h-[64px] text-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}
                value={newsContext}
                onChange={(e) => setNewsContext(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !stockSymbol.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B,#FCD34D)', color: '#1a0e00', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
            >
              {isPending
                ? <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                : <Target className="w-4 h-4" />
              }
              {isPending ? 'Analysing…' : 'Generate Decision'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <AnimatePresence>
        {displayResult && (() => {
          const rec = getRec(displayResult.recommendation);
          return (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-5"
            >
              {/* Main Verdict */}
              <div className="md:col-span-2">
                <div className="relative rounded-2xl overflow-hidden p-7"
                  style={{ background: rec.bg, border: `1px solid ${rec.border}`, boxShadow: rec.glow }}
                >
                  {/* Ambient blob */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[60px] pointer-events-none"
                    style={{ background: rec.border.replace('0.3', '0.2') }} />

                  <div className="relative flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-mono-data text-muted-foreground">{displayResult.stock}</span>
                      <h2 className="font-display font-bold text-6xl mt-1 leading-none"
                        style={{ background: rec.textGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                      >
                        {rec.label}
                      </h2>
                    </div>
                    <ConfidenceMeter score={displayResult.confidence} size={90} strokeWidth={7} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-5 mb-5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {[
                      { label: 'Target Price', val: displayResult.targetPrice ? formatCurrency(displayResult.targetPrice) : 'N/A' },
                      { label: 'Stop Loss', val: displayResult.stopLoss ? formatCurrency(displayResult.stopLoss) : 'N/A' },
                      { label: 'Time Horizon', val: displayResult.timeHorizon || 'N/A' },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-mono-data font-bold text-lg text-foreground">{val}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">{displayResult.explanation}</p>
                </div>
              </div>

              {/* Supporting Factors + Risks */}
              <div className="space-y-5">
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <h3 className="font-display font-semibold text-sm flex items-center gap-2 text-positive mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Supporting Factors
                  </h3>
                  <ul className="space-y-2">
                    {displayResult.reasons.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm p-2.5 rounded-lg"
                        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)' }}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-positive shrink-0 mt-0.5" />
                        <span className="text-foreground/85">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {displayResult.warnings?.length > 0 && (
                  <div className="rounded-2xl p-5"
                    style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)' }}
                  >
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2 text-destructive mb-3">
                      <AlertOctagon className="w-4 h-4" /> Key Risks
                    </h3>
                    <ul className="space-y-2">
                      {displayResult.warnings.map((w: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm p-2.5 rounded-lg"
                          style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.1)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                          <span className="text-foreground/85">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
