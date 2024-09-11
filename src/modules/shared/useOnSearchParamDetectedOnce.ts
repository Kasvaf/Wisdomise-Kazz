import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useOnSearchParamDetectedOnce = ({
  searchParam,
  active,
  callback,
}: {
  searchParam: string;
  active: boolean;
  callback: (value: string | null) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCalled = useRef(false);

  useEffect(() => {
    isCalled.current = false;
  }, [searchParam]);

  useEffect(() => {
    if (searchParams.has(searchParam) && !isCalled.current && active) {
      const value = searchParams.get(searchParam);
      searchParams.delete(searchParam);
      setSearchParams(searchParams);
      isCalled.current = true;
      callback(value);
    }
  }, [active, searchParams, setSearchParams, searchParam, callback]);
};
