import { clsx } from 'clsx';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import {
  BoldItalicUnderlineToggles,
  ListsToggle,
  MDXEditor,
  toolbarPlugin,
  listsPlugin,
  type RealmPlugin,
  type MDXEditorMethods,
  headingsPlugin,
  BlockTypeSelect,
  imagePlugin,
} from '@mdxeditor/editor';
import './style.css';

export const Markdown = forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    value?: string;
    onChange?: (newValue: string) => void;
    onBlur?: (e: FocusEvent) => void;
    name?: string;
    disabled?: boolean;
    className?: string;
  }
>(
  (
    { className, value, placeholder, onChange, onBlur, disabled },
    forwardedRef,
  ) => {
    const plugins = useMemo<RealmPlugin[]>(() => {
      let response = [listsPlugin(), headingsPlugin(), imagePlugin()];
      if (typeof onChange === 'function') {
        response = [
          ...response,
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <BoldItalicUnderlineToggles />
                <ListsToggle options={['bullet']} />
                <BlockTypeSelect />
              </>
            ),
          }),
        ];
      }
      return response;
    }, [onChange]);

    const ref = useRef<MDXEditorMethods>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.setMarkdown(value || '');
      }
    }, [value]);

    return (
      <>
        <MDXEditor
          markdown={value || ''}
          onChange={newValue => {
            onChange?.(newValue);
          }}
          onBlur={onBlur}
          plugins={plugins}
          placeholder={placeholder}
          readOnly={typeof onChange !== 'function' || disabled}
          ref={ref}
          className={clsx(
            // eslint-disable-next-line tailwindcss/no-custom-classname
            'wsdm-markdown',
            typeof onChange === 'function' && 'wsdm-markdown-editable',
            className,
          )}
        />
        <input
          className="hidden"
          ref={forwardedRef}
          onFocus={() => ref.current?.focus?.()}
        />
      </>
    );
  },
);

Markdown.displayName = 'Markdown';
