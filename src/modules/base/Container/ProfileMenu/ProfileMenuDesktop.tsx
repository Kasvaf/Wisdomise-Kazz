import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import Button from 'shared/Button';
import DropdownContainer from '../DropdownContainer';
import { ReactComponent as AccountIconEmpty } from '../useMenuItems/icons/account-empty.svg';
import { ReactComponent as AccountIconFull } from '../useMenuItems/icons/account-full.svg';
import ProfileMenuContent from './ProfileMenuContent';

const ProfileMenuDesktop = () => {
  const [open, setOpen] = useState(false);

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer className="w-96 !p-4" setOpen={setOpen}>
        <ProfileMenuContent />
      </DropdownContainer>
    ),
    [],
  );

  return (
    <div>
      <Dropdown
        open={open}
        trigger={['click']}
        onOpenChange={setOpen}
        placement="bottomRight"
        dropdownRender={dropDownFn}
      >
        <Button
          className={clsx('!p-3', open && 'active')}
          variant="alternative"
        >
          {open ? <AccountIconFull /> : <AccountIconEmpty />}
        </Button>
      </Dropdown>
    </div>
  );
};

export default ProfileMenuDesktop;
