import { useEffect } from 'react';
import { IssueIcon } from './IssueIcon';

export function IssueToast({
  message,
  variant,
  onDismiss,
}: {
  message: string;
  variant: 'success' | 'error';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`fixed right-4 top-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border bg-white p-4 shadow-[0_12px_32px_rgba(23,43,77,0.18)] ${
        isError ? 'border-red-200' : 'border-emerald-200'
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
        <IssueIcon name={isError ? 'warning' : 'check'} />
      </span>
      <p className="min-w-0 flex-1 break-words text-sm leading-5 text-[#1f2937]">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
        className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-md text-[#64748b] hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172b4d]"
      >
        <IssueIcon name="close" className="size-4" />
      </button>
    </div>
  );
}
