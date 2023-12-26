export const JWT_TOKEN_KEY = 'TOKEN';

export const getJwtToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

export const setJwtToken = (token: string) => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
};

export const delJwtToken = () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
};
