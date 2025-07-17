import React from 'react';

export interface ActionButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({text, onClick, disabled = false, className = ''}) => (
  <button type="button" onClick={onClick} disabled={disabled} className={`lc-btn ${className}`.trim()}>
    {text}
  </button>
);
