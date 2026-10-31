
export interface Tenant {
  id: string;
  user_id: string | null;
  full_name: string | null;
  username: string | null;
  email: string | null;
  phone_number: string | null;
  identity_card_number: string;
  issue_date: string | null;
  issue_place: string | null;
  permanent_address: string | null;
  emergency_contact: string | null;
}

export interface CreateTenantInput {
  user_id?: string | null;
  identity_card_number: string;
  issue_date?: string | null;
  issue_place?: string | null;
  permanent_address?: string | null;
  emergency_contact?: string | null;
}

export type UpdateTenantInput = Partial<CreateTenantInput>;
