import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { AuthUser } from '../types/auth';
import { CurrentUserProfile } from '../types/users';
import { HttpError } from '../utils/httpError';

interface AccountRow extends RowDataPacket {
  id: string; username: string; fullName: string; email: string | null;
  phoneNumber: string | null; role: AuthUser['role']; tenantId: string | null;
  identityCardNumber: string | null; issueDate: string | null; issuePlace: string | null;
  permanentAddress: string | null; emergencyContact: string | null;
}

interface ContractRoomRow extends RowDataPacket {
  contractId: string; contractNumber: string; startDate: string; endDate: string;
  rentalPrice: string; depositAmount: string; contractStatus: string;
  billingCycleDay: number | null; roomId: string; roomNumber: string;
  floor: number | null; roomStatus: string | null; roomTypeName: string | null;
  basePrice: string | null; areaSqm: string | null; representativeTenantId: string;
}

interface MemberRow extends RowDataPacket {
  tenantId: string; fullName: string | null; identityCardNumber: string;
  phoneNumber: string | null; isRepresentative: number | boolean;
}

export async function getCurrentUserProfile(authUser: AuthUser): Promise<CurrentUserProfile> {
  const [accountRows] = await pool.query<AccountRow[]>(
    `SELECT u.id, u.username, u.full_name AS fullName, u.email,
            u.phone_number AS phoneNumber, u.role,
            t.id AS tenantId, t.identity_card_number AS identityCardNumber,
            DATE_FORMAT(t.issue_date, '%Y-%m-%d') AS issueDate,
            t.issue_place AS issuePlace, t.permanent_address AS permanentAddress,
            t.emergency_contact AS emergencyContact
     FROM users u
     LEFT JOIN tenants t ON t.user_id = u.id
     WHERE u.id = ? LIMIT 1`, [authUser.id]);
  const account = accountRows[0];
  if (!account) throw new HttpError(404, 'User account was not found');

  const profile: CurrentUserProfile = {
    user: {
      id: account.id, username: account.username, fullName: account.fullName,
      email: account.email, phoneNumber: account.phoneNumber, role: account.role,
    },
    tenant: account.tenantId ? {
      id: account.tenantId, identityCardNumber: account.identityCardNumber!,
      issueDate: account.issueDate, issuePlace: account.issuePlace,
      permanentAddress: account.permanentAddress, emergencyContact: account.emergencyContact,
    } : null,
    contract: null,
    room: null,
    amenities: [],
    members: [],
  };
  if (!account.tenantId) return profile;

  const [contractRows] = await pool.query<ContractRoomRow[]>(
    `SELECT c.id AS contractId, c.contract_number AS contractNumber,
            DATE_FORMAT(c.start_date, '%Y-%m-%d') AS startDate,
            DATE_FORMAT(c.end_date, '%Y-%m-%d') AS endDate,
            c.rental_price AS rentalPrice, c.deposit_amount AS depositAmount,
            c.status AS contractStatus, c.billing_cycle_day AS billingCycleDay,
            r.id AS roomId, r.room_number AS roomNumber, r.floor,
            r.status AS roomStatus, rt.name AS roomTypeName,
            rt.base_price AS basePrice, rt.area_sqm AS areaSqm,
            c.representative_tenant_id AS representativeTenantId
     FROM contracts c
     LEFT JOIN rooms r ON r.id = c.room_id
     LEFT JOIN room_types rt ON rt.id = r.room_type_id
     WHERE c.status = 'HIEU_LUC'
       AND CURRENT_DATE BETWEEN c.start_date AND c.end_date
       AND (c.representative_tenant_id = ? OR EXISTS (
         SELECT 1 FROM contract_members cm
         WHERE cm.contract_id = c.id AND cm.tenant_id = ?
       ))
     ORDER BY c.start_date DESC, c.created_at DESC
     LIMIT 1`, [account.tenantId, account.tenantId]);
  const contractRoom = contractRows[0];
  if (!contractRoom) return profile;

  profile.contract = {
    id: contractRoom.contractId, contractNumber: contractRoom.contractNumber,
    startDate: contractRoom.startDate, endDate: contractRoom.endDate,
    rentalPrice: String(contractRoom.rentalPrice), depositAmount: String(contractRoom.depositAmount),
    status: contractRoom.contractStatus, billingCycleDay: contractRoom.billingCycleDay,
  };
  if (contractRoom.roomId) {
    profile.room = {
      id: contractRoom.roomId, roomNumber: contractRoom.roomNumber,
      floor: contractRoom.floor, status: contractRoom.roomStatus,
      roomType: contractRoom.roomTypeName ? {
        name: contractRoom.roomTypeName,
        basePrice: String(contractRoom.basePrice),
        areaSqm: contractRoom.areaSqm === null ? null : String(contractRoom.areaSqm),
      } : null,
    };
    const [amenityRows] = await pool.query<(RowDataPacket & { name: string })[]>(
      `SELECT a.name FROM room_amenities ra
       INNER JOIN amenities a ON a.id = ra.amenity_id
       WHERE ra.room_id = ? ORDER BY a.name`, [contractRoom.roomId]);
    profile.amenities = amenityRows.map((row) => row.name);
  }

  const [memberRows] = await pool.query<MemberRow[]>(
    `SELECT t.id AS tenantId, u.full_name AS fullName,
            t.identity_card_number AS identityCardNumber,
            u.phone_number AS phoneNumber,
            (t.id = ?) AS isRepresentative
     FROM tenants t
     LEFT JOIN users u ON u.id = t.user_id
     WHERE t.id = ? OR t.id IN (
       SELECT cm.tenant_id FROM contract_members cm WHERE cm.contract_id = ?
     )
     ORDER BY isRepresentative DESC, fullName ASC`,
    [contractRoom.representativeTenantId, contractRoom.representativeTenantId,
      contractRoom.contractId]);
  profile.members = memberRows.map((member) => ({
    tenantId: member.tenantId, fullName: member.fullName,
    identityCardNumber: member.identityCardNumber, phoneNumber: member.phoneNumber,
    isRepresentative: Boolean(member.isRepresentative),
  }));
  return profile;
}
