import React, { useState } from 'react';
import type { DailyVisit, ToDo } from '../types';

interface VisitCardProps {
  visit: DailyVisit;
  onUpdateVisit: (updatedVisit: DailyVisit) => void;
  onGenerateReport: (visit: DailyVisit) => void;
  onCompleteVisit: (visitId: string) => void;
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, onUpdateVisit, onGenerateReport, onCompleteVisit }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const isCompleted = visit.status === 'completed';

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '' || isCompleted) return;
    const newTodo: ToDo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      details: '',
    };
    const updatedVisit = { ...visit, todos: [...visit.todos, newTodo] };
    onUpdateVisit(updatedVisit);
    setNewTodoText('');
  };

  const handleToggleTodo = (todoId: string) => {
    if (isCompleted) return;
    const updatedTodos = visit.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    const updatedVisit = { ...visit, todos: updatedTodos };
    onUpdateVisit(updatedVisit);
  };

  const handleDeleteTodo = (todoId: string) => {
    if (isCompleted) return;
    const updatedTodos = visit.todos.filter((todo) => todo.id !== todoId);
    const updatedVisit = { ...visit, todos: updatedTodos };
    onUpdateVisit(updatedVisit);
  };

  const hasCompletedTodos = visit.todos.some(todo => todo.completed);

  return (
    <div className={`bg-white rounded-lg shadow-md flex flex-col ${isCompleted ? 'opacity-70' : ''}`}>
      <header className={`p-4 border-b border-slate-200 flex justify-between items-center ${isCompleted ? 'bg-slate-100' : ''}`}>
        <h2 className="text-lg font-bold text-slate-800 truncate">{visit.firmName}</h2>
        {isCompleted && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">完了済み</span>}
      </header>

      <main className="flex-1 p-4 space-y-3">
        {visit.todos.map((todo) => (
          <div key={todo.id} className="flex items-center bg-slate-50 p-3 rounded-lg">
            <input
              type="checkbox"
              id={`todo-${visit.id}-${todo.id}`}
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="h-6 w-6 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500 cursor-pointer disabled:cursor-not-allowed"
              disabled={isCompleted}
            />
            <label
              htmlFor={`todo-${visit.id}-${todo.id}`}
              className={`flex-1 ml-3 text-slate-700 ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'} ${todo.completed ? 'line-through text-slate-400' : ''}`}
            >
              {todo.text}
            </label>
            <button onClick={() => handleDeleteTodo(todo.id)} className="ml-2 text-slate-400 hover:text-red-500 transition px-2 disabled:opacity-50 disabled:hover:text-slate-400" disabled={isCompleted}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
        {!isCompleted && (
            <form onSubmit={handleAddTodo} className="flex gap-2 pt-2">
            <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="ToDoを追加..."
                className="flex-grow px-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
            <button type="submit" className="flex-shrink-0 w-10 h-10 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:bg-slate-400 transition flex items-center justify-center">
                <i className="fas fa-plus"></i>
            </button>
            </form>
        )}
      </main>

      <footer className="p-4 border-t border-slate-200 bg-slate-50/80 rounded-b-lg flex flex-col sm:flex-row gap-2">
        {(hasCompletedTodos || isCompleted) && (
          <button
            onClick={() => onGenerateReport(visit)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
          >
            {isCompleted ? 'レポートを再表示' : '訪問レポート作成'}
          </button>
        )}
        {!isCompleted && (
            <button
            onClick={() => onCompleteVisit(visit.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
            >
            訪問完了
            </button>
        )}
      </footer>
    </div>
  );
};

export default VisitCard;