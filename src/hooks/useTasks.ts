import { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../app-types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todo-tasks-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tasks from local storage", e);
        return [];
      }
    }
    return [
      {
        id: crypto.randomUUID(),
        title: 'Revisar plano de negócios',
        status: 'Em andamento',
        priority: 'Alta',
        category: 'Trabalho',
        dueDate: new Date().toISOString(),
        reminder: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Comprar mantimentos',
        status: 'Concluído',
        priority: 'Média',
        category: 'Pessoal',
        dueDate: null,
        reminder: false,
        createdAt: new Date().toISOString(),
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('todo-tasks-v2', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        // Bloqueio: se já estiver concluído, não permite voltar (regra do usuário)
        if (t.status === 'Concluído') return t;
        return { ...t, status };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTaskStatus, deleteTask };
}
