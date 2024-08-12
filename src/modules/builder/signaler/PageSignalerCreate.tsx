import { useState } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type Resolution } from 'api';
import { useCreateSignalerMutation } from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import { type MarketTypes } from 'api/types/financialProduct';
import MarketSelector from 'modules/account/MarketSelector';
import PageWrapper from 'modules/base/PageWrapper';
import ResolutionSelector from 'shared/ResolutionSelector';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import TitleHint from '../TitleHint';

export default function PageSignalerCreate() {
  const { t } = useTranslation('builder');
  const [showErrors, setShowErrors] = useState(false);
  const [name, setName] = useState('');
  const [market, setMarket] = useState<MarketTypes>('FUTURES');
  const [resolution, setResolution] = useState<Resolution>('5m');

  const { mutateAsync, isLoading } = useCreateSignalerMutation();
  const navigate = useNavigate();

  const onCreateHandler = async () => {
    setShowErrors(true);
    if (!name) return;

    try {
      const { key } = await mutateAsync({
        name,
        market_name: market,
        resolution,
      });
      navigate(`/marketplace/builder/signalers/${key}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">
        {t('signaler.create-new.title')}
      </h1>

      <Card>
        <section>
          <TitleHint
            className="ml-3"
            title={t('signaler.create-new.signaler-name')}
          >
            {t('signaler.create-new.description')}
          </TitleHint>

          <div className="mt-4 flex max-w-4xl gap-6 mobile:flex-col">
            <TextBox
              placeholder={t('signaler.create-new.signaler-name')}
              className="basis-3/5"
              value={name}
              onChange={setName}
              error={showErrors && !name && 'This field is required.'}
            />

            <MarketSelector
              selectedItem={market}
              onSelect={setMarket}
              className="basis-1/5"
            />

            <ResolutionSelector
              selectedItem={resolution}
              onSelect={setResolution}
              className="basis-1/5"
            />
          </div>
        </section>

        <section className="mt-12">
          <Button
            disabled={!name}
            onClick={onCreateHandler}
            loading={isLoading}
          >
            {t('signaler.create-new.btn-create-signaler')}
          </Button>
        </section>
      </Card>
    </PageWrapper>
  );
}
