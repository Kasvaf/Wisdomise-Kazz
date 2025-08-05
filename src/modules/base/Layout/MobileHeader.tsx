import { clsx } from 'clsx';
import type React from 'react';
import { type ReactElement, type PropsWithChildren } from 'react';
import { isMiniApp } from 'utils/version';
import { ReactComponent as Logo } from 'assets/monogram-white.svg';
import { useActiveNetwork } from 'modules/base/active-network';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import BtnBack from 'modules/base/BtnBack';
import HeaderNav from './HeaderNav';
import ProfileMenu from './ProfileMenu';

const MobileHeader: React.FC<
  PropsWithChildren<{
    hasBack?: boolean;
    title?: null | string;
    extension?: null | false | ReactElement;
    className?: string;
  }>
> = ({ hasBack, title, extension, className, children }) => {
  const net = useActiveNetwork();
  const defaultChildren = (
    <>
      <div className="mr-2 w-1/2 has-[+div+div>*]:w-auto">
        {hasBack ? <BtnBack /> : <ProfileMenu className="w-full" />}
      </div>

      {/* // weird class hides it when there's a button on right */}
      <div className="shrink-0 has-[+div>*]:hidden">
        {title ? (
          <div className="text-base font-medium">{title}</div>
        ) : (
          <Logo />
        )}
      </div>

      <div
        className={clsx(
          'ml-2 flex w-full justify-end empty:w-1/2',
          // in mini-app, we want logo on right (more space needed for left)
          isMiniApp && 'empty:hidden',
        )}
      >
        {title === undefined ? (
          <div className="flex gap-2">
            {net === 'solana' && <HeaderNav />}
            <BtnWalletConnect />
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div className={clsx('bg-v1-background-primary', className)}>
      <div className="flex h-full items-center px-3 py-2">
        <div className="w-full">
          <div className="flex items-center justify-between">
            {children || defaultChildren}
          </div>
          {extension && <div className="mt-2">{extension}</div>}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
