import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useDeleteReport, useUpdateReport, useUpdateReportText } from "../api";
import type { Report, ReportStatus } from "@/entities/reportCard/models";
import styles from "./reportPopup.module.scss";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

interface AdminReportPopupProps {
  report: Report;
  onClose: () => void;
  canEdit: boolean;
}

const statusOptions: { value: ReportStatus; label: string }[] = [
  { value: "Sent", label: "Отправлено" },
  { value: "Received", label: "Получено" },
  { value: "Solved", label: "Решено" },
];

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
};

const isImageFile = (file: Report["files"][number]) =>
  file.content_type?.startsWith("image/");

export const ReportViewPopup = ({
  report,
  onClose,
  canEdit,
}: AdminReportPopupProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
    report.status,
  );
  const [text, setText] = useState(report.text);
  const [error, setError] = useState<string | null>(null);

  const updateReport = useUpdateReport();
  const updateReportText = useUpdateReportText();
  const deleteReport = useDeleteReport();

  useEffect(() => {
    setSelectedStatus(report.status);
    setText(report.text);
    setError(null);
  }, [report]);

  const isUpdatingStatus = updateReport.isPending;
  const isUpdatingText = updateReportText.isPending;
  const isDeleting = deleteReport.isPending;

  const isLoading = isUpdatingStatus || isUpdatingText || isDeleting;

  const isStatusChanged = selectedStatus !== report.status;
  const isTextChanged = text.trim() !== report.text.trim();

  const canDelete = canEdit || report.status === "Sent";

  const canSubmit = useMemo(() => {
    if (isLoading) return false;

    if (canEdit) {
      return isStatusChanged;
    }

    return text.trim().length > 0 && isTextChanged;
  }, [canEdit, isLoading, isStatusChanged, isTextChanged, text]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);

    try {
      if (canEdit) {
        await updateReport.mutateAsync({
          id: report.id,
          status: selectedStatus,
        });
      } else {
        await updateReportText.mutateAsync({
          id: report.id,
          text: text.trim(),
        });
      }

      onClose();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : canEdit
            ? "Не удалось обновить жалобу"
            : "Не удалось обновить текст жалобы",
      );
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    setError(null);

    try {
      await deleteReport.mutateAsync({ id: report.id });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось удалить жалобу");
    }
  };

  return (
    <div className={styles.container} onClick={onClose}>
      <div
        className={styles.containerBody}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.containerBodyHeader}>
          <div className={styles.containerBodyTitle}>Жалоба</div>

          <button
            type="button"
            className={styles.containerBodyClose}
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className={styles.containerBodyMeta}>
          <div className={styles.containerBodyMetaItem}>
            <div className={styles.containerBodyMetaLabel}>ID жалобы</div>
            <div className={styles.containerBodyMetaValue}>{report.id}</div>
          </div>

          <div className={styles.containerBodyMetaItem}>
            <div className={styles.containerBodyMetaLabel}>ID пользователя</div>
            <div className={styles.containerBodyMetaValue}>
              {report.user_id}
            </div>
          </div>

          <div className={styles.containerBodyMetaItem}>
            <div className={styles.containerBodyMetaLabel}>Статус</div>
            <div className={styles.containerBodyMetaValue}>{report.status}</div>
          </div>

          <div className={styles.containerBodyMetaItem}>
            <div className={styles.containerBodyMetaLabel}>Создано</div>
            <div className={styles.containerBodyMetaValue}>
              {new Date(report.created_at).toLocaleString("ru-RU")}
            </div>
          </div>
        </div>

        <div className={styles.containerBodyContent}>
          <div className={styles.containerBodySectionTitle}>Текст жалобы</div>

          {canEdit ? (
            <p className={styles.containerBodyText}>{report.text}</p>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              maxLength={200}
              className={styles.containerBodyTextarea}
              placeholder="Введите текст жалобы"
            />
          )}
        </div>

        <div className={styles.containerBodyContent}>
          <div className={styles.containerBodySectionTitle}>Файлы</div>

          {report.files.length > 0 ? (
            <div className={styles.containerBodyFiles}>
              {report.files.map((file) => (
                <a
                  key={file.id}
                  href={file.download_url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.containerBodyFile}
                >
                  {isImageFile(file) && file.download_url ? (
                    <img
                      src={file.download_url}
                      alt={file.original_filename}
                      className={styles.containerBodyPreviewImage}
                    />
                  ) : (
                    <div className={styles.containerBodyPreviewStub}>FILE</div>
                  )}

                  <div className={styles.containerBodyFileInfo}>
                    <div className={styles.containerBodyFileName}>
                      {file.original_filename}
                    </div>
                    <div className={styles.containerBodyFileSize}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.containerBodyEmpty}>Файлов нет</div>
          )}
        </div>

        {canEdit ? (
          <div className={styles.containerBodyEdit}>
            <div className={styles.containerBodySectionTitle}>
              Изменить статус
            </div>

            <div className={styles.containerBodyStatusList}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={isLoading}
                  className={clsx(
                    styles.containerBodyStatusButton,
                    selectedStatus === option.value &&
                      styles.containerBodyStatusButtonActive,
                  )}
                  onClick={() => setSelectedStatus(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {error && <div className={styles.containerBodyError}>{error}</div>}

            <button
              type="button"
              className={styles.containerBodySubmit}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isUpdatingStatus ? <LoadingSpinner /> : "Сохранить"}
            </button>

            <button
              type="button"
              className={clsx(
                styles.containerBodySubmit,
                styles.containerBodyDelete,
              )}
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isDeleting ? <LoadingSpinner /> : "Удалить жалобу"}
            </button>
          </div>
        ) : (
          <div className={styles.containerBodyEdit}>
            <div className={styles.containerBodySectionTitle}>Действия</div>

            {error && <div className={styles.containerBodyError}>{error}</div>}

            <button
              type="button"
              className={styles.containerBodySubmit}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isUpdatingText ? <LoadingSpinner /> : "Сохранить"}
            </button>

            {canDelete && (
              <button
                type="button"
                className={clsx(
                  styles.containerBodySubmit,
                  styles.containerBodyDelete,
                )}
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isDeleting ? <LoadingSpinner /> : "Удалить жалобу"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
