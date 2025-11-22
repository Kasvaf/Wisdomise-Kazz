import { bxCheck, bxEditAlt } from 'boxicons-quasar';
import { useEffect, useRef, useState } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import type { Surface } from 'utils/useSurface';

export default function EditableText({
  defaultValue,
  onChange,
  resetOnBlank,
  surface = 1,
}: {
  defaultValue?: string;
  onChange?: (newValue: string) => void;
  resetOnBlank?: boolean;
  surface?: Surface;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(spanRef.current?.offsetWidth ?? 0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <have dep on value>
  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.offsetWidth;
      setWidth(newWidth);
    }
  }, [value, editMode]);

  const save = () => {
    if (value === '' && resetOnBlank) {
      setValue(defaultValue ?? '');
    } else {
      onChange?.(value);
    }
    setEditMode(prev => !prev);
  };

  return (
    <div className="inline-flex items-center gap-2">
      {editMode ? (
        <div className="relative flex items-center gap-1">
          <span className="invisible absolute" ref={spanRef}>
            {value}
          </span>
          <input
            className="min-w-10 border-v1-border-brand bg-transparent outline-0 focus:border-b"
            defaultValue={value}
            onBlur={save}
            onChange={e => {
              setValue(e.target.value);
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
          {value && <span>{value}</span>}
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
