import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTaskContext } from '../context/TaskContext';
import { Filter, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  const { tasks } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredTasks = selectedCategory === 'Todas' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory);

  const categories = ['Todas', ...Array.from(new Set(tasks.map(t => t.category)))];

  const statusData = [
    { name: 'Pendentes', value: filteredTasks.filter(t => t.status === 'Pendente').length },
    { name: 'Em andamento', value: filteredTasks.filter(t => t.status === 'Em andamento').length },
    { name: 'Concluídas', value: filteredTasks.filter(t => t.status === 'Concluído').length },
  ];

  const priorityData = [
    { name: 'Alta', value: filteredTasks.filter(t => t.priority === 'Alta').length },
    { name: 'Média', value: filteredTasks.filter(t => t.priority === 'Média').length },
    { name: 'Baixa', value: filteredTasks.filter(t => t.priority === 'Baixa').length },
  ];

  const COLORS = ['#ef4444', '#1e2b48', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 rounded-[2rem]">
        <div>
          <h1 className="text-4xl font-extrabold text-cejam-navy dark:text-white">Dashboard <span className="text-cejam-teal">Interativo</span></h1>
          <p className="text-[var(--muted)] mt-1 font-medium">Análise avançada de produtividade e métricas.</p>
        </div>

        <div className="flex items-center gap-3 bg-[var(--background)] p-2 rounded-2xl border border-[var(--card-border)]">
          <Filter className="w-5 h-5 text-cejam-teal ml-2" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-sm text-cejam-navy dark:text-white cursor-pointer pr-4"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border-b-8 border-cejam-teal">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="w-6 h-6 text-cejam-teal" />
            <h2 className="text-xl font-bold">Estado de Fluxo</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border-b-8 border-[#1e2b48]">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-cejam-navy dark:text-cejam-teal" />
            <h2 className="text-xl font-bold">Distribuição Crítica</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'var(--primary)', opacity: 0.05}}
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} animationBegin={500} animationDuration={1500}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: filteredTasks.length, color: '#1e2b48' },
          { label: 'Concluídas', value: filteredTasks.filter(t => t.status === 'Concluído').length, color: '#10b981' },
          { label: 'Em Curso', value: filteredTasks.filter(t => t.status === 'Em andamento').length, color: '#00a4b4' },
          { label: 'Pendentes', value: filteredTasks.filter(t => t.status === 'Pendente').length, color: '#ef4444' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2rem] text-center hover:scale-105 transition-transform duration-300">
            <p className="text-[var(--muted)] text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-5xl font-black mt-3" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
