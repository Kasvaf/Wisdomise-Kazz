import { useLocalStorage } from 'usehooks-ts';

export const useActiveQuote = () => useLocalStorage('active-quote', 'tether');
