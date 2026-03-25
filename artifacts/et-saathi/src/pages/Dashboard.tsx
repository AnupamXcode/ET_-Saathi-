import React from 'react';
import { useAuth } from '../hooks/use-auth';
import { useMarketData } from '../hooks/use-market';
import { Card, CardContent } from '../components/ui/card';
import { ArrowUpRight, TrendingUp, TrendingDown, Newspaper, GitBranch, Target, BarChart2, RefreshCw, Activity } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { formatPercent } from '../lib/utils';

const QUICK_ACTIONS = [
  {
    title: "News Intelligence",
    desc: "AI-powered extraction of market impact and sentiment from any article or press release.",
    icon: Newspaper,
    href: "/analyze-news",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))",
    border: "rgba(59,130,246,0.25)",
    iconColor: "#38BDF8",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    title: "Scenario Engine",
    desc: "Simulate macroeconomic 'what-if' events and model their sectoral ripple effects.",
    icon: GitBranch,
    href: "/scenario",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(79,70,229,0.08))",
    border: "rgba(139,92,246,0.25)",
    iconColor: "#A78BFA",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    title: "Decision Engine",
    desc: "Get AI-driven Buy / Hold / Avoid verdicts with confidence scoring and target prices.",
    icon: Target,
    href: "/decision",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(252,211,77,0.06))",
    border: "rgba(245,158,11,0.25)",
    iconColor: "#FCD34D",
    glow: "rgba(245,158,11,0.12)",
  },
  {
    title: "Wealth Simulation",
    desc: "Project your investment's future value with AI growth models and historical data.",
    icon: BarChart2,
    href: "/simulate",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.06))",
    border: "rgba(16,185,129,0.25)",
    iconColor: "#34D399",
    glow: "rgba(16,185,129,0.12)",
  },
];

const SYMBOL_DISPLAY: Record<string, { shortName: string; flag?: string }> = {
  "^NSEI":    { shortName: "NIFTY 50" },
  "^BSESN":   { shortName: "SENSEX" },
  "^NSEBANK": { shortName: "BANK NIFTY" },
  "^INDIAVIX":{ shortName: "INDIA VIX" },
  "USDINR=X": { shortName: "USD/INR" },
  "GC=F":     { shortName: "GOLD" },
};

function MarketCard({ quote, index }: { quote: any; index: number }) {
  const positive = quote.changePercent >= 0;
  const display = SYMBOL_DISPLAY[quote.symbol] || { shortName: quote.name };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, ease: 'easeOut' }}
    >
      <div className="relative rounded-2xl overflow-hidden p-4 h-full"
        style={{
          background: positive
            ? 'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(145deg, rgba(244,63,94,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${positive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
          boxShadow: positive
            ? '0 4px 24px rgba(16,185,129,0.06)'
            : '0 4px 24px rgba(244,63,94,0.06)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: positive ? 'rgba(52,211,153,0.7)' : 'rgba(251,113,133,0.7)' }}
        >
          {display.shortName}
        </p>
        <div className="flex items-end justify-between">
          <span className="font-mono-data text-xl font-bold text-foreground">
            {quote.symbol === "USDINR=X"
              ? `₹${quote.price.toFixed(2)}`
              : quote.symbol === "GC=F"
              ? `$${quote.price.toFixed(0)}`
              : quote.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center gap-1 text-sm font-bold ${positive ? 'text-positive' : 'text-destructive'}`}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {formatPercent(quote.changePercent)}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(200,200,255,0.35)' }}>
          {positive ? '+' : ''}{typeof quote.change === 'number' ? quote.change.toFixed(2) : '—'}
        </p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: market, isLoading: marketLoading, refetch, dataUpdatedAt } = useMarketData();
  const firstName = user?.name?.split(' ')[0] ?? 'Trader';

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="space-y-8 pb-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-gradient leading-tight">Terminal Overview</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Welcome back, <span className="text-gradient-gold font-semibold">{firstName}</span>.
            {' '}Real-time intelligence at your command.
          </p>
        </div>
        {lastUpdated && (
          <button onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 flex-shrink-0"
            style={{ color: 'rgba(200,200,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <RefreshCw className={`w-3 h-3 ${marketLoading ? 'animate-spin' : ''}`} />
            {market?.live ? '🟢 Live' : '🟡 Demo'} · {lastUpdated}
          </button>
        )}
      </header>

      {/* Gradient divider */}
      <div className="divider-gradient opacity-50" />

      {/* Live Market Indices */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.8)' }}>
            Live Market Feed
          </h2>
        </div>

        {marketLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {(market?.data ?? []).map((q, i) => (
              <MarketCard key={q.symbol} quote={q} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Gradient divider */}
      <div className="divider-gradient opacity-30" />

      {/* Intelligence Engines */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg,#8B5CF6,#06B6D4)' }} />
          <h2 className="text-lg font-display font-semibold text-foreground">Intelligence Engines</h2>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08, ease: 'easeOut' }}
            >
              <Link href={action.href} className="block h-full group">
                <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    background: action.gradient,
                    border: `1px solid ${action.border}`,
                  }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(ellipse at 50% 120%, ${action.glow} 0%, transparent 70%)` }}
                  />

                  <div className="relative p-5">
                    {/* Arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                      <ArrowUpRight className="w-4 h-4" style={{ color: action.iconColor }} />
                    </div>

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `rgba(${action.iconColor},0.1)`, border: `1px solid ${action.border}` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.iconColor }} />
                    </div>

                    <h3 className="font-display font-semibold text-foreground mb-1.5 group-hover:text-white transition-colors text-sm">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,200,255,0.55)' }}>
                      {action.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom hint */}
      <div className="text-center pt-2">
        <p className="text-xs" style={{ color: 'rgba(200,200,255,0.25)' }}>
          Data refreshes every 30 seconds · Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
