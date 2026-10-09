import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu trực tiếp để tránh phụ thuộc vào file mockData
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'info' | 'success' | 'urgent' | 'system';
  read: boolean;
}

// Dữ liệu mẫu nội bộ
const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Sắp đến hạn thanh toán tiền nhà',
    message: 'Hóa đơn tháng này của phòng 101 chuẩn bị hết hạn vào ngày 15.',
    date: '10/10/2026',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'Yêu cầu sửa chữa mới',
    message: 'Khách thuê phòng 202 gửi yêu cầu kiểm tra vòi nước bị rò rỉ.',
    date: '09/10/2026',
    type: 'urgent',
    read: false,
  },
  {
    id: '3',
    title: 'Thanh toán thành công',
    message: 'Phòng 301 đã thanh toán tiền phòng tháng 10 qua chuyển khoản.',
    date: '08/10/2026',
    type: 'success',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc thông báo theo bộ lọc và từ khóa tìm kiếm
  const filteredNotifications = notifications.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'unread'
        ? !item.read
        : item.read;

    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'warning':
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Khẩn cấp
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Tin tức
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Thanh toán
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Hệ thống
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Thông báo
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và theo dõi toàn bộ thông báo hệ thống nhà trọ
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="self-start md:self-auto px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm outline-none transition-all"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === 'unread'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === 'read'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đã đọc ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 transition-colors flex items-start justify-between gap-4 ${
                !item.read ? 'bg-amber-50/40' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="pt-1">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      !item.read ? 'bg-amber-500' : 'bg-transparent'
                    }`}
                  />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm font-semibold ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.title}
                    </h3>
                    {getTypeBadge(item.type)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.message}</p>
                  <span className="text-xs text-gray-400 block pt-1">{item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Đánh dấu đã đọc"
                    className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(item.id)}
                  title="Xóa thông báo"
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-500 text-sm font-medium">Không tìm thấy thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
}