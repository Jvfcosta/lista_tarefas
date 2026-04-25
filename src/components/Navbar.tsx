import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Moon, Sun, LayoutDashboard, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-4xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 text-[var(--primary)]">
          <CheckSquare className="w-6 h-6" />
          <span className="text-xl font-bold font-heading hidden sm:block text-[var(--foreground)]">Antigravit<span className="text-[var(--primary)]">Task</span></span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          <Link to="/" className={`flex items-center gap-2 transition-colors ${isActive('/') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
            <CheckSquare className="w-4 h-4" />
            <span className="hidden md:block">Tarefas</span>
          </Link>
          <Link to="/analytics" className={`flex items-center gap-2 transition-colors ${isActive('/analytics') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:block">Análises</span>
          </Link>
          <Link to="/calendar" className={`flex items-center gap-2 transition-colors ${isActive('/calendar') ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}>
            <Calendar className="w-4 h-4" />
            <span className="hidden md:block">Calendário</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--card-border)] text-[var(--foreground)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={signOut}
            className="flex items-center gap-2 text-sm font-medium text-[var(--danger)] hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span className="hidden sm:block">Sair</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
