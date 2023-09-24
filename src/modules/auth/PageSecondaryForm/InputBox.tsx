import { useCallback } from 'react';

interface InputProps {
  value?: string;
  placeholder: string;
  error?: string | boolean;
  label: string | React.ReactNode;
  onChange: (val: string) => void;
}

const InputBox: React.FC<InputProps> = ({
  label,
  error,
  onChange,
  placeholder,
  value,
}) => (
  <div className="mb-5">
    <label className="pl-4 text-base">{label}</label>
    <input
      value={value}
      onChange={useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        [onChange],
      )}
      placeholder={placeholder}
      className="mt-1 block w-[300px] rounded-full  border-2 border-solid border-[#ffffff1a] bg-transparent p-5 placeholder:text-[#FFFFFF80] md:w-[400px]"
    />
    {error && <p className="ml-6 text-error">{error}</p>}
  </div>
);

export default InputBox;
