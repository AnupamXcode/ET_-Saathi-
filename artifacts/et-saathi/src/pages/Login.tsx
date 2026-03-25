import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BarChart2, Lock, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@etsaathi.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'hsl(226,45%,4%)' }}
    >
      {/* Background ambient gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[200px]"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Gradient grid lines for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mb-5"
          >
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 40px rgba(139,92,246,0.3)',
              }}
            >
              <BarChart2 className="w-9 h-9 text-violet-300" />
            </div>
            <div className="absolute -inset-2 rounded-3xl blur-xl -z-10"
              style={{ background: 'rgba(139,92,246,0.2)' }} />
          </motion.div>

          <h1 className="font-display text-5xl font-bold text-gradient tracking-tight text-center text-glow-violet">
            ET Saathi
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] mt-2 font-medium"
            style={{ color: 'rgba(167,139,250,0.7)' }}
          >
            Financial Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(139,92,246,0.07), rgba(6,182,212,0.03))',
            border: '1px solid rgba(139,92,246,0.18)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-center text-foreground mb-1">Welcome Back</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Enter your credentials to access the terminal</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl text-sm text-center"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#FB7185' }}
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10 h-12 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-6 h-12 rounded-xl font-semibold"
                isLoading={isLoggingIn}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #4F46E5, #06B6D4)',
                  border: 'none',
                  boxShadow: '0 0 24px rgba(139,92,246,0.35)',
                  color: '#fff',
                }}
              >
                {!isLoggingIn && <Sparkles className="w-4 h-4 mr-2" />}
                Authenticate
              </Button>

              <div className="text-center mt-3">
                <button type="button" onClick={handleDemoLogin}
                  className="text-xs transition-colors underline underline-offset-4 hover:opacity-100"
                  style={{ color: 'rgba(167,139,250,0.6)' }}
                >
                  Fill demo credentials
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 text-center text-sm text-muted-foreground"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium hover:opacity-90"
                style={{ color: '#A78BFA' }}
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
