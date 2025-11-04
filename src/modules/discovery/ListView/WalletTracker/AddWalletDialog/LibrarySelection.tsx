import { type LibraryType, useLibrariesQuery } from 'api/library';
import { bxCheck, bxPlus } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useEffect, useState } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import libBg from './lib-bg.png';

export function LibrarySelection({
  onClose,
  type,
}: {
  onClose: () => void;
  type: LibraryType;
}) {
  const { settings, updateSelectedLibs } = useUserSettings();
  const [selected, setSelected] = useState<string[]>([]);
  const { data: libs } = useLibrariesQuery();
  const isLoggedIn = useIsLoggedIn();
  const [loginModal, open] = useModalLogin();

  useEffect(() => {
    setSelected(settings.wallet_tracker.selected_libraries.map(l => l.key));
  }, [settings.wallet_tracker.selected_libraries]);

  const toggleLib = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? [...prev.filter(l => l !== key)] : [...prev, key],
    );
  };

  const save = async () => {
    if (!isLoggedIn) {
      open();
      return;
    }

    updateSelectedLibs(selected.map(s => ({ key: s })));
    onClose();
  };

  return (
    <div className="flex grow flex-col overflow-hidden">
      <div className="grid grow grid-cols-3 gap-3 overflow-auto py-3">
        {libs?.results
          .filter(l => l.type === type)
          .map(lib => (
            <div
              className="relative flex h-60 flex-col rounded-xl bg-v1-surface-l2 p-3"
              key={lib.key}
            >
              <Button
                className="!absolute top-2 right-2 z-10"
                fab
                onClick={() => toggleLib(lib.key)}
                size="xs"
                surface={2}
                variant={selected.includes(lib.key) ? 'primary' : 'outline'}
              >
                <Icon name={selected.includes(lib.key) ? bxCheck : bxPlus} />
              </Button>
              <div className="relative">
                <img alt="" src={libBg} />
                <div className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 size-16 overflow-hidden rounded-xl border border-white/5 p-1">
                  <img
                    alt=""
                    className="size-full rounded-lg bg-v1-surface-l1"
                    src={lib.icon}
                  />
                </div>
              </div>
              <h2 className="mt-auto mb-1 text-sm">{lib.name}</h2>
              <p className="text-white/70 text-xs">{lib.description}</p>
            </div>
          ))}
      </div>
      <Button className="mt-3 w-full shrink-0" onClick={save}>
        Save
      </Button>
      {loginModal}
    </div>
  );
}
