import { clsx } from 'clsx';
import { styled } from '@linaria/react';
import { type PropsWithChildren } from 'react';
import { ReactComponent as BinanceBackSvg } from './binance-back.svg';

const BrandedCard: React.FC<
  PropsWithChildren<{
    type: 'Binance' | 'Wisdomise';
    className?: string;
    onClick?: () => void;
  }>
> = ({ type, children, className, onClick }) => {
  const BrandedDiv = type === 'Wisdomise' ? PurpleGradient : YellowGradient;
  return (
    <BrandedDiv
      onClick={onClick}
      className={clsx(
        'relative shrink-0 border-2 border-transparent',
        'h-full overflow-hidden rounded-xl p-3 leading-4 text-black',
        className,
      )}
    >
      {type === 'Binance' && (
        <BinanceBackSvg className="absolute -left-10 -top-6 z-[0] h-[120px] w-[120px]" />
      )}
      {children}
    </BrandedDiv>
  );
};

const YellowGradient = styled.div`
  background: linear-gradient(133deg, #dbb94d -24.22%, #fdab36 128.59%);
  box-shadow:
    0px 13px 27px -5px rgba(50, 50, 93, 0.25),
    0px 8px 16px -8px rgba(0, 0, 0, 0.3);
`;

const PurpleGradient = styled.div`
  background: linear-gradient(133deg, #9581de -24.22%, #c85ad9 128.59%);
  box-shadow:
    0px 13px 27px -5px rgba(50, 50, 93, 0.25),
    0px 8px 16px -8px rgba(0, 0, 0, 0.3);
`;

export default BrandedCard;
