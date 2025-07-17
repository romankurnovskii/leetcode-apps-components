import React from 'react';

export interface ActionButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({text, onClick, disabled = false, className}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : className}`}
  >
    {text}
  </button>
);
