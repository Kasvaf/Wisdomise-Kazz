import { useMediaQuery } from 'usehooks-ts';

const useIsMobile = () => useMediaQuery('(max-width: 750px)');

export default useIsMobile;
