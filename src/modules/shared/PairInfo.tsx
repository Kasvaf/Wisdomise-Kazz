import CoinsIcons from './CoinsIcons';

interface Props {
  title: string;
  base: string;
  quote: string;
}

const PairInfo: React.FC<Props> = ({ title, base, quote }) => (
  <div className="flex items-center justify-center p-2">
    <CoinsIcons coins={[base]} />
    <div className="ml-2">
      <p className="text-sm text-white ">{title}</p>
      <p className="text-[10px] text-white/40 ">
        {base} / {quote}
      </p>
    </div>
  </div>
);

export default PairInfo;
