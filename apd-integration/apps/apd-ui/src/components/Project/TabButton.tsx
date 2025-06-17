import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`${active ? 'text-primary border-primary' : 'text-gray-400'} px-4 py-2 border-b-2`}
    >
      {children}
    </button>
  );
};

export default TabButton;
