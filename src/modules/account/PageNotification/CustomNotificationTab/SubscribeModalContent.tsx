import { bxLock } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import Button from 'modules/shared/Button';
import Icon from 'modules/shared/Icon';

export default function SubscribeModalContent() {
  const navigate = useNavigate();

  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <Icon name={bxLock} className="text-warning" size={40} />
      </div>

      <h1 className="text-white">You are not subscribed</h1>
      <div className="mt-2 text-slate-400">
        To add a question, you need to subscribe to one of the Wisdomise plans
      </div>

      <Button className="mt-6" onClick={() => navigate('/account/billing')}>
        Subscribe
      </Button>
    </div>
  );
}
