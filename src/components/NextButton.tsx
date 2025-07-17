import React from 'react';
import {ActionButton} from './ActionButton';
import type {SimpleButtonProps} from './StartButton';

export const NextButton: React.FC<SimpleButtonProps> = props => <ActionButton text="Next Step" {...props} />;
