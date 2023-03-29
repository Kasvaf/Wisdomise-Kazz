import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import LogoSmall from "@images/logo.svg";
import { tabs } from "containers/dashboard/constants";
import { gaClick } from "utils/ga";
import { useGetUserInfoQuery } from "../../api/horosApi";
import { ReactComponent as Hamburger } from "@images/menu.svg";
import { ReactComponent as Close } from "@images/close.svg";
import { Tab } from "containers/dashboard/types";
import Header from "containers/dashboard/components/Header";
import Splash from "containers/splash";
import LeftNavigation from "./LeftNavigation";
import "./index.module.css";

const HomeLayout = ({
  signOut,
}: {
  signOut: () => unknown;
  // children: ReactElement;
}) => {
  const [collapseNavbar, setCollapseNavbar] = useState(false);
  const [shouldShowMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const { data: userInfo, isLoading } = useGetUserInfoQuery({});

  useEffect(() => {
    document.body.style.overflow = shouldShowMenu ? "hidden" : "unset";
  }, [shouldShowMenu]);

  const [shouldShowProfile, setShowProfile] = useState(false);
  const showProfile = useCallback(() => {
    setShowMenu(false);
    setShowProfile(true);
  }, []);

  if (isLoading) return <Splash />;

  return (
    <div className="flex h-screen">
      <LeftNavigation
        collapseNavbar={collapseNavbar}
        setCollapseNavbar={setCollapseNavbar}
        setShowMenu={setShowMenu}
      />
      <div className="w-full overflow-y-auto p-6 md:px-10 md:py-8">
        <Header signOut={signOut} />
        <Outlet />
      </div>
    </div>
  );

  // return (
  //   <React.Fragment>
  //     <div className="flex h-full w-full flex-row justify-center">
  //       <div className="flex w-full flex-col md:flex-row">
  //         {renderMobileNav()}
  //       <FirstTimeModal {...{ showModal, setShowModal }} />

  //       {/* {isStage() ||
  //         (isDev() && (
  //           <div className="absolute bottom-1 left-[50%]  text-xl font-bold uppercase text-white opacity-20">
  //             DEV version: {getCurrentVersion()}
  //           </div>
  //         ))} */}
  //     </div>
  //   </React.Fragment>
  // );
};

export default HomeLayout;
