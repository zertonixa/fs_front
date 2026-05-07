import { useMemo, useRef, useState } from "react";
import { ReportCard } from "@/entities/reportCard/ui/reportCard";
import { useGetReports } from "@/entities/reportCard/api";
import { ReportViewPopup } from "@/features/reportPopup/ui";
import type { ReportStatus } from "@/entities/reportCard/models";
import styles from "./adminReports.module.scss";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

const statusOptions: { value: "" | ReportStatus; label: string }[] = [
  { value: "", label: "Все статусы" },
  { value: "Sent", label: "Отправлено" },
  { value: "Received", label: "Получено" },
  { value: "Solved", label: "Решено" },
];

export const AdminReports = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | ReportStatus>("");
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);

  const reports = useGetReports({
    search: search || undefined,
    status: status || undefined,
  });

  const selectedReport = useMemo(() => {
    return (
      reports.data?.find((report) => report.id === selectedReportId) ?? null
    );
  }, [reports.data, selectedReportId]);

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === status)?.label ??
    "Все статусы";

  return (
    <div className={styles.container}>
      <span className={styles.containerTitle}>Обращения</span>

      <div className={styles.containerFilters}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.containerInput}
          placeholder="Поиск по контенту"
        />

        <div ref={selectRef} className={styles.containerSelect}>
          <button
            type="button"
            className={styles.containerSelectTrigger}
            onClick={() => setIsStatusOpen((prev) => !prev)}
          >
            <span>{selectedStatusLabel}</span>
            <span
              className={`${styles.containerSelectArrow} ${
                isStatusOpen ? styles.containerSelectArrowOpen : ""
              }`}
            >
              ▾
            </span>
          </button>

          {isStatusOpen && (
            <div className={styles.containerSelectMenu}>
              {statusOptions.map((option) => {
                const isActive = option.value === status;

                return (
                  <button
                    key={option.value || "all"}
                    type="button"
                    className={`${styles.containerSelectOption} ${
                      isActive ? styles.containerSelectOptionActive : ""
                    }`}
                    onClick={() => {
                      setStatus(option.value);
                      setIsStatusOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.containerCards}>
        {reports.isPending && <LoadingSpinner />}

        {reports.isError && (
          <span className={styles.containerState}>
            Ошибка загрузки обращений
          </span>
        )}

        {!reports.isPending && !reports.isError && !reports.data?.length && (
          <span className={styles.containerState}>Обращения не найдены</span>
        )}

        {reports.data?.map((report) => (
          <ReportCard
            key={report.id}
            id={report.id}
            text={report.text}
            status={report.status}
            created_at={report.created_at}
            onClick={(id) => setSelectedReportId(id)}
          />
        ))}
      </div>

      {selectedReportId && selectedReport && (
        <ReportViewPopup
          report={selectedReport}
          canEdit={true}
          onClose={() => setSelectedReportId("")}
        />
      )}
    </div>
  );
};
