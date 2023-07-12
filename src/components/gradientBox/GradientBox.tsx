import { FunctionComponent, ReactElement } from "react";

interface GradientBoxProps {
  selected?: boolean;
  className?: string;
  children?: ReactElement;
  disabled?: boolean;
  onClick?: () => any;
}

const GradientBox: FunctionComponent<GradientBoxProps> = ({ selected, className, children, disabled, onClick }) => {
  const onClickCard = () => {
    if (typeof onClick === "function") onClick();
  };

  return (
    <div
      onClick={onClickCard}
      className={`my-2 w-full  bg-gradient-to-r p-[3px]  ${selected && `cursor-pointer from-gradientFrom to-gradientTo`}
     
      ${className}`}
    >
      <div
        className={`flex h-full flex-col justify-between bg-gray-dark ${
          selected && `bg-gradient-to-r from-gradientFromTransparent to-gradientToTransparent`
        }
        ${disabled && `opacity-40`}
        p-4 text-center`}
      >
        {children}
      </div>
    </div>
  );
};

export default GradientBox;
