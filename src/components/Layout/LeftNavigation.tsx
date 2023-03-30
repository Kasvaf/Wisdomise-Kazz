import Logo from "@images/wisdomiseWealthLogo.svg";
import LogoSmall from "@images/logo.svg";
import Beta from "@images/beta.svg";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";

import { gaClick } from "utils/ga";
import { useNavigate } from "react-router-dom";
import { VERSION } from "config/constants";
import LeftNavTabs from "./LeftNavTabs";

interface IProps {
  collapseNavbar: boolean;
  setCollapseNavbar: (c: boolean) => void;
  setShowMenu: (s: boolean) => void;
}

export default function LeftNavigation({
  collapseNavbar,
  setCollapseNavbar,
  setShowMenu,
}: IProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`horos-navbar !bg-gray-dark ${
        collapseNavbar ? "collapsed" : ""
      }`}
    >
      <button
        className="absolute -right-6 bottom-5 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-dark  bg-bgcolor text-xl text-nodata hover:text-white"
        onClick={() => {
          gaClick("collapse navbar");
          setCollapseNavbar(!collapseNavbar);
        }}
      >
        {collapseNavbar ? <RightOutlined /> : <LeftOutlined />}
      </button>
      <div className="items-left mb-[55px] flex flex-col space-y-6 text-white">
        <div className="flex w-full cursor-pointer flex-row items-center justify-start pl-6">
          <img
            className={`h-7 ${collapseNavbar ? "" : "hidden"}`}
            src={LogoSmall}
            alt="logo"
          />
          <img
            className={`h-10  ${collapseNavbar ? "hidden" : ""}`}
            src={Logo}
            alt="logo"
            onClick={() => navigate("/app")}
          />
          <img
            className={`mx-4 h-7 ${collapseNavbar ? "hidden" : ""}`}
            src={Beta}
            alt="logo"
          />
        </div>
      </div>
      <LeftNavTabs collapseNavbar={collapseNavbar} setShowMenu={setShowMenu} />
      <span
        className={`text-normal absolute bottom-12 text-nodata ${
          collapseNavbar ? "left-6" : "left-20"
        }`}
      >
        {collapseNavbar ? VERSION : "Wisdomise Beta " + VERSION}
      </span>
      <span
        className={`text-normal absolute bottom-4 left-8 text-center text-nodata ${
          collapseNavbar ? "hidden" : "block"
        }`}
      >
        ©2023 Wisdomise. All rights reserved
      </span>
    </div>
  );
}
