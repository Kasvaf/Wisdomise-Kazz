import TextBox from './TextBox';

interface Props {
  label?: string | React.ReactNode;
  value: string;
  hint?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  error?: string | boolean;
  suffix?: string | React.ReactNode;
  min?: number;
  max?: number;
  onChange?: (item: string) => void;
  onBlur?: () => void;
}

export const toAmount = (v: string) =>
  v
    .replaceAll(/[^\d.]+/g, '')
    .replace(/^(0+)/, '')
    .replace(/^\./, '0.')
    .replace(/^(\d+(\.\d*))\..*$/, '$1') || '0';

const AmountInputBox: React.FC<Props> = ({ min, max, ...props }) => {
  return (
    <TextBox
      type="tel"
      filter={toAmount}
      {...props}
      onBlur={() => {
        props.onChange?.(
          min !== undefined && +props.value < min
            ? String(min)
            : max !== undefined && +props.value > max
            ? String(max)
            : props.value,
        );
        props.onBlur?.();
      }}
    />
  );
};

export default AmountInputBox;
