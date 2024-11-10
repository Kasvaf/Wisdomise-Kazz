import axios from 'axios';

interface PairData {
  name: string;
  display_name: string;
  base: { name: string };
  quote: { name: string };
}

let cachedPairs: PairData[];
const getAllPairsCached = async () => {
  if (!cachedPairs) {
    const { data } = await axios.get<PairData[]>('catalog/pairs');
    cachedPairs = data;
  }

  return cachedPairs;
};

export default getAllPairsCached;
