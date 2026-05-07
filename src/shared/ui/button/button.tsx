import React from "react";
import { LoadingSpinner } from "./loading/loading";

interface ButtonProps {
  text: string;
  borderRadius?: string;
  backgroundColor?: string;
  fontSize?: string;
  onClick: () => void;
  width?: string;
  height?: string;
  disabled?: boolean;
  border?: string;
  loading?: boolean;
}

export const Button = React.memo(
  ({
    text,
    borderRadius,
    backgroundColor,
    fontSize,
    onClick,
    width,
    height,
    disabled,
    border,
    loading = false,
  }: ButtonProps) => (
    <button
      onClick={() => onClick()}
      type="button"
      disabled={disabled || false}
      style={{
        borderRadius: borderRadius || "",
        backgroundColor: backgroundColor || "transparent",
        fontSize: fontSize || "16px",
        width: width || "",
        height: height || "",
        opacity: disabled ? 0.1 : "",
        cursor: "pointer",
        border: border || "",
        color: "#fff",
      }}
    >
      {!loading ? text : <LoadingSpinner />}
    </button>
  ),
);
