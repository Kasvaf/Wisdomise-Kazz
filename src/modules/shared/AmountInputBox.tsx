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
  onChange?: (item: string) => void;
}

const toAmount = (v: string) =>
  v
    .replaceAll(/[^\d.]+/g, '')
    .replace(/^(0+)/, '')
    .replace(/^\./, '0.')
    .replace(/^(\d+(\.\d*))\..*$/, '$1') || '0';

const AmountInputBox: React.FC<Props> = props => {
  return <TextBox type="tel" filter={toAmount} {...props} />;
};

export default AmountInputBox;
