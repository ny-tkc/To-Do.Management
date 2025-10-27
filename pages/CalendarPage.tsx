import React, { useState, useMemo } from 'react';
import type { DailyVisit } from '../types';
import VisitCard from '../components/VisitCard';

interface CalendarPageProps {
  visits: DailyVisit[];
  onAddVisit: (date: string) => void;
  onUpdateVisit: (updatedVisit: DailyVisit) => void;
  onGenerateReport: (visit: DailyVisit) => void;
  onCompleteVisit: (visitId: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ visits, onAddVisit, onUpdateVisit, onGenerateReport, onCompleteVisit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const visitsByDate = useMemo(() => {
    return visits.reduce((acc, visit) => {
      (acc[visit.date] = acc[visit.date] || []).push(visit);
      return acc;
    }, {} as Record<string, DailyVisit[]>);
  }, [visits]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <>
            {blanks.map((_, i) => <div key={`blank-${i}`} className="p-1"></div>)}
            {days.map(day => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasVisit = visitsByDate[dateStr];
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                
                return (
                    <div key={day} onClick={() => setSelectedDate(dateStr)} className={`p-1 text-center cursor-pointer border rounded-lg transition-colors
                        ${isSelected ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-cyan-100'}
                        ${isToday && !isSelected ? 'border-cyan-500' : 'border-transparent'}
                    `}>
                        <span className="relative">
                            {day}
                            {hasVisit && <span className="absolute -top-1 -right-1.5 h-2 w-2 bg-blue-500 rounded-full"></span>}
                        </span>
                    </div>
                );
            })}
        </>
    );
  };

  const selectedVisits = visitsByDate[selectedDate] || [];

  return (
    <div>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-800">カレンダー</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="text-slate-500 hover:text-cyan-600 p-2 rounded-full"><i className="fas fa-chevron-left"></i></button>
                <h2 className="text-lg font-bold text-slate-800">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</h2>
                <button onClick={() => changeMonth(1)} className="text-slate-500 hover:text-cyan-600 p-2 rounded-full"><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
                {['日', '月', '火', '水', '木', '金', '土'].map(d => <div key={d} className="font-semibold text-center text-slate-500 pb-2">{d}</div>)}
                {renderCalendar()}
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-700">{selectedDate}</h3>
                <button
                onClick={() => onAddVisit(selectedDate)}
                className="flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-full hover:bg-cyan-700 transition"
                >
                <i className="fas fa-plus mr-2"></i>訪問を追加
                </button>
            </div>
            {selectedVisits.length > 0 ? (
                <div className="space-y-4">
                    {selectedVisits.map(visit => (
                         <VisitCard 
                            key={visit.id}
                            visit={visit}
                            onUpdateVisit={onUpdateVisit}
                            onGenerateReport={onGenerateReport}
                            onCompleteVisit={onCompleteVisit}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-slate-100 rounded-lg">
                    <i className="fas fa-calendar-alt text-5xl text-slate-300 mb-4"></i>
                    <p className="text-slate-600">この日の訪問予定はありません。</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
