import { type OpenOrderCondition, type SignalerData } from 'api/builder';
import { type SignalFormState } from '../useSignalFormStates';

export type ConditionTypes = 'compare';

export interface ConditionDefinition {
  Component: React.FC<{
    data: SignalFormState;
    signaler: SignalerData;
    assetName: string;
    value?: OpenOrderCondition;
    onChange: (val: OpenOrderCondition) => void;
  }>;
  default: OpenOrderCondition;
  title: string;
}
