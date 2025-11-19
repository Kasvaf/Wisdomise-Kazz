import { useReferralStatusQuery } from 'api';
import { bxShareAlt } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { type FC, useState } from 'react';
import Icon from 'shared/Icon';
import ShareSocial from 'shared/ShareTools/ShareSocial';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { Dialog } from 'shared/v1-components/Dialog';
import { formatNumber } from 'utils/numbers';

export const BtnTokenShare: FC<{
  className?: string;
}> = ({ className }) => {
  const details = useUnifiedCoinDetails();
  const [_share, shareNotif] = useShare('copy');
  const { data } = useReferralStatusQuery();
  const [open, setOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const formatedPrice = formatNumber(details.marketData.currentPrice ?? 0, {
    compactInteger: true,
    minifyDecimalRepeats: true,
    separateByComma: true,
    decimalLength: 2,
  });
  const text = `Check out ${details.symbol.abbreviation} on GoatX, price: $${formatedPrice} `;
  const url = `${window.location.origin}${window.location.pathname}${isLoggedIn ? `?referrer_code=${data?.referral_code}` : ''}`;

  return (
    <>
      <Button
        className={className}
        fab
        onClick={() => setOpen(true)}
        size="sm"
        surface={0}
        variant="outline"
      >
        <Icon name={bxShareAlt} />
      </Button>
      <Dialog className="w-[30rem]" onClose={() => setOpen(false)} open={open}>
        <div className="p-3">
          <h1 className="mb-3">Share</h1>
          <div className="break-words rounded-xl bg-v1-surface-l2 p-3 text-sm text-v1-content-primary/70">
            {text}
            {url}
          </div>
          <ShareSocial
            className="!gap-4 mt-5 justify-center"
            link={url}
            text={text}
          />
        </div>
      </Dialog>
      {shareNotif}
    </>
  );
};
