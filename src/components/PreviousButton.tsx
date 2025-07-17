import React from 'react';
import {ActionButton} from './ActionButton';
import type {SimpleButtonProps} from './StartButton';

export const PreviousButton: React.FC<SimpleButtonProps> = props => <ActionButton text="Previous Step" {...props} />;
