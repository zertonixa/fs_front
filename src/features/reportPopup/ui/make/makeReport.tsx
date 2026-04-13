import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";
import { FileField } from "@/shared/ui/fileField";
import styles from "./makeReport.module.scss";

type ReportFormValues = {
    text: string;
    files: File[];
};

type MakeReportProps = {
    close: () => void;
    onBack: () => void;
    isLoading: boolean;
    errorMessage: string | null;
    register: UseFormRegister<ReportFormValues>;
    control: Control<ReportFormValues>;
    errors: FieldErrors<ReportFormValues>;
    onSubmit: () => void;
};

export const MakeReport = ({
    close,
    onBack,
    isLoading,
    errorMessage,
    register,
    control,
    errors,
    onSubmit,
}: MakeReportProps) => {
    return (
        <>
            <div className={styles.containerBodyHeader}>
                <button
                    type="button"
                    className={styles.containerBodyBack}
                    onClick={onBack}
                    disabled={isLoading}
                    aria-label="Вернуться назад"
                >
                    ←
                </button>

                <span className={styles.containerBodyTitle}>
                    Сообщить о проблеме
                </span>

                <button
                    type="button"
                    className={styles.containerBodyClose}
                    onClick={close}
                    disabled={isLoading}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>

            <form className={styles.containerBodyForm} onSubmit={onSubmit}>
                <label className={styles.containerBodyLabel}>
                    <span className={styles.containerBodyLabelText}>
                        Название проблемы
                    </span>
                    <input
                        {...register("text", {
                            required: "Введите название проблемы",
                            validate: (value) =>
                                value.trim().length > 0 || "Введите название проблемы",
                        })}
                        type="text"
                        placeholder="Кратко опишите проблему"
                        className={styles.containerBodyInput}
                        maxLength={200}
                        disabled={isLoading}
                    />
                </label>

                {errors.text && (
                    <span className={styles.containerBodyError}>
                        {errors.text.message}
                    </span>
                )}

                <Controller
                    name="files"
                    control={control}
                    render={({ field }) => (
                        <FileField
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                        />
                    )}
                />

                {!!errorMessage && (
                    <span className={styles.containerBodyError}>
                        {errorMessage}
                    </span>
                )}

                <div className={styles.containerBodyBottom}>
                    <button
                        type="submit"
                        className={styles.containerBodySubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : "Отправить"}
                    </button>
                </div>
            </form>
        </>
    );
};