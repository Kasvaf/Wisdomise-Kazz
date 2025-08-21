import { bxLeftArrowAlt, bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

export function NavigateButtons({
  nextText,
  prevText,
  allowNext = true,
  allowPrev = true,
  showPrev = true,
  showNext = true,
  onNext,
  onPrev,
  className,
}: {
  nextText?: string;
  prevText?: string;
  allowPrev?: boolean;
  allowNext?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex w-full flex-nowrap items-center justify-between gap-4 p-4',
        className,
      )}
    >
      <Button
        block
        className={clsx('w-64', !showPrev && 'mobile:hidden opacity-0')}
        disabled={!allowPrev || !showPrev}
        onClick={onPrev}
        size="xl"
        variant="outline"
      >
        <Icon name={bxLeftArrowAlt} />
        {prevText}
      </Button>
      <Button
        block
        className={clsx(
          'mobile:w-full w-64',
          !showNext && 'mobile:hidden opacity-0',
        )}
        disabled={!allowNext || !showNext}
        onClick={onNext}
        size="xl"
        variant="primary"
      >
        {nextText}
        <Icon name={bxRightArrowAlt} />
      </Button>
    </div>
  );
}
