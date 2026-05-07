import type { KeyboardEvent } from "react";
import type { ReportStatus } from "../models";
import styles from "./reportCard.module.scss";

interface ReportCardProps {
    onClick?: (id: string) => void;
    id: string;
    text: string;
    status: ReportStatus;
    created_at: string;
}

const statusMap: Record<
    ReportStatus,
    { label: string; className: string }
> = {
    Sent: {
        label: "Отправлено",
        className: styles.containerStatusSent,
    },
    Received: {
        label: "Получено",
        className: styles.containerStatusReceived,
    },
    Solved: {
        label: "Решено",
        className: styles.containerStatusSolved,
    },
    Updated: {
        label: "Обновлено",
        className: styles.containerStatusUpdated,
    }
};

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const ReportCard = ({
    onClick,
    id,
    text,
    status,
    created_at,
}: ReportCardProps) => {
    const isClickable = Boolean(onClick);
    const statusData = statusMap[status];

    const handleClick = () => {
        onClick?.(id);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!isClickable) return;

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(id);
        }
    };

    return (
        <div
            className={`${styles.container} ${
                isClickable ? styles.containerClickable : ""
            }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <div className={styles.containerHeader}>
                <span className={styles.containerDate}>
                    {formatDate(created_at)}
                </span>

                <span
                    className={`${styles.containerStatus} ${statusData.className}`}
                >
                    {statusData.label}
                </span>
            </div>

            <div className={styles.containerBody}>
                <span className={styles.containerTitle}>Обращение</span>
                <p className={styles.containerText}>{text}</p>
            </div>
        </div>
    );
};