import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
}

export interface MarketData {
  data: MarketQuote[];
  timestamp: string;
  live: boolean;
}

export function useMarketData() {
  return useQuery<MarketData>({
    queryKey: ["market-data"],
    queryFn: () => apiFetch<MarketData>("/market"),
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
  });
}
