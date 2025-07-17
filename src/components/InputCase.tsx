import React from 'react';

export interface InputCaseProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const InputCase: React.FC<InputCaseProps> = ({label, value, onChange, placeholder, className = ''}) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <label style={{fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem'}}>{label}:</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`lc-input ${className}`.trim()}
    />
  </div>
);
