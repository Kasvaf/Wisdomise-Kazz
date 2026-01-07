import type { TokenUpdateResolution } from 'services/grpc/tokenUpdate';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Dialog } from 'shared/v1-components/Dialog';

const resolutions: { value: TokenUpdateResolution; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: 'all-time', label: 'All' },
];

interface VolumeFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResolution: TokenUpdateResolution;
  onResolutionChange: (resolution: TokenUpdateResolution) => void;
}

export function VolumeFilterDrawer({
  isOpen,
  onClose,
  selectedResolution,
  onResolutionChange,
}: VolumeFilterDrawerProps) {
  const handleChange = (resolution: TokenUpdateResolution) => {
    onResolutionChange(resolution);
    // Auto-close after selection with brief delay for visual feedback
    setTimeout(() => onClose(), 200);
  };

  const header = (
    <div className="flex w-full items-center justify-center">
      <span className="font-bold text-base text-white">Volume Timeframe</span>
    </div>
  );

  return (
    <Dialog
      className="bg-v1-background-primary"
      contentClassName="px-4 py-4"
      drawerConfig={{ position: 'bottom', closeButton: true }}
      header={header}
      mode="drawer"
      onClose={onClose}
      open={isOpen}
    >
      <ButtonSelect
        className="w-full"
        onChange={handleChange}
        options={resolutions}
        size="sm"
        surface={1}
        value={selectedResolution}
        variant="default"
      />
    </Dialog>
  );
}
