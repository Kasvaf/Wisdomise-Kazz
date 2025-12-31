import { bxLeftArrowAlt, bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { Button, type ButtonSize } from 'shared/v1-components/Button';

export function NavigateButtons({
  nextText,
  prevText,
  allowNext = true,
  allowPrev = true,
  showPrev = true,
  showNext = true,
  onNext,
  onPrev,
  buttonClassName,
  buttonSize = 'xl',
  renderHiddenButtons = true,
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
  buttonSize?: ButtonSize;
  buttonClassName?: string;
  renderHiddenButtons?: boolean;
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
        className={clsx(
          'w-64',
          !showPrev && [
            'opacity-0 max-md:hidden',
            !renderHiddenButtons && 'hidden',
          ],
          buttonClassName,
        )}
        disabled={!allowPrev || !showPrev}
        onClick={onPrev}
        size={buttonSize}
        variant="outline"
      >
        <Icon name={bxLeftArrowAlt} />
        {prevText}
      </Button>
      <Button
        block
        className={clsx(
          'w-64 max-md:w-full',
          !showNext && [
            'opacity-0 max-md:hidden',
            !renderHiddenButtons && 'hidden',
          ],
          buttonClassName,
        )}
        disabled={!allowNext || !showNext}
        onClick={onNext}
        size={buttonSize}
        variant="primary"
      >
        {nextText}
        <Icon name={bxRightArrowAlt} />
      </Button>
    </div>
  );
}
