import freeSrc from '../images/free.png';
import insightSrc from '../images/insight.png';
import investmentSrc from '../images/investment.png';
interface Props {
  name: string;
}

export default function PlanLogo({ name }: Props) {
  let src = '';

  if (name.toLowerCase().includes('free')) {
    src = freeSrc;
  } else if (name.toLowerCase().includes('insight')) {
    src = insightSrc;
  } else if (name.toLowerCase().includes('investment')) {
    src = investmentSrc;
  }

  return <img className="size-12 mobile:size-10" src={src} />;
}
