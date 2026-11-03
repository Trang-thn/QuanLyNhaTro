import { useEffect, useState } from 'react';
import { fetchMaintenanceImage } from '../../services/maintenanceService';
import { IssueIcon } from './IssueIcon';

export function IssueImage({ src, className = '' }: { src?: string | null; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [authenticatedSrc, setAuthenticatedSrc] = useState<{ src: string; objectUrl: string } | null>(null);
  const isPrivateImage = Boolean(src?.startsWith('/maintenance-requests/images/'));

  useEffect(() => {
    if (!src || !isPrivateImage) {
      setAuthenticatedSrc(null);
      return;
    }
    let active = true;
    let objectUrl: string | undefined;
    setFailedSrc(null);
    void fetchMaintenanceImage(src).then((blob) => {
      objectUrl = URL.createObjectURL(blob);
      if (active) setAuthenticatedSrc({ src, objectUrl });
      else URL.revokeObjectURL(objectUrl);
    }).catch(() => {
      if (active) setFailedSrc(src);
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, isPrivateImage]);

  const hasFailed = Boolean(src && failedSrc === src);
  const imageSrc = isPrivateImage ? (authenticatedSrc && authenticatedSrc.src === src ? authenticatedSrc.objectUrl : null) : src;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-[#f8fafc] text-[#8c9bae] ${className}`}
      role="img"
      aria-label={src && !hasFailed ? 'Ảnh sự cố' : 'Chưa có ảnh sự cố'}
    >
      {src && imageSrc && !hasFailed ? (
        <img
          src={imageSrc}
          alt=""
          width="320"
          height="160"
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : isPrivateImage && !hasFailed && src ? (
        <span role="status" aria-label="Đang tải ảnh sự cố"><IssueIcon name="image" className="size-8 animate-pulse" /></span>
      ) : (
        <IssueIcon name="image" className="size-8" />
      )}
    </div>
  );
}
