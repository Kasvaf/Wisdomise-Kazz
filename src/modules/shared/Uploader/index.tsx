import { clsx } from 'clsx';
import { forwardRef, useState, type PropsWithChildren } from 'react';
import { Modal, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import './style.css';
import Button from 'shared/Button';
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
    const [errorModal, setErrorModal] = useState(false);
    const { t } = useTranslation();
    const uploader = useUploaderMutation(target);
    const tooltip = uploader.isLoading
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
            uploader.isLoading && '[&,&_*]:!cursor-wait !pointer-events-none',
            className,
          )}
        >
          <div>
            <div
              className={clsx(
                'relative left-0 top-0 h-full w-full',
                uploader.isLoading && 'animate-pulse grayscale',
              )}
            >
              {children}
            </div>
            <input
              ref={forwardedRef}
              type="file"
              placeholder={placeholder}
              className={clsx('absolute left-0 top-0 h-full w-full')}
              disabled={uploader.isLoading || disabled}
              accept="image/*"
              onChange={async e => {
                const file = e.target?.files?.[0];
                if (file === undefined) {
                  onChange?.(value);
                } else {
                  try {
                    const uploadedFileUrl = await uploader.mutateAsync(file);
                    onChange?.(uploadedFileUrl);
                  } catch {
                    setErrorModal(true);
                  } finally {
                    e.target.value = '';
                  }
                }
              }}
            />
          </div>
        </Tooltip>
        <Modal
          open={errorModal}
          onCancel={() => setErrorModal(false)}
          footer={false}
          centered
        >
          <p className="mt-4">{t('common:upload-failed')}</p>
          <div className="mt-8 flex w-full justify-end">
            <Button variant="primary" onClick={() => setErrorModal(false)}>
              {t('common:actions.ok')}
            </Button>
          </div>
        </Modal>
      </>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';
