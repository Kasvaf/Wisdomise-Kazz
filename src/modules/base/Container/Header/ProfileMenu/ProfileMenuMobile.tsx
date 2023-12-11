import { type MouseEventHandler, useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { useLocation } from 'react-router-dom';
import Button from 'shared/Button';
import { ReactComponent as WisdomiseLogo } from 'assets/logo-horizontal-beta.svg';
import ProfileMenuContent from './ProfileMenuContent';

const ProfileMenuMobile = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  // on browser history back:
  const loc = useLocation();
  useEffect(() => onClose, [loc]);

  // click on any link or button:
  const clickHandler: MouseEventHandler<HTMLDivElement> = e => {
    if ((e.target as HTMLElement).closest('a,button')) onClose();
  };

  return (
    <div>
      <Button className="!p-3" variant="link" onClick={() => setOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 9H20"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 16L20 16"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      <div onClick={clickHandler}>
        <Drawer
          className="rounded-l-3xl bg-page"
          placement="right"
          onClose={onClose}
          open={open}
          closable={true}
          title={<WisdomiseLogo />}
        >
          <ProfileMenuContent />
        </Drawer>
      </div>
    </div>
  );
};

export default ProfileMenuMobile;
