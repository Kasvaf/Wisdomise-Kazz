/* eslint-disable jsx-a11y/label-has-associated-control */
import { Select } from 'antd';
import { bxChevronDown, bxPlus } from 'boxicons-quasar';
import { type SignalerData } from 'api/builder';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Collapsible from '../Collapsible';
import { type SignalFormState } from '../useSignalFormStates';
import { type ConditionTypes } from './types';
import usePriceDefinition from './usePriceDefinition';
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
  const conditionDefs = useConditionDefinitions();
  const [conditions, setConditions] = data.conditions;

  const usableConditionTypes: ConditionTypes[] = [];
  if (!conditions.some(x => x.type === 'compare'))
    usableConditionTypes.push('compare');

  const colorClassName = 'bg-[#30385080]';
  return (
    <div className="flex flex-col gap-2">
      {conditions.map((cond, ind) => {
        const ConditionForm =
          (cond.type && conditionDefs[cond.type]?.Component) ?? (() => null);

        return (
          <Collapsible
            className={colorClassName}
            headerClassName={colorClassName}
            key={ind}
            title={`Open Condition #${String(ind + 1)}`}
            onDelete={() =>
              setConditions(conditions => conditions.filter(c => c !== cond))
            }
          >
            <div className="gap-2 p-2">
              <div className="grow">
                <label className="mb-2 ml-2 block">Condition</label>

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
                    <Icon name={bxChevronDown} className="mr-2 text-white" />
                  }
                >
                  {/* unique set of usable conditions and current one */}
                  {[...new Set([...usableConditionTypes, cond.type])].map(c => (
                    <Option key={c} value={c}>
                      {conditionDefs[c]?.title}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mt-2">
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
          </Collapsible>
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
          <Icon name={bxPlus} /> New Condition
        </Button>
      )}
    </div>
  );
};

export default OpenConditions;
