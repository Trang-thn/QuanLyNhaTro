export interface NotificationDTO {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  receiver_id: string;
  receiver_name?: string;
  sender_name?: string;
  room_number?: string | null;
}

export interface NotificationRecipientDTO {
  id: string;
  name: string;
  rooms: { id: string; room_number: string }[];
}

export interface NotificationRoomDTO {
  id: string;
  room_number: string;
}

export interface CreateNotificationInput {
  title: string;
  content: string;
  receiver_id?: string;
  room_id?: string;
}
