export interface TenantNotification {
    id: string
    title: string
    preview: string
    content: string[]
    createdAt: string
    isRead: boolean
    icon: string
    deadline?: string
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
    target: 'all' | 'person';
    scope: 'all' | 'room';
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
    options: string[];
    onChange: (value: string) => void
}
