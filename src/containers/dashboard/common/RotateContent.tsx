import { ReactNode } from "react";

interface RotateContentProps {
  view: ReactNode;
}

function RotateContent({ view }: RotateContentProps) {
  return (
    <>
      <div className="text-center text-base text-white opacity-50 sm:hidden">
        Please rotate your screen to see the table
      </div>
      <div className="hidden h-full flex-col sm:flex">{view}</div>
    </>
  );
}

export default RotateContent;
