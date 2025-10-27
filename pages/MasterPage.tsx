import React from 'react';
import type { Firm } from '../types';

interface MasterPageProps {
  firms: Firm[];
  onAddFirm: () => void;
  onDeleteFirm: (firmId: string) => void;
  onResetVisitStatus: (firmId: string) => void;
}

const MasterPage: React.FC<MasterPageProps> = ({ firms, onAddFirm, onDeleteFirm, onResetVisitStatus }) => {
  return (
    <div>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">訪問先マスター</h1>
            <button
                onClick={onAddFirm}
                className="flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-full hover:bg-cyan-700 transition"
                aria-label="訪問先を追加"
            >
                <i className="fas fa-plus mr-2"></i>追加
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6 flex gap-2">
            <button className="flex-1 text-sm px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition">
                <i className="fas fa-file-import mr-2"></i>CSVインポート
            </button>
            <button className="flex-1 text-sm px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition">
                <i className="fas fa-file-export mr-2"></i>CSVエクスポート
            </button>
        </div>

        <div className="space-y-3">
          {firms.length > 0 ? (
            firms.map((firm) => (
              <div key={firm.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  {firm.visited ? (
                    <i className="fas fa-check-circle text-green-500 mr-3" title="訪問済み"></i>
                  ) : (
                    <i className="far fa-circle text-slate-400 mr-3" title="未訪問"></i>
                  )}
                  <span className={`font-medium ${firm.visited ? 'text-slate-500' : 'text-slate-800'}`}>
                    {firm.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {firm.visited && (
                    <button onClick={() => onResetVisitStatus(firm.id)} className="text-slate-500 hover:text-cyan-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan-50 transition" title="未訪問に戻す">
                      <i className="fas fa-rotate-left"></i>
                    </button>
                  )}
                  <button onClick={() => onDeleteFirm(firm.id)} className="text-slate-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition" title="削除">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-16">
                <i className="fas fa-folder-open text-6xl text-slate-300 mb-4"></i>
                <h2 className="text-xl font-semibold text-slate-700">データがありません</h2>
                <p className="text-slate-500 mt-2">右上の「追加」ボタンから訪問先を登録してください。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MasterPage;
