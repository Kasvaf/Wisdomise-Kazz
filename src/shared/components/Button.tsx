import { clsx } from "clsx";
import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "small";
  loading?: boolean;
  variant?: "primary" | "alternative" | "secondary" | "link";
}

export const Button: React.FC<Props> = ({
  size,
  variant,
  loading,
  children,
  className,
  disabled,
  ...restOfProps
}) => {
  const btnContent = loading ? "Loading . . ." : children;

  if (variant === "secondary") {
    return (
      <button
        className={
          "rounded-[40px] border border-white bg-transparent p-[20px_24px] px-6 leading-none text-white hover:border-white/40 " +
          clsx(size === "small" && "!p-[10px_12px] ") +
          className
        }
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
        className={
          "rounded-[40px] bg-white/10 p-[20px_24px] px-6 leading-none text-white hover:bg-black/5 " +
          clsx(
            disabled &&
              "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10 "
          ) +
          className
        }
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
        className={
          "bg-transparent p-[20px_24px] leading-none text-white " +
          clsx(
            disabled &&
              "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10 ",

            size === "small" && "!p-[10px_12px] "
          ) +
          className
        }
        disabled={disabled}
        {...restOfProps}
      >
        {btnContent}
      </button>
    );
  }

  return (
    <button
      className={
        "rounded-[40px] bg-white p-[20px_24px] leading-none text-black hover:bg-white/80 " +
        clsx(
          disabled &&
            "bg-white/10 text-white/10 hover:cursor-default hover:!bg-white/10 ",

          size === "small" && "!p-[10px_12px] "
        ) +
        className
      }
      disabled={disabled}
      {...restOfProps}
    >
      {btnContent}
    </button>
  );
};
