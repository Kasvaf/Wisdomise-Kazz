import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupportedPairs } from 'api';

const useEnsureIsSupportedPair = ({
  slug,
  nextPage,
}: {
  slug?: string;
  nextPage: string;
}) => {
  const navigate = useNavigate();
  const supportedPairs = useSupportedPairs(slug);
  useEffect(() => {
    if (
      slug &&
      !supportedPairs.isLoading &&
      !supportedPairs.data?.length &&
      window.location.pathname !== nextPage
    ) {
      navigate(nextPage);
    }
  }, [
    slug,
    navigate,
    nextPage,
    supportedPairs.data?.length,
    supportedPairs.isLoading,
  ]);
};

export default useEnsureIsSupportedPair;
