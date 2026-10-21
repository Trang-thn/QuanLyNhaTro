import { RowDataPacket } from 'mysql2';

export interface TenantRow extends RowDataPacket {
  id: string;
  user_id: string | null;
  identity_card_number: string;
  issue_date: string | null;
  issue_place: string | null;
  permanent_address: string | null;
  emergency_contact: string | null;
  full_name?: string;
  email?: string;
  phone_number?: string;
}

export interface ContractRow extends RowDataPacket {
  id: string;
  contract_number: string;
  room_id: string;
  representative_tenant_id: string;
  start_date: string;
  end_date: string;
  rental_price: string;
  deposit_amount: string;
  status: string;
  billing_cycle_day: number;
}