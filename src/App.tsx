import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTaskAlarms } from './hooks/useTaskAlarms';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Analytics from './components/Analytics';
import CalendarView from './components/CalendarView';
import Auth from './components/Auth';
import type { FilterState } from './app-types';
import './App.css';

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  
  const { tasks, addTask, updateTaskStatus, deleteTask, markAsNotified, loading } = useTaskContext();
  const [filter, setFilter] = useState<FilterState>('Todas');

  useTaskAlarms(tasks, markAsNotified);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pendentes') return task.status === 'Pendente';
    if (filter === 'Em andamento') return task.status === 'Em andamento';
    if (filter === 'Concluídas') return task.status === 'Concluído';
    return true;
  });

  const Home = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-cejam-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cejam-teal font-bold tracking-widest text-sm uppercase">Conectando ao banco de dados...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-panel p-8 rounded-[2rem]">
          <div>
            <h1 className="text-4xl font-extrabold text-cejam-navy dark:text-white">
              Suas <span className="text-cejam-teal">Tarefas</span>
            </h1>
            <p className="text-[var(--muted)] mt-1 font-medium text-lg">Gerenciamento profissional de produtividade.</p>
          </div>
          
          <div className="flex bg-[var(--background)] p-1.5 rounded-2xl border border-[var(--card-border)] overflow-x-auto">
            {(['Todas', 'Pendentes', 'Em andamento', 'Concluídas'] as FilterState[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-cejam-navy text-white shadow-xl shadow-cejam-navy/20 dark:bg-cejam-teal' 
                    : 'text-[var(--muted)] hover:text-cejam-navy hover:bg-white/50 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <ProgressBar />

        <TaskForm onAdd={addTask} />
        
        <TaskList 
          tasks={filteredTasks} 
          onUpdateStatus={updateTaskStatus} 
          onDelete={deleteTask} 
        />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 transition-colors duration-500">
        <Toaster position="top-right" richColors theme={theme} closeButton />
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function ProtectedApp() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <div className="w-16 h-16 border-4 border-cejam-navy border-t-cejam-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <Auth />
      </>
    );
  }

  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}

export default App;
