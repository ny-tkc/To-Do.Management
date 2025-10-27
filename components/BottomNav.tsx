
import React from 'react';

export type Page = 'today' | 'calendar' | 'rate' | 'master';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  icon: string;
  label: string;
}> = ({ page, activePage, setActivePage, icon, label }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-cyan-600' : 'text-slate-500 hover:text-cyan-500'
      }`}
    >
      <i className={`fas ${icon} fa-lg`}></i>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center z-20">
      <NavItem
        page="today"
        activePage={activePage}
        setActivePage={setActivePage}
        icon="fa-list-check"
        label="本日"
      />
      <NavItem
        page="calendar"
        activePage={activePage}
        setActivePage={setActivePage}
        icon="fa-calendar-days"
        label="カレンダー"
      />
      <NavItem
        page="rate"
        activePage={activePage}
        setActivePage={setActivePage}
        icon="fa-chart-pie"
        label="面談率"
      />
      <NavItem
        page="master"
        activePage={activePage}
        setActivePage={setActivePage}
        icon="fa-building"
        label="マスター"
      />
    </nav>
  );
};

export default BottomNav;