export type Priority = 'Alta' | 'Média' | 'Baixa';
export type Category = 'Trabalho' | 'Pessoal' | 'Estudos' | string;
export type TaskStatus = 'Pendente' | 'Em andamento' | 'Concluído';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  reminderTime: string | null; // Novo campo para horário
  notified?: boolean; // Controle de disparo do alarme
  createdAt: string;
}

export type FilterState = 'Todas' | 'Pendentes' | 'Em andamento' | 'Concluídas';
