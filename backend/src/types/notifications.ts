export type NotificationAudience = 'ALL' | 'ROOM' | 'TENANT';

export interface NotificationDTO {
  id: string;
  title: string;
  content: string;
  audience_type: NotificationAudience;
  room_id: string | null;
  is_read?: boolean;
  created_at: string;
  receiver_id?: string | null;
  receiver_name?: string | null;
  sender_name?: string | null;
  room_number?: string | null;
  recipient_count?: number;
}

export interface NotificationRecipientDTO {
  id: string;
  name: string;
}

export interface NotificationRoomDTO {
  id: string;
  room_number: string;
}

export interface CreateNotificationInput {
  title: string;
  content: string;
  audience: NotificationAudience;
  receiver_id?: string;
  room_id?: string;
}
