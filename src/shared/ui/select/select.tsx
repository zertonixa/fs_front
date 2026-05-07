import { useEffect, useRef, useState } from "react";
import styles from "./select.module.scss";

type Option<T extends string> = {
  value: T;
  label: string;
};

type CustomSelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
};

export const CustomSelect = <T extends string>({
  value,
  options,
  onChange,
  placeholder,
  className,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    placeholder ??
    "Выбрать";

  return (
    <div ref={selectRef} className={`${styles.select} ${className ?? ""}`}>
      <button
        type="button"
        className={styles.selectTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedLabel}</span>
        <span
          className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ""}`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={styles.selectMenu}>
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.selectOption} ${isActive ? styles.selectOptionActive : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
