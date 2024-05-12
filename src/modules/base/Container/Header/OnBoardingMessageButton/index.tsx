import { clsx } from 'clsx';
import { useOnboardingMessage } from 'shared/Onboarding/utils';
import { ReactComponent as OpenIcon } from './open.svg';
import { ReactComponent as ClosedIcon } from './closed.svg';

export default function OnBoardingMessageButton() {
  const { isOpen, closeMessage, openMessage, sections } =
    useOnboardingMessage();

  if (!sections) return null;

  return (
    <button
      className={clsx(
        'mr-3 rounded-xl p-3',
        isOpen ? 'bg-white/20' : 'bg-white/5',
      )}
      onClick={isOpen ? closeMessage : openMessage}
    >
      {isOpen ? <OpenIcon /> : <ClosedIcon />}
    </button>
  );
}
