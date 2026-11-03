export type InvoiceStatus =
  | 'CHUA_THANH_TOAN'
  | 'THANH_TOAN_MOT_PHAN'
  | 'DA_THANH_TOAN'
  | 'QUA_HAN';

export interface InvoiceItem {
  id: string;
  invoice_code: string;
  contract_id: string;
  utility_reading_id: string | null;
  room_id: string;
  room_number: string;
  tenant_name: string;
  billing_month: number;
  billing_year: number;
  room_price: number;
  electricity_cost: number;
  water_cost: number;
  other_service_cost: number;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  due_date: string;
  old_electricity_kwh: number | null;
  new_electricity_kwh: number | null;
  old_water_m3: number | null;
  new_water_m3: number | null;
  electricity_price_per_kwh: number | null;
  water_price_per_m3: number | null;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount_paid: number;
  payment_method: string;
  transaction_note: string | null;
}

export interface CreatePaymentInput {
  amount_paid: number;
  payment_method: 'TIEN_MAT' | 'CHUYEN_KHOAN' | 'VI_DIEN_TU';
  transaction_note?: string;
}

export interface InvoiceListFilters {
  month?: number;
  year?: number;
  search?: string;
}
