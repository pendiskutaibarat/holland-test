"use client";

import React from "react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      aria-hidden="true"
    />
  );
}

export default function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  className = "",
  ...rest
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  // Detect if children is only an icon (no text content)
  const isIconOnly = React.Children.toArray(children).every(
    (child) =>
      React.isValidElement(child) &&
      (child.type === "svg" ||
        (typeof child.type === "function" &&
          child.type.name?.includes("Icon")))
  );

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 transition-all ${
        isDisabled
          ? "opacity-70 cursor-not-allowed"
          : ""
      } ${className}`}
      {...rest}
    >
      {loading ? (
        isIconOnly ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <>
            <Spinner className="w-4 h-4 shrink-0" />
            <span>{loadingText ?? children}</span>
          </>
        )
      ) : (
        children
      )}
    </button>
  );
}
