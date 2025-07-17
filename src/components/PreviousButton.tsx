import React from 'react';
import {ActionButton} from './ActionButton';
import type {SimpleButtonProps} from './StartButton';

export const PreviousButton: React.FC<SimpleButtonProps> = ({onClick, disabled = false}) => (
  <ActionButton
    text="Previous Step"
    onClick={onClick}
    disabled={disabled}
    className={
      !disabled
        ? 'bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded border border-gray-300 hover:bg-gray-300'
        : ''
    }
  />
);
