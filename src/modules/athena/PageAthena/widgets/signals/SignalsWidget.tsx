import { Signals } from './Signals';
import {
  SignalsProvider,
  type Props as SignalsProviderProps,
} from './components/SignalsProvider';

export default function SignalsWidget(props: SignalsProviderProps) {
  return (
    <SignalsProvider {...props}>
      <Signals />
    </SignalsProvider>
  );
}
