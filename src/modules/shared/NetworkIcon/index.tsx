import { clsx } from 'clsx';
import { type FunctionComponent, type SVGProps } from 'react';
import { ReactComponent as TonIcon } from './ton.svg';
import { ReactComponent as SolanaIcon } from './solana.svg';
import { ReactComponent as BaseIcon } from './base.svg';
import { ReactComponent as EthereumIcon } from './eth.svg';
import { ReactComponent as ArbitrumIcon } from './arb.svg';
import { ReactComponent as PolygonIcon } from './polygon.svg';

const NETWORK_ICON: Record<
  string,
  { Icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string }
> = {
  'solana': {
    Icon: SolanaIcon,
    title: 'Solana',
  },
  'base': {
    Icon: BaseIcon,
    title: 'Base',
  },
  'the-open-network': {
    Icon: TonIcon,
    title: 'Ton',
  },
  'ethereum': {
    Icon: EthereumIcon,
    title: 'Ethereum',
  },
  'arbitrum': {
    Icon: ArbitrumIcon,
    title: 'Arbitrum',
  },
  'polygon': {
    Icon: PolygonIcon,
    title: 'Polygon',
  },
};

const NetworkIcon: React.FC<{
  network: string;
  size?: number;
  withTitle?: boolean;
  className?: string;
}> = ({ network, size = 14, withTitle, className }) => {
  const net = NETWORK_ICON[network];
  if (!net) return null;

  const { Icon, title } = net;
  return withTitle ? (
    <span className={clsx('flex items-center gap-1', className)}>
      <Icon key={network} width={size} height={size} />
      {title}
    </span>
  ) : (
    <Icon key={network} width={size} height={size} className={className} />
  );
};

export default NetworkIcon;
