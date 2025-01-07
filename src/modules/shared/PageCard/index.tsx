import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  type MouseEventHandler,
  type ReactNode,
  type SVGProps,
  type FC,
} from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useHasFlag } from 'api';
import { YoutubeVideoButton } from 'shared/YoutubeVideoButton';
import { DebugPin } from 'shared/DebugPin';
import { ArrowIcon, InfoIcon } from './icons';

const badgeColors = {
  green: clsx('border-transparent bg-[#183B2A] text-[#40F19C]/95'),
  purple: clsx('border-[#9747FF]/40 bg-[#9747FF]/10 text-white'),
  orange: clsx('border-transparent bg-[#F1AA40]/10 text-[#F1AA40]'),
};

interface PageCardProps {
  to: string;
  info?: string;
  hint?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  title: ReactNode;
  description: ReactNode;
  footer?: ReactNode;
  cta?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  videoId?: string;
  badge?: ReactNode;
  badgeType?: keyof typeof badgeColors | 'manual';
}

export const PageCard: FC<PageCardProps> = props => {
  const {
    to,
    info,
    title,
    cta,
    icon: Icon,
    description,
    onClick,
    badgeType = 'purple',
    badge,
    videoId,
    footer,
  } = props;
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');
  const hasFlag = useHasFlag();

  if (!hasFlag(to)) return null;

  return (
    <NavLink
      to={to}
      className={clsx(
        'group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl',
        'bg-gradient-to-bl from-[#1A1C20] to-[#161718] transition-all duration-150 hover:brightness-110',
      )}
      onClick={onClick}
    >
      <DebugPin value={to} />
      <div className="relative h-auto overflow-auto">
        {Icon && (
          <Icon className="absolute right-6 top-1/2 h-auto w-[112px] -translate-y-1/2 mobile:w-[88px]" />
        )}
        <div className="relative flex min-h-40 w-full max-w-[70%] basis-auto flex-col gap-4 bg-gradient-to-r from-[#1A1C20] to-transparent p-6 mobile:max-w-[calc(100%-90px)]">
          <p className="flex items-center gap-2 text-base font-semibold">
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
          <div className="flex flex-col gap-4 text-xs font-light text-white/60">
            <p>{description}</p>
            {videoId && (
              <div
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <YoutubeVideoButton videoId={videoId} />
              </div>
            )}
            {footer && (
              <p className="absolute bottom-0 mb-6 text-xxs">{footer}</p>
            )}
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'rounded-b-2xl border-t border-white/10 bg-gradient-to-r from-[#09090A4D] to-[#2314364D]',
          'flex h-[72px] max-w-full flex-row items-center gap-4 overflow-x-auto overflow-y-hidden px-6 mobile:h-20 mobile:px-4',
        )}
      >
        <div className="grow">
          {badge && (
            <div
              className={clsx(
                badgeType !== 'manual' && [
                  'h-10 overflow-x-auto whitespace-nowrap rounded-full border-[2px] px-6 text-xxs font-medium',
                  'inline-flex items-center justify-center gap-2',
                  badgeColors[badgeType || 'purple'],
                ],
              )}
            >
              {badge}
            </div>
          )}
        </div>

        <span className="inline-flex items-center justify-end gap-1 rounded-lg text-sm font-medium mobile:text-xs">
          {cta || t('actions.explore')}{' '}
          <ArrowIcon className="transition-all group-hover:translate-x-1" />
        </span>
      </div>
    </NavLink>
  );
};
