import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import DropdownContainer from 'shared/DropdownContainer';
import { ReactComponent as AccountIconEmpty } from '../../useMenuItems/icons/account-empty.svg';
import { ReactComponent as AccountIconFull } from '../../useMenuItems/icons/account-full.svg';
import DropButton from '../DropButton';
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
        <DropButton className={clsx(open && 'active')}>
          {open ? <AccountIconFull /> : <AccountIconEmpty />}
        </DropButton>
      </Dropdown>
    </div>
  );
};

export default ProfileMenuDesktop;
