import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { MobileMenu } from "./mobileMenu/MobileMenu";
import { SideMenu } from "./sideMenu/SideMenu";

export const Container = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    mainRef.current?.addEventListener("scroll", function () {
      setShowShadow(this.scrollTop > 8);
    });
    document.addEventListener("scroll", function () {
      setShowShadow((this.scrollingElement?.scrollTop || 0) > 8);
    });
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl">
      <SideMenu />
      <Header showShadow={showShadow} />
      <div
        ref={mainRef}
        className="main ml-[17.75rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto"
      >
        <Outlet />
      </div>
      <MobileMenu />
      <script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/45ba2d94-5ef7-46ad-bb13-2894c89025f9/cd.js"
        type="text/javascript"
        async
      ></script>
    </main>
  );
};
