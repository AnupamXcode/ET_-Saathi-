import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SYMBOLS = ["^NSEI", "^BSESN", "^NSEBANK", "^INDIAVIX", "USDINR=X", "GC=F"];

const MOCK_DATA = [
  { symbol: "^NSEI", name: "NIFTY 50", price: 22453.30, change: 190.30, changePercent: 0.85, previousClose: 22263 },
  { symbol: "^BSESN", name: "SENSEX", price: 73903.91, change: 527.60, changePercent: 0.72, previousClose: 73376 },
  { symbol: "^NSEBANK", name: "BANK NIFTY", price: 48159.00, change: -103.20, changePercent: -0.21, previousClose: 48262 },
  { symbol: "^INDIAVIX", name: "INDIA VIX", price: 12.45, change: -0.27, changePercent: -2.15, previousClose: 12.72 },
  { symbol: "USDINR=X", name: "USD/INR", price: 83.12, change: 0.05, changePercent: 0.06, previousClose: 83.07 },
  { symbol: "GC=F", name: "Gold (USD)", price: 2318.40, change: 12.30, changePercent: 0.53, previousClose: 2306.10 },
];

router.get("/market", async (_req, res) => {
  try {
    const symbolsParam = SYMBOLS.join(",");
    const fields = "regularMarketPrice,regularMarketChangePercent,regularMarketChange,regularMarketPreviousClose,shortName";
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}&fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance responded with ${response.status}`);
    }

    const json = (await response.json()) as any;
    const quotes: any[] = json?.quoteResponse?.result ?? [];

    if (!quotes.length) throw new Error("No quotes returned");

    const data = quotes.map((q: any) => ({
      symbol: q.symbol,
      name: q.shortName || q.symbol,
      price: q.regularMarketPrice ?? 0,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      previousClose: q.regularMarketPreviousClose ?? 0,
    }));

    res.json({ data, timestamp: new Date().toISOString(), live: true });
  } catch {
    res.json({ data: MOCK_DATA, timestamp: new Date().toISOString(), live: false });
  }
});

export default router;
