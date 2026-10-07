export type ContractStatus = 'HIEU_LUC' | 'KHONG_HIEU_LUC' | 'DA_THANH_LY';

export interface Contract {
  id: string;
  contract_number: string;
  room_id: string;
  representative_tenant_id: string;
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount: number;
  billing_cycle_day: number;
  status: ContractStatus;
}

export type ContractModalState =
  | { type: 'view'; id: string }
  | { type: 'edit'; id: string }
  | { type: 'thanh_ly'; id: string }
  | null;