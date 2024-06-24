import type React from 'react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import useIsMobile from 'utils/useIsMobile';
import { useHasFlag } from 'api';
import { ArrowIcon, InfoIcon } from './icons';

interface Props {
  to: string;
  info?: string;
  hint?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: React.ReactNode;
  description: React.ReactNode;
  footer?: React.ReactNode;
  cta?: string;
  onCtaClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function CardPageLink(props: Props) {
  const {
    to,
    info,
    title,
    cta,
    icon: Icon,
    description,
    onCtaClick,
    footer,
  } = props;
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');
  const hasFlag = useHasFlag();

  if (!hasFlag(to)) return null;

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-bl from-[#1A1C20] to-[#161718]">
      <div className="relative h-auto overflow-auto">
        <Icon className="absolute right-6 top-1/2 h-auto w-[110px] -translate-y-1/2" />
        <div className="relative flex min-h-40 w-full max-w-[calc(100%-200px)] basis-auto flex-col gap-4 bg-gradient-to-r from-[#1A1C20] to-transparent p-6 mobile:max-w-[calc(100%-90px)]">
          <p className="flex items-center gap-1 text-base font-semibold">
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
          <p className="text-xs font-light text-white/60">{description}</p>
        </div>
      </div>
      <div
        className={clsx(
          'rounded-b-2xl border-t border-white/10 bg-gradient-to-r from-[#09090A4D] to-[#2314364D]',
          'flex h-[72px] max-w-full flex-row items-center gap-4 overflow-x-auto overflow-y-hidden px-6 mobile:h-20 mobile:px-4',
        )}
      >
        <div className="grow">{footer}</div>

        <NavLink
          to={to}
          onClick={onCtaClick}
          className="flex grow items-center justify-end gap-1 text-sm font-medium mobile:text-xs"
        >
          {cta || t('actions.explore')} <ArrowIcon />
        </NavLink>
      </div>
    </div>
  );
}
