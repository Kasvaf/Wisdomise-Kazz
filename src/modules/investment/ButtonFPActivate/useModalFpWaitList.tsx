import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import { useJoinWaitList } from 'api';
import imgWaitList from './fp-wait-list.png';

const ModalFpWaitList: React.FC<{ onResolve?: () => void }> = ({
  onResolve,
}) => {
  const { t } = useTranslation('products');
  const { mutateAsync: join, isLoading } = useJoinWaitList();
  const handler = async () => {
    await join();
    onResolve?.();
    notification.success({
      message: t('wait-list.notif-success'),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <img className="-mb-2 -mt-6" src={imgWaitList} alt="wait-list" />
      <h1 className="mb-9 text-center text-2xl">{t('wait-list.title')}</h1>

      <p className="w-full text-center text-white/60">
        {t('wait-list.description-1')}
      </p>

      <p className="mt-4 w-full text-center">{t('wait-list.description-2')}</p>

      <div className="mt-12 flex w-full gap-4 mobile:flex-col">
        <Button
          loading={isLoading}
          className="grow"
          variant="primary"
          onClick={handler}
        >
          {t('wait-list.btn-join')}
        </Button>
        <Button className="grow" variant="purple" to="/insight">
          {t('wait-list.btn-explore')}
        </Button>
      </div>
    </div>
  );
};

export default function useModalFpWaitList(): [
  JSX.Element,
  () => Promise<unknown>,
] {
  const [Modal, showModal] = useModal(ModalFpWaitList, {
    width: 640,
    introStyle: true,
  });
  return [Modal, async () => await showModal({})];
}
