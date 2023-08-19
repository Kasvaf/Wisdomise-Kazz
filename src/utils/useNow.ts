import { useEffect, useState } from 'react';

const useNow = () => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  });
  return now;
};

export default useNow;
