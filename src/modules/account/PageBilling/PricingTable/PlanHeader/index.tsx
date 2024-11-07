import { clsx } from 'clsx';
import freeSrc from './free.png';
import proSrc from './pro.png';

export function PlanHeader({
  className,
  name,
  description,
}: {
  className?: string; // min-h-28
  name: string;
  description: string;
}) {
  const logo = name.toLowerCase().includes('free') ? freeSrc : proSrc;

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <img className="col-span-1 row-span-2 size-14 shrink-0" src={logo} />
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold capitalize text-white">{name}</h2>
        <p className="text-xs leading-normal text-white/70">{description}</p>
      </div>
    </div>
  );
}
