import { Calendar, Trash2, Bell, PlayCircle, CheckCircle2, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task, TaskStatus } from '../app-types';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Média': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Baixa': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Pendente': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'Em andamento': return <PlayCircle className="w-4 h-4 text-cejam-teal animate-pulse" />;
      case 'Concluído': return <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />;
    }
  };

  const isCompleted = task.status === 'Concluído';

  return (
    <div className={`group flex items-start sm:items-center gap-4 glass-panel p-5 rounded-[2rem] transition-all duration-300 relative overflow-hidden ${
      isCompleted ? 'opacity-50 grayscale-[50%]' : 'hover:scale-[1.01] hover:shadow-xl'
    }`}>
      <div className="pt-1 sm:pt-0">
        <button
          onClick={() => !isCompleted && onUpdateStatus(task.id, 'Concluído')}
          disabled={isCompleted}
          className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
            isCompleted 
              ? 'bg-[var(--success)] border-[var(--success)]' 
              : 'border-[var(--card-border)] hover:border-cejam-teal'
          }`}
        >
          {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className={`text-xl font-bold truncate transition-all duration-300 ${
            isCompleted ? 'line-through text-[var(--muted)]' : 'text-cejam-navy dark:text-white'
          }`}>
            {task.title}
          </h3>
          {task.reminderTime && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Bell className="w-3 h-3 fill-amber-500" />
              <span className="text-[10px] font-black">{task.reminderTime}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-black uppercase tracking-[0.15em]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--card-border)] text-[var(--muted)]">
            {getStatusIcon(task.status)}
            <span>{task.status}</span>
          </div>

          <span className="px-3 py-1.5 rounded-xl border bg-cejam-teal/5 text-cejam-teal border-cejam-teal/20">
            {task.category}
          </span>
          <span className={`px-3 py-1.5 rounded-xl border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>

          {!isCompleted && task.status === 'Pendente' && (
            <button 
              onClick={() => onUpdateStatus(task.id, 'Em andamento')}
              className="ml-auto px-4 py-1.5 rounded-xl bg-cejam-navy text-white hover:bg-cejam-teal transition-all font-bold shadow-lg shadow-cejam-navy/10"
            >
              Iniciar
            </button>
          )}

          {task.dueDate && (
            <span className="flex items-center gap-1.5 text-[var(--muted)] px-3 py-1.5 rounded-xl border border-[var(--card-border)] bg-white/50 dark:bg-white/5">
              <Calendar className="w-3.5 h-3.5" />
              {format(parseISO(task.dueDate), "dd MMM", { locale: ptBR })}
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2.5 text-[var(--muted)] hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TaskCard;
