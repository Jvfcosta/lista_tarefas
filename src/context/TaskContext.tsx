import { createContext, useContext, useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../app-types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  markAsNotified: (id: string) => Promise<void>;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Função para mapear do formato DB (snake_case) para o App (camelCase)
const mapDbToApp = (dbTask: any): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  status: dbTask.status as TaskStatus,
  priority: dbTask.priority as any,
  category: dbTask.category as any,
  dueDate: dbTask.due_date,
  reminderTime: dbTask.reminder_time,
  notified: dbTask.notified,
  createdAt: dbTask.created_at,
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca as tarefas do Supabase quando o aplicativo carrega
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setTasks(data.map(mapDbToApp));
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas do Supabase:", error);
        toast.error("Não foi possível carregar suas tarefas.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      
      // Cria a tarefa localmente primeiro (otimista) para UI rápida
      const newTask: Task = { ...taskData, id, createdAt };
      setTasks(prev => [newTask, ...prev]);

      // Insere no banco
      const { error } = await supabase.from('tasks').insert([{
        id,
        title: taskData.title,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        due_date: taskData.dueDate,
        reminder_time: taskData.reminderTime,
        notified: taskData.notified || false,
        created_at: createdAt
      }]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      toast.error("Erro ao salvar a tarefa no servidor.");
      // Poderíamos reverter o estado local aqui se necessário
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      // Otimista
      setTasks(prev => prev.map(t => {
        if (t.id === id) {
          if (t.status === 'Concluído') return t;
          return { ...t, status };
        }
        return t;
      }));

      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Falha ao atualizar tarefa.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Otimista
      setTasks(prev => prev.filter(t => t.id !== id));

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      toast.error("Erro ao deletar a tarefa.");
    }
  };

  const markAsNotified = async (id: string) => {
    try {
      // Otimista
      setTasks(prev => prev.map(t => {
        if (t.id === id) {
          return { ...t, notified: true };
        }
        return t;
      }));

      const { error } = await supabase
        .from('tasks')
        .update({ notified: true })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao marcar notificação:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask, markAsNotified, selectedDate, setSelectedDate, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};
