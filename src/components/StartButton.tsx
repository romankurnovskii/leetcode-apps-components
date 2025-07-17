import React from 'react';
import {ActionButton} from './ActionButton';

export interface SimpleButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const StartButton: React.FC<SimpleButtonProps> = ({onClick, disabled = false}) => (
  <ActionButton
    text="Start"
    onClick={onClick}
    disabled={disabled}
    className={!disabled ? 'bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600' : ''}
  />
);
