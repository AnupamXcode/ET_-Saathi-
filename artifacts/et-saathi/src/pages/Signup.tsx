import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../hooks/use-auth';
import { Input } from '../components/ui/input';
import { BarChart2, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup, isSigningUp } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await signup({ name, email, password }); }
    catch (err: any) { setError(err.message || 'Registration failed. Please try again.'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'hsl(226,45%,4%)' }}
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(ellipse,rgba(6,182,212,0.14) 0%,transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(ellipse,rgba(139,92,246,0.12) 0%,transparent 70%)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }}
      />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(139,92,246,0.2))', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 0 40px rgba(6,182,212,0.25)' }}
            >
              <BarChart2 className="w-9 h-9 text-cyan-300" />
            </div>
            <div className="absolute -inset-2 rounded-3xl blur-xl -z-10" style={{ background: 'rgba(6,182,212,0.15)' }} />
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-center"
            style={{ background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            ET Saathi
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] mt-2 font-medium"
            style={{ color: 'rgba(6,182,212,0.65)' }}
          >
            Financial Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(145deg,rgba(6,182,212,0.06),rgba(139,92,246,0.04))', border: '1px solid rgba(6,182,212,0.15)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          <div className="p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-center text-foreground mb-1">Create Account</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Join the Financial Intelligence Engine</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl text-sm text-center"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#FB7185' }}
                >
                  {error}
                </motion.div>
              )}

              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Full name" className="pl-10 h-12 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.15)' }}
                  value={name} onChange={(e) => setName(e.target.value)} required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="Email address" className="pl-10 h-12 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.15)' }}
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="Password (min 6 chars)" className="pl-10 h-12 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.15)' }}
                  value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                />
              </div>

              <button type="submit" disabled={isSigningUp}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm mt-3 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#06B6D4,#4F46E5,#8B5CF6)', color: '#fff', boxShadow: '0 0 24px rgba(6,182,212,0.3)' }}
              >
                {isSigningUp
                  ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : <Sparkles className="w-4 h-4" />
                }
                {isSigningUp ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 text-center text-sm text-muted-foreground"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              Already have an account?{" "}
              <Link href="/login" className="font-medium hover:opacity-90" style={{ color: '#67E8F9' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
