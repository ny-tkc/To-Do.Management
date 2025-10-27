import React, { useState, useEffect } from 'react';
import type { Firm, DailyVisit, ToDo } from './types';

// Page Components
import TodayPage from './pages/TodoPage';
import CalendarPage from './pages/CalendarPage';
import RatePage from './pages/RatePage';
import MasterPage from './pages/MasterPage';

// Modal Components
import AddFirmModal from './components/AddFirmModal';
import AddVisitModal from './components/AddVisitModal';
import ReportModal from './components/ReportModal';
import BottomNav, { Page } from './components/BottomNav';

const App: React.FC = () => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [activePage, setActivePage] = useState<Page>('today');

  // Modal States
  const [isAddFirmModalOpen, setIsAddFirmModalOpen] = useState(false);
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportVisit, setReportVisit] = useState<DailyVisit | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load and save data from/to localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedFirms = localStorage.getItem('firms');
        if (storedFirms) setFirms(JSON.parse(storedFirms));

        const storedVisits = localStorage.getItem('dailyVisits');
        if (storedVisits) setDailyVisits(JSON.parse(storedVisits));
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('firms', JSON.stringify(firms));
    } catch (error) {
      console.error("Failed to save firms to localStorage", error);
    }
  }, [firms]);

  useEffect(() => {
    try {
      localStorage.setItem('dailyVisits', JSON.stringify(dailyVisits));
    } catch (error) {
      console.error("Failed to save daily visits to localStorage", error);
    }
  }, [dailyVisits]);
  
  // Date helper
  const getToday = () => new Date().toISOString().split('T')[0];

  // Firm master management
  const addFirm = (name: string) => {
    const newFirm: Firm = {
      id: Date.now().toString(),
      name,
      visited: false,
    };
    setFirms(prevFirms => [...prevFirms, newFirm].sort((a, b) => a.name.localeCompare(b.name, 'ja')));
  };

  const deleteFirm = (firmId: string) => {
    const firmToDelete = firms.find(f => f.id === firmId);
    if (firmToDelete && window.confirm(`「${firmToDelete.name}」を削除してもよろしいですか？関連するすべての訪問予定も削除されます。`)) {
        setFirms(firms.filter((firm) => firm.id !== firmId));
        setDailyVisits(dailyVisits.filter(v => v.firmId !== firmId));
    }
  };
  
  const resetVisitStatus = (firmId: string) => {
    const firmToReset = firms.find(f => f.id === firmId);
    if (firmToReset && window.confirm(`「${firmToReset.name}」を未訪問に戻しますか？`)) {
      setFirms(firms.map(f => f.id === firmId ? { ...f, visited: false } : f));
    }
  };

  // Daily Visit management
  const addDailyVisit = (data: { firmId: string, date: string, todos: string[] }) => {
    const firm = firms.find(f => f.id === data.firmId);
    if (!firm) return;

    const newVisit: DailyVisit = {
      id: Date.now().toString(),
      firmId: firm.id,
      firmName: firm.name,
      date: data.date,
      status: 'pending',
      todos: data.todos.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        completed: false,
        details: ''
      })),
    };
    setDailyVisits(prev => [...prev, newVisit]);
  };
  
  const updateDailyVisit = (updatedVisit: DailyVisit) => {
    setDailyVisits(dailyVisits.map(v => v.id === updatedVisit.id ? updatedVisit : v));
  };

  const completeVisit = (visitId: string) => {
    const visit = dailyVisits.find(v => v.id === visitId);
    if (!visit) return;

    if (window.confirm(`「${visit.firmName}」への訪問を完了しますか？`)) {
      setFirms(firms.map(f => f.id === visit.firmId ? { ...f, visited: true } : f));
      setDailyVisits(dailyVisits.map(v => v.id === visitId ? { ...v, status: 'completed' } : v));
    }
  };

  const handleGenerateReport = (visit: DailyVisit) => {
    setReportVisit(visit);
    setIsReportModalOpen(true);
  };
  
  const handleAddVisitClick = (date: string) => {
    setSelectedDate(date);
    setIsAddVisitModalOpen(true);
  }

  const renderPage = () => {
    switch (activePage) {
      case 'today':
        const todayVisits = dailyVisits.filter(v => v.date === getToday() && v.status === 'pending');
        return <TodayPage
          visits={todayVisits} 
          onAddVisit={() => handleAddVisitClick(getToday())}
          onUpdateVisit={updateDailyVisit}
          onGenerateReport={handleGenerateReport}
          onCompleteVisit={completeVisit}
        />;
      case 'calendar':
        return <CalendarPage 
          visits={dailyVisits}
          onAddVisit={handleAddVisitClick}
          onUpdateVisit={updateDailyVisit}
          onGenerateReport={handleGenerateReport}
          onCompleteVisit={completeVisit}
        />;
      case 'rate':
        return <RatePage firms={firms} />;
      case 'master':
        return <MasterPage firms={firms} onAddFirm={() => setIsAddFirmModalOpen(true)} onDeleteFirm={deleteFirm} onResetVisitStatus={resetVisitStatus} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="pb-20"> 
        {renderPage()}
      </div>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />

      <AddFirmModal
        isOpen={isAddFirmModalOpen}
        onClose={() => setIsAddFirmModalOpen(false)}
        onAddFirm={addFirm}
      />
      
      <AddVisitModal
        isOpen={isAddVisitModalOpen}
        onClose={() => setIsAddVisitModalOpen(false)}
        firms={firms}
        onAddVisit={addDailyVisit}
        date={selectedDate}
      />

      <ReportModal
        visit={reportVisit}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onUpdateVisit={updateDailyVisit}
      />
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default App;