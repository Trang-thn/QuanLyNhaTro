
export interface CreateTenantContractInput {
  contract_number: string;
  room_id: string;
  representative_tenant_id: string;
  member_tenant_ids?: string[];
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount?: number;
  status?: string;
  billing_cycle_day?: number;
}

export interface TenantContract {
  id: string;
  contract_number: string;
  room_id: string;
  room_number: string | null;
  representative_tenant_id: string;
  representative_name: string | null;
  start_date: string;
  end_date: string;
  rental_price: number;
  deposit_amount: number;
  status: string;
  billing_cycle_day: number;
  member_tenant_ids: string[];
}
