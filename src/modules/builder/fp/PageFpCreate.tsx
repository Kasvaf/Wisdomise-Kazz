import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, notification } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import {
  type RiskLevel,
  useCreateMyFinancialProductMutation,
} from 'api/builder';
import { type MarketTypes } from 'api/types/financialProduct';
import { unwrapErrorMessage } from 'utils/error';
import PageWrapper from 'modules/base/PageWrapper';
import MarketSelector from 'modules/account/MarketSelector';
import AmountInputBox from 'shared/AmountInputBox';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
const { Option } = Select;

export default function PageFpCreate() {
  const { t } = useTranslation('builder');
  const [showErrors, setShowErrors] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [marketType, setMarketType] = useState<MarketTypes>('FUTURES');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [expectedApy, setExpectedApy] = useState('');
  const [expectedDrawdown, setExpectedDrawdown] = useState('');

  const { mutateAsync, isLoading } = useCreateMyFinancialProductMutation();
  const navigate = useNavigate();

  const onCreateHandler = async () => {
    setShowErrors(true);
    if (!title) return;

    try {
      const { key } = await mutateAsync({
        title,
        description,
        market_name: marketType,
        risk_level: riskLevel,
        expected_apy: expectedApy,
        expected_drawdown: expectedDrawdown,
      });
      navigate(`/builder/fp/${key}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">{t('fp.create-new.title')}</h1>

      <Card>
        <section>
          <div className="mt-4 flex gap-6 mobile:flex-col">
            <TextBox
              label={t('fp.create-new.name')}
              placeholder={t('fp.create-new.name')}
              className="basis-2/5"
              value={title}
              onChange={setTitle}
              error={showErrors && !title && 'This field is required.'}
            />

            <TextBox
              label={t('fp.create-new.description')}
              placeholder={t('fp.create-new.description')}
              className="basis-3/5"
              value={description}
              onChange={setDescription}
              error={showErrors && !description && 'This field is required.'}
            />
          </div>

          <div className="mt-8 flex gap-6 mobile:flex-col">
            <AmountInputBox
              label={t('fp.create-new.expected-drawdown')}
              placeholder={t('fp.create-new.expected-drawdown')}
              className="basis-1/4"
              value={expectedDrawdown}
              onChange={setExpectedDrawdown}
              error={
                showErrors && !expectedDrawdown && 'This field is required.'
              }
            />
            <AmountInputBox
              label={t('fp.create-new.expected-apy')}
              placeholder={t('fp.create-new.expected-apy')}
              className="basis-1/4"
              value={expectedApy}
              onChange={setExpectedApy}
              error={showErrors && !expectedApy && 'This field is required.'}
            />

            <MarketSelector
              label={t('fp.create-new.market')}
              className="basis-1/4"
              selectedItem={marketType}
              onSelect={setMarketType}
            />

            <div className="basis-1/4">
              <div className="mb-2 ml-2">{t('fp.create-new.risk-level')}</div>
              <Select
                className="w-full"
                placeholder={t('fp.create-new.risk-level')}
                value={riskLevel}
                onChange={setRiskLevel}
                suffixIcon={
                  <Icon name={bxChevronDown} className="mr-2 text-white" />
                }
              >
                <Option value="Low">
                  {t('products:product-detail.risk.low')}
                </Option>
                <Option value="Medium">
                  {t('products:product-detail.risk.medium')}
                </Option>
                <Option value="High">
                  {t('products:product-detail.risk.high')}
                </Option>
              </Select>
            </div>
          </div>
        </section>

        <section className="mt-12 justify-center mobile:flex">
          <Button
            disabled={
              !title || !description || !expectedDrawdown || !expectedApy
            }
            onClick={onCreateHandler}
            loading={isLoading}
          >
            {t('fp.create-new.btn-create-financial-product')}
          </Button>
        </section>
      </Card>
    </PageWrapper>
  );
}
