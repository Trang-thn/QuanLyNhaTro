export interface TenantNotification {
    id: string
    title: string
    preview: string
    content: string[]
    createdAt: string
    isRead: boolean
    icon: string
    deadline?: string
    senderName?: string
}
export interface Item {
    id: string;
    title: string;
    content: string;
    recipient: string;
    sentAt: string;
    unread: boolean
}
export interface Draft {
    title: string;
    content: string;
    audience: 'ALL' | 'ROOM' | 'TENANT';
    person: string;
    room: string
}
export interface FieldProps {
    label: string
    value: string
    bold?: boolean
}
export interface RadioClick {
    active: boolean
    label: string
    onClick: () => void
}
export interface DropDowns {
    value: string;
    placeholder: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
}
export interface DropdownOption { value: string; label: string }

export interface NotificationApiDTO {
    id: string
    title: string
    content: string
    audience_type: 'ALL' | 'ROOM' | 'TENANT'
    room_id?: string | null
    is_read?: boolean | number
    created_at: string
    receiver_id?: string | null
    receiver_name?: string | null
    sender_name?: string | null
    room_number?: string | null
    recipient_count?: number
}

export interface NotificationRecipient {
    id: string
    name: string
}

export interface NotificationRoom {
    id: string
    room_number: string
}
