import type React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useHasFlag } from 'api/feature-flags';
import { TelegramIcon } from 'modules/account/PageProfile/assets';
import { Button } from 'shared/v1-components/Button';

const TelegramLogin: React.FC<{
  className?: string;
  onClick: () => unknown;
}> = ({ className, onClick }) => {
  const { t } = useTranslation('auth');
  const hasFlag = useHasFlag();
  if (!hasFlag('/mini-login')) return null;

  return (
    <Button
      onClick={onClick}
      block
      variant="white"
      size="md"
      className={clsx(
        'w-full !justify-between !text-[13px] font-medium',
        className,
      )}
    >
      {t('login.login-by-telegram')}
      <TelegramIcon
        className="-me-1 !size-[23px] stroke-[#229ed9]"
        strokeWidth={1.4}
      />
    </Button>
  );
};

export default TelegramLogin;
