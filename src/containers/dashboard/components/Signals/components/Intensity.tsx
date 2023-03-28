import { FunctionComponent } from 'react';
import { ReactComponent as Intensity1 } from '@images/icons/intensity-1.svg';
import { ReactComponent as Intensity2 } from '@images/icons/intensity-2.svg';
import { ReactComponent as Intensity3 } from '@images/icons/intensity-3.svg';
import { ReactComponent as Intensity4 } from '@images/icons/intensity-4.svg';

interface IntensityProps {
  intensity: number;
}

const Intensity: FunctionComponent<IntensityProps> = ({ intensity }) => {
  if (isNaN(Number(intensity))) return <span className="text-nodata">-</span>;
  const value = Math.floor(intensity / 0.33) + 1;
  switch (value) {
    case 1:
      return <Intensity1 title="1" />;
    case 2:
      return <Intensity2 title="2" />;
    case 3:
      return <Intensity3 title="3" />;
    case 4:
      return <Intensity4 title="4" />;
    default:
      return <Intensity1 title="1" />;
  }
};

export default Intensity;
