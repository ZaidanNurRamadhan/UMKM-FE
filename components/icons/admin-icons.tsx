type IconProps = {
  className?: string;
};

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 10h16l-1.2-5.5H5.2L4 10Z" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ArticleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h7" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="6" r="4" />
      <path d="M3 21a9 9 0 0 1 18 0" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function LogOutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h12" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="m14 5 5 5" />
      <path d="M4 20h5L20 9a3.54 3.54 0 0 0-5-5L4 15v5Z" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className={className}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="M4 8h4l2-3h4l2 3h4v11H4V8Z" />
      <circle cx="12" cy="13.5" r="3.2" />
      <path d="M19 3v5" />
      <path d="M16.5 5.5h5" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m4 16 4.5-4.5 3.5 3.5 2-2 6 6" />
      <circle cx="8.5" cy="8.5" r="1.3" />
    </svg>
  );
}

export function UploadCloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="M16.5 18H18a4 4 0 0 0 .4-7.98A6.5 6.5 0 0 0 6 8.4A4.8 4.8 0 0 0 6.8 18H8" />
      <path d="m12 12-3 3" />
      <path d="m12 12 3 3" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function SaveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M5 4h12l2 2v14H5V4Z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 20v-6h8v6" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.56 2 2.1 6.41 2.1 11.84c0 1.73.46 3.41 1.33 4.89L2 22l5.4-1.4a10.1 10.1 0 0 0 4.64 1.15c5.48 0 9.94-4.41 9.94-9.84C21.98 6.41 17.52 2 12.04 2Zm0 18.05a8.4 8.4 0 0 1-4.27-1.17l-.31-.18-3.2.83.86-3.08-.2-.32a8.05 8.05 0 0 1-1.24-4.29c0-4.48 3.75-8.14 8.36-8.14 4.61 0 8.36 3.66 8.36 8.14 0 4.56-3.75 8.21-8.36 8.21Zm4.58-6.15c-.25-.12-1.48-.72-1.71-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.97-.15.16-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.21-.75-.65-1.25-1.45-1.4-1.7-.15-.24-.02-.37.11-.49.12-.11.25-.29.38-.43.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.57-1.35-.78-1.84-.2-.47-.41-.41-.57-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.04s.89 2.36 1.02 2.53c.13.16 1.76 2.65 4.27 3.72.6.25 1.06.4 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.59 1.69-1.16.21-.57.21-1.06.15-1.16-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
