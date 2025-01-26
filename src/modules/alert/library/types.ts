import { type ComponentType, type ReactNode } from 'react';
import { type Alert } from 'api/alert';

export interface AlertFormStepProps {
  lock?: boolean;
  loading?: boolean;
  onSubmit: () => void;
  onDelete?: () => void;
  className: string;
}

export interface AlertStep {
  title: ReactNode;
  subtitle?: ReactNode;
  icon: ComponentType<{ className?: string }>;
  crumb?: ReactNode;
  component: ComponentType<AlertFormStepProps>;
}

export interface AlertForm {
  value: string;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ComponentType<{ className?: string }>;
  steps?: AlertStep[];
  disabled?: () => boolean;
  hidden?: () => boolean;
  isCompatible?: (payload: Partial<Alert>) => boolean;
  defaultValue?: () => Promise<Partial<Alert>>;
  save?: (payload: Partial<Alert>) => Promise<unknown>;
  delete?: (payload: Partial<Alert>) => Promise<unknown>;
}

export interface AlertFormGroup {
  value: string;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ComponentType<{ className?: string }>;
  disabled?: () => boolean;
  hidden?: () => boolean;
  children: AlertForm[];
}
