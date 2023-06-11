/// <reference types="vite-plugin-svgr/client" />
import { useCallback, useEffect } from "react";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { WISDOMISE_TOKEN_KEY } from "config/constants";
import DB from "config/keys";
import AuthContainer from "containers/auth/AuthContainer";
import Callback from "containers/auth/Callback";
import { RootState } from "../store/appReducer";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loadSessionData } from "../store/userInfo";

import { App } from "./App";

export function AppAuthContainer() {
  const dispatch = useAppDispatch();
  const sessionData = useAppSelector((state: RootState) => state.user);

  const signOut = useCallback(async () => {
    localStorage.removeItem(WISDOMISE_TOKEN_KEY);
    window.location.href = `${DB}/api/v1/account/logout`;
  }, []);

  useEffect(() => {
    dispatch(loadSessionData());
  }, [dispatch]);

  if (sessionData?.loading) {
    return null;
  }

  return (
    <>
      {!sessionData?.jwtToken ? (
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/*" element={<AuthContainer />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <App signOut={signOut} />
      )}
      <NotificationContainer />
    </>
  );
}
