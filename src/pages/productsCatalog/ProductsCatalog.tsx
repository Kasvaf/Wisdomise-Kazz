import { PageWrapper } from "shared/components/PageWrapper";
import { useInvestorAssetStructuresQuery } from "shared/services/services";
import { ProductCatalogCard } from "./ProductCatalogCard";
import { useFinancialProductsQuery } from "./services";

export const ProductsCatalog = () => {
  const fps = useFinancialProductsQuery();
  const ias = useInvestorAssetStructuresQuery();

  return (
    <>
      <PageWrapper loading={fps.isLoading || ias.isLoading}>
        <div className="mt-2">
          <h2 className="mb-4 text-xl font-semibold text-white">
            All Financial Products
          </h2>
          <p className="mb-6 text-sm leading-5 text-white/60 ">
            AI-based Trading Strategies Run Automatically On Your Crypto Wallet.
            <br />
            These Are Built With Our Comprehensive And Sophisticated AI After
            Running Over 300 Million Unique Experiments
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,_350px)] gap-6 mobile:justify-center">
          {fps?.data?.results
            .filter((fp) => fp.is_active)
            .map((fp) => (
              <ProductCatalogCard fp={fp} key={fp.key} />
            ))}
        </div>
      </PageWrapper>
    </>
  );
};

export default ProductsCatalog;
