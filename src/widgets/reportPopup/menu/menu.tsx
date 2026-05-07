import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateReport } from "@/features/reportPopup/api";
import { MakeReport } from "@/features/reportPopup/ui/make/makeReport";
import { ReportViewPopup } from "@/features/reportPopup/ui";
import { useMyReports } from "@/entities/reportCard/api";
import { ReportCard } from "@/entities/reportCard/ui/reportCard";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import styles from "./menu.module.scss";

type MenuProps = {
  close: () => void;
};

export type ReportFormValues = {
  text: string;
  files: File[];
};

export const Menu = ({ close }: MenuProps) => {
  const [mode, setMode] = useState<"history" | "create">("history");
  const [selectedReportId, setSelectedReportId] = useState("");

  const createReport = useCreateReport();
  const reports = useMyReports();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReportFormValues>({
    defaultValues: {
      text: "",
      files: [],
    },
  });

  const isLoading = isSubmitting || createReport.isPending;

  const selectedReport = useMemo(() => {
    return (
      reports.data?.find((report) => report.id === selectedReportId) ?? null
    );
  }, [reports.data, selectedReportId]);

  const onSubmit = async (values: ReportFormValues) => {
    const formData = new FormData();
    formData.append("text", values.text.trim());

    values.files.forEach((file) => {
      formData.append("files", file);
    });

    await createReport.mutateAsync(formData);

    reset();
    setMode("history");
  };

  const errorMessage =
    createReport.error?.response?.data?.detail ||
    createReport.error?.message ||
    null;

  const handleClose = !isLoading ? close : undefined;

  return (
    <div className={styles.container} onClick={handleClose}>
      <div
        className={styles.containerBody}
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "history" ? (
          <div className={styles.containerContent}>
            <div className={styles.containerHeader}>
              <span className={styles.containerTitle}>Обращения</span>

              <button
                type="button"
                className={styles.containerAdd}
                onClick={() => setMode("create")}
                aria-label="Создать обращение"
              >
                +
              </button>
            </div>

            <div className={styles.containerCards}>
              {reports.isPending && <LoadingSpinner />}

              {reports.isError && (
                <span className={styles.containerState}>
                  Ошибка загрузки обращений
                </span>
              )}

              {!reports.isPending &&
                !reports.isError &&
                !reports.data?.length && (
                  <span className={styles.containerState}>
                    Обращений пока нет
                  </span>
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
          </div>
        ) : (
          <MakeReport
            close={close}
            onBack={() => setMode("history")}
            isLoading={isLoading}
            errorMessage={errorMessage}
            register={register}
            control={control}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
          />
        )}
      </div>

      {selectedReportId && selectedReport && (
        <ReportViewPopup
          report={selectedReport}
          canEdit={false}
          onClose={() => setSelectedReportId("")}
        />
      )}
    </div>
  );
};
