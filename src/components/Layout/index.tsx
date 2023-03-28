import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Logo from "@images/wisdomiseWealthLogo.svg";
import LogoSmall from "@images/logo.svg";
import Beta from "@images/beta.svg";
import { VERSION } from "config/constants";
import { tabs } from "containers/dashboard/constants";
import FirstTimeModal from "containers/dashboard/components/FirstTimeModal";
import MenuModal from "containers/dashboard/components/MenuModal";
import { gaClick } from "utils/ga";
import { useGetUserInfoQuery } from "../../api/horosApi";
import { ReactComponent as Hamburger } from "@images/menu.svg";
import { ReactComponent as Close } from "@images/close.svg";
import { Tab, TabLabels } from "containers/dashboard/types";
// import { IconChevronLeft, IconChevronRight } from "@aws-amplify/ui-react";
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
  const [selectedTab, setSelectedTab] = useState(tabs.dashboard);
  const [showModal, setShowModal] = useState(false);
  const [collapseNavbar, setCollapseNavbar] = useState(false);
  const [shouldShowMenu, setShowMenu] = useState(false);
  const toggleShowMenu = useCallback(() => {
    setShowMenu((p: boolean) => !p);
    setShowProfile(false);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const { data: userInfo, isLoading } = useGetUserInfoQuery({});

  const userName = userInfo?.customer.user.email || "";

  useEffect(() => {
    document.body.style.overflow = shouldShowMenu ? "hidden" : "unset";
  }, [shouldShowMenu]);

  const handleTabClick = (tab: Tab) => {
    if (!tab.subMenu) {
      if (tab.button) {
        setShowMenu(false);
        gaClick(`tab ${tab.label}`);
        return;
      }
      navigate(`/app/${tab.defaultUrl}`);
      setSelectedTab(tab);
      setShowMenu(false);
      gaClick(`tab ${tab.label}`);
    }
  };

  const renderTabButton = (tab: Tab) => {
    if (tab) {
    }
  };

  const [shouldShowProfile, setShowProfile] = useState(false);
  const showProfile = useCallback(() => {
    setShowMenu(false);
    setShowProfile(true);
  }, []);

  const renderMobileNav = () => (
    <div className="sticky flex flex-row items-center justify-between border-b border-white/20 px-6 py-4 md:hidden">
      <img className="h-7" src={LogoSmall} alt="logo" />

      <div className="flex flex-row items-center space-x-4">
        <button
          onClick={showProfile}
          className=" flex h-10 w-10 flex-col items-center justify-center rounded-md bg-gray-dark bg-gradient-to-r from-gradientFromTransparent via-gradientToTransparent to-gradientToTransparent uppercase"
        >
          <p className="text-xl text-primary">{userName.charAt(0)}</p>
        </button>
        <button type="button" className="group" onClick={toggleShowMenu}>
          {shouldShowMenu ? (
            <Close className="fill-white group-hover:fill-primary" />
          ) : (
            <Hamburger className="stroke-white group-hover:stroke-primary" />
          )}
        </button>
      </div>
    </div>
  );

  const onClickLogo = () => {
    navigate("/dashboard");
  };

  if (isLoading) return <Splash />;

  return (
    <div className="flex h-screen">
      <LeftNavigation
        collapseNavbar={collapseNavbar}
        setCollapseNavbar={setCollapseNavbar}
        setSelectedTab={setSelectedTab}
        setShowMenu={setShowMenu}
      />
      <div className="w-full overflow-y-auto p-6 md:px-10 md:py-8">
        <Header />
        <Outlet />
      </div>
    </div>
  );

  // return (
  //   <React.Fragment>
  //     <div className="flex h-full w-full flex-row justify-center">
  //       <div className="flex w-full flex-col md:flex-row">
  //         {renderMobileNav()}
  //         <div
  //           className={`horos-navbar !bg-gray-dark ${
  //             collapseNavbar ? "collapsed" : ""
  //           }`}
  //         >
  //           <button
  //             className="absolute -right-6 bottom-5 -mt-6 h-12 w-12 rounded-full border-4 border-gray-dark  bg-bgcolor text-xl text-nodata hover:text-white"
  //             onClick={() => {
  //               gaClick("collapse navbar");
  //               setCollapseNavbar(!collapseNavbar);
  //             }}
  //           >
  //             <div className="-translate-y-0.5">
  //               {/* {collapseNavbar ? (
  //                 <IconChevronRight style={{ fontSize: "1.5rem" }} />
  //               ) : (
  //                 <IconChevronLeft style={{ fontSize: "1.5rem" }} />
  //               )} */}
  //             </div>
  //           </button>
  //           <div className="items-left mb-[55px] flex flex-col space-y-6 text-white">
  //             <div className="flex w-full cursor-pointer flex-row items-center justify-start pl-6">
  //               <img
  //                 className={`h-7 ${collapseNavbar ? "" : "hidden"}`}
  //                 src={LogoSmall}
  //                 alt="logo"
  //               />
  //               <img
  //                 className={`h-10  ${collapseNavbar ? "hidden" : ""}`}
  //                 src={Logo}
  //                 alt="logo"
  //                 onClick={onClickLogo}
  //               />
  //               <img
  //                 className={`mx-4 h-7 ${collapseNavbar ? "hidden" : ""}`}
  //                 src={Beta}
  //                 alt="logo"
  //               />
  //             </div>
  //           </div>
  //           <div className="space-y-4 text-inactive">
  //             {Object.keys(tabs).map((t) => {
  //               const tab = tabs[t as TabLabels];
  //               return tab.hidden ? (
  //                 <span key={t}></span>
  //               ) : (
  //                 renderTabButton(tab)
  //               );
  //             })}
  //           </div>
  //           <span
  //             className={`text-normal absolute bottom-12 text-nodata ${
  //               collapseNavbar ? "left-6" : "left-20"
  //             }`}
  //           >
  //             {collapseNavbar ? VERSION : "Wisdomise Beta " + VERSION}
  //           </span>
  //           <span
  //             className={`text-normal absolute bottom-4 left-8 text-center text-nodata ${
  //               collapseNavbar ? "hidden" : "block"
  //             }`}
  //           >
  //             ©2023 Wisdomise. All rights reserved
  //           </span>
  //         </div>
  //         <div className="w-full p-6 md:px-10 md:py-8">
  //           <Header
  //             handleTabClick={handleTabClick}
  //             tab={selectedTab}
  //             signOut={signOut}
  //           />
  //           <Outlet />
  //         </div>
  //       </div>
  //       <MenuModal
  //         showMenu={shouldShowMenu}
  //         renderTabButton={renderTabButton}
  //         signOut={signOut}
  //         renderMobileNav={renderMobileNav}
  //       />
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
