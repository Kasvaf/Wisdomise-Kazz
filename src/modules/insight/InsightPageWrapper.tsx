import PageWrapper, { type PageWrapperProps } from 'modules/base/PageWrapper';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';

const InsightPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  ...wrapperProps
}) => {
  return (
    <PageWrapper extension={<CoinExtensionsGroup />} {...wrapperProps}>
      {children}
    </PageWrapper>
  );
};

export default InsightPageWrapper;
