import React from 'react';
import { useProfile } from '../hooks/use-analysis';
import { Briefcase, TrendingUp, TrendingDown, PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#F43F5E', '#A78BFA'];

const MOCK_PORTFOLIO = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', quantity: 50, avgPrice: 2400, currentPrice: 2950, allocation: 40 },
  { symbol: 'TCS.NS',      name: 'Tata Consultancy',   quantity: 20, avgPrice: 3100, currentPrice: 3800, allocation: 25 },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank',          quantity: 100, avgPrice: 1550, currentPrice: 1480, allocation: 20 },
  { symbol: 'INFY.NS',     name: 'Infosys',            quantity: 40, avgPrice: 1400, currentPrice: 1650, allocation: 15 },
];

export default function Portfolio() {
  const { data: profile, isLoading } = useProfile();
  const portfolio = profile?.portfolio ?? MOCK_PORTFOLIO;

  const totalValue    = portfolio.reduce((a: number, s: any) => a + s.quantity * (s.currentPrice ?? s.avgPrice), 0);
  const totalInvested = portfolio.reduce((a: number, s: any) => a + s.quantity * s.avgPrice, 0);
  const totalPnl      = totalValue - totalInvested;
  const pnlPct        = (totalPnl / totalInvested) * 100;
  const positive      = totalPnl >= 0;

  const pieData = portfolio.map((s: any) => ({
    name: s.symbol.replace('.NS', ''),
    value: s.allocation ?? Math.round((s.quantity * (s.currentPrice ?? s.avgPrice) / totalValue) * 100),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-xl text-sm" style={{ background: '#0D1226', border: '1px solid rgba(139,92,246,0.25)' }}>
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-violet-400 font-bold">{payload[0].value}%</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <Briefcase className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient">My Portfolio</h1>
          </div>
          <p className="text-muted-foreground ml-12">Manage holdings for personalized scenario analysis.</p>
        </div>
        <button className="text-sm px-4 py-2 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,200,255,0.7)' }}
        >
          Sync Broker
        </button>
      </header>

      <div className="divider-gradient opacity-40" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Value',  val: formatCurrency(totalValue),    sub: null },
          { label: 'Total Invested',   val: formatCurrency(totalInvested), sub: null },
          { label: 'Total P&L',        val: `${positive ? '+' : ''}${formatCurrency(totalPnl)}`, sub: null, pos: positive },
          { label: 'Return',           val: `${pnlPct.toFixed(2)}%`, sub: null, pos: positive },
        ].map(({ label, val, pos }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4"
            style={{
              background: pos === undefined ? 'rgba(255,255,255,0.025)' : pos ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
              border: `1px solid ${pos === undefined ? 'rgba(255,255,255,0.07)' : pos ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
            }}
          >
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`font-mono-data font-bold text-xl ${pos === undefined ? 'text-foreground' : pos ? 'text-positive' : 'text-destructive'}`}>
              {val}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Holdings + Pie */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Holdings Table */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-display font-semibold text-sm text-foreground">Holdings</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {portfolio.map((stock: any, i: number) => {
              const currPrice = stock.currentPrice ?? stock.avgPrice;
              const currValue = stock.quantity * currPrice;
              const pnl       = currValue - stock.quantity * stock.avgPrice;
              const pnlP      = (pnl / (stock.quantity * stock.avgPrice)) * 100;
              const pos       = pnl >= 0;
              return (
                <motion.div key={stock.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="grid grid-cols-4 px-5 py-3.5 items-center text-sm hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <p className="font-mono-data font-semibold text-foreground">{stock.symbol.replace('.NS','')}</p>
                    <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-foreground">{stock.quantity}</p>
                    <p className="text-xs text-muted-foreground">@{formatCurrency(stock.avgPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-foreground">{formatCurrency(currValue)}</p>
                    <p className="text-xs text-muted-foreground">{stock.allocation ?? Math.round((currValue / totalValue)*100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold font-mono-data ${pos ? 'text-positive' : 'text-destructive'}`}>
                      {pos ? '+' : ''}{formatCurrency(pnl)}
                    </p>
                    <p className={`text-xs ${pos ? 'text-positive' : 'text-destructive'} opacity-80`}>
                      {pos ? '+' : ''}{pnlP.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Allocation Pie */}
        <div className="rounded-2xl p-5 flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-4 self-start">
            <PieIcon className="w-4 h-4 text-violet-400" />
            <h3 className="font-display font-semibold text-sm text-foreground">Allocation</h3>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                  dataKey="value" paddingAngle={3} strokeWidth={0}
                >
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-1.5 w-full mt-2">
            {pieData.map((d: any, i: number) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-mono-data font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
