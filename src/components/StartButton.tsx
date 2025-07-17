import React from 'react';
import {ActionButton} from './ActionButton';

export interface SimpleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const StartButton: React.FC<SimpleButtonProps> = props => <ActionButton text="Start" {...props} />;
