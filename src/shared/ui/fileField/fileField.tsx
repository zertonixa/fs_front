import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import styles from "./fileField.module.scss";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

type FileFieldProps = {
  value: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
};

export const FileField = ({ value, onChange, disabled }: FileFieldProps) => {
  const [localError, setLocalError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        const tooLargeFile = rejectedFiles.find((item) =>
          item.errors.some((error) => error.code === "file-too-large"),
        );

        if (tooLargeFile) {
          setLocalError(`Файл "${tooLargeFile.file.name}" больше 4 МБ`);
          return;
        }

        setLocalError("Не удалось загрузить один или несколько файлов");
        return;
      }

      setLocalError("");

      const mergedFiles = [...value, ...acceptedFiles];

      const uniqueFiles = mergedFiles.filter(
        (file, index, arr) =>
          index ===
          arr.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          ),
      );

      onChange(uniqueFiles);
    },
    [onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    disabled,
  });

  const handleRemove = (fileIndex: number) => {
    onChange(value.filter((_, index) => index !== fileIndex));
  };

  return (
    <div className={styles.containerBodyUpload}>
      <span className={styles.containerBodyLabelText}>Файлы</span>

      <div
        {...getRootProps()}
        className={`${styles.containerBodyDropzone} ${
          isDragActive ? styles.containerBodyDropzoneActive : ""
        } ${disabled ? styles.containerBodyDropzoneDisabled : ""}`}
      >
        <input {...getInputProps()} />
        <span className={styles.containerBodyDropzoneTitle}>
          Перетащи файлы сюда или нажми для выбора
        </span>
        <span className={styles.containerBodyHint}>
          Можно загрузить несколько файлов, каждый до 4 МБ
        </span>
      </div>

      {!!localError && (
        <span className={styles.containerBodyError}>{localError}</span>
      )}

      {!!value.length && (
        <div className={styles.containerBodyFiles}>
          {value.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}`}
              className={styles.containerBodyFile}
            >
              <div className={styles.containerBodyFileInfo}>
                <span className={styles.containerBodyFileName}>
                  {file.name}
                </span>
                <span className={styles.containerBodyFileSize}>
                  {(file.size / 1024 / 1024).toFixed(2)} МБ
                </span>
              </div>

              <button
                type="button"
                className={styles.containerBodyFileRemove}
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
