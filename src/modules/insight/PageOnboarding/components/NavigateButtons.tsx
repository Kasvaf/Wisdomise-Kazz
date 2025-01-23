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
        'flex w-full flex-nowrap items-center justify-between gap-4 p-4 mobile:flex-col-reverse',
        className,
      )}
    >
      <Button
        size="xl"
        variant="outline"
        disabled={!allowPrev || !showPrev}
        onClick={onPrev}
        block
        className={clsx(
          'w-56 mobile:w-full',
          !showPrev && 'opacity-0 mobile:hidden',
        )}
      >
        <Icon name={bxLeftArrowAlt} />
        {prevText}
      </Button>
      <Button
        size="xl"
        variant="primary"
        disabled={!allowNext || !showNext}
        onClick={onNext}
        block
        className={clsx(
          'w-56 mobile:w-full',
          !showNext && 'opacity-0 mobile:hidden',
        )}
      >
        {nextText}
        <Icon name={bxRightArrowAlt} />
      </Button>
    </div>
  );
}
