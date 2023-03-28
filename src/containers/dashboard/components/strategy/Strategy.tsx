import { useNavigate } from "react-router-dom";
import { ReactComponent as ChevronDownIcon } from "@images/chevron-down.svg";
import { useGetETFPackagesQuery } from "api/horosApi";
import RiskCard from "containers/dashboard/components/RiskCard";

interface StrategyProps {
  getSelectedKey?: (id: number | undefined) => void;
}

const Strategy: React.FC<StrategyProps> = ({ getSelectedKey }) => {
  const navigate = useNavigate();

  const etfData = useGetETFPackagesQuery({});

  const onClickDetail = (id: number) => {
    navigate(`/app/strategyCatalog/${id}`);
  };

  const onClickCard = async (id: number | undefined) => {
    if (typeof getSelectedKey === "function") getSelectedKey(id);
  };

  const onClickCatalog = () => {
    navigate("/app/strategyCatalog");
  };

  return (
    <>
      <div className="mt-2">
        <h2 className="mb-4 font-campton text-base text-white xl:text-xl">
          choose strategy
        </h2>
        <div className="flex justify-between">
          <p className="mb-6 font-campton text-base text-gray-light ">
            Wisdomise helps you optimize your basket of cryptocurrencies and
            trade them profitably.
          </p>
          <h2
            className="mb-4 flex cursor-pointer items-center  text-base text-white xl:text-xl"
            onClick={onClickCatalog}
          >
            More
            <ChevronDownIcon className="rotate-[270deg] fill-white" />
          </h2>
        </div>
      </div>
      <div className="flex-w flex justify-between gap-4">
        <RiskCard
          showActions={true}
          showHeader={true}
          title="Low Risk Package"
          loading={etfData.isLoading}
          id={etfData?.data?.results[5].key}
          expectedYield={etfData?.data?.results[5].profile.expected_yield}
          maxDrawdown={etfData?.data?.results[5].profile.max_drawdown}
          riskRatio={etfData?.data?.results[5].profile.return_risk_ratio}
          onDetail={() => onClickDetail(etfData?.data?.results[5].key)}
          onClickCard={(key) => onClickCard(key)}
          className="w-full md:w-[32%]"
        />
        <RiskCard
          showActions={true}
          showHeader={true}
          title="Mid Risk Package"
          loading={etfData.isLoading}
          id={etfData?.data?.results[4].key}
          expectedYield={etfData?.data?.results[4].profile.expected_yield}
          maxDrawdown={etfData?.data?.results[4].profile.max_drawdown}
          riskRatio={etfData?.data?.results[4].profile.return_risk_ratio}
          onDetail={() => onClickDetail(etfData?.data?.results[4].key)}
          onClickCard={(id) => onClickCard(id)}
          className="w-full md:w-[32%]"
        />
        <RiskCard
          showActions={true}
          showHeader={true}
          title="High Risk Package"
          loading={etfData.isLoading}
          key={etfData?.data?.results[3].key}
          expectedYield={etfData?.data?.results[3].profile.expected_yield}
          maxDrawdown={etfData?.data?.results[3].profile.max_drawdown}
          riskRatio={etfData?.data?.results[3].profile.return_risk_ratio}
          onDetail={() => onClickDetail(etfData?.data?.results[3].key)}
          onClickCard={(key) => onClickCard(key)}
          className="w-full md:w-[32%]"
        />
      </div>
    </>
  );
};

export default Strategy;
