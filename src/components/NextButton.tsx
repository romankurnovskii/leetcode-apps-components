import React from 'react';
import {ActionButton} from './ActionButton';
import type {SimpleButtonProps} from './StartButton';

export const NextButton: React.FC<SimpleButtonProps> = ({onClick, disabled = false}) => (
  <ActionButton
    text="Next Step"
    onClick={onClick}
    disabled={disabled}
    className={!disabled ? 'bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700' : ''}
  />
);
