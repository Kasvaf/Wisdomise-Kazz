import { FC } from "react";
import cls from "classnames";
import { TagProps } from "./types";
import { twMerge } from "tailwind-merge";

const Tag: FC<TagProps> = ({ children, color, icon, className }) => {
  return (
    <div
      className={twMerge(
        cls("horos-tag md cursor-default text-xl", {
          success: color === "success",
          primary: color === "primary",
          warn: color === "warn",
          error: color === "error",
          default: color === "default",
        }),
        className
      )}
    >
      {children}
      {icon}
    </div>
  );
};

export default Tag;
