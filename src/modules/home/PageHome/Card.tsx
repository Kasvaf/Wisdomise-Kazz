import type React from 'react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import useIsMobile from 'utils/useIsMobile';
import { trackClick } from 'config/segment';
import { ReactComponent as ArrowIcon } from './icon/arrow.svg';
import { ReactComponent as InfoIcon } from './icon/info.svg';
import WatchGuideVideo from './WatchGuideVideo';

interface Props {
  to: string;
  tag?: string;
  info?: string;
  title: string;
  hint?: string;
  videoId?: string;
  ctaTitle?: string;
  description: string;
  ctaSegmentEvent?: string;
  icon: string | React.FC<React.SVGProps<SVGSVGElement>>;
}

export default function Card(props: Props) {
  const {
    to,
    tag,
    info,
    hint,
    title,
    videoId,
    ctaTitle,
    icon: Icon,
    description,
    ctaSegmentEvent,
  } = props;
  const isMobile = useIsMobile();
  const { t } = useTranslation('home');

  return (
    <section className="flex flex-col justify-between rounded-2xl bg-gradient-to-bl from-[#1A1C20] to-[#161718]">
      <div className="flex justify-between p-6 mobile:p-6">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-1 font-semibold">
            {title}
            {info && (
              <Tooltip
                color="#343942"
                overlayInnerStyle={{
                  padding: 20,
                  width: isMobile ? 'unset' : '350px',
                }}
                title={
                  <p className="text-xs leading-5 text-white/60">{info}</p>
                }
              >
                <InfoIcon />
              </Tooltip>
            )}
          </p>
          <p className="text-xs text-white/60">{description}</p>

          {videoId && <WatchGuideVideo videoId={videoId} />}

          {hint && <p className="text-xxs text-white/60">{hint}</p>}
        </div>
        <div className="flex shrink-0 grow-0 basis-1/3 items-center justify-end">
          {typeof Icon === 'string' ? (
            <img src={Icon} />
          ) : (
            <Icon className="w-[110px] mobile:w-[90px]" />
          )}
        </div>
      </div>
      <div
        className={clsx(
          'flex items-center rounded-b-2xl bg-gradient-to-r from-[#09090A4D] to-[#2314364D] px-6 py-4',
          'border-t border-white/10',
          'mobile:px-5 mobile:py-3',
        )}
      >
        <div
          className={clsx(
            'rounded-full border-[2px] border-[#9747FF66] bg-[#9747FF1A] px-6 py-3 text-xxs font-medium',
            !tag && 'invisible',
            'mobile:px-4 mobile:py-2',
          )}
        >
          {tag || 'nothing'}
        </div>

        <NavLink
          to={to}
          onClick={() => ctaSegmentEvent && trackClick(ctaSegmentEvent)()}
          className="ml-auto flex items-center gap-1 text-sm font-medium mobile:text-xs"
        >
          {ctaTitle || t('explore')} <ArrowIcon />
        </NavLink>
      </div>
    </section>
  );
}
