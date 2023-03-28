import classNames from 'classnames';
import Spinner from 'components/common/Spinner';
import type { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';

interface IntroSectionProps {
  referralCode?: string;
  isLoading?: boolean;
  referredUsers: number | undefined;
  activeReferredUsers: number | undefined;
}

const IntroSection: FC<IntroSectionProps> = ({
  referralCode = '',
  isLoading,
  referredUsers,
}) => {
  const onClickCopy = () => {
    NotificationManager.success('Code Copied Successfully');
  };

  return (
    <div className="flex flex-nowrap items-center	gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-white">Referral program</h1>
        <p className="text-base font-medium text-white/70">
          {referredUsers !== undefined && referredUsers !== 0
            ? `Congratulation! You have referred ${referredUsers} users.`
            : `You have not referred anyone yet, refer your friends through your own
						referral code.`}
        </p>
      </div>
      <div className="grow"></div>
      <div className="flex w-full shrink basis-1/3 flex-col gap-3">
        <h3 className="text-base font-medium text-white">Referral Code:</h3>
        <div className="flex w-full justify-between bg-newPanel p-4">
          <span className="text-sm font-medium text-white">
            {isLoading ? '-' : referralCode}
          </span>
          <CopyToClipboard onCopy={onClickCopy} text={referralCode}>
            <button
              disabled={isLoading}
              type="button"
              className={classNames('uppercase', {
                'bg-gradient-to-r from-gradientFrom to-gradientTo bg-clip-text text-sm font-bold text-transparent':
                  !isLoading,
                'cursor-not-allowed text-black/70': isLoading,
              })}
            >
              {isLoading ? <Spinner /> : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
