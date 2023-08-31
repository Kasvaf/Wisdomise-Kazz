import { JwtTokenKey, LoginUrl, RouterBaseName } from 'config/constants';
import App from './App';

const callbackPath = '/auth/callback';
const getSearch = () => {
  const { pathname, hash, search } = window.location;
  if (RouterBaseName) {
    if (hash.startsWith('#' + callbackPath)) {
      return hash.replace(/[^?]+/, '');
    }
  } else if (pathname === callbackPath) {
    return search;
  }
};

export default function AppAuthContainer() {
  const search = getSearch();
  if (search) {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem(JwtTokenKey, JSON.stringify(token));
      if (RouterBaseName) {
        window.location.href = '/' + RouterBaseName;
        return null;
      }
    }
  }

  if (!localStorage.getItem(JwtTokenKey)) {
    window.location.href = LoginUrl;
    return null;
  }

  return <App />;
}
