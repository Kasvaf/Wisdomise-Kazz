import { bxBookmarkMinus, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type BlacklistType,
  MAX_BLACKLISTS_LENGTH,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useMemo, useState } from 'react';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableDate } from 'shared/ReadableDate';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';
import { Input } from 'shared/v1-components/Input';
import { EmptyContent } from 'shared/v1-components/Table/EmptyContent';

const blacklistTypeMap: Record<BlacklistType, string> = {
  ca: 'Contract Address',
  dev: 'Developer Address',
  keyword: 'Keyword',
};

export default function BlacklistManager({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<BlacklistType | null>(null);
  const [value, setValue] = useState<string>('');
  const { settings, deleteBlacklist, addBlacklist, deleteAllBlacklists } =
    useUserSettings();

  const addItem = (type: BlacklistType) => {
    addBlacklist({
      type,
      network: 'solana',
      value: value,
    });
    setValue('');
  };

  const tabs = useMemo(() => {
    return [
      { value: null, label: 'All' },
      ...Object.entries(blacklistTypeMap)
        .filter(([value]) => value !== 'keyword')
        .map(([value, label]) => ({
          value,
          label,
        })),
    ];
  }, []);

  const blacklists = useMemo(() => {
    return settings.blacklists.filter(b => (filter ? b.type === filter : true));
  }, [settings.blacklists, filter]);

  return (
    <>
      <HoverTooltip title="Blacklist">
        <Button
          className={className}
          fab
          onClick={() => setOpen(true)}
          size="xs"
          surface={0}
          variant="ghost"
        >
          <Icon name={bxBookmarkMinus} />
        </Button>
      </HoverTooltip>

      <Dialog
        className="md:w-[500px]"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="p-4">
          <h1 className="mb-5">Blacklist</h1>
          <div className="my-5 flex items-center gap-2">
            <Input
              className="grow"
              onChange={newValue => setValue(newValue)}
              placeholder="Enter token CA, dev address"
              size="sm"
              type="string"
              value={value}
            />
            <ClickableTooltip
              chevron={false}
              disabled={!value}
              title={
                <div className="flex flex-col gap-1">
                  {Object.entries(blacklistTypeMap).map(([key, value]) => (
                    <Button
                      className={clsx(
                        key === 'keyword' && '!hidden',
                        'w-full justify-start',
                      )}
                      key={key}
                      onClick={() => addItem(key as BlacklistType)}
                      size="sm"
                      variant="ghost"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              }
            >
              <Button disabled={!value} size="sm" variant="primary">
                Blacklist
              </Button>
            </ClickableTooltip>
          </div>
          <ButtonSelect
            onChange={newValue => setFilter(newValue as BlacklistType)}
            options={tabs}
            size="sm"
            surface={1}
            value={filter}
            variant="tab"
          />
          <div className="h-[300px] overflow-y-auto">
            {blacklists.length === 0 && <EmptyContent />}
            {blacklists.map((item, index) => (
              <>
                {index !== 0 && <hr className="border-white/10" />}
                <div
                  className="flex items-center justify-between py-3"
                  key={item.created_at}
                >
                  <div>
                    <p className="mb-1 text-xs">{item.value}</p>
                    <div>
                      <Badge variant="soft">
                        {blacklistTypeMap[item.type]}
                      </Badge>
                      <span className="ml-2 text-2xs text-v1-content-secondary">
                        Added <ReadableDate value={item.created_at} />
                      </span>
                    </div>
                  </div>
                  <Button
                    fab
                    onClick={() =>
                      deleteBlacklist({
                        type: item.type,
                        value: item.value,
                        network: 'solana',
                      })
                    }
                    size="xs"
                    variant="outline"
                  >
                    <Icon name={bxTrash} />
                  </Button>
                </div>
              </>
            ))}
          </div>
          <hr className="mb-3 border-white/10" />
          <div className="flex items-center justify-between">
            <div className="text-v1-content-secondary text-xs">
              {settings.blacklists.length}/{MAX_BLACKLISTS_LENGTH} Blacklists
            </div>
            <Button
              disabled={!settings.blacklists.length}
              onClick={() => deleteAllBlacklists()}
              size="sm"
              variant="negative"
            >
              Delete All
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
