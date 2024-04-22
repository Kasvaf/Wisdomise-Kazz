import * as numerable from 'numerable';

const MinMaxInfo: React.FC<{
  min: number;
  max: number;
}> = ({ min, max }) => {
  return (
    <section className="my-3 flex items-center justify-between border-y border-white/10 py-3">
      <div className="flex items-center">
        <span className="text-white/40">Min Investment</span>
        <span className="ml-3">
          <span>{numerable.format(min, '0,0')}</span>
          <span className="ml-1 text-xs text-white/40">USDT</span>
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-white/40">Max Investment</span>
        <span className="ml-3">
          <span>{numerable.format(max, '0,0')}</span>
          <span className="ml-1 text-xs text-white/40">USDT</span>
        </span>
      </div>
    </section>
  );
};

export default MinMaxInfo;
