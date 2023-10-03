import { clsx } from 'clsx';
import { ReactComponent as LogoSvg } from 'assets/logo-horizontal-beta.svg';
import Card from 'shared/Card';

const CardWisdomiseAccount: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Card className={className}>
      <h2 className="mb-8 text-base font-semibold">Wisdomise Account</h2>

      <div
        className={clsx(
          'flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:gap-6',
          'rounded-3xl bg-black/20 px-6 py-4',
          'max-w-xl',
        )}
      >
        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">Account</div>
          <div className="h-full">
            <LogoSvg />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">Subscription</div>
          <div className="flex h-full items-center">Pro Plan</div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xs text-white/60">KYC</div>
          <div className="flex h-full items-center">3/3</div>
        </div>
      </div>
    </Card>
  );
};

export default CardWisdomiseAccount;
