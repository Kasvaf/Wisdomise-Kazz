import { clsx } from 'clsx';
import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';

interface Props {
  open?: boolean;
}

export const HamburgerIcon: React.FC<Props> = ({ open }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active && open !== active) {
      setActive(false);
    }
  }, [open]);

  return (
    <div
      onClick={() => setActive(a => !a)}
      className="mb-1 h-6 py-2 hover:cursor-pointer"
    >
      <Line
        className={clsx('!mt-0', active && 'translate-y-[9px] -rotate-45')}
      />
      <Line className={clsx(active && 'opacity-0')} />
      <Line
        className={clsx('!mb-0', active && 'translate-y-[-3px] rotate-45')}
      />
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
