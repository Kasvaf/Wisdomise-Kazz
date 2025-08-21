import { Select, type SelectProps } from 'antd';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AboveIcon } from './above.svg';
import { ReactComponent as BelowIcon } from './below.svg';
import { ReactComponent as EqualIcon } from './equal.svg';

export const OperatorSelect: FC<
  SelectProps<string> & {
    showEqual: boolean;
  }
> = ({ showEqual, className, disabled, ...props }) => {
  const { t } = useTranslation('common');

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      disabled={disabled}
      options={[
        {
          label: (
            <>
              <AboveIcon className="me-2 inline-block" />
              {t('above')}
            </>
          ),
          value: 'GREATER',
        },
        {
          label: (
            <>
              <BelowIcon className="me-2 inline-block" />
              {t('below')}
            </>
          ),
          value: 'LESS',
        },
        ...(showEqual
          ? [
              {
                label: (
                  <>
                    <EqualIcon className="me-2 inline-block" />
                    {t('equal')}
                  </>
                ),
                value: 'EQUAL',
              },
            ]
          : []),
      ]}
      showArrow={!disabled}
      {...props}
    />
  );
};
