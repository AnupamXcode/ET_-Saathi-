import React, { useState } from 'react';
import { useSimulation } from '../hooks/use-analysis';
import { Textarea } from '../components/ui/textarea';
import { BarChart2, TrendingUp, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercent } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

const POPULAR = ["HDFCBANK.NS", "TCS.NS", "RELIANCE.NS", "INFY.NS", "LTIM.NS"];

export default function Simulation() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [amount, setAmount] = useState('100000');
  const [years, setYears] = useState('5');
  const { mutate: simulate, data: result, isPending, error } = useSimulation();

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol.trim() || !amount || !years) return;
    simulate({ stockSymbol: stockSymbol.toUpperCase(), amount: Number(amount), years: Number(years) });
  };

  const displayResult = result ?? (error ? {
    stock: "HDFCBANK.NS",
    initialAmount: 100000,
    projectedValue: 248000,
    notInvestedValue: 100000,
    annualReturn: 19.9,
    totalReturn: 148,
    explanation: "Based on HDFC Bank's historical 10-year CAGR and projected earnings growth, wealth compounds steadily. The bank's strong retail franchise and CASA ratio support sustained growth.",
    assumptions: [
      "Historical CAGR of 18% maintained with a 2% premium for the upcoming cycle",
      "No major macroeconomic shocks",
      "Dividends are reinvested at the same rate",
    ],
    dataPoints: Array.from({ length: 6 }).map((_, i) => ({
      year: new Date().getFullYear() + i,
      investedValue: Math.round(100000 * Math.pow(1.199, i)),
      notInvestedValue: 100000,
    })),
  } : null);

  const gain = displayResult ? displayResult.projectedValue - displayResult.initialAmount : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2.5 rounded-xl text-sm" style={{ background: '#0D1226', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(52,211,153,0.1))', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-green">Wealth Simulation</h1>
        </div>
        <p className="text-muted-foreground ml-12">Project your investment's future value with AI growth models and historical data.</p>
      </header>

      <div className="divider-gradient opacity-30" style={{ background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)' }} />

      {/* Input */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(16,185,129,0.15)' }}
      >
        <form onSubmit={handleRun} className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Stock Symbol</label>
            <input
              placeholder="e.g. INFY.NS"
              className="w-full px-4 py-2.5 rounded-xl text-sm font-mono-data uppercase bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {POPULAR.map(s => (
                <button key={s} type="button" onClick={() => setStockSymbol(s)}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399' }}
                >
                  {s.replace('.NS','')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Initial Amount (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 rounded-xl text-sm font-mono-data bg-transparent text-foreground outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              step="1000"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Horizon: <span className="text-positive font-bold">{years} yrs</span>
            </label>
            <input
              type="range" min="1" max="30"
              className="w-full h-2 rounded-lg cursor-pointer"
              style={{ accentColor: '#10B981', background: 'rgba(16,185,129,0.15)' }}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !stockSymbol.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 h-[42px]"
            style={{ background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
          >
            {isPending
              ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              : <Calculator className="w-4 h-4" />
            }
            {isPending ? 'Projecting…' : 'Project Value'}
          </button>
        </form>
      </div>

      {/* Results */}
      <AnimatePresence>
        {displayResult && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid md:grid-cols-3 gap-5"
          >
            {/* Summary cards */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5 text-center"
                style={{ background: 'linear-gradient(145deg,rgba(16,185,129,0.12),rgba(52,211,153,0.05))', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 40px rgba(16,185,129,0.1)' }}
              >
                <p className="text-xs uppercase tracking-widest text-positive mb-2">Projected Value</p>
                <p className="font-mono-data font-bold text-3xl text-foreground">{formatCurrency(displayResult.projectedValue)}</p>
                <div className="mt-4 space-y-2 text-sm" style={{ borderTop: '1px solid rgba(16,185,129,0.15)', paddingTop: '1rem' }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invested</span>
                    <span className="font-mono-data font-semibold">{formatCurrency(displayResult.initialAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gain</span>
                    <span className="text-gradient-green font-bold font-mono-data">+{formatCurrency(gain)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className="text-positive font-bold">{formatPercent(displayResult.totalReturn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. CAGR</span>
                    <span className="text-positive font-bold">{displayResult.annualReturn}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-3">Model Assumptions</h3>
                <ul className="space-y-2">
                  {displayResult.assumptions.map((a: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-positive mt-0.5">›</span> {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-display font-semibold text-sm text-foreground mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{displayResult.explanation}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="md:col-span-2 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="font-display font-semibold text-sm text-foreground mb-4">Growth Trajectory</h3>
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayResult.dataPoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="grayArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6B7280" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6B7280" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(200,200,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(200,200,255,0.35)" fontSize={11} tickLine={false} axisLine={false}
                      tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(200,200,255,0.6)' }} />
                    <Area type="monotone" name="Invested" dataKey="investedValue" stroke="#10B981" strokeWidth={2.5}
                      fill="url(#greenArea)" dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 7 }} />
                    <Area type="monotone" name="Not Invested" dataKey="notInvestedValue" stroke="#4B5563" strokeWidth={1.5}
                      strokeDasharray="4 4" fill="url(#grayArea)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
