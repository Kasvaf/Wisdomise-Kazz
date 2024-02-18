import { SPO as SPOComponent } from './SPO';
import { SPOProvider, type Props as SpoProps } from './components/SPOProvider';

export default function SPOWidget(props: SpoProps) {
  return (
    <SPOProvider {...props}>
      <SPOComponent />
    </SPOProvider>
  );
}
