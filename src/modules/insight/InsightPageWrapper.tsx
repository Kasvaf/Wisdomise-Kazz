import PageWrapper, { type PageWrapperProps } from 'modules/base/PageWrapper';

const InsightPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  ...wrapperProps
}) => {
  return <PageWrapper {...wrapperProps}>{children}</PageWrapper>;
};

export default InsightPageWrapper;
