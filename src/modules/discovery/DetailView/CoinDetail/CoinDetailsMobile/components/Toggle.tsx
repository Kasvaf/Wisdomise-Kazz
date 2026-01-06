interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'data-testid'?: string;
}

export function Toggle({
  checked,
  onChange,
  'data-testid': testId,
}: ToggleProps) {
  return (
    <button
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#BEFF21] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] ${
        checked ? 'bg-[#BEFF21]' : 'bg-[#252525]'
      }`}
      data-testid={testId}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
