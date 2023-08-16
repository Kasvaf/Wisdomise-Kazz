import { useLocalStorage } from 'usehooks-ts'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JwtTokenKey, LoginUrl } from "config/constants";
import { AuthCallback } from "./AuthCallback";
import { App } from "./App";

export function AppAuthContainer() {
  const [userToken] = useLocalStorage(JwtTokenKey, '');

  return (
    <>
      {!userToken ? (
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="*"
              Component={() => {
                window.location.href = LoginUrl;
                return null;
              }}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <App />
      )}
    </>
  );
}
