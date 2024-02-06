import * as numerable from 'numerable';

const FancyPrice: React.FC<{ value: number }> = ({ value }) => {
  return (
    <span>
      <span className="text-white/40">$</span>
      <span>{numerable.format(value, '0,0.00')}</span>
    </span>
  );
};

export default FancyPrice;
