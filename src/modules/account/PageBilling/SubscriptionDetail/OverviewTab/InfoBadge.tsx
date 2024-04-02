import { clsx } from 'clsx';

export default function InfoBadge({
  value1,
  value2,
  type,
}: {
  value1?: string | number;
  value2?: string | number;
  type?: 'warning';
}) {
  return (
    <span
      className={clsx(
        'mx-2 inline-flex h-7 items-center gap-1 rounded-lg  px-3 text-sm font-bold capitalize mobile:text-xs',
        type === 'warning' ? 'bg-[#F1AA40]/5 text-[#F1AA40]' : 'bg-white/5',
      )}
    >
      <span>{value1}</span>
      {value2 && (
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1L1 13"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        </svg>
      )}
      <span>{value2}</span>
    </span>
  );
}
