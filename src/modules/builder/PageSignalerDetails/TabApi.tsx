import { bxLinkExternal } from 'boxicons-quasar';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSignalerQuery } from 'api/builder';
import CopyInputBox from 'shared/CopyInputBox';
import Spinner from 'shared/Spinner';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import TitleHint from '../TitleHint';

const TabApi = () => {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const { data: signaler, isLoading } = useSignalerQuery(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!signaler) return null;

  return (
    <section className="mt-8 flex gap-10 mobile:flex-col">
      <div className="flex grow-0 basis-1/2 flex-col gap-8 md:w-1/2">
        <div>
          <TitleHint title={t('api.signaler-id.title')}>
            {t('api.signaler-id.description')}
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={signaler?.strategy_id} />
          </div>
        </div>

        <div>
          <TitleHint title={t('api.secret-key.title')}>
            {t('api.secret-key.description')}
          </TitleHint>

          <div className="mt-4">
            <CopyInputBox style="alt" value={signaler?.secret_key} />
          </div>
        </div>

        <Card className="flex items-center gap-4 !py-4 mobile:flex-col">
          <TitleHint title={t('api.documentation.title')}>
            {t('api.documentation.description')}
          </TitleHint>
          <Button className="shrink-0">
            <span className="mr-2">{t('api.documentation.title')}</span>
            <Icon name={bxLinkExternal} />
          </Button>
        </Card>
      </div>

      <div className="flex grow-0 basis-1/2 flex-col gap-8 md:w-1/2">
        <TitleHint title={t('api.signaler-api.title')}>
          {t('api.signaler-api.description')}
        </TitleHint>

        <Card className="mt-4 max-w-full overflow-x-scroll !py-4">
          <pre className="max-w-full">{signaler.signal_api_call_example}</pre>
        </Card>
      </div>
    </section>
  );
};

export default TabApi;
