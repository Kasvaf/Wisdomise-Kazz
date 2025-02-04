import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'shared/v1-components/Select';
import { ReactComponent as LangIcon } from './lang-icon.svg';

const langs = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中国人' },
];

const LanguageSelector: FC = () => {
  const { i18n } = useTranslation();
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

  return (
    <Select
      className="text-white"
      options={langs.map(x => x.value)}
      value={i18n.language}
      loading={loading}
      onChange={x => changeLang(x ?? langs[0].value)}
      prefixIcon={<LangIcon />}
      chevron={false}
      surface={1}
      render={(val, target) => {
        const lng = langs.find(x => x.value === val) ?? langs[0];
        return (
          <div>
            <div className="text-base">{lng.value.toUpperCase()}</div>
            {target === 'option' && (
              <div className="-mt-1 text-xxs text-v1-content-primary/80">
                {lng.label}
              </div>
            )}
          </div>
        );
      }}
      allowClear={false}
    />
  );
};

export default LanguageSelector;
