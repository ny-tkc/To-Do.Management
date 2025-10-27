
import React, { useState } from 'react';

interface AddFirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFirm: (name: string) => void;
}

const AddFirmModal: React.FC<AddFirmModalProps> = ({ isOpen, onClose, onAddFirm }) => {
  const [firmName, setFirmName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firmName.trim()) {
      onAddFirm(firmName.trim());
      setFirmName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-up">
        <h2 className="text-xl font-bold text-slate-800 mb-4">訪問先の追加</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="会計事務所名"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            autoFocus
          />
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
              disabled={!firmName.trim()}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirmModal;
