import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../hooks/use-auth';
import { 
  BarChart2, Newspaper, GitBranch, Target,
  Briefcase, History, LogOut, Menu, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: BarChart2 },
  { href: "/analyze-news", label: "Analyze News", icon: Newspaper },
  { href: "/scenario", label: "Scenario Engine", icon: GitBranch },
  { href: "/decision", label: "Decision Engine", icon: Target },
  { href: "/simulate", label: "Simulation", icon: BarChart2 },
  { href: "/portfolio", label: "My Portfolio", icon: Briefcase },
  { href: "/history", label: "History", icon: History },
];

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'hsl(226,45%,4%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/30 flex items-center justify-center">
            <BarChart2 className="w-9 h-9 text-violet-400 animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-br from-violet-500/20 to-cyan-400/20 blur-lg -z-10" />
        </div>
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <motion.span key={i} className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)' }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.3, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="text-sm" style={{ color: 'rgba(220,220,255,0.5)' }}>Connecting to terminal…</p>
      </motion.div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) setLocation('/login');
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <LoadingScreen />;

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'hsl(226,45%,4%)' }}>

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 relative z-20"
        style={{
          background: 'linear-gradient(180deg, hsl(226,50%,3.5%) 0%, hsl(226,50%,3%) 100%)',
          borderRight: '1px solid rgba(139,92,246,0.12)',
        }}
      >
        {/* Ambient glow behind sidebar top */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative h-20 flex items-center px-5 z-10"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              <BarChart2 className="w-5 h-5 text-violet-300" />
              <div className="absolute inset-0 rounded-xl blur-md"
                style={{ background: 'rgba(139,92,246,0.3)', zIndex: -1 }} />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none text-gradient">ET Saathi</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(139,92,246,0.7)' }}>Intelligence Engine</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5 hide-scrollbar z-10">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="block">
                <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                  className={cn(
                    "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group",
                    isActive ? "" : "hover:bg-white/[0.04]"
                  )}
                  style={isActive ? {
                    background: 'linear-gradient(90deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.06) 100%)',
                    border: '1px solid rgba(139,92,246,0.22)',
                  } : { border: '1px solid transparent' }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #8B5CF6, #06B6D4)' }}
                    />
                  )}
                  <item.icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", isActive ? "text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className={cn("font-medium text-sm", isActive ? "text-violet-200" : "text-muted-foreground group-hover:text-foreground")}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)' }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 divider-gradient-gold opacity-30" />

        {/* User */}
        <div className="p-3 space-y-1 z-10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)', color: '#fff' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none text-foreground">{user.name}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(200,200,255,0.4)' }}>{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout}
            className="w-full justify-start text-sm h-9 text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Mobile Header ──────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 backdrop-blur-xl"
        style={{ background: 'rgba(5,9,18,0.9)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <BarChart2 className="w-4 h-4 text-violet-300" />
          </div>
          <span className="font-display font-bold text-base text-gradient">ET Saathi</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -320 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="md:hidden fixed inset-0 top-14 z-20 flex flex-col p-4 space-y-1 overflow-y-auto"
            style={{ background: 'hsl(226,50%,3.5%)', borderRight: '1px solid rgba(139,92,246,0.12)' }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block">
                  <div className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all", isActive ? "" : "hover:bg-white/5 text-muted-foreground")}
                    style={isActive ? { background: 'linear-gradient(90deg,rgba(139,92,246,0.18),rgba(6,182,212,0.06))', border: '1px solid rgba(139,92,246,0.22)', color: '#C4B5FD' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pt-14 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="max-w-5xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
