import { Tooltip } from 'antd';
import { clsx } from 'clsx';
import { forwardRef, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';
import { type ImageUploaderTarget, useUploaderMutation } from 'api';

export const ImageUploader = forwardRef<
  HTMLInputElement,
  PropsWithChildren<{
    className?: string;
    target: ImageUploaderTarget;
    placeholder?: string;
    value?: string | null;
    onChange?: (newValue?: string | null) => void;
    onBlur?: (e: FocusEvent) => void;
    name?: string;
    disabled?: boolean;
    recommendedRatio: [number, number];
  }>
>(
  (
    {
      children,
      className,
      target,
      value,
      disabled,
      placeholder,
      onChange,
      recommendedRatio,
    },
    forwardedRef,
  ) => {
    const { t } = useTranslation();
    const uploader = useUploaderMutation(target);
    const tooltip = uploader.isPending
      ? `${t('common:uploading')}...`
      : `${t('common:recommended-size')}: ${recommendedRatio.join('x')}`;
    return (
      <Tooltip
        className={clsx(
          'wsdm-uploader [&_*]:!cursor-pointer relative',
          uploader.isPending && '[&,&_*]:!cursor-wait !pointer-events-none',
          className,
        )}
        color="#343942"
        overlayInnerStyle={{
          padding: 10,
        }}
        placement="top"
        // eslint-disable-next-line tailwindcss/no-custom-classname
        title={tooltip}
      >
        <div>
          <div
            className={clsx(
              'relative top-0 left-0 h-full w-full',
              uploader.isPending && 'animate-pulse grayscale',
            )}
          >
            {children}
          </div>
          <input
            className={clsx('absolute top-0 left-0 h-full w-full')}
            disabled={uploader.isPending || disabled}
            onChange={async e => {
              const file = e.target?.files?.[0];
              if (file === undefined) {
                onChange?.(value);
              } else {
                try {
                  const uploadedFileUrl = await uploader.mutateAsync(file);
                  onChange?.(uploadedFileUrl);
                } catch {
                } finally {
                  e.target.value = '';
                }
              }
            }}
            placeholder={placeholder}
            ref={forwardedRef}
            // accept="image/*"
            type="file"
          />
        </div>
      </Tooltip>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';
