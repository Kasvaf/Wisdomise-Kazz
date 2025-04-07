import { clsx } from 'clsx';
import { forwardRef, type PropsWithChildren } from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import './style.css';
import { useUploaderMutation, type ImageUploaderTarget } from 'api';

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
      <>
        <Tooltip
          placement="top"
          color="#343942"
          overlayInnerStyle={{
            padding: 10,
          }}
          title={tooltip}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={clsx(
            'wsdm-uploader relative [&_*]:!cursor-pointer',
            uploader.isPending && '[&,&_*]:!cursor-wait !pointer-events-none',
            className,
          )}
        >
          <div>
            <div
              className={clsx(
                'relative left-0 top-0 h-full w-full',
                uploader.isPending && 'animate-pulse grayscale',
              )}
            >
              {children}
            </div>
            <input
              ref={forwardedRef}
              type="file"
              placeholder={placeholder}
              className={clsx('absolute left-0 top-0 h-full w-full')}
              disabled={uploader.isPending || disabled}
              // accept="image/*"
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
            />
          </div>
        </Tooltip>
      </>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';
