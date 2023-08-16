import { useMediaQuery } from 'usehooks-ts'

export const useIsMobile = () => useMediaQuery('(max-width: 750px)');
