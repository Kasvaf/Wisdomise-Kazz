import { clsx } from 'clsx';
import { notification } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import useModal from 'shared/useModal';
import TextBox from 'shared/TextBox';
import { useRecommendChannelMutation } from 'api';
import { ReactComponent as RecommendIcon } from './images/recommend.svg';

export default function RecommendAccount() {
  const { t } = useTranslation('social-radar');
  const [modal, open] = useModal(RecommendAccountModal, {
    centered: false,
    destroyOnClose: true,
  });

  return (
    <section>
      <button
        onClick={open}
        className={clsx(
          'flex h-full items-center gap-2 whitespace-nowrap rounded-xl px-3 text-xs font-medium',
          'bg-[linear-gradient(250deg,_#00A3FF_-8.91%,_#9747FF_104.19%)]',
          'mobile:w-full mobile:justify-center',
        )}
      >
        <RecommendIcon className="-mb-1 size-10" />
        {t('recommend-account.button')}
      </button>
      {modal}
    </section>
  );
}

const RecommendAccountModal = ({ onResolve }: { onResolve: () => void }) => {
  const { t } = useTranslation('social-radar');
  const recommendChannel = useRecommendChannelMutation();
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: { channel_address: '', description: '' },
  });

  const onRecommendClick = async () => {
    await handleSubmit(async data => {
      try {
        await recommendChannel.mutateAsync(data);
        notification.success({ message: 'Account recommended successfully' });
        onResolve();
      } catch {
        notification.error({ message: 'Error' });
      }
    })();
  };

  return (
    <section className="p-6 mobile:p-0">
      <div className="flex justify-center gap-4 ">
        <RecommendIcon className="w-52" />
      </div>
      <p className="mt-6 text-center text-xl font-medium mobile:text-base">
        {t('recommend-account.modal.title')}
      </p>
      <p className="mt-4 text-center text-sm text-white/40 mobile:text-xs">
        {t('recommend-account.modal.sub-title')}
      </p>

      <Controller
        control={control}
        name="channel_address"
        rules={{
          minLength: {
            value: 3,
            message: t(
              'recommend-account.modal.channel-address.rules.minLength',
            ),
          },
          required: {
            message: t(
              'recommend-account.modal.channel-address.rules.required',
            ),
            value: true,
          },
        }}
        render={({ field, fieldState }) => (
          <TextBox
            {...field}
            className="mt-6"
            placeholder={t(
              'recommend-account.modal.channel-address.placeholder',
            )}
            error={fieldState.error?.message}
            label={t('recommend-account.modal.channel-address.label')}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          minLength: {
            value: 3,
            message: t('recommend-account.modal.description.rules.minLength'),
          },
        }}
        render={({ field, fieldState }) => (
          <TextBox
            {...field}
            error={fieldState.error?.message}
            className="mt-6"
            label={
              <Trans
                ns="social-radar"
                i18nKey="recommend-account.modal.description.label"
              >
                Description{' '}
                <span className="text-xs text-white/50">(optional)</span>
              </Trans>
            }
            placeholder={t('recommend-account.modal.description.placeholder')}
          />
        )}
      />

      <div className="mt-8 flex gap-3">
        <button
          onClick={onResolve}
          className=" grow basis-1/2 rounded-xl border border-white py-4"
        >
          {t('recommend-account.modal.cancel')}
        </button>
        <button
          onClick={onRecommendClick}
          disabled={!formState.isValid || recommendChannel.isLoading}
          className={clsx(
            'grow basis-1/2 rounded-xl py-4 transition-opacity disabled:!opacity-30',
            'bg-[linear-gradient(250deg,_#00A3FF_-8.91%,_#9747FF_104.19%)]',
          )}
        >
          {t('recommend-account.modal.recommend')}
        </button>
      </div>
    </section>
  );
};
