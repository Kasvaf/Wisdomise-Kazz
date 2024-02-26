import { type PropsWithChildren } from 'react';

const InfoBox: React.FC<PropsWithChildren<{ title: JSX.Element | string }>> = ({
  title,
  children,
}) => (
  <div className="flex h-[110px] grow flex-col justify-between rounded-2xl bg-black/30 p-6">
    <div className="self-start text-base text-white/40">{title}</div>
    <div className="flex self-end text-xl">{children}</div>
  </div>
);

export default InfoBox;
