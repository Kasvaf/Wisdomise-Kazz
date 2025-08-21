import { bxCopyAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';

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
  const { t } = useTranslation('common');
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
      {label && <label className="mb-2 ml-2 block">{label}</label>}

      <div
        className={clsx(
          'flex h-12 rounded-xl px-6 text-sm',
          'items-center justify-between',
          style === 'primary'
            ? 'bg-white text-black hover:bg-white/80'
            : 'bg-black/40 text-white hover:bg-black/60',
          'cursor-pointer',
        )}
        onClick={copyToClipboard}
      >
        <input
          className="!border-0 pointer-events-none w-full truncate bg-transparent outline-0"
          readOnly
          ref={inputRef}
          style={{ maxWidth: 'calc(100% - 50px)' }}
          value={value}
        />
        <div className="font-medium">
          <Icon name={bxCopyAlt} />
        </div>
      </div>
      <div
        className={clsx(
          'mt-1 ml-6 text-white/60 text-xs transition-opacity',
          showInfo ? 'opacity-100' : 'opacity-0',
        )}
      >
        {t('copied-to-clipboard')}
      </div>
    </div>
  );
};

export default CopyInputBox;
