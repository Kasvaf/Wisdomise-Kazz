import { JwtTokenKey, LogoutUrl } from 'config/constants';

const logout = () => {
  localStorage.removeItem(JwtTokenKey);
  window.location.href = LogoutUrl;
};

export default logout;
