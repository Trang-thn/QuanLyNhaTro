export type ModalType = 'renew' | 'print' | null;

export interface Member {
  name: string;
  cccd: string;
  role: string;
  joinDate: string;
}

export interface HistoryItem {
  room: string;
  from: string;
  to: string;
  status: 'active' | 'ended';
  contractId: string;
}