import type React from 'react';

interface Props {
  id: string;
  error?: string | boolean;
  checked?: boolean;
  label: string | React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const CheckBox: React.FC<Props> = ({ id, label, checked, onClick, error }) => (
  <div className="mb-5">
    <input
      checked={checked}
      onClick={onClick}
      type="checkbox"
      id={id}
      readOnly
    />
    <label htmlFor={id} className="pl-2">
      {label}
    </label>
    {error && <p className="ml-6 text-error">{error}</p>}
  </div>
);

export default CheckBox;
