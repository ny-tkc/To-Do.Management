
import React, { useMemo } from 'react';
import type { Firm } from '../types';
import ProgressBar from '../components/ProgressBar';

interface RatePageProps {
  firms: Firm[];
}

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} mr-4`}>
        <i className={`fas ${icon} text-xl text-white`}></i>
    </div>
    <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);


const RatePage: React.FC<RatePageProps> = ({ firms }) => {
  const { visitedCount, totalCount, unvisitedCount, completionRate } = useMemo(() => {
    const totalCount = firms.length;
    const visitedCount = firms.filter(f => f.visited).length;
    const unvisitedCount = totalCount - visitedCount;
    const completionRate = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;
    return { visitedCount, totalCount, unvisitedCount, completionRate };
  }, [firms]);

  return (
    <div>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-slate-800">面談率サマリー</h1>
           <p className="text-sm text-slate-500 mt-1">訪問活動の進捗状況です。</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard title="担当件数" value={`${totalCount} 社`} icon="fa-building" color="bg-sky-500" />
            <StatCard title="訪問済み" value={`${visitedCount} 社`} icon="fa-check" color="bg-green-500" />
            <StatCard title="未訪問" value={`${unvisitedCount} 社`} icon="fa-person-running" color="bg-amber-500" />
            <StatCard title="面談率" value={`${completionRate} %`} icon="fa-bullseye" color="bg-cyan-600" />
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-cyan-700">進捗</span>
              <span className="text-sm font-bold text-slate-600">{completionRate}% ({visitedCount}/{totalCount} 社)</span>
            </div>
            <ProgressBar value={visitedCount} max={totalCount} />
        </div>
      </main>
    </div>
  );
};

export default RatePage;
