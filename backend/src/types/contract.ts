
export interface Contract {
  id: string;
  contract_number: string;
  room_id: string;
  room_number: string | null;
  representative_tenant_id: string;
  tenant_name: string | null;
  phone: string | null;
  email: string | null;
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount: number;
  status: string;
  billing_cycle_day: number;
}

export interface CreateContractInput {
  contract_number: string;
  room_id: string;
  representative_tenant_id: string;
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount: number;
  status: string;
  billing_cycle_day: number;
}

export type UpdateContractInput = Partial<CreateContractInput>;

export interface ContractFilters {
  roomNumber?: string;
  status?: string;
}
