import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import Icon from 'shared/Icon';

const NoticeBox: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(
      'rounded-3xl bg-white/5 p-4 text-xs text-white/60 opacity-70',
      className,
    )}
  >
    <div className="flex gap-4">
      <Icon name={bxInfoCircle} className="shrink-0 text-warning" />
      <div>
        This website contains forward-looking statements. Such forward-looking
        statements are based on estimates, assumptions and presumptions that
        Wisdomise (Switzerland) AG believes are reasonable at this time. These
        forward-looking statements are inherently subject to risks and
        uncertainties as they relate to future events. Therefore, it is possible
        that actual events, including the performance of cryptocurrencies, may
        differ materially from those forecast. You should also note that past
        events and results are no guarantee of future events or results.
        Wisdomise (Switzerland) AG or any other person does not guarantee that
        the developments described on this website will occur. The User should
        therefore not solely base their investment decision with regard to the
        services offered by Wisdomise (Switzerland) AG on the forward-looking
        statements expressed on this website.
      </div>
    </div>
  </div>
);

export default NoticeBox;
