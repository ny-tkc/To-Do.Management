import React from 'react';
import type { DailyVisit } from '../types';
import VisitCard from '../components/VisitCard';

interface TodayPageProps {
  visits: DailyVisit[];
  onAddVisit: () => void;
  onUpdateVisit: (updatedVisit: DailyVisit) => void;
  onGenerateReport: (visit: DailyVisit) => void;
  onCompleteVisit: (visitId: string) => void;
}

const TodayPage: React.FC<TodayPageProps> = ({ visits, onAddVisit, onUpdateVisit, onGenerateReport, onCompleteVisit }) => {
  return (
    <div>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">本日の訪問リスト</h1>
            <button
              onClick={onAddVisit}
              className="flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-full hover:bg-cyan-700 transition"
              aria-label="本日の訪問を追加"
            >
              <i className="fas fa-plus mr-2"></i>訪問を追加
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {visits.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit) => (
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
          <div className="text-center py-16">
            <i className="fas fa-calendar-check text-6xl text-slate-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-slate-700">本日の訪問予定はありません</h2>
            <p className="text-slate-500 mt-2">お疲れ様です！右上のボタンから訪問を追加するか、<br/>カレンダーで先の予定を確認しましょう。</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TodayPage;