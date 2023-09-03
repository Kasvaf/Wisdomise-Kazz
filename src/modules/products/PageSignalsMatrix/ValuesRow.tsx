import { clsx } from 'clsx';

const ValuesRow: React.FC<{
  values: Array<{ label: string; value?: string | number; isMuted?: boolean }>;
  className?: string;
}> = ({ values, className }) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-between bg-black/10 p-2',
        className,
      )}
    >
      {values.map(v => (
        <div
          key={v.label}
          className="mt-2 flex w-full items-center justify-start first:mt-0"
        >
          <span className="mr-1 grow-0 basis-auto text-xxs text-white/20">
            {v.label}
          </span>
          <div className="mx-1 grow basis-auto border-t border-white/5" />
          <span
            className={clsx(
              'grow-0 basis-auto text-xs text-white/90',
              v.isMuted && '!text-white/20',
            )}
          >
            {v.value || <span className="text-white/20">None</span>}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ValuesRow;
