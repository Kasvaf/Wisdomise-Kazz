import { bxLogIn } from 'boxicons-quasar';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';

export default function BtnLogin({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return (
    <>
      <Button
        className={className}
        onClick={showModalLogin}
        size="xs"
        surface={isMobile ? 2 : 3}
        variant="primary"
      >
        <Icon name={bxLogIn} size={24} />
        <span className="ml-1">Login</span>
      </Button>
      {ModalLogin}
    </>
  );
}
