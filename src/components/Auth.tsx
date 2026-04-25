import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { CheckSquare, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login efetuado com sucesso!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu email para confirmar.");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro durante a autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 md:p-12 rounded-[2rem] animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-cejam-navy text-cejam-teal rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-cejam-navy/20 dark:bg-cejam-teal dark:text-cejam-navy">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-cejam-navy dark:text-white">Antigravit<span className="text-cejam-teal">Task</span></h1>
          <p className="text-[var(--muted)] mt-2 font-medium">Acesse suas tarefas sincronizadas na nuvem.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cejam-teal uppercase tracking-widest ml-1">Email</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)] focus-within:border-cejam-teal transition-colors">
              <Mail className="w-5 h-5 text-[var(--muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-transparent border-none outline-none font-semibold text-cejam-navy dark:text-white placeholder-[var(--muted)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-cejam-teal uppercase tracking-widest ml-1">Senha</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)] focus-within:border-cejam-teal transition-colors">
              <Lock className="w-5 h-5 text-[var(--muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none font-semibold text-cejam-navy dark:text-white placeholder-[var(--muted)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed bg-cejam-navy text-white hover:bg-cejam-teal shadow-cejam-navy/20 dark:bg-cejam-teal dark:text-cejam-navy dark:hover:bg-white"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isLogin ? (
              <><LogIn className="w-5 h-5" /> Entrar</>
            ) : (
              <><UserPlus className="w-5 h-5" /> Criar Conta</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-[var(--muted)]">
            {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-sm font-bold text-cejam-teal hover:text-cejam-navy dark:hover:text-white transition-colors"
          >
            {isLogin ? "Crie uma conta gratuitamente" : "Faça login com sua conta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
