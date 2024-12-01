import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { type PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxChevronDown } from 'boxicons-quasar';
import DropdownContainer from 'shared/DropdownContainer';
import useIsMobile from 'utils/useIsMobile';
import Icon from 'shared/Icon';
import DropButton from '../DropButton';
import { ReactComponent as LangIcon } from './lang-icon.svg';

const langs = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中国人' },
];

const LanguageSelector: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();
  // const [cookies, setCookie] = useCookies(['i18next']);

  const [loading, setLoading] = useState(false);
  const changeLang = async (value: string) => {
    try {
      setLoading(true);
      await i18n.changeLanguage(value);
      // setCookie('i18next', value, {
      //   path: '/',
      //   domain: isLocal ? 'localhost' : 'wisdomise.com',
      // });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (cookies.i18next) {
  //     void changeLang(cookies.i18next);
  //   }
  // }, [changeLang, cookies.i18next]);

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

  return (
    <Dropdown
      open={open}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomRight"
      dropdownRender={dropDownFn}
    >
      {children || (
        <DropButton
          className={clsx('mr-3', open && 'active')}
          loading={loading}
        >
          <div className="flex items-center">
            {!isMobile && (
              <LangIcon className="mr-3 w-9 border-r border-r-white/10 pr-3 text-white" />
            )}
            <div>{i18n.language.toUpperCase()}</div>
            {isMobile && (
              <Icon
                name={bxChevronDown}
                size={20}
                className="ml-1 text-white/30"
              />
            )}
          </div>
        </DropButton>
      )}
    </Dropdown>
  );
};

export default LanguageSelector;
