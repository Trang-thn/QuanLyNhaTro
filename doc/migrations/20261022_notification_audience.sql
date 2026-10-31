-- Run once on an existing database after taking a verified backup.
-- Existing notifications remain one-to-one and retain their read state.
ALTER TABLE notifications
  ADD COLUMN audience_type ENUM('ALL', 'ROOM', 'TENANT') NOT NULL DEFAULT 'TENANT' AFTER receiver_id,
  ADD COLUMN room_id VARCHAR(36) NULL AFTER audience_type,
  ADD INDEX idx_notifications_sender_created (sender_id, created_at),
  ADD CONSTRAINT fk_notif_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL;

CREATE TABLE notification_recipients (
  notification_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notification_id, user_id),
  INDEX idx_notification_recipients_user_created (user_id, created_at),
  CONSTRAINT fk_notification_recipients_notification
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_recipients_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO notification_recipients (notification_id, user_id, is_read)
SELECT id, receiver_id, COALESCE(is_read, FALSE)
FROM notifications
WHERE receiver_id IS NOT NULL;
