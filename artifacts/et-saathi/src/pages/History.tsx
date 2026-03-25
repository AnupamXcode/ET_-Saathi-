import React from 'react';
import { useHistory } from '../hooks/use-analysis';
import { Badge } from '../components/ui/badge';
import { History as HistoryIcon, Newspaper, GitBranch, Target, BarChart2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TYPE_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string; border: string }> = {
  news:       { icon: Newspaper, label: "News Analysis",    color: "#38BDF8", bg: "rgba(59,130,246,0.08)",    border: "rgba(59,130,246,0.2)" },
  scenario:   { icon: GitBranch, label: "Scenario",        color: "#A78BFA", bg: "rgba(139,92,246,0.08)",   border: "rgba(139,92,246,0.2)" },
  decision:   { icon: Target,    label: "Decision",        color: "#FCD34D", bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.2)" },
  simulation: { icon: BarChart2, label: "Simulation",      color: "#34D399", bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.2)" },
};

const MOCK_ITEMS = [
  { id: 1, type: "decision",   query: "RELIANCE.NS — strong Q3 results",        createdAt: new Date().toISOString(),                    result: { recommendation: "BUY",  confidence: 85 } },
  { id: 2, type: "scenario",   query: "What if US Fed cuts rates by 50bps?",     createdAt: new Date(Date.now() - 3600000).toISOString(), result: { niftyImpact: 1.2 } },
  { id: 3, type: "news",       query: "RBI Monetary policy minutes released",    createdAt: new Date(Date.now() - 86400000).toISOString(), result: { sentiment: "bearish" } },
  { id: 4, type: "simulation", query: "HDFCBANK.NS — ₹1L for 5 years",          createdAt: new Date(Date.now() - 172800000).toISOString(), result: { totalReturn: 148 } },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs  > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

function ResultChip({ type, result }: { type: string; result: any }) {
  if (!result) return null;
  if (type === 'decision' && result.recommendation) {
    const color = result.recommendation === 'BUY' ? '#34D399' : result.recommendation === 'AVOID' ? '#FB7185' : '#FCD34D';
    return <span className="font-mono-data font-bold text-xs" style={{ color }}>{result.recommendation} · {result.confidence}%</span>;
  }
  if (type === 'scenario' && result.niftyImpact != null) {
    const pos = result.niftyImpact >= 0;
    return <span className="font-mono-data text-xs font-bold" style={{ color: pos ? '#34D399' : '#FB7185' }}>
      Nifty {pos ? '+' : ''}{result.niftyImpact}%
    </span>;
  }
  if (type === 'news' && result.sentiment) {
    const color = result.sentiment === 'bullish' ? '#34D399' : result.sentiment === 'bearish' ? '#FB7185' : '#9CA3AF';
    return <span className="font-mono-data text-xs font-bold capitalize" style={{ color }}>{result.sentiment}</span>;
  }
  if (type === 'simulation' && result.totalReturn != null) {
    return <span className="text-positive font-bold text-xs">+{result.totalReturn}% return</span>;
  }
  return null;
}

export default function History() {
  const { data, isLoading } = useHistory();
  const items = data?.items ?? MOCK_ITEMS;

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <HistoryIcon className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient">Intelligence History</h1>
        </div>
        <p className="text-muted-foreground ml-12">Your recent AI analyses and simulations.</p>
      </header>

      <div className="divider-gradient opacity-40" />

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No analysis history yet. Start with a news analysis or scenario simulation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any, i: number) => {
            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.news;
            const Icon = cfg.icon;
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: 'easeOut' }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.005] cursor-default"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: `${cfg.color}cc` }}
                    >{cfg.label}</span>
                    {item.result && <ResultChip type={item.type} result={item.result} />}
                  </div>
                  <p className="text-sm font-medium text-foreground/90 truncate">{item.query}</p>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(item.createdAt)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
