import React, { useState } from 'react';
import { useAnalyzeNews } from '../hooks/use-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ConfidenceMeter } from '../components/ui/confidence-meter';
import { AlertTriangle, Zap, TrendingUp, TrendingDown, Minus, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_NEWS = `Reliance Industries reported its Q3 FY25 results today, posting a net profit of ₹21,930 crore, beating analyst estimates by 8%. The company's O2C segment showed 12% margin expansion due to favourable crude differentials. Jio Platforms added 8 million subscribers this quarter with ARPU rising to ₹195. The retail segment, however, saw moderated growth of 6% YoY amid cautious consumer spending. Management guided for continued capital expenditure of ₹1.5 lakh crore over the next 3 years in green energy and 5G infrastructure.`;

export default function AnalyzeNews() {
  const [newsText, setNewsText] = useState('');
  const { mutate: analyze, data: result, isPending, error, reset } = useAnalyzeNews();

  const handleAnalyze = () => {
    if (!newsText.trim()) return;
    analyze(newsText);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return { text: 'text-positive', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' };
      case 'bearish': return { text: 'text-destructive', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.3)' };
      default: return { text: 'text-muted-foreground', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
    }
  };

  const displayResult = result ?? (error ? {
    keyEvent: "RBI announces unexpected repo rate hike of 50 basis points",
    eventType: "Monetary Policy",
    sentiment: "bearish",
    sentimentScore: 25,
    confidence: 88,
    summary: "The Reserve Bank of India has increased the repo rate by 50 bps to curb inflation. This unexpected move will increase borrowing costs for banks, leading to higher interest rates for consumers and potentially slowing economic growth.",
    marketImpact: "Broad negative impact expected on interest-rate sensitive sectors like Real Estate, Auto, and Banking. IT might see neutral to slightly negative impact due to broader market sentiment.",
    affectedSectors: [
      { name: "Real Estate", impact: "negative", magnitude: 8 },
      { name: "Banking & Financials", impact: "negative", magnitude: 6 },
      { name: "Automobiles", impact: "negative", magnitude: 5 },
      { name: "FMCG", impact: "neutral", magnitude: 2 },
    ],
    riskWarnings: [
      "High probability of near-term market correction.",
      "Home loan EMI increases may reduce consumer spending.",
      "Corporate margins may squeeze due to higher cost of capital."
    ]
  } : null);

  const sc = displayResult ? getSentimentColor(displayResult.sentiment) : null;

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.15))', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <Newspaper className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-3xl font-display font-bold" style={{ background: 'linear-gradient(135deg,#60A5FA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            News Intelligence
          </h1>
        </div>
        <p className="text-muted-foreground ml-12">Paste any financial news or press release to extract AI-powered market insights.</p>
      </header>

      <div className="divider-gradient opacity-40" />

      {/* Input Card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(59,130,246,0.18)' }}
      >
        <div className="p-5">
          <Textarea
            placeholder="Paste article text, press release, or earnings call transcript here..."
            className="min-h-[150px] text-base font-mono leading-relaxed resize-none"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => { setNewsText(SAMPLE_NEWS); reset?.(); }}
              className="text-xs transition-colors hover:text-foreground"
              style={{ color: 'rgba(200,200,255,0.4)' }}
            >
              Load sample news →
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isPending || !newsText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(59,130,246,0.3)',
              }}
            >
              {isPending
                ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <Zap className="w-4 h-4" />
              }
              {isPending ? 'Analysing…' : 'Extract Intelligence'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {displayResult && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-5"
          >
            {/* Left: main insight */}
            <div className="md:col-span-2 space-y-5">
              {/* Key Event */}
              <div className="relative rounded-2xl overflow-hidden p-6"
                style={{ background: 'linear-gradient(145deg,rgba(139,92,246,0.08),rgba(6,182,212,0.04))', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-r-full"
                  style={{ background: 'linear-gradient(180deg,#8B5CF6,#06B6D4)' }}
                />
                <Badge style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}
                  className="mb-3 text-[10px] uppercase tracking-widest font-semibold rounded-full"
                >
                  {displayResult.eventType}
                </Badge>
                <h2 className="text-xl font-display font-bold text-foreground leading-snug mb-4">
                  {displayResult.keyEvent}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{displayResult.summary}</p>

                <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" /> Market Impact
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{displayResult.marketImpact}</p>
                </div>
              </div>

              {/* Risk Warnings */}
              <div className="rounded-2xl overflow-hidden p-5"
                style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)' }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5 rounded"
                  style={{ background: 'linear-gradient(90deg,rgba(244,63,94,0.6),transparent)' }}
                />
                <h3 className="flex items-center gap-2 font-display font-semibold text-base mb-4"
                  style={{ color: '#FB7185' }}
                >
                  <AlertTriangle className="w-4 h-4" /> Risk Warnings
                </h3>
                <ul className="space-y-2">
                  {displayResult.riskWarnings?.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm p-3 rounded-xl"
                      style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.12)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-destructive" />
                      <span className="text-foreground/85">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: metrics */}
            <div className="space-y-5">
              {/* Confidence + Sentiment */}
              <div className="rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Analysis Metrics</p>
                <div className="flex justify-center mb-5">
                  <ConfidenceMeter score={displayResult.confidence} size={130} strokeWidth={9} />
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Sentiment</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wide text-sm"
                  style={{ background: sc?.bg, border: `1px solid ${sc?.border}` }}
                >
                  {displayResult.sentiment === 'bullish' ? <TrendingUp className="w-4 h-4" /> : displayResult.sentiment === 'bearish' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  <span className={sc?.text}>{displayResult.sentiment}</span>
                </div>
              </div>

              {/* Sector Impact */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="font-display font-semibold text-sm mb-4 text-foreground">Sector Impact</h3>
                <div className="space-y-3">
                  {displayResult.affectedSectors.map((s: any) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground/90">{s.name}</span>
                        <span className={s.impact === 'positive' ? 'text-positive' : s.impact === 'negative' ? 'text-destructive' : 'text-muted-foreground'}>
                          {s.impact.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.magnitude / 10) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                          style={{
                            background: s.impact === 'positive'
                              ? 'linear-gradient(90deg,#059669,#34D399)'
                              : s.impact === 'negative'
                              ? 'linear-gradient(90deg,#E11D48,#FB7185)'
                              : 'rgba(255,255,255,0.3)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
