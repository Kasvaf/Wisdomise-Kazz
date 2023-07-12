import Logo from "@images/logo.svg";

export const Splash = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <img className="mb-[100px] h-[200px] w-full" src={Logo} alt="logo" />
      <div className="loader-line" />
      <p className="mt-[14px] text-[16px] font-medium text-white">Wisdomise Wealth Loading ...</p>
    </div>
  );
};
