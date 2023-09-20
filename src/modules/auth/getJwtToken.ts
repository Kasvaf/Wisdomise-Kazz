import { tryParse } from 'utils/json';
import { JWT_TOKEN_KEY } from './constants';

const getJwtToken = () => {
  const token = tryParse(localStorage.getItem(JWT_TOKEN_KEY));
  if (token && typeof token === 'string') {
    return token;
  }
};

export default getJwtToken;
