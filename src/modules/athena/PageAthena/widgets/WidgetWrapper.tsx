import { clsx } from 'clsx';
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import type React from 'react';
import { forwardRef, type PropsWithChildren, type ReactNode } from 'react';
import { ReactComponent as LunarCrushIcon } from './images/poweredLunarcrush.svg';
import { ReactComponent as WisdomiseIcon } from './images/poweredWisdomise.svg';

interface Props {
  id?: string;
  title?: string;
  iconSrc?: string;
  scroll?: boolean;
  subtitle?: string;
  children: ReactNode;
  rightHeader?: React.ReactNode;
  poweredBy: 'wisdomise' | 'lunarcrush';
}

export const WidgetWrapper = forwardRef<
  OverlayScrollbarsComponentRef,
  PropsWithChildren<Props>
>(
  (
    { title, scroll, iconSrc, children, subtitle, rightHeader, poweredBy, id },
    ref,
  ) => {
    const content = <section className="px-8 max-md:px-3">{children}</section>;

    return (
      <section
        className="relative max-w-[520px] rounded-3xl bg-white/10"
        id={id}
      >
        <header className="flex items-center justify-between p-6 text-xl text-white max-md:text-xl">
          <div>
            <div className="flex items-center gap-2">
              {iconSrc && (
                <img className="h-6 w-6" src={iconSrc} alt="Widget icon" />
              )}
              {title}
            </div>
            {subtitle && <div className="text-xxs">{subtitle}</div>}
          </div>
          {rightHeader}
        </header>
        <section className={clsx('bg-black/20', !scroll && 'overflow-hidden')}>
          {scroll ? (
            <OverlayScrollbarsComponent
              defer
              ref={ref}
              className="max-h-[365px]"
              options={{ scrollbars: { theme: 'wisdomiseScroll' } }}
            >
              {content}
            </OverlayScrollbarsComponent>
          ) : (
            content
          )}
        </section>

        <footer className="flex items-center justify-center gap-2 p-4 text-xs text-white/50">
          Powered By{' '}
          {poweredBy === 'lunarcrush' ? <LunarCrushIcon /> : <WisdomiseIcon />}
        </footer>
      </section>
    );
  },
);

WidgetWrapper.displayName = 'WidgetWrapper';
