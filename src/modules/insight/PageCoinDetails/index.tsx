import { useParams } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { CoinDetailsMeta } from './components/CoinDetailsMeta';
import { CoinDetailsDesktop } from './components/CoinDetailsDesktop';
import { CoinDetailsMobile } from './components/CoinDetailsMobile';

export default function PageCoinDetails() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const isMobile = useIsMobile();

  return (
    <>
      <CoinDetailsMeta slug={slug} />
      {isMobile ? (
        <CoinDetailsMobile slug={slug} />
      ) : (
        <CoinDetailsDesktop slug={slug} />
      )}
    </>
  );
}
