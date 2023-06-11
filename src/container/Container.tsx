import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { SideMenu } from "./sideMenu/SideMenu";

export const Container = ({ signOut }: { signOut: () => void }) => {
  return (
    <main>
      <SideMenu />
      <div className="ml-[19rem] basis-full p-6">
        <Header signOut={signOut} />
        <Outlet />
      </div>
    </main>
  );
};
