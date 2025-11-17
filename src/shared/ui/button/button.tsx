import React from "react";

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
        opacity: disabled ? 0.5 : "",
        cursor: "pointer",
        border: border || "",
        color: "#fff",
      }}
    >
      {text}
    </button>
  ),
);
