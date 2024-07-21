import axios from 'axios';
import { type PairDataFull } from 'api/types/strategy';

let cachedPairs: PairDataFull[];
const getAllPairsCached = async () => {
  if (!cachedPairs) {
    const { data } = await axios.get<PairDataFull[]>('catalog/pairs');
    cachedPairs = data;
  }

  return cachedPairs;
};

export default getAllPairsCached;
