import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../app-types';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateStatus, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--muted)] animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--card-border)]">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-lg font-semibold text-[var(--foreground)]">Tudo limpo por aqui!</p>
        <p className="text-sm">Crie novas tarefas ou altere seus filtros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <TaskCard 
              task={task} 
              onUpdateStatus={onUpdateStatus} 
              onDelete={onDelete} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
