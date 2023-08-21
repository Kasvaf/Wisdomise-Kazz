import { clsx } from 'clsx';
import { styled } from '@linaria/react';
import { useCallback } from 'react';

interface Props {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerIcon: React.FC<Props> = ({ open, setOpen }) => {
  const toggle = useCallback(() => setOpen(a => !a), [setOpen]);

  return (
    <div onClick={toggle} className="mb-1 h-6 py-2 hover:cursor-pointer">
      <Line className={clsx('!mt-0', open && 'translate-y-[9px] -rotate-45')} />
      <Line className={clsx(open && 'opacity-0')} />
      <Line className={clsx('!mb-0', open && 'translate-y-[-3px] rotate-45')} />
    </div>
  );
};

const Line = styled.span`
  @apply rounded-full bg-black;
  width: 20px;
  height: 2px;
  display: block;
  margin: 4px auto;
  transition: all 0.3s ease-in-out;
`;

export default HamburgerIcon;
