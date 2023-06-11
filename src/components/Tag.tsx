import cls from "classnames";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type TagColors = "success" | "warn" | "error" | "primary" | "default";

export interface TagProps {
  children?: ReactNode;
  color?: TagColors;
  icon?: ReactNode;
  className?: string;
}
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
