export type IssueStatus = "TIEP_NHAN" | "DANG_XU_LY" | "HOAN_THANH";
export type IssueFilter = "ALL" | IssueStatus;

export interface Issue {
  id: string;
  room: string;
  vip?: boolean;
  title: string;
  description: string;
  reporter: string;
  date: string;
  expectedCost: number;
  actualCost?: number;
  status: IssueStatus;
}
export interface Sumary {
  label: string;
  value: number;
  icon: string;
  iconBackground: string;
}
export type Status = "TIEP_NHAN" | "DANG_XU_LY" | "HOAN_THANH";
export interface Incident {
  id: string;
  title: string;
  description: string;
  room: string;
  date: string;
  time: string;
  status: Status;
  imageName: string;
  imageUrl?: string;
  cost?: number;
  icon: string;
}
