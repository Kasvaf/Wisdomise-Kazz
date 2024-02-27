import freeSrc from '../images/free.png';
import insightSrc from '../images/insight.png';
import investmentSrc from '../images/investment.png';

interface Props {
  name: string;
}

export default function PlanLogo({ name }: Props) {
  let src: string;
  if (name.toLowerCase().includes('insight')) {
    src = insightSrc;
  } else if (name.toLowerCase().includes('investment')) {
    src = investmentSrc;
  } else {
    src = freeSrc;
  }

  return <img className="h-16 w-16" src={src} alt="" />;
}
