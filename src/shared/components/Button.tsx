import { clsx } from "clsx";
import React from "react";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  size?: "small";
  loading?: boolean;
  variant?: "primary" | "alternative" | "secondary" | "link";
}

export const Button: React.FC<Props> = ({ size, variant, loading, children, className, disabled, ...restOfProps }) => {
  const btnContent = loading ? "Loading . . ." : children;

  if (variant === "secondary") {
    return (
      <button
        className={clsx(
          "rounded-[40px] border border-white bg-transparent px-8 py-4 text-sm font-medium leading-none text-white hover:border-white/40",
          size === "small" && "!p-[10px_12px] ",
          className
        )}
        disabled={disabled}
        {...restOfProps}
      >
        {btnContent}
      </button>
    );
  }

  if (variant === "alternative") {
    return (
      <button
        className={clsx(
          "rounded-[40px] bg-white/10 px-8 py-4 text-sm font-medium leading-none text-white hover:bg-black/5",
          disabled && "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10",
          className
        )}
        disabled={disabled}
        {...restOfProps}
      >
        {btnContent}
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        className={clsx(
          "bg-transparent px-8 py-4 text-sm font-medium leading-none text-white",
          disabled && "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10",

          size === "small" && "!p-[10px_12px]",
          className
        )}
        disabled={disabled}
        {...restOfProps}
      >
        {btnContent}
      </button>
    );
  }

  return (
    <button
      className={clsx(
        "rounded-[40px] bg-white px-8 py-4 text-sm font-medium leading-none text-black hover:bg-white/80",
        disabled && "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10",

        size === "small" && "!p-[10px_12px]",
        className
      )}
      disabled={disabled}
      {...restOfProps}
    >
      {btnContent}
    </button>
  );
};
