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
    <label className="pl-2 text-base">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 block w-[300px] rounded-xl border-2 border-solid border-[#ffffff1a] bg-transparent px-5 py-4 placeholder:text-[#FFFFFF80] md:w-[400px]"
    />
    {error && <p className="ml-2 text-error">{error}</p>}
  </div>
);

export default InputBox;
