import { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import type { Task } from '../app-types';

// Função para tocar uma "musiquinha" agradável usando Web Audio API
// Isso garante que o som funcione sem depender de arquivos MP3 externos
const playAlarmSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    // Sequência de notas agradável (Arpejo Dó Maior)
    const notes = [523.25, 659.25, 783.99, 1046.50]; 
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      
      // Envelope de volume para suavizar o som
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  } catch (e) {
    console.error("Falha ao tocar o áudio", e);
  }
};

export function useTaskAlarms(
  tasks: Task[], 
  markAsNotified: (id: string) => void
) {
  // Solicita permissão para notificações do sistema assim que o hook é carregado
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const currentFormattedDate = format(now, 'yyyy-MM-dd');
      const currentFormattedTime = format(now, 'HH:mm');

      tasks.forEach(task => {
        if (task.status === 'Concluído') return;
        if (!task.reminderTime || task.notified) return;

        let isToday = false;
        if (task.dueDate) {
          const taskDate = format(parseISO(task.dueDate), 'yyyy-MM-dd');
          isToday = taskDate === currentFormattedDate;
        }

        if (isToday && task.reminderTime === currentFormattedTime) {
          // 1. Notificação In-App
          toast.success(`Lembrete: ${task.title}`, {
            description: `A tarefa "${task.title}" está agendada para agora (${task.reminderTime}).`,
            duration: 8000,
          });

          // 2. Notificação Nativa do Sistema (Aparece mesmo em outras abas/aplicativos)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('AntigravitTask - Lembrete', {
              body: `Está na hora: ${task.title}`,
              icon: '/favicon.svg'
            });
          }

          // 3. Tocar a Musiquinha
          playAlarmSound();

          // Marca como notificada
          markAsNotified(task.id);
        }
      });
    }, 10000); // 10 segundos

    return () => clearInterval(intervalId);
  }, [tasks, markAsNotified]);
}
