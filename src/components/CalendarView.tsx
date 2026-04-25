import React from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const CalendarView: React.FC = () => {
  const { tasks, setSelectedDate } = useTaskContext();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day.toISOString());
    navigate('/');
    // Suave scroll para o formulário
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between glass-panel p-6 rounded-[2rem]">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Calendário</h1>
          <p className="text-[var(--muted)] mt-1 capitalize text-lg">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={prevMonth} className="p-3 rounded-full hover:bg-[var(--card-border)] text-[var(--primary)] transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextMonth} className="p-3 rounded-full hover:bg-[var(--card-border)] text-[var(--primary)] transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="glass-panel p-2 rounded-[2.5rem] overflow-hidden">
        <div className="grid grid-cols-7 text-center py-4 border-b border-[var(--card-border)]">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-[var(--card-border)]">
          {days.map((day, idx) => {
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));
            const today = isToday(day);

            return (
              <div 
                key={idx} 
                onClick={() => handleDayClick(day)}
                className="bg-[var(--background)] min-h-[120px] p-3 cursor-pointer hover:bg-[var(--primary)]/5 transition-all group relative"
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold ${today ? 'bg-cejam-teal text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-[var(--foreground)]'}`}>
                    {format(day, 'd')}
                  </span>
                  <PlusCircle className="w-4 h-4 text-cejam-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-2 space-y-1">
                  {dayTasks.slice(0, 3).map(t => (
                    <div key={t.id} className="text-[9px] px-2 py-0.5 rounded-full bg-cejam-navy/5 text-cejam-navy border border-cejam-navy/10 truncate font-semibold">
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[9px] text-[var(--muted)] font-bold pl-2">
                      + {dayTasks.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
