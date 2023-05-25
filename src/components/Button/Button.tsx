import type { FunctionComponent, ReactNode } from "react";
import { BUTTON_TYPE } from "utils/enums";

interface ButtonProps {
  type: BUTTON_TYPE;
  text?: string;
  onClick?: (e?: any) => void;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  text,
  onClick,
  type,
  className,
  children,
  disabled,
}) => {
  return (
    <div
      onClick={onClick}
      className={`min-h-[48px] w-fit cursor-pointer rounded  bg-gradient-to-r from-gradientFrom to-gradientTo p-[3px] ${className} ${
        disabled && "pointer-events-none from-gray-main to-gray-main"
      }`}
    >
      {type === BUTTON_TYPE.FILLED ? (
        <div className="flex h-full flex-col items-center  justify-between px-4 py-3 text-center text-sm font-bold uppercase text-gray-dark">
          {text ? (
            <p className={`${disabled && " text-gray-main"}`}>{text}</p>
          ) : (
            children
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between rounded bg-gray-dark px-4 py-3 text-center text-sm uppercase">
          {text ? (
            <p
              className={`${
                disabled
                  ? "  from-gray-main to-gray-main"
                  : "gradientColor font-bold"
              }`}
            >
              {text}
            </p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default Button;
