import { UserRole } from './auth';

export interface CurrentUserProfile {
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string | null;
    phoneNumber: string | null;
    role: UserRole;
  };
  tenant: null | {
    id: string;
    identityCardNumber: string;
    issueDate: string | null;
    issuePlace: string | null;
    permanentAddress: string | null;
    emergencyContact: string | null;
  };
  contract: null | {
    id: string;
    contractNumber: string;
    startDate: string;
    endDate: string;
    rentalPrice: string;
    depositAmount: string;
    status: string;
    billingCycleDay: number | null;
  };
  room: null | {
    id: string;
    roomNumber: string;
    floor: number | null;
    status: string | null;
    roomType: null | { name: string; basePrice: string; areaSqm: string | null };
  };
  amenities: string[];
  members: Array<{
    tenantId: string;
    fullName: string | null;
    identityCardNumber: string;
    phoneNumber: string | null;
    isRepresentative: boolean;
  }>;
}
