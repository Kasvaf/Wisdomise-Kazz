import proSrc from '../images/pro.png';
import eliteSrc from '../images/elite.png';
import masterSrc from '../images/master.png';
import expertSrc from '../images/expert.png';

interface Props {
  name: string;
}

export default function PlanLogo({ name }: Props) {
  let src: string;
  if (name.toLowerCase().includes('pro')) {
    src = proSrc;
  } else if (name.toLowerCase().includes('expert')) {
    src = expertSrc;
  } else if (name.toLowerCase().includes('master')) {
    src = masterSrc;
  } else {
    src = eliteSrc;
  }
  return <img className="h-16 w-16" src={src} />;
}
