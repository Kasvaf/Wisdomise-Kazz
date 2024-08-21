/* eslint-disable jsx-a11y/label-has-associated-control */
import { clsx } from 'clsx';
import { Select } from 'antd';
import { useState } from 'react';
import { bxChevronDown, bxPlus, bxTrash } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { type SignalerData } from 'api/builder';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import { DrawerModal } from 'shared/DrawerModal';
import { type SignalFormState } from '../useSignalFormStates';
import { type ConditionTypes } from './types';
import usePriceDefinition from './usePriceDefinition';
import { ReactComponent as ConditionsIcon } from './conditions-icon.svg';
const { Option } = Select;

const useConditionDefinitions = () => {
  return {
    compare: usePriceDefinition(),
  };
};

const OpenConditions: React.FC<{
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
}> = ({ signaler, assetName, data }) => {
  const { t } = useTranslation('builder');
  const conditionDefs = useConditionDefinitions();
  const {
    conditions: [conditions, setConditions],
    isUpdate: [isUpdate],
  } = data;

  const usableConditionTypes: ConditionTypes[] = [];
  if (!conditions.some(x => x.type === 'compare'))
    usableConditionTypes.push('compare');

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        className={clsx(
          '!p-2 !text-xxs',
          conditions.length > 0 && 'border-info !text-info',
        )}
        onClick={() => setDrawerOpen(true)}
        disabled={isUpdate}
      >
        {t('signal-form.conditional-open.title')}
      </Button>

      <DrawerModal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
        width={468}
      >
        <div className="mb-6 border-b border-white/5">
          <h1 className="flex items-center text-base font-semibold">
            <ConditionsIcon />
            {t('signal-form.conditional-open.title')}
          </h1>
          <p className="my-3 text-sm text-white/60">
            {t('signal-form.conditional-open.description')}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {conditions.map((cond, ind) => {
            const ConditionForm =
              (cond.type && conditionDefs[cond.type]?.Component) ??
              (() => null);

            return (
              <div key={ind}>
                <div className="gap-2">
                  <div className="grow">
                    <label className="mb-2 ml-2 block">
                      {t('signal-form.conditional-open.condition-ind', {
                        ind: ind + 1,
                      })}
                    </label>

                    <div className="flex items-center">
                      <Select
                        value={cond.type}
                        onChange={type =>
                          setConditions(conditions =>
                            conditions.map(x =>
                              x === cond ? conditionDefs[type]?.default : x,
                            ),
                          )
                        }
                        className="w-full"
                        suffixIcon={
                          <Icon
                            name={bxChevronDown}
                            className="mr-2 text-white"
                          />
                        }
                      >
                        {/* unique set of usable conditions and current one */}
                        {[...new Set([...usableConditionTypes, cond.type])].map(
                          c => (
                            <Option key={c} value={c}>
                              {conditionDefs[c]?.title}
                            </Option>
                          ),
                        )}
                      </Select>
                      <Button
                        variant="link"
                        className="ml-1 !p-2"
                        onClick={() =>
                          setConditions(conditions =>
                            conditions.filter(c => c !== cond),
                          )
                        }
                      >
                        <Icon name={bxTrash} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 rounded-lg bg-[#303137] p-3">
                    <ConditionForm
                      data={data}
                      signaler={signaler}
                      assetName={assetName}
                      value={cond}
                      onChange={c =>
                        setConditions(conditions =>
                          conditions.map(x => (x === cond ? c : x)),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {usableConditionTypes.length > 0 && (
            <Button
              variant="alternative"
              className="!py-2"
              onClick={() =>
                setConditions(conditions => [
                  ...conditions,
                  conditionDefs[usableConditionTypes[0]]?.default,
                ])
              }
            >
              <Icon name={bxPlus} />{' '}
              {t('signal-form.conditional-open.btn-new-condition')}
            </Button>
          )}
        </div>
      </DrawerModal>
    </>
  );
};

export default OpenConditions;
