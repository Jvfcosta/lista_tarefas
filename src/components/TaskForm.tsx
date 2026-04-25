import { useState, useEffect } from 'react';
import { Plus, Tag, Flag, Bell, BellOff, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import type { Priority, Category, TaskStatus } from '../app-types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskFormProps {
  onAdd: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const { selectedDate, setSelectedDate } = useTaskContext();
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState<Priority>('Média');
  const [category, setCategory] = useState<Category>('Trabalho');
  const [status, setStatus] = useState<TaskStatus>('Pendente');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [hasReminder, setHasReminder] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setIsExpanded(true);
      document.getElementById('task-title-input')?.focus();
    }
  }, [selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title: title.trim(),
      status,
      priority,
      category,
      dueDate: selectedDate || new Date().toISOString(),
      reminderTime: hasReminder ? reminderTime : null
    });
    
    setTitle('');
    setIsExpanded(false);
    setPriority('Média');
    setCategory('Trabalho');
    setStatus('Pendente');
    setReminderTime('');
    setHasReminder(false);
    setSelectedDate(null);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] overflow-hidden transition-all duration-500 border-2 border-transparent focus-within:border-cejam-teal/30">
      {selectedDate && (
        <div className="bg-cejam-teal/10 px-6 py-2 flex items-center justify-between border-b border-cejam-teal/20">
          <div className="flex items-center gap-2 text-cejam-teal font-bold text-xs uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4" />
            <span>Inserindo para: {format(parseISO(selectedDate), "dd 'de' MMMM", { locale: ptBR })}</span>
          </div>
          <button onClick={() => setSelectedDate(null)} className="text-cejam-teal hover:bg-cejam-teal/20 p-1 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center px-6 py-5 bg-[var(--background)]/30">
        <div className="bg-cejam-navy text-white p-2 rounded-xl mr-4 dark:bg-cejam-teal">
          <Plus className="w-6 h-6" />
        </div>
        <input 
          id="task-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="No que você está trabalhando hoje?"
          className="w-full bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted)] text-xl font-semibold"
        />
        {title.trim() && (
          <button type="submit" className="btn-pill btn-primary ml-4">
            Salvar
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-8 md:px-16 py-6 flex flex-wrap gap-8 items-center bg-white/40 dark:bg-black/20 text-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-cejam-teal uppercase tracking-widest ml-1">Prioridade</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)]">
              <Flag className="w-4 h-4 text-cejam-teal" />
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="bg-transparent border-none outline-none font-bold text-cejam-navy dark:text-white">
                <option value="Alta">Alta</option><option value="Média">Média</option><option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-cejam-teal uppercase tracking-widest ml-1">Categoria</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)]">
              <Tag className="w-4 h-4 text-cejam-teal" />
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="bg-transparent border-none outline-none font-bold text-cejam-navy dark:text-white">
                <option value="Trabalho">Trabalho</option><option value="Pessoal">Pessoal</option><option value="Estudos">Estudos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-cejam-teal uppercase tracking-widest ml-1">Lembrete</label>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setHasReminder(!hasReminder)}
                className={`p-2 rounded-xl border transition-all ${hasReminder ? 'bg-amber-500 text-white' : 'bg-white/50 dark:bg-white/5 text-[var(--muted)]'}`}
              >
                {hasReminder ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>
              
              {hasReminder && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)] animate-in slide-in-from-left-2 duration-300">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <input 
                    type="time" 
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-cejam-navy dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
