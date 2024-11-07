import freeSrc from '../images/free.png';
import proSrc from '../images/pro.png';

export default function PlanLogo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={name.toLowerCase().includes('free') ? freeSrc : proSrc}
    />
  );
}
