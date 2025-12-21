import { clsx } from 'clsx';
import { TelegramIcon } from 'modules/account/PageProfile/assets';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'services/rest/feature-flags';
import { Button } from 'shared/v1-components/Button';

const TelegramLogin: React.FC<{
  className?: string;
  onClick: () => unknown;
}> = ({ className, onClick }) => {
  const { t } = useTranslation('auth');
  const hasFlag = useHasFlag();
  if (!hasFlag('/login-by-telegram')) return null;

  return (
    <Button
      block
      className={clsx(
        '!justify-between !text-[13px] w-full font-medium',
        className,
      )}
      onClick={onClick}
      size="md"
      variant="white"
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
