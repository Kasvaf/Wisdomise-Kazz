import { clsx } from 'clsx';

export function Network({
  className,
  network,
  imageClassName,
}: {
  network: {
    name: string;
    icon_url?: string | null;
  };
  className?: string;
  imageClassName?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex w-auto shrink items-center gap-2 p-1 pe-2',
        className,
      )}
    >
      <div
        className={clsx(
          'shrink-0 rounded-full bg-white bg-cover bg-center bg-no-repeat',
          imageClassName ?? 'size-8',
        )}
        style={{
          ...(typeof network.icon_url === 'string' && {
            backgroundImage: `url("${network.icon_url}")`,
          }),
        }}
      />
      <div className="max-w-[110px] shrink grow leading-snug">
        <div
          className={clsx('overflow-hidden text-ellipsis', 'whitespace-nowrap')}
        >
          {network.name}
        </div>
      </div>
    </span>
  );
}
