import React from 'react';

export interface InputCaseProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const InputCase: React.FC<InputCaseProps> = ({label, value, onChange, placeholder}) => (
  <div className="flex-1 flex flex-col">
    <label className="block text-sm font-medium mb-1">{label}:</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition duration-200"
    />
  </div>
);
