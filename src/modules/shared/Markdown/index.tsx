import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  imagePlugin,
  ListsToggle,
  listsPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type RealmPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { clsx } from 'clsx';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
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
          className={clsx(
            // eslint-disable-next-line tailwindcss/no-custom-classname
            'wsdm-markdown',
            typeof onChange === 'function' && 'wsdm-markdown-editable',
            className,
          )}
          markdown={value || ''}
          onBlur={onBlur}
          onChange={newValue => {
            onChange?.(newValue);
          }}
          placeholder={placeholder}
          plugins={plugins}
          readOnly={typeof onChange !== 'function' || disabled}
          ref={ref}
        />
        <input
          className="hidden"
          onFocus={() => ref.current?.focus?.()}
          ref={forwardedRef}
        />
      </>
    );
  },
);

Markdown.displayName = 'Markdown';
