export interface TimeBarProps {
  date?: string;
  values: string[];
  onValueChanged: (date: string, param: "startTime" | "endTime") => void;
  type: "startTime" | "endTime";
}
