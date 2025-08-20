import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCheck } from 'boxicons-quasar';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Spin from 'shared/Spin';
import Icon from 'shared/Icon';
import BoxedIcon from './BoxedIcon';
import MenuItem from './MenuItem';
import { IconLanguage } from './icons';

const langs = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中国人' },
];

const MenuItemLang = () => {
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

  const selected = langs.find(x => x.value === i18n.language);

  return (
    <ClickableTooltip
      chevron={false}
      disabled={loading}
      title={
        <div className="flex flex-col gap-1">
          {langs.map(lng => (
            <a
              key={lng.value}
              onClick={() => changeLang(lng.value)}
              className="flex cursor-pointer gap-2 rounded-lg px-2 !text-v1-content-primary hover:bg-v1-surface-l2"
            >
              {selected?.value === lng.value ? (
                <Icon name={bxCheck} className="text-v1-content-positive" />
              ) : (
                <div className="size-6" />
              )}

              <div>
                <div className="text-base">{lng.value.toUpperCase()}</div>
                <div className="-mt-1 text-xxs text-v1-content-primary/80">
                  {lng.label}
                </div>
              </div>
            </a>
          ))}
        </div>
      }
      tooltipPlacement="bottomLeft"
    >
      <MenuItem className="w-full">
        <BoxedIcon icon={IconLanguage} />
        Language{' '}
        <span className="text-v1-content-secondary">{selected?.label}</span>{' '}
        {loading && <Spin />}
      </MenuItem>
    </ClickableTooltip>
  );
};

export default MenuItemLang;
