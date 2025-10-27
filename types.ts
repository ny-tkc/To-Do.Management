export interface ToDo {
  id: string;
  text: string;
  completed: boolean;
  details: string;
}

export interface Firm {
  id: string;
  name: string;
  visited: boolean;
}

export interface DailyVisit {
  id: string;
  firmId: string;
  firmName: string;
  todos: ToDo[];
  date: string; // YYYY-MM-DD
  status: 'pending' | 'completed';
}