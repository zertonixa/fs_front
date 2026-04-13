export interface Report {
    files: File[];
    text: string;
    id: string;
    user_id: string;
    status: "Sent" | "Received" | "Solved";
    created_at: string;
}

export interface ReportFilters {
    limit?: number;
    offset?: number;
    status?: ReportStatus;
    user_id?: string;
    search?: string;
}

export interface File {
    id: string;
    bucket: string;
    object_key: string;
    original_filename: string;
    content_type: string;
    size: number;
    created_at: string;
    download_url: string;
}

export type ReportStatus = "Sent" | "Received" | "Solved" | "Updated"; 