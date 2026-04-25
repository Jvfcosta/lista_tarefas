import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const ProgressBar: React.FC = () => {
  const { tasks } = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Concluído').length;
  
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="glass-panel p-6 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h2 className="text-xl font-bold text-cejam-navy dark:text-white">Progresso Geral</h2>
          <p className="text-sm font-medium text-[var(--muted)]">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
        </div>
        <span className="text-3xl font-black text-cejam-teal">
          {percentage}%
        </span>
      </div>
      
      <div className="h-3 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--card-border)] relative">
        <div 
          className="h-full bg-gradient-to-r from-cejam-navy to-cejam-teal transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Brilho animado dentro da barra de progresso */}
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
