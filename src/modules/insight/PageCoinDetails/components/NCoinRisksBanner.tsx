import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { bxError, bxXCircle } from 'boxicons-quasar';
import { useNCoinDetails } from 'api';
import Icon from 'shared/Icon';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { isDebugMode } from 'utils/version';

export const NCoinRisksBanner: FC<{
  slug: string;
  className?: string;
}> = ({ slug, className }) => {
  const nCoin = useNCoinDetails({ slug });

  const risks = useMemo(() => {
    const raw = nCoin.data?.risks ?? [];
    return [...raw]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .sort(
        (a, b) =>
          (b.level === 'danger' ? 1 : 0) - (a.level === 'danger' ? 1 : 0),
      )
      .map(risk => ({
        score: risk.score,
        text: risk.description ?? risk.name ?? 'Unknown Message',
        icon: risk.level === 'danger' ? bxXCircle : bxError,
        fg:
          risk.level === 'danger'
            ? clsx('text-v1-content-negative')
            : clsx('text-v1-content-notice'),
        bg:
          risk.level === 'danger'
            ? clsx('bg-v1-background-negative/20')
            : clsx('bg-v1-background-notice/15'),
      }));
  }, [nCoin]);

  if (risks.length === 0) return null;

  return (
    <ClickableTooltip
      className={clsx(
        'flex w-full items-center justify-center gap-1 p-3 text-xs font-normal capitalize mobile:rounded-lg',
        risks[0].bg,
        risks[0].fg,
        className,
      )}
      disabled={risks.length === 1}
      chevron={false}
      tooltipPlacement="bottom"
      title={
        <div className="flex flex-col gap-2">
          {risks.slice(1).map(risk => (
            <div
              key={risk.text}
              className={clsx(
                'flex items-center justify-start gap-1 rounded-lg p-2 text-xs font-normal capitalize',
                risk.fg,
              )}
            >
              <Icon name={risk.icon} size={16} />
              {risk.text} {isDebugMode && <> ({risk.score})</>}
            </div>
          ))}
        </div>
      }
    >
      <Icon name={risks[0].icon} size={16} />
      {risks[0].text}
      {isDebugMode && <> ({risks[0].score})</>}
      {risks.length > 1 && (
        <span className="shrink-0 underline">{`+${
          risks.length - 1
        } More`}</span>
      )}
    </ClickableTooltip>
  );
};
