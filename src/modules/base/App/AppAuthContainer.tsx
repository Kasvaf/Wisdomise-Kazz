import { useLocalStorage } from 'usehooks-ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { JwtTokenKey, LoginUrl } from 'config/constants';
import { AuthCallback } from './AuthCallback';
import { App } from './App';

const redirectToLogin = () => {
  window.location.href = LoginUrl;
  return null;
};

export function AppAuthContainer() {
  const [userToken] = useLocalStorage(JwtTokenKey, '');
  if (userToken) return <App />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" Component={redirectToLogin} />
      </Routes>
    </BrowserRouter>
  );
}
