import { clsx } from 'clsx';
import useIsMobile from 'utils/useIsMobile';
import PageWrapper, { type PageWrapperProps } from 'modules/base/PageWrapper';
import { GlobalSearchBar } from 'shared/GlobalSearchBar';

const InsightPageWrapper: React.FC<PageWrapperProps> = ({
  children,
  ...wrapperProps
}) => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper
      extension={
        <GlobalSearchBar
          size="xs"
          className={clsx('w-full shrink-0', !isMobile && 'max-w-96')}
          selectorSurface={isMobile ? 2 : 3}
          buttonSurface={isMobile ? 1 : 2}
        />
      }
      {...wrapperProps}
    >
      {children}
    </PageWrapper>
  );
};

export default InsightPageWrapper;
