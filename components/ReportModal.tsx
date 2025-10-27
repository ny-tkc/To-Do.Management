import React, { useState, useEffect } from 'react';
import type { DailyVisit, ToDo } from '../types';

interface ReportModalProps {
  visit: DailyVisit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateVisit: (updatedVisit: DailyVisit) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ visit, isOpen, onClose, onUpdateVisit }) => {
  const [copyStatus, setCopyStatus] = useState('コピー');
  const [internalVisit, setInternalVisit] = useState<DailyVisit | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCopyStatus('コピー');
      setInternalVisit(visit ? JSON.parse(JSON.stringify(visit)) : null);
    }
  }, [isOpen, visit]);
  
  const handleDetailChange = (todoId: string, newDetails: string) => {
    if (!internalVisit) return;
    
    const updatedTodos = internalVisit.todos.map(todo => 
      todo.id === todoId ? { ...todo, details: newDetails } : todo
    );
    const updatedVisit = { ...internalVisit, todos: updatedTodos };
    setInternalVisit(updatedVisit);
    onUpdateVisit(updatedVisit);
  };

  if (!isOpen || !internalVisit) return null;

  const completedTodos = internalVisit.todos.filter(todo => todo.completed);

  const reportText = completedTodos
    .map((todo, index) => {
      const detailsText = todo.details ? `\n  ${todo.details.replace(/\n/g, '\n  ')}` : '';
      return `${index + 1}. ${todo.text}${detailsText}`;
    })
    .join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopyStatus('コピーしました！');
      setTimeout(() => setCopyStatus('コピー'), 2000);
    }, () => {
      setCopyStatus('失敗しました');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in-up">
        <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-slate-800 mb-2">訪問レポート</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition">
              <i className="fas fa-times fa-lg"></i>
            </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">{internalVisit.firmName} 様 ({internalVisit.date})</p>
        
        <div className="bg-slate-50 p-4 rounded-md mb-6 max-h-[50vh] overflow-y-auto space-y-3">
          {completedTodos.length > 0 ? completedTodos.map(todo => (
            <div key={todo.id}>
              <p className="font-semibold text-slate-800">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>{todo.text}
              </p>
              <textarea
                value={todo.details}
                onChange={(e) => handleDetailChange(todo.id, e.target.value)}
                placeholder="詳細を記入..."
                className="w-full mt-1.5 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
                rows={2}
              ></textarea>
            </div>
          )) : (
            <p className="text-slate-500 text-center py-4">完了したToDoがありません。</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto px-4 py-2 text-white font-semibold rounded-md transition ${copyStatus === 'コピーしました！' ? 'bg-green-500' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            disabled={!reportText}
          >
            <i className="fas fa-copy mr-2"></i>{copyStatus}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;