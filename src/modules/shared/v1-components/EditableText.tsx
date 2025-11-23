import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import type { Surface } from 'utils/useSurface';

export default function EditableText({
  value,
  onChange,
  resetOnBlank,
  surface = 1,
  className,
}: {
  value?: string;
  onChange?: (newValue: string) => void;
  resetOnBlank?: boolean;
  surface?: Surface;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(spanRef.current?.offsetWidth ?? 0);

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <have dep on value>
  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth;
      setWidth(newWidth);
    }
  }, [localValue, editMode]);

  const save = () => {
    if (localValue === '' && resetOnBlank) {
      setLocalValue(value ?? '');
    } else {
      onChange?.(localValue);
    }
    setEditMode(prev => !prev);
  };

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      {editMode ? (
        <div className="relative flex items-center gap-1">
          <span className="invisible absolute" ref={spanRef}>
            {localValue}
          </span>
          <input
            className="min-w-16 border-v1-border-brand border-t border-t-transparent bg-transparent outline-0 focus:border-b"
            defaultValue={localValue}
            onBlur={save}
            onChange={e => {
              setLocalValue(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                save();
              }
            }}
            ref={inputRef}
            style={{ width }}
          />
          <Button
            fab
            onClick={() => {
              setEditMode(prev => !prev);
            }}
            size="3xs"
            surface={surface}
            variant="ghost"
          >
            <Icon name={bxCheck} size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {localValue && (
            <span className="border-transparent border-y" ref={spanRef}>
              {localValue}
            </span>
          )}
          <Button
            fab
            onClick={() => {
              setEditMode(prev => !prev);
              setTimeout(() => inputRef.current?.select(), 0);
            }}
            size="3xs"
            surface={surface}
            variant="ghost"
          >
            <Icon
              className="text-v1-content-primary/70 [&>svg]:size-4"
              name={bxEditAlt}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
