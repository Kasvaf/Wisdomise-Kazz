import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { type PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useIsMobile from 'utils/useIsMobile';
import DropdownContainer from 'shared/DropdownContainer';
import DropButton from '../DropButton';
import { ReactComponent as LangIcon } from './lang-icon.svg';

const langs = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];

const LanguageSelector: React.FC<PropsWithChildren> = () => {
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const changeLang = async (value: string) => {
    try {
      setLoading(true);
      await i18n.changeLanguage(value);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const dropDownFn = () => (
    <DropdownContainer className="w-[146px] gap-1 !p-1" setOpen={setOpen}>
      {langs.map(lng => (
        <div
          key={lng.value}
          className={clsx(
            'flex cursor-pointer justify-between rounded-lg p-3 hover:bg-white/[.02]',
            lng.value === i18n.language && '!bg-black/30',
          )}
          onClick={() => changeLang(lng.value)}
        >
          <div>{lng.value.toUpperCase()}</div>
          <div>{lng.label}</div>
        </div>
      ))}
    </DropdownContainer>
  );

  const isMobile = useIsMobile();
  return (
    <Dropdown
      open={open}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomRight"
      dropdownRender={dropDownFn}
    >
      {isMobile ? (
        <div className="flex h-16 items-center justify-between border-b border-b-black/10 p-3 hover:bg-black/40">
          <div className="text-white/80">Language</div>
          <div className="text-right">{i18n.language.toUpperCase()}</div>
        </div>
      ) : (
        <DropButton
          className={clsx('mr-3', open && 'active')}
          loading={loading}
        >
          <div className="flex items-center">
            <LangIcon className="mr-3 w-9 border-r border-r-white/10 pr-3" />
            <div>{i18n.language.toUpperCase()}</div>
          </div>
        </DropButton>
      )}
    </Dropdown>
  );
};

export default LanguageSelector;
