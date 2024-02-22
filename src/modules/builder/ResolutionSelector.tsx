import type React from 'react';
import { type Resolution } from 'api';
import ComboBox from 'shared/ComboBox';

const ResolutionOptionItem = (item: Resolution) => {
  return <div>{item}</div>;
};

interface Props {
  label?: string;
  className?: string;
  selectedItem: string;
  onSelect?: (net: Resolution) => void;
  disabled?: boolean;
}

const ResolutionSelector: React.FC<Props> = ({
  label,
  className,
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  const resolutions: Resolution[] = ['1m', '3m', '5m', '15m', '30m', '1h'];
  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <ComboBox
        options={resolutions}
        selectedItem={selectedItem}
        onSelect={onSelect}
        renderItem={ResolutionOptionItem}
        disabled={disabled}
      />
    </div>
  );
};

export default ResolutionSelector;
