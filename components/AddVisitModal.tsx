import React, { useState, useEffect } from 'react';
import type { Firm } from '../types';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  firms: Firm[];
  onAddVisit: (data: { firmId: string; date: string; todos: string[] }) => void;
  date: string;
}

const AddVisitModal: React.FC<AddVisitModalProps> = ({ isOpen, onClose, firms, onAddVisit, date }) => {
  const [selectedFirmId, setSelectedFirmId] = useState<string>('');
  const [todos, setTodos] = useState<string[]>(['']);

  useEffect(() => {
    if (isOpen) {
      setSelectedFirmId('');
      setTodos(['']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTodoChange = (index: number, value: string) => {
    const newTodos = [...todos];
    newTodos[index] = value;
    setTodos(newTodos);
  };

  const handleAddTodoInput = () => {
    setTodos([...todos, '']);
  };

  const handleRemoveTodoInput = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTodos = todos.map(t => t.trim()).filter(t => t !== '');
    if (selectedFirmId && date) {
      onAddVisit({ firmId: selectedFirmId, date, todos: finalTodos });
      onClose();
    }
  };
  
  const canSubmit = selectedFirmId && date;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-up">
        <h2 className="text-xl font-bold text-slate-800 mb-2">訪問予定の追加</h2>
        <p className="text-slate-500 mb-4 font-semibold">{date}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">訪問先</label>
            <select
              value={selectedFirmId}
              onChange={(e) => setSelectedFirmId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition bg-white"
              autoFocus
            >
              <option value="" disabled>事務所を選択してください</option>
              {firms.map(firm => (
                <option key={firm.id} value={firm.id}>{firm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">初期ToDoリスト</label>
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={todo}
                    onChange={(e) => handleTodoChange(index, e.target.value)}
                    placeholder={`ToDo ${index + 1}`}
                    className="flex-grow px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                  />
                  {todos.length > 1 && (
                     <button type="button" onClick={() => handleRemoveTodoInput(index)} className="w-8 h-8 flex-shrink-0 text-slate-400 hover:text-red-500 transition">
                      <i className="fas fa-minus-circle"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddTodoInput} className="mt-2 text-sm text-cyan-600 hover:text-cyan-800 font-semibold">
              <i className="fas fa-plus mr-1"></i>ToDoを追加
            </button>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-slate-400 transition"
              disabled={!canSubmit}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitModal;