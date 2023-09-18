import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';

interface Props {
  label?: string;
  value?: string;
  className?: string;
  style?: 'primary' | 'alt';
}

const CopyInputBox: React.FC<Props> = ({
  value,
  label,
  className,
  style = 'primary',
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyToClipboard = useCallback(() => {
    if (!value) return;

    const el = inputRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange?.(0, 1000);
    }
    let timer: undefined | ReturnType<typeof setTimeout>;
    void navigator.clipboard?.writeText(value).then(() => {
      setShowInfo(true);
      timer = setTimeout(() => {
        setShowInfo(false);
      }, 2000);
      return null;
    });
    return clearTimeout(timer);
  }, [value]);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <div
        className={clsx(
          'flex h-12 rounded-full px-6 text-sm',
          'items-center justify-between',
          style === 'primary'
            ? 'bg-white text-black hover:bg-white/80'
            : 'bg-black/40 text-white hover:bg-black/60',
          'cursor-pointer',
        )}
        onClick={copyToClipboard}
      >
        <input
          ref={inputRef}
          className="pointer-events-none w-full truncate !border-0 bg-transparent outline-0"
          style={{ maxWidth: 'calc(100% - 50px)' }}
          value={value}
          readOnly
        />
        <div className="font-medium">Copy</div>
      </div>
      <div
        className={clsx(
          'ml-6 mt-1 text-xs text-white/60 transition-opacity',
          showInfo ? 'opacity-100' : 'opacity-0',
        )}
      >
        Copied to clipboard
      </div>
    </div>
  );
};

export default CopyInputBox;
