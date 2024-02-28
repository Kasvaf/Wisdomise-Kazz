import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, notification } from 'antd';
import {
  type RiskLevel,
  useCreateMyFinancialProductMutation,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import PageWrapper from 'modules/base/PageWrapper';
import MarketSelector from 'modules/account/MarketSelector';
import AmountInputBox from 'shared/AmountInputBox';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import Card from 'shared/Card';
import { type MarketTypes } from 'api/types/financialProduct';
const { Option } = Select;

export default function PageFpCreate() {
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
      <h1 className="mb-8 text-xl font-semibold">
        Create New Financial Product
      </h1>

      <Card>
        <section>
          <div className="mt-4 flex gap-6">
            <TextBox
              label="Financial Product Name"
              placeholder="Financial Product Name"
              className="basis-2/5"
              value={title}
              onChange={setTitle}
              error={showErrors && !title && 'This field is required.'}
            />

            <TextBox
              label="Financial Product Description"
              placeholder="Financial Product Description"
              className="basis-3/5"
              value={description}
              onChange={setDescription}
              error={showErrors && !description && 'This field is required.'}
            />
          </div>

          <div className="mt-8 flex gap-6">
            <AmountInputBox
              label="Expected Drawdown"
              placeholder="Expected Drawdown"
              className="basis-1/4"
              value={expectedDrawdown}
              onChange={setExpectedDrawdown}
              error={
                showErrors && !expectedDrawdown && 'This field is required.'
              }
            />
            <AmountInputBox
              label="Expected APY"
              placeholder="Expected APY"
              className="basis-1/4"
              value={expectedApy}
              onChange={setExpectedApy}
              error={showErrors && !expectedApy && 'This field is required.'}
            />

            <MarketSelector
              label="Market"
              className="basis-1/4"
              selectedItem={marketType}
              onSelect={setMarketType}
            />

            <div className="basis-1/4">
              <div className="mb-2 ml-4">Risk Level</div>
              <Select
                className="w-full"
                placeholder="Risk Level"
                value={riskLevel}
                onChange={setRiskLevel}
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <Button onClick={onCreateHandler} loading={isLoading}>
            Create Financial Product
          </Button>
        </section>
      </Card>
    </PageWrapper>
  );
}
