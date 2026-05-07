import type { ReportStatus } from "@/entities/reportCard/models";

export interface ReportFile {
    id: string;
    bucket: string;
    object_key: string;
    original_filename: string;
    content_type: string;
    size: number;
    created_at: string;
    download_url: string;
}

export interface ReportCreate {
    text: string;
    files?: globalThis.File[];
}

export interface ReportUpdate {
    id: string;
    status: ReportStatus;
}